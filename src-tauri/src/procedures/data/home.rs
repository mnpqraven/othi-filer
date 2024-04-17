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

pub fn get_logical_drives() -> Result<Vec<String>, AppError> {
    #[cfg(windows)]
    unsafe {
        use itertools::Itertools;
        // 'C' ':' '\\' 'NUL'
        // worst case times 26
        let mut buffer = [0, 0, 0, 0].repeat(26);
        windows::Win32::Storage::FileSystem::GetLogicalDriveStringsA(Some(&mut buffer));

        let mut drives_bytes: Vec<Vec<u8>> = Vec::new();
        for (_, group) in &buffer.into_iter().group_by(|ch| *ch > 0) {
            drives_bytes.push(group.collect());
        }

        drives_bytes.retain(|grp| grp.iter().all(|ch| *ch > 0));
        let drives: Vec<String> = drives_bytes
            .iter()
            .flat_map(|bytes| match std::str::from_utf8(bytes) {
                Ok(res) => Ok(res.to_string()),
                Err(e) => Err(AppError::GenericError(e.to_string())),
            })
            .collect();
        Ok(drives)
    }
    #[cfg(not(windows))]
    Err(AppError::Unimplemented)
}

#[cfg(test)]
mod test {
    use super::get_logical_drives;

    #[test]
    fn drive() {
        if let Ok(drives) = get_logical_drives() {
            assert!(!drives.is_empty())
        }
    }
}
