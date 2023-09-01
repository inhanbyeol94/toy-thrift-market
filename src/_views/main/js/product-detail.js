const productId = window.location.pathname.split('/product/')[1];
const productImageEl = document.querySelector('#product-image');
const nameEl = document.querySelector('#product-name');
const priceEl = document.querySelector('#product-price');
const contentEl = document.querySelector('#product-content');
const memberProfileImageEl = document.querySelector('#member-profile-image');
const memberNameEl = document.querySelector('#member-name');
const smallImageGalleryEl = document.querySelector('#small-image-gallery');
const categoryEl = document.querySelector('#small-category');
const resister = document.getElementById('resister');
const updated = document.getElementById('updated');
const payment = document.getElementById('payment');

loadProduct();
async function loadProduct() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();

  const { productImages, price, name: productName, content, createdAt, updatedAt, bankAccountNumber } = result;
  const { profileImage, name: memberName } = result.member;
  const { name: categoryName } = result.smallCategory;

  productImageEl.src = productImages[0].imageUrl;
  nameEl.innerText = productName;
  contentEl.innerText = content;
  priceEl.innerText = price.toLocaleString() + '원';
  memberProfileImageEl.src = profileImage;
  memberNameEl.innerText = memberName;
  categoryEl.innerText = categoryName;
  resister.innerText = new Date(createdAt).toLocaleString();
  updated.innerText = new Date(updatedAt).toLocaleString();
  payment.innerText = bankAccountNumber;

  // 이미지가 두장 이상일경우
  if (productImages.length >= 2) {
    const smallImageGallery = document.createElement('div');
    smallImageGallery.setAttribute('class', 'row');

    for (let i = 1; i < productImages.length; i++) {
      const imageUrl = productImages[i].imageUrl;
      const smallImage = document.createElement('div');
      smallImage.setAttribute('class', 'col-sm-6');
      smallImage.innerHTML = `<a
                            class="gallery-item rounded-3 mb-grid-gutter smallImage"
                            href="img/marketplace/single/02.jpg"
                            data-sub-html='&lt;h6 class="fs-sm text-light"&gt;UI Psd iPhone X Monochrome&lt;/h6&gt;'
                          >
                            <img src=${imageUrl} alt="Gallery preview" />
                            <span class="gallery-item-caption">UI Psd iPhone X Monochrome</span>
                          </a>`;

      smallImageGalleryEl.appendChild(smallImage);
    }
    const smallImages = document.querySelectorAll('.smallImage img');
    smallImages.forEach((img) => {
      img.style.width = '380px';
      img.style.height = '308px';
    });
  }
}
// 결제버튼 이벤트
// document.getElementById('payButton').addEventListener('click',())
