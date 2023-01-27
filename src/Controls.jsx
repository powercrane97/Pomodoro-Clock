function Controls({ running, start, stop, reset }) {
  return (
    <div className='timer-controls'>
      <button
        id='start_stop'
        className='control'
        onClick={running ? stop : start}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button id='reset' className='control' onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default Controls;
