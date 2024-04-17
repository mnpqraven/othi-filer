use std::fs::{self, read_dir};

use rand::Rng;

pub struct DirTestSandbox {
    root: String,
}

impl DirTestSandbox {
    #[cfg(windows)]
    const ROOT: &'static str = "C:\\tmp\\filer-sandbox\\";
    #[cfg(not(windows))]
    const ROOT: &'static str = "/tmp/filer-sandbox/";

    /// TODO: instead of using folder name as seed, generate a random seed
    pub fn init() -> Result<Self, std::io::Error> {
        let mut root = Self::ROOT.to_string();
        let mut rng = rand::thread_rng();
        root.push_str(&rng.gen_range(0..10000).to_string());

        // clean up first
        let _ = fs::remove_dir_all(root.clone());

        let _ = fs::create_dir_all(&root);
        Ok(Self { root })
    }

    pub fn clean_up(&self) -> Result<(), std::io::Error> {
        fs::remove_dir_all(&self.root)
    }

    pub fn path(&self) -> String {
        self.root.to_owned()
    }

    pub fn debug_list(&self) {
        let read = read_dir(self.path()).unwrap();
        for entry in read {
            let _ = dbg!(entry);
        }
    }
}
