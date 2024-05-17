use anyhow::Result;
use deno_bindgen::deno_bindgen;
use std::slice;
use std::{
    error::Error,
    sync::{Arc, RwLock},
};
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

static WHISPER: RwLock<Option<Arc<WhisperContext>>> = RwLock::new(None);

#[deno_bindgen]
fn initialize(path: &str) -> u8 {
    match raw_initialize(path) {
        Ok(_) => 0,
        Err(_) => 1,
    }
}

fn raw_initialize(path: &str) -> Result<(), Box<dyn Error>> {
    let mut param = WhisperContextParameters::default();
    param.use_gpu(true);
    let context = WhisperContext::new_with_params(path, param)?;
    *WHISPER.write().unwrap() = Some(Arc::new(context));
    Ok(())
}

fn get_whisper_context() -> Result<Arc<WhisperContext>, Box<dyn Error>> {
    WHISPER
        .read()
        .unwrap()
        .clone()
        .ok_or("Failed to get whisper context".into())
}

#[deno_bindgen(non_blocking)]
pub fn transcribe(buffer: &[u8]) -> String {
    let float_slice = unsafe {
        slice::from_raw_parts(
            buffer.as_ptr() as *const f32,
            buffer.len() / std::mem::size_of::<f32>(),
        )
    };

    let context = get_whisper_context().unwrap();
    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
    params.set_language(Some("ja"));

    // now we can run the model
    let mut state = context.create_state().expect("failed to create state");
    state
        .full(params, &float_slice[..])
        .expect("failed to run model");

    let mut segments: Vec<String> = Vec::new();

    // fetch the results
    let num_segments = state
        .full_n_segments()
        .expect("failed to get number of segments");

    for i in 0..num_segments {
        let segment = state.full_get_segment_text(i).unwrap_or(String::new());
        segments.push(segment)
    }

    segments.concat()
}
