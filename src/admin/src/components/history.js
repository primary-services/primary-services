import {
  useTownHistory,
} from "../api-hooks.js";

export const TownHistory = ({ close, town }) => {
    const history = useTownHistory(town.id);
    return <div>
        <p className="disclaimer">Records not available for changes before X/X/X</p>
        {
            history.length === 0 ? <h4>No history available.</h4> : history.map((entry, idx) => (
                <div key={idx} className="history-entry">
                    <div className="history-meta">
                        <span className="history-date">{new Date(entry.date).toLocaleString()}</span>
                        <span className="history-user">by {entry.user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="history-changes">
                        {entry.changes.map((change, cidx) => (
                            <div key={cidx} className="history-change">
                                <strong>{change.field}:</strong> "{change.oldValue}" &rarr; "{change.newValue}"
                            </div>
                        ))}
                    </div>
                </div>
            ))
        }
        <section className="actions">
          <div className="btn blocky clicky" onClick={close}>
            Close
          </div>
		</section>
    </div>;
}