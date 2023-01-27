function TimeAdjust(props) {
  const { increment, decrement, title, session } = props;
  return (
    <div id='session-label' className='labels'>
      <span className='label-title'>{title} Length</span>
      <button
        id='session-decrement'
        className='time-button'
        onClick={decrement}
      >
        -
      </button>
      <div id='session-length' className='time-length'>
        {session}
      </div>
      <button
        id='session-increment'
        className='time-button'
        onClick={increment}
      >
        +
      </button>
    </div>
  );
}

export default TimeAdjust;
