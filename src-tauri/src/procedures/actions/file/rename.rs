use std::path::PathBuf;

use super::RenameRequest;
use crate::common::error::AppError;

pub fn rename(params: RenameRequest) -> Result<(), AppError> {
    let RenameRequest { path, from, to } = params;
    let path_from = PathBuf::from(path.clone()).join(from);
    let path_to = PathBuf::from(path).join(to);
    std::fs::rename(path_from, path_to)?;
    Ok(())
}
