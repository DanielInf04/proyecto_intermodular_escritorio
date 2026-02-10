export const Alerts = {
  async confirmDelete({
    title = '¿Eliminar?',
    text = 'Esta acción no se puede deshacer'
  } = {}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    });
  },

  success(message, { toast = true } = {}) {
    return Swal.fire(
      toast
        ? {
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          }
        : {
            icon: 'success',
            title: 'Correcto',
            text: message,
            timer: 1500,
            showConfirmButton: false
          }
    );
  },

  error(message) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  },

  loading(message = 'Procesando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  },

  close() {
    Swal.close();
  }
};