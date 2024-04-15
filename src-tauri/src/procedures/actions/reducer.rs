use super::types::{
    CopyUiState, DirActionPanel, SelectRequest, ToggleExpandRequest, ToggleHiddenRequest,
    UpdatePathRequest,
};
use crate::common::{
    error::{AppError, AppErrorIpc},
    AppStateArc,
};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::api::dir::is_dir;

#[derive(Clone, Serialize, Deserialize, specta::Type, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Side {
    Left,
    Right,
}

pub enum DirActionSchema {
    UpdateRootPath(UpdatePathRequest),
    UpdateCursorPath(UpdatePathRequest),
    Forward(UpdatePathRequest),
    Back(Side),
    ToggleExpand(ToggleExpandRequest),
    ToggleHidden(ToggleHiddenRequest),
    Select(SelectRequest),
    SwapSides,
    SetCopyWrapping(Option<bool>),
}

pub async fn dispatch_action(
    guard: AppStateArc,
    action: DirActionSchema,
) -> Result<CopyUiState, AppErrorIpc> {
    let mut state = guard.state.lock().await;

    match action {
        DirActionSchema::UpdateRootPath(UpdatePathRequest { side, to }) => {
            get_panel_mut(&mut state, side).root_path = to
        }
        DirActionSchema::ToggleHidden(ToggleHiddenRequest { side, to }) => {
            let panel = get_panel_mut(&mut state, side);
            panel.show_hidden = to;
        }
        DirActionSchema::UpdateCursorPath(UpdatePathRequest { side, to }) => {
            let panel = get_panel_mut(&mut state, side);
            panel.current_pointer_path = to
        }
        DirActionSchema::Forward(UpdatePathRequest { side, to }) => {
            let panel = get_panel_mut(&mut state, side);
            panel.current_pointer_path = to
        }
        DirActionSchema::Back(side) => {
            let panel = get_panel_mut(&mut state, side);
            let path = PathBuf::from(panel.current_pointer_path.clone());
            let mut ancestors = path.ancestors();
            // current dir
            ancestors.next();
            if let Some(next_path) = ancestors.next() {
                next_path
                    .to_str()
                    .unwrap()
                    .clone_into(&mut panel.current_pointer_path)
            }
        }
        DirActionSchema::ToggleExpand(ToggleExpandRequest {
            expanded,
            folder_path,
            side,
        }) => {
            let panel = get_panel_mut(&mut state, side);
            // if not a dir then noop
            if !is_dir(&folder_path).unwrap_or(false) {
                return Ok(state.clone());
            }

            match expanded {
                Some(true) => {
                    panel.expanded_paths.push(folder_path);
                }
                Some(false) => match panel.expanded_paths.iter().position(|e| *e == folder_path) {
                    Some(rm_index) => {
                        panel.expanded_paths.remove(rm_index);
                    }
                    None => {
                        return Err(AppError::GenericError("file not found".into()).into());
                    }
                },
                // toggle, find
                None => match panel.expanded_paths.iter().position(|e| *e == folder_path) {
                    Some(index) => {
                        panel.expanded_paths.remove(index);
                    }
                    None => {
                        panel.expanded_paths.push(folder_path);
                    }
                },
            }
        }
        DirActionSchema::Select(SelectRequest {
            side,
            path,
            selected,
        }) => {
            let panel = get_panel_mut(&mut state, side);
            let find = panel
                .selected_items
                .iter()
                .position(|path_in_list| path_in_list.eq(&path));
            match (find, selected) {
                // if not in list and `selected` > add
                (None, true) => {
                    panel.selected_items.push(path);
                }
                // if in list and `!selected` > remove
                (Some(index), false) => {
                    panel.selected_items.remove(index);
                }
                // rest noop
                _ => {}
            }
        }
        DirActionSchema::SwapSides => {
            let left_owned = state.left.clone();
            let right_owned = state.right.clone();
            state.left = right_owned;
            state.right = left_owned;
        }
        DirActionSchema::SetCopyWrapping(some_to) => match some_to {
            Some(to) => {
                state.global_config.copy_wrapping_dir = to;
            }
            None => {
                let prev = state.global_config.copy_wrapping_dir;
                state.global_config.copy_wrapping_dir = !prev;
            }
        },
    }

    Ok(state.clone())
}

// TODO: move to utils.rs ?
fn get_panel_mut(state: &mut CopyUiState, side: Side) -> &mut DirActionPanel {
    match side {
        Side::Left => &mut state.left,
        Side::Right => &mut state.right,
    }
}

#[allow(dead_code)]
pub fn get_panel(state: &CopyUiState, side: Side) -> &DirActionPanel {
    match side {
        Side::Left => &state.left,
        Side::Right => &state.right,
    }
}
