use super::reducer::Side;

#[derive(Debug)]
#[taurpc::ipc_type]
pub struct CopyUiState {
    pub left: DirActionPanel,
    pub right: DirActionPanel,
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
    pub is_selected: bool,
    // if this is expanded on the frontend
    // is_expanded: bool,
}

impl DirItem {
    pub fn new(path: impl Into<String>) -> Self {
        Self {
            path: path.into(),
            ..Default::default()
        }
    }
}
