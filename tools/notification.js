class Notification{
    constructor(){
      this.notification = document.createElement('div');
    }
    init(){
      this.notification.classList.add('notice');
      document.querySelector('body').appendChild(this.notification);
    }
    show(message, type){
      if (type === 'success'){
        this.notification.classList.add('notice-success');
        this.notification.innerHTML='<strong>Success </strong>'+message;
      }else if (type === 'error') {
        this.notification.classList.add('notice-danger');
        this.notification.innerHTML='<strong>Error </strong>'+message;
      }else if (type === 'info') {
        this.notification.classList.add('notice-info');
        this.notification.innerHTML='<strong>Info </strong>'+message;
      }
      this.notification.classList.add('active');
      setTimeout(() => {
        this.notification.classList.remove('active');
        this.notification.textContent = '';
      },6100);
    }
  }

//init notification
const notification = new Notification();
notification.init();

