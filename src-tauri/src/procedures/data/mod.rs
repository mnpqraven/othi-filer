use super::actions::{types::DirActionState, AppStateArc};

pub mod home;

#[taurpc::procedures(path = "data", export_to = "../src/bindings/taurpc.ts")]
pub trait Data {
    async fn get_state() -> Result<DirActionState, String>;
}

#[taurpc::resolvers]
impl Data for AppStateArc {
    async fn get_state(self) -> Result<DirActionState, String> {
        let state = self.state.lock().await;
        dbg!(state.clone().left.current_pointer_path);
        Ok(state.clone())
    }
}
