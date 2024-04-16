use super::error::AppError;
use std::path::Path;

/// cross-platform function to get the file name
pub fn file_name<P: AsRef<Path>>(path: P) -> Result<String, AppError> {
    let Some(file_name_os) = path.as_ref().file_name() else {
        return Err(AppError::InvalidPath("..".into()));
    };
    let path = file_name_os
        .to_os_string()
        .into_string()
        .map_err(|_| AppError::FileNameFormat)?;
    Ok(path)
}
