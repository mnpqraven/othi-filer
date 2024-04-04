use std::path::Path;
use std::os::windows::fs::MetadataExt;

#[cfg(unix)]
pub fn is_hidden(file: &DirEntry) -> Result<bool, String> {
    use std::os::unix::ffi::OsStrExt;

    let res = file.file_name().as_os_str().as_bytes()[0] != b'.';
    Ok(res)
}

#[cfg(windows)]
pub fn is_hidden(file: &Path) -> Result<bool, String> {
    const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;
    // FIX: safe unwrap
    let res = file.metadata().unwrap().file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0;
    Ok(res)
}
