'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Download, ExternalLink, RefreshCw, Truck, XCircle } from 'lucide-react';
import adminService from '@/lib/services/admin';
import styles from './orders.module.css';

export const isDelhiveryShipment = (shipment) =>
  Boolean(shipment?.awb_code) && /delhivery/i.test(shipment?.courier_name || '');

const isActiveDelhivery = (shipment) =>
  isDelhiveryShipment(shipment) && shipment.status !== 'cancelled';

const formatStatus = (status) =>
  String(status || 'manifested')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function DelhiveryShipping({ order, onShipmentChange, compact = false }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const shipment = order?.shipment || null;
  const sent = isActiveDelhivery(shipment);
  const cancelled = isDelhiveryShipment(shipment) && shipment.status === 'cancelled';
  const orderCancelled = (order?.order_status || '').toLowerCase() === 'cancelled';

  const run = async (key, action) => {
    setBusy(key);
    setError('');
    try {
      await action();
    } catch (err) {
      const message = err.message || 'Delhivery request failed';
      setError(message);
      toast.error(message);
    } finally {
      setBusy('');
    }
  };

  const send = (e) => {
    e?.stopPropagation();
    run('send', async () => {
      const next = await adminService.sendOrderToDelhivery(order.order_id);
      onShipmentChange(order.order_id, next);
      toast.success(`Sent to Delhivery One · AWB ${next.awb_code}`);
    });
  };

  const downloadLabel = (e) => {
    e?.stopPropagation();
    const win = window.open('', '_blank');
    run('label', async () => {
      try {
        const { label_url: url } = await adminService.getDelhiveryLabel(order.order_id);
        if (win) win.location.href = url;
        else window.location.href = url;
      } catch (err) {
        win?.close();
        throw err;
      }
    });
  };

  const refresh = (e) => {
    e?.stopPropagation();
    run('track', async () => {
      const data = await adminService.trackDelhiveryShipment(order.order_id);
      onShipmentChange(order.order_id, data.shipment);
      toast.success(`Delhivery status: ${data.status}`);
    });
  };

  const cancel = (e) => {
    e?.stopPropagation();
    if (!window.confirm(`Cancel Delhivery shipment ${shipment.awb_code}?`)) return;
    run('cancel', async () => {
      const next = await adminService.cancelDelhiveryShipment(order.order_id);
      onShipmentChange(order.order_id, next);
      toast.success('Delhivery shipment cancelled');
    });
  };

  if (compact) {
    if (sent) {
      return (
        <span className={styles.dlSentBadge} title={`AWB ${shipment.awb_code}`}>
          <CheckCircle2 size={14} />
          Delhivery
        </span>
      );
    }
    if (orderCancelled) return <span className={styles.muted}>—</span>;
    return (
      <button
        type="button"
        className={styles.dlSendBtnSmall}
        onClick={send}
        disabled={busy === 'send'}
      >
        <Truck size={13} />
        {busy === 'send' ? 'Sending…' : 'Send'}
      </button>
    );
  }

  return (
    <div className={styles.dlPanel}>
      {sent ? (
        <>
          <div className={styles.dlSentRow}>
            <CheckCircle2 size={20} className={styles.dlTick} />
            <div>
              <p className={styles.dlSentTitle}>Sent to Delhivery One</p>
              <p className={styles.dlSentMeta}>
                AWB <strong>{shipment.awb_code}</strong> · {formatStatus(shipment.status)}
              </p>
            </div>
          </div>
          <div className={styles.dlActions}>
            <button
              type="button"
              className={styles.dlActionBtn}
              onClick={downloadLabel}
              disabled={Boolean(busy)}
            >
              <Download size={14} />
              {busy === 'label' ? 'Preparing…' : 'Download label'}
            </button>
            {shipment.tracking_url && (
              <a
                href={shipment.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.dlActionBtn}
              >
                <ExternalLink size={14} />
                Track
              </a>
            )}
            <button
              type="button"
              className={styles.dlActionBtn}
              onClick={refresh}
              disabled={Boolean(busy)}
            >
              <RefreshCw size={14} />
              {busy === 'track' ? 'Checking…' : 'Refresh status'}
            </button>
            <button
              type="button"
              className={`${styles.dlActionBtn} ${styles.dlDangerBtn}`}
              onClick={cancel}
              disabled={Boolean(busy)}
            >
              <XCircle size={14} />
              {busy === 'cancel' ? 'Cancelling…' : 'Cancel shipment'}
            </button>
          </div>
        </>
      ) : (
        <>
          {cancelled && (
            <p className={styles.dlCancelledNote}>
              Previous Delhivery shipment {shipment.awb_code} was cancelled.
            </p>
          )}
          <button
            type="button"
            className={styles.dlSendBtn}
            onClick={send}
            disabled={busy === 'send' || orderCancelled}
          >
            <Truck size={16} />
            {busy === 'send'
              ? 'Sending to Delhivery…'
              : cancelled
                ? 'Send to Delhivery One again'
                : 'Send to Delhivery One'}
          </button>
          {orderCancelled && (
            <p className={styles.muted}>Cancelled orders cannot be shipped.</p>
          )}
        </>
      )}
      {error && <p className={styles.dlError}>{error}</p>}
    </div>
  );
}
