document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detailsModal');
  if (!modal) return;

  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;

    const name = button.getAttribute('data-name');
    const description = button.getAttribute('data-description');
    const price = button.getAttribute('data-price');
    const stockText = button.getAttribute('data-stock-text');
    const stockClass = button.getAttribute('data-stock-class');

    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductDescription').textContent = description;
    document.getElementById('modalProductPrice').textContent = price;

    const stockEl = document.getElementById('modalProductStock');
    stockEl.textContent = stockText;
    stockEl.className = 'fw-bold ' + stockClass;
  });
});