import appInfo from './appInfo.js';

export function clearTheCart() {
  appInfo.cart = {};
  window.localStorage.removeItem('cart');
}

export function addToTheCart(goodsInfo, specOne) {
  const cart = appInfo.cart;
  const goodsId = goodsInfo.id;
  const specId = specOne.id;
  const amount = 1; // parseInt 强制转换输入为数字
  if (!goodsId || !specId) {
    window.toast('商品信息错误');
    return;
  }
  // 为某一基本商品创建存储空间
  const cartGoods = cart[goodsId] || {
    goodsId: goodsId, // 基本商品id，用于找到改商品的购物车数据后返回id
    goodsInfo: goodsInfo, // 缓存基本商品详情
    specInfo: {}, // 缓存不通规格商品详情
    specs: {} // 存储不同规格商品数量
  };
  // 为购物车内不同规格的商品计数并缓存规格商品详情
  if (!cartGoods.specs[specId]) {
    cartGoods.specs[specId] = amount;
    cartGoods.specInfo[specId] = specOne;
  } else {
    cartGoods.specs[specId] += amount;
  }
  // 更新购物车总数及总价
  cart.mount = (cart.mount || 0) + amount;
  cart.allPrice = (cart.allPrice || 0) + (parseFloat(specOne.price) * amount);
  // 将商品的信息变动更新到cart对象
  cart[goodsId] = cartGoods;
  return cart;
}

export function removeFromTheCart(goodsInfo, specOne) {
  const cart = appInfo.cart;
  const goodsId = goodsInfo.id;
  const specId = specOne.id;
  const amount = 1; // parseInt 强制转换输入为数字
  const cartGoods = cart[goodsId];
  // 购物车无该规格商品信息
  if (!cartGoods) {
    return;
  }
  if (!goodsId || !specId) {
    window.toast('商品信息错误');
    return;
  }
  if (cartGoods.specs[specId]) {
    cartGoods.specs[specId] -= amount;
  }
  // 清空该规格商品信息
  if (cartGoods.specs[specId] < 1) {
    delete cartGoods.specs[specId];
    delete cartGoods.specInfo[specId];
  }
  cart.mount -= amount;
  cart.allPrice -= parseFloat(specOne.price);
  if (cart.mount < 1) {
    cart.mount = 0;
    cart.allPrice = 0;
  }
  cart[goodsId] = cartGoods;
  return cart;
}
