use crate::common::error::AppError;

pub fn home_dir() -> Result<String, AppError> {
    let dir = tauri::api::path::home_dir();

    match dir {
        Some(path_buf) => Ok(path_buf
            .to_str()
            .ok_or(AppError::FileNameFormat)?
            .to_owned()),
        None => Err(AppError::GenericError("unknown home".into())),
    }
}
