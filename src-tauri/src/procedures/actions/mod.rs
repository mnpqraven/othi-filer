/// this module manages the copy-n-paste dir for now
///
use self::{
    // back::BackIn,
    // forward::ForwardIn,
    list_dir::list_dir,
    reducer::{dispatch_action, DirActionSchema, Side},
    types::{
        DirActionPanel, DirActionState, DirItem, ListDirRequest, SelectRequest,
        ToggleExpandRequest, ToggleHiddenRequest, UpdatePathRequest,
    },
};
use std::{path::Path, sync::Arc};
use tokio::sync::Mutex;

use super::data::home::home_dir;

pub mod back;
pub mod list_dir;
pub mod reducer;
pub mod types;

#[taurpc::procedures(path = "actions", export_to = "../src/bindings/taurpc.ts")]
pub trait DirAction {
    // TODO: move this to data (try using a diffenrt trait but same impl (DirActionImpl) to share state)
    // async fn tree_state() -> Result<DirActionState, String>;
    async fn list_dir(params: ListDirRequest) -> Result<Vec<DirItem>, String>;
    async fn toggle_expand(params: ToggleExpandRequest) -> Result<DirActionState, String>;
    async fn toggle_hidden(params: ToggleHiddenRequest) -> Result<DirActionState, String>;
    async fn update_cursor_path(params: UpdatePathRequest) -> Result<DirActionState, String>;
    async fn forward(params: UpdatePathRequest) -> Result<DirActionState, String>;
    async fn back(params: Side) -> Result<DirActionState, String>;
    async fn select(params: SelectRequest) -> Result<DirActionState, String>;
}

/// TODO: manage state
#[derive(Clone)]
pub struct AppStateArc {
    pub state: Arc<Mutex<DirActionState>>,
}

impl AppStateArc {
    pub async fn new() -> Result<Self, String> {
        let initial_state = DirActionState::new().await?;
        Ok(Self {
            state: Arc::new(Mutex::new(initial_state)),
        })
    }
}

impl DirActionState {
    pub async fn new() -> Result<Self, String> {
        let home_path = home_dir().unwrap();
        let default_panel: DirActionPanel = DirActionPanel {
            root_path: home_path.clone(),
            current_pointer_path: home_path.clone(),
            show_hidden: false,
            items: list_dir(&home_path, false).unwrap(),
            selected_items: vec![],
            expanded_paths: vec![],
        };

        Ok(Self {
            left: default_panel.clone(),
            right: default_panel.clone(),
        })
    }
}

#[taurpc::resolvers]
impl DirAction for AppStateArc {
    // async fn tree_state(self) -> Result<DirActionState, String> {
    //     let state = self.state.lock().await;
    //     let state = state.clone();

    //     Ok(state)
    // }

    async fn list_dir(self, params: ListDirRequest) -> Result<Vec<DirItem>, String> {
        let ListDirRequest { path, show_hidden } = params;
        let path = Path::new(&path);
        list_dir::list_dir(path, show_hidden)
    }

    /// needs alot of work with recursion
    async fn toggle_expand(self, params: ToggleExpandRequest) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::ToggleExpand(params)).await
    }

    async fn toggle_hidden(self, params: ToggleHiddenRequest) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::ToggleHidden(params)).await
    }

    async fn update_cursor_path(self, params: UpdatePathRequest) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::UpdateCursorPath(params)).await
    }

    async fn forward(self, params: UpdatePathRequest) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::Forward(params)).await
    }

    async fn back(self, params: Side) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::Back(params)).await
    }

    async fn select(self, params: SelectRequest) -> Result<DirActionState, String> {
        dispatch_action(self, DirActionSchema::Select(params)).await
    }
}
