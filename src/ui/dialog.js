// Modal window built on the native <dialog> element: Esc closes it and keyboard
// focus stays inside. We add closing by a click outside and returning focus
// to the element that opened it (CLAUDE.md, section 5).
//
// openDialog resolves with the value of the pressed action, or null when the
// player closed the window another way (Esc, click outside).

let counter = 0;

// focusTitle: for long content, start at the top (title gets focus) instead of
// scrolling down to the first button
export function openDialog({ title, body, actions, className = '', focusTitle = false }) {
  counter += 1;
  const titleId = `dialog-title-${counter}`;
  const opener = document.activeElement;

  const dialog = document.createElement('dialog');
  dialog.className = `dialog ${className}`.trim();
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.innerHTML = `
    <div class="dialog__inner">
      <h2 class="dialog__title" id="${titleId}" tabindex="-1" ${focusTitle ? 'autofocus' : ''}>${title}</h2>
      <div class="dialog__body">${body}</div>
      <div class="dialog__actions">
        ${actions
          .map(
            (action) =>
              `<button type="button" class="button ${action.primary ? 'button--primary' : 'button--secondary'}"
                data-value="${action.value}" ${action.autofocus && !focusTitle ? 'autofocus' : ''}>${action.label}</button>`,
          )
          .join('')}
      </div>
    </div>
  `;
  document.body.append(dialog);

  return new Promise((resolve) => {
    let result = null;

    dialog.addEventListener('click', (event) => {
      const button = event.target.closest('[data-value]');
      if (button) {
        result = button.dataset.value;
        dialog.close();
      } else if (event.target === dialog) {
        // The click landed on the backdrop area around .dialog__inner
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => {
      dialog.remove();
      if (opener && document.contains(opener)) opener.focus();
      resolve(result);
    });

    dialog.showModal();
  });
}
