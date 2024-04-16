use super::types::{
    CopyUiState, DirActionPanel, SelectRequest, ToggleExpandRequest, ToggleHiddenRequest,
    UpdatePathRequest,
};
use crate::common::{error::AppError, AppStateArc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::api::dir::is_dir;
use tracing::*;

#[derive(Clone, Serialize, Deserialize, specta::Type, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Side {
    Left,
    Right,
}

#[derive(Debug)]
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

#[instrument(skip(guard))]
pub async fn dispatch_action(
    guard: AppStateArc,
    action: DirActionSchema,
) -> Result<CopyUiState, AppError> {
    let mut state = guard.state.lock().await;
    info!(?action);

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
                    .ok_or(AppError::FileNameFormat)?
                    .clone_into(&mut panel.current_pointer_path)
            }
        }
        DirActionSchema::ToggleExpand(ToggleExpandRequest {
            side,
            paths,
            expanded,
        }) => {
            if paths.is_empty() {
                return Ok(state.clone());
            }
            let panel = get_panel_mut(&mut state, side);
            let (left_iter, right_iter) = (
                &mut panel.expanded_paths,
                &paths
                    .into_iter()
                    .filter(|path| is_dir(path).unwrap_or_default())
                    .collect::<Vec<String>>(),
            );

            union_flag_switch(left_iter, right_iter, expanded);
        }
        DirActionSchema::Select(SelectRequest {
            side,
            paths,
            selected,
        }) => {
            if paths.is_empty() {
                return Ok(state.clone());
            }
            let panel = get_panel_mut(&mut state, side);
            let (left_iter, right_iter) = (&mut panel.selected_items, &paths);

            union_flag_switch(left_iter, right_iter, selected);
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

pub fn get_panel_mut(state: &mut CopyUiState, side: Side) -> &mut DirActionPanel {
    match side {
        Side::Left => &mut state.left,
        Side::Right => &mut state.right,
    }
}

pub fn get_panel(state: &CopyUiState, side: Side) -> &DirActionPanel {
    match side {
        Side::Left => &state.left,
        Side::Right => &state.right,
    }
}

/// this functions takes in 2 iterator and mutates the first to either have all
/// or none of the contents from the 2nd iterator
fn union_flag_switch(left_iter: &mut Vec<String>, right_iter: &[String], to_value: Option<bool>) {
    // [hello]
    // not used high-level
    let any = right_iter.iter().any(|path| left_iter.contains(path));

    // use these 3 below
    // [baz]
    let none = right_iter.iter().all(|path| !left_iter.contains(path));
    // [hello, bar]
    let all = right_iter.iter().all(|path| left_iter.contains(path));
    // [hello, baz]
    let partial = any && !all;

    match to_value {
        Some(true) => {
            left_iter.extend(right_iter.iter().cloned());
            left_iter.sort();
            left_iter.dedup();
        }
        Some(false) => left_iter.retain(|path| !right_iter.contains(path)),
        None => {
            if partial | none {
                left_iter.extend(right_iter.iter().cloned());
                left_iter.sort();
                left_iter.dedup();
            } else if all {
                left_iter.retain(|path| !right_iter.contains(path))
            }
        }
    }
}
