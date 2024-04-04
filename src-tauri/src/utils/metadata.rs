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
