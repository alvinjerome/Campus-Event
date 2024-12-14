import { toast } from 'sonner';

export const useToast = () => {
  const promiseToast = (promise, options = {}) => {
    return toast.promise(promise, {
      loading: options.loading || 'Loading...',
      success: options.success || 'Success!',
      error: (err) => options.error?.(err) || `Error: ${err.message}`,
      ...options
    });
  };

  const successToast = (message) => toast.success(message);
  const errorToast = (message) => toast.error(message);
  const infoToast = (message) => toast.info(message);
  const warningToast = (message) => toast.warning(message);

  return {
    promiseToast,
    success: successToast,
    error: errorToast,
    info: infoToast,
    warning: warningToast,
  };
};
