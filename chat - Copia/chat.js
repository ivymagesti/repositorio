class InteractiveChatbox {
  constructor(a, b, c) {
    this.args = {
      button: a,
      chatbox: b,
    };
    this.icons = c;
    this.state = false;
  }

  display() {
    const { button, chatbox } = this.args;

    button.addEventListener('click', () => this.toggleState(chatbox));
  }

  toggleState(chatbox) {
    this.state = !this.state;
    this.showOrHideChatBox(chatbox, this.args.button);
  }

  showOrHideChatBox(chatbox, button) {
    if (this.state) {
      chatbox.classList.add('chatbox--active');
      this.toggleIcon(true, button);
    } else if (!this.state) {
      chatbox.classList.remove('chatbox--active');
      this.toggleIcon(false, button);
    }
  }

  toggleIcon(state, button) {
    const { isClicked, isNotClicked } = this.icons;
    let b = button.children[0].innerHTML;

    if (state) {
      button.children[0].innerHTML = isClicked;
    } else if (!state) {
      button.children[0].innerHTML = isNotClicked;
    }
  }
}

const chatButton = document.querySelector('.chatbox__button');
const chatContent = document.querySelector('.chatbox__support');
const icons = {
  isClicked: 'Clicado',
  isNotClicked: 'Sem clicar',
};
const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
chatbox.display();
chatbox.toggleIcon(false, chatButton);

(function () {
  const sendBtn = document.querySelector('#send');
  const messages = document.querySelector('#messages');
  const messageBox = document.querySelector('#messageBox');

  let ws;

  function showMessage(message) {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
  }

  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket('ws://localhost:6969');
    ws.onopen = () => {
      console.log('Connection opened!');
    };
    ws.onmessage = ({ data }) => showMessage(data);
    ws.onclose = function () {
      ws = null;
    };
  }

  sendBtn.onclick = function () {
    if (!ws) {
      showMessage('No WebSocket connection :(');
      return;
    }

    ws.send(messageBox.value);
    showMessage(messageBox.value);
  };

  init();
})();
