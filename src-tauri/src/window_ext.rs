use tauri::{Runtime, Window};

#[allow(dead_code)]
pub enum ToolbarThickness {
    Thick,
    Medium,
    Thin,
}

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_thickness(&self, thickness: ToolbarThickness);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_thickness(&self, thickness: ToolbarThickness) {
        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            match thickness {
                ToolbarThickness::Thick => {
                    self.set_title("").expect("Title wasn't set to ''");
                    make_toolbar(id);
                }
                ToolbarThickness::Medium => {
                    make_toolbar(id);
                }
                ToolbarThickness::Thin => {
                    // todo
                }
            }
        }
    }
}

#[cfg(target_os = "macos")]
unsafe fn make_toolbar(id: cocoa::base::id) {
    use cocoa::appkit::{NSToolbar, NSWindow};

    let new_toolbar = NSToolbar::alloc(id);
    new_toolbar.init_();
    id.setToolbar_(new_toolbar);
}
