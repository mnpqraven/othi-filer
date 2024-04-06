use std::path::PathBuf;

use super::types::{
    DirActionPanel, DirActionState, SelectRequest, ToggleExpandRequest, ToggleHiddenRequest,
    UpdatePathRequest,
};
use super::AppStateArc;
use serde::{Deserialize, Serialize};

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
}

pub async fn dispatch_action(
    guard: AppStateArc,
    action: DirActionSchema,
) -> Result<DirActionState, String> {
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
                panel.current_pointer_path = next_path.to_str().unwrap().to_owned()
            }
        }
        DirActionSchema::ToggleExpand(ToggleExpandRequest {
            expanded,
            folder_path,
            side,
        }) => {
            let panel = get_panel_mut(&mut state, side);
            if expanded {
                panel.expanded_paths.push(folder_path);
            } else {
                let rm_index = panel
                    .expanded_paths
                    .iter()
                    .position(|e| *e == folder_path)
                    .unwrap();
                panel.expanded_paths.remove(rm_index);
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
    }

    Ok(state.clone())
}

// TODO: move to utils.rs ?
fn get_panel_mut(state: &mut DirActionState, side: Side) -> &mut DirActionPanel {
    match side {
        Side::Left => &mut state.left,
        Side::Right => &mut state.right,
    }
}

#[allow(dead_code)]
fn get_panel(state: &DirActionState, side: Side) -> &DirActionPanel {
    match side {
        Side::Left => &state.left,
        Side::Right => &state.right,
    }
}
