use super::{list_dir::list_dir, reducer::Side};
use crate::procedures::data::home::home_dir;

#[derive(Debug)]
#[taurpc::ipc_type]
pub struct CopyUiState {
    pub left: DirActionPanel,
    pub right: DirActionPanel,
}

impl CopyUiState {
    pub async fn new() -> Result<Self, String> {
        let home_path = home_dir().unwrap();
        let default_panel: DirActionPanel = DirActionPanel {
            root_path: home_path.clone(),
            current_pointer_path: home_path.clone(),
            show_hidden: false,
            items: list_dir(&home_path, false, Some(&home_path)).unwrap(),
            selected_items: vec![],
            expanded_paths: vec![],
        };

        Ok(Self {
            left: default_panel.clone(),
            right: default_panel.clone(),
        })
    }
}

#[derive(Debug)]
#[taurpc::ipc_type]
pub struct DirActionPanel {
    // the full path of the current panel
    pub root_path: String,
    // this pointer will be use to keep track of current dir for both front-end
    // and back-end
    // TODO: travesal function that returns the DirItem
    pub current_pointer_path: String,
    pub show_hidden: bool,
    pub items: Vec<DirItem>,
    pub expanded_paths: Vec<String>,
    pub selected_items: Vec<String>,
}

// ----------------- INPUTS

#[taurpc::ipc_type]
pub struct ToggleExpandRequest {
    pub side: Side,
    pub folder_path: String,
    pub expanded: bool,
}

#[taurpc::ipc_type]
pub struct ToggleHiddenRequest {
    pub side: Side,
    pub to: bool,
}

#[taurpc::ipc_type]
pub struct UpdatePathRequest {
    pub side: Side,
    pub to: String,
}

#[taurpc::ipc_type]
pub struct ListDirRequest {
    pub path: String,
    pub show_hidden: bool,
    pub side: Side,
}

#[taurpc::ipc_type]
pub struct SelectRequest {
    pub side: Side,
    pub path: String,
    pub selected: bool,
}

// ----------------- OUTPUTS

#[taurpc::ipc_type]
pub struct ListDirOut {
    pub path: String,
    pub short_path: String,
    pub children: Vec<DirItem>,
}

// ----------------- AUX

#[derive(Default, Debug)]
#[taurpc::ipc_type]
pub struct DirItem {
    // the full path of the current panel
    pub path: String,
    // the truncated path of the current panel
    pub short_path: String,
    pub is_folder: bool,
    pub permissions: Option<DirPermission>,
}

#[derive(Default, Debug)]
#[taurpc::ipc_type]
pub struct DirPermission {
    pub readable: bool,
    pub writable: bool,
    pub executable: bool,
}

impl DirItem {
    pub fn new(path: impl Into<String>) -> Self {
        Self {
            path: path.into(),
            ..Default::default()
        }
    }
}
