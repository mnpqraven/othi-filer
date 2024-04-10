use crate::{
    common::error::{AppError, AppErrorIpc},
    procedures::actions::types::DirPermission,
};
use std::path::Path;

#[cfg(unix)]
pub fn is_hidden(file: &Path) -> Result<bool, String> {
    let res = file
        .file_name()
        .unwrap()
        .to_str()
        .unwrap()
        .to_owned()
        .starts_with('.');
    Ok(res)
}

#[cfg(windows)]
pub fn is_hidden(file: &Path) -> Result<bool, String> {
    use std::os::windows::fs::MetadataExt;
    const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;
    // FIX: safe unwrap
    let res = file.metadata().unwrap().file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0;
    Ok(res)
}

pub fn empty_dir<T: AsRef<Path>>(path: T) -> Result<bool, AppErrorIpc> {
    match path.as_ref().is_dir() {
        true => match path.as_ref().read_dir() {
            Ok(mut iterator) => Ok(iterator.next().is_none()),
            Err(e) => Err(AppError::GenericError(e.to_string()).into()),
        },
        false => Err(AppError::GenericError("not a directory".to_owned()).into()),
    }
}

pub fn get_permissions<P: faccess::PathExt + ?Sized>(path: &P) -> DirPermission {
    DirPermission {
        readable: path.readable(),
        writable: path.writable(),
        executable: path.executable(),
    }
}
