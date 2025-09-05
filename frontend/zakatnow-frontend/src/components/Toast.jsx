import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showSuccess(message) {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
  });
}

export function showError(message) {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
  });
}

export function showInfo(message) {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
  });
}