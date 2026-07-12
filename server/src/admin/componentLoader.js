import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

export const Components = {
  Dashboard: componentLoader.add('Dashboard', './components/dashboard.jsx'),
  ProductEdit: componentLoader.add('ProductEdit', './components/product-edit.jsx'),
  CategoryEdit: componentLoader.add('CategoryEdit', './components/category-edit.jsx'),
  CmsList: componentLoader.add('CmsList', './components/cms-list.jsx'),
  ReviewEdit: componentLoader.add('ReviewEdit', './components/review-edit.jsx'),
  SettingsEdit: componentLoader.add('SettingsEdit', './components/settings-edit.jsx'),
  OrderDetail: componentLoader.add('OrderDetail', './components/order-detail.jsx'),
}

componentLoader.override('Login', './components/login.jsx')
componentLoader.override('ActionHeader', './components/action-header.jsx')
componentLoader.override('DefaultRichtextEditProperty', './components/richtext-edit.jsx')

export default componentLoader
