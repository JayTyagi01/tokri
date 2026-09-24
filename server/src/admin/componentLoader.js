import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

export const Components = {
  Dashboard: componentLoader.add('Dashboard', './components/dashboard.jsx'),
  ProductEdit: componentLoader.add('ProductEdit', './components/product-edit.jsx'),
  CategoryEdit: componentLoader.add('CategoryEdit', './components/category-edit.jsx'),
  CmsList: componentLoader.add('CmsList', './components/cms-list.jsx'),
  ReviewEdit: componentLoader.add('ReviewEdit', './components/review-edit.jsx'),
  SettingsEdit: componentLoader.add('SettingsEdit', './components/settings-edit.jsx'),
  CouponEdit: componentLoader.add('CouponEdit', './components/coupon-edit.jsx'),
  OrderDetail: componentLoader.add('OrderDetail', './components/order-detail.jsx'),
  ChangePassword: componentLoader.add('ChangePassword', './components/change-password.jsx'),
  PartnerEdit: componentLoader.add('PartnerEdit', './components/partner-edit.jsx'),
  PincodeEdit: componentLoader.add('PincodeEdit', './components/pincode-edit.jsx'),
  StatusToggle: componentLoader.add('StatusToggle', './components/status-toggle.jsx'),
  CustomerEdit: componentLoader.add('CustomerEdit', './components/customer-edit.jsx'),
}

componentLoader.override('Login', './components/login.jsx')
componentLoader.override('ActionHeader', './components/action-header.jsx')
componentLoader.override('DefaultRichtextEditProperty', './components/richtext-edit.jsx')
componentLoader.override('SidebarResourceSection', './components/sidebar-dashboard.jsx')

export default componentLoader
