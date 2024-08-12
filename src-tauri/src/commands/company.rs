use crate::company;
use crate::currency;
use crate::error::CommandResult;
use crate::error::CoreError;
use crate::template;
use crate::DbState;
use bcrypt::{hash, verify, DEFAULT_COST};
use prisma_client_rust::not;
use prisma_client_rust::QueryError;
use serde::Deserialize;
use serde::Serialize;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanyWithProtection {
    id: i32,
    name: String,
    email: Option<String>,
    is_protected: bool,
}

#[tauri::command]
pub async fn get_companies(
    client: DbState<'_>,
    exclude: Option<i32>,
) -> Result<Vec<CompanyWithProtection>, QueryError> {
    println!("Getting companies, excluding {:?}", exclude);
    let companies = client
        .company()
        .find_many(vec![not![company::id::equals(exclude.unwrap_or(999))]])
        .exec()
        .await?;

    Ok(companies
        .into_iter()
        .map(|c| CompanyWithProtection {
            id: c.id,
            name: c.name,
            email: c.email,
            is_protected: c.password.is_some(),
        })
        .collect())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompanyDataWithoutPassword {
    id: i32,
    name: String,
    cin: String,
    vat_id: Option<String>,
    address: String,
    city: String,
    zip: String,
    phone: Option<String>,
    email: Option<String>,
    bank_account: Option<String>,
    bank_iban: Option<String>,
    is_protected: bool,
}

impl From<company::Data> for CompanyDataWithoutPassword {
    fn from(data: company::Data) -> Self {
        CompanyDataWithoutPassword {
            id: data.id,
            name: data.name,
            cin: data.cin,
            vat_id: data.vat_id,
            address: data.address,
            city: data.city,
            zip: data.zip,
            phone: data.phone,
            email: data.email,
            bank_account: data.bank_account,
            bank_iban: data.bank_iban,
            is_protected: data.password.is_some(),
        }
    }
}

#[tauri::command]
pub async fn get_company(
    client: DbState<'_>,
    id: Option<i32>,
) -> CommandResult<Option<CompanyDataWithoutPassword>> {
    let company_data = client
        .company()
        .find_first(vec![company::id::equals(id.unwrap_or(1))])
        .exec()
        .await?;

    Ok(company_data.map(CompanyDataWithoutPassword::from))
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ManageCompanyData {
    name: String,
    cin: String,
    vat_id: Option<String>,
    address: String,
    city: String,
    zip: String,
    phone: Option<String>,
    email: Option<String>,
    bank_account: Option<String>,
    bank_iban: Option<String>,
    new_password: Option<String>,
    old_password: Option<String>,
    template_code: Option<String>,
}

#[tauri::command]
pub async fn create_company(
    client: DbState<'_>,
    data: ManageCompanyData,
) -> Result<i32, QueryError> {
    debug!("Creating company {:?}", data);

    let password_hash = match data.new_password {
        Some(password) => Some(
            hash(password, DEFAULT_COST).map_err(|e| QueryError::PasswordHashing(e.to_string()))?,
        ),
        None => None,
    };

    let company = client
        .company()
        .create(
            data.name,
            data.cin,
            data.address,
            data.city,
            data.zip,
            vec![
                company::vat_id::set(data.vat_id),
                company::email::set(data.email),
                company::phone::set(data.phone),
                company::bank_account::set(data.bank_account),
                company::bank_iban::set(data.bank_iban),
                company::password::set(password_hash),
            ],
        )
        .exec()
        .await
        .unwrap();

    let currency = client
        .currency()
        .create(
            "Euro".to_string(),
            "EUR".to_string(),
            1.0,
            company::id::equals(company.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    let template = client
        .template()
        .create(
            "Invoice Template".to_string(),
            data.template_code.unwrap_or("default".to_string()),
            company::id::equals(company.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    let _settings = client
        .settings()
        .create(
            company::id::equals(company.id),
            currency::id::equals(currency.id),
            template::id::equals(template.id),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    Ok(company.id)
}
#[tauri::command]
pub async fn update_company(
    client: DbState<'_>,
    id: i32,
    data: ManageCompanyData,
) -> CommandResult<()> {
    debug!("Updating company");

    let current_company = client
        .company()
        .find_unique(company::id::equals(id))
        .exec()
        .await?
        .ok_or(CoreError::CompanyNotFound)?;

    if current_company.password.is_some() {
        if let Some(old_password) = data.old_password {
            let password_matches = verify(old_password, &current_company.password.unwrap())
                .map_err(|e| CoreError::PasswordHashingError(e.to_string()))?;
            if !password_matches {
                return Err(CoreError::PasswordMismatch.into());
            }
        } else {
            return Err(CoreError::OldPasswordRequired.into());
        }
    }

    let mut update_params = vec![
        company::name::set(data.name),
        company::cin::set(data.cin),
        company::vat_id::set(data.vat_id),
        company::address::set(data.address),
        company::city::set(data.city),
        company::zip::set(data.zip),
        company::phone::set(data.phone),
        company::email::set(data.email),
        company::bank_account::set(data.bank_account),
        company::bank_iban::set(data.bank_iban),
    ];

    if let Some(new_password) = data.new_password {
        let password_hash = hash(new_password, DEFAULT_COST)
            .map_err(|e| CoreError::PasswordHashingError(e.to_string()))?;
        update_params.push(company::password::set(Some(password_hash)));
    }

    client
        .company()
        .update(company::id::equals(id), update_params)
        .exec()
        .await?;

    Ok(())
}

#[tauri::command]
pub async fn delete_company(client: DbState<'_>, id: i32) -> Result<(), String> {
    debug!("Deleting company");
    let data = client
        .company()
        .delete(company::id::equals(id))
        .exec()
        .await;

    match data {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn validate_company_password(
    client: DbState<'_>,
    id: i32,
    password: String,
) -> Result<bool, QueryError> {
    let company = client
        .company()
        .find_first(vec![company::id::equals(id)])
        .exec()
        .await?;

    match company {
        Some(c) => {
            if let Some(hash) = c.password {
                Ok(bcrypt::verify(password, &hash).unwrap_or(false))
            } else {
                Ok(false)
            }
        }
        None => Ok(false),
    }
}
