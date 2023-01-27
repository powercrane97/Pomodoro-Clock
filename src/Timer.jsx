function Timer(props) {
  const { state, minutes, seconds } = props;
  return (
    <div className='timer'>
      <div id='timer-wrapper'>
        <div id='timer-label'>{state ? "Session" : "Break"}</div>
        <div id='time-left'>
          <span>{`${minutes < 10 ? "0" + minutes : minutes}:${
            seconds < 10 ? "0" + seconds : seconds
          }`}</span>
        </div>
      </div>
    </div>
  );
}

export default Timer;
