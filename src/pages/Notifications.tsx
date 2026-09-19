import { Link } from "react-router-dom";
import { TopBar } from "../components/AppShell";
import { useStore } from "../context/Store";
import { formatTime } from "../lib/ids";

export function NotificationsPage() {
  const { notifications, markNotificationsRead, enableNotifications, device } = useStore();

  return (
    <>
      <TopBar title="Notifications" back="/more" />
      <div className="page">
        <p className="muted">
          Push is device-level. We store FCM token + Order ID — never a user account.
        </p>
        {device?.permission !== "granted" ? (
          <button className="btn" type="button" onClick={() => void enableNotifications()}>
            Enable notifications
          </button>
        ) : (
          <div className="notice">Permission granted. Token {device.fcmToken.slice(0, 22)}…</div>
        )}
        {notifications.length > 0 ? (
          <p>
            <button className="btn ghost" type="button" onClick={markNotificationsRead}>
              Mark all read
            </button>
          </p>
        ) : null}
        <div className="list">
          {notifications.length === 0 ? (
            <p className="empty">Quiet so far. Place an order to see delivery pings.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="line-item" style={{ gridTemplateColumns: "1fr" }}>
                <div>
                  {!n.read ? <span className="badge" style={{ position: "static" }}>New</span> : null}
                  <b> {n.title}</b>
                  <div>{n.body}</div>
                  <div className="muted">{formatTime(n.at)}</div>
                  {n.orderId ? <Link to={`/order/${n.orderId}`}>Open {n.orderId}</Link> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
