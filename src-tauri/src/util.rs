use std::path::PathBuf;

/// Get the accoubting config directory.
/// This config directory has the following structure:
/// - data.db
/// - assets/ # All the images/videos/audios are stored here
/// - config.toml
pub fn get_app_dir() -> PathBuf {
    // get app dir with /accounting. use std libary
    let path = platform_dirs::AppDirs::new(Some("accountingdata"), true).unwrap();
    let mut data_dir = path.data_dir;

    // check if in dev mode
    if cfg!(debug_assertions) {
        // set the dir to ./
        data_dir = PathBuf::from("./");
    }

    data_dir
}
