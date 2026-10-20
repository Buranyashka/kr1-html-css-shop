/* =========================================================
   main.js
   Совместим со всеми страницами проекта:
   - index.html  — модальное окно и кнопки заказа в карточках
   - order.html  — форма заявки на странице
   - contacts.html — форма обратной связи
   ========================================================= */

/* ---------- 1. Модальное окно (есть только на index.html) ---------- */
const orderDialog = document.getElementById('order-dialog');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

// Открытие модального окна из карточек товара (если кнопки-<button> с data-product есть).
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');

orderButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (!orderDialog) return; // если модалки нет — не вмешиваемся
    event.preventDefault();

    const productName = button.dataset.product;
    if (selectedProductInput) {
      selectedProductInput.value = productName;
    }

    orderDialog.showModal();
  });
});

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

/* ---------- 2. Универсальная обработка форм ---------- */
function setupForm(formId, successMessageId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const successMessage = successMessageId
    ? document.getElementById(successMessageId)
    : null;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(form.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!form.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      form.reportValidity();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();

    if (orderDialog && orderDialog.open) {
      orderDialog.close();
    }
  });
}

// Модальная форма на index.html
setupForm('order-form', 'success-message');

// Форма на order.html
setupForm('order-page-form', 'order-page-success');

// Форма на contacts.html (создадим на шаге 3)
setupForm('contacts-form', 'contacts-success');
