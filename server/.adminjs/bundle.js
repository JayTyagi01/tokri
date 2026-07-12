(function (React, adminjs, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const api = new adminjs.ApiClient();
  const statCards = [{
    key: 'productCount',
    label: 'Products',
    icon: 'ShoppingCart',
    resource: 'Product'
  }, {
    key: 'orderCount',
    label: 'Orders',
    icon: 'ShoppingBag',
    resource: 'Order'
  }, {
    key: 'pageCount',
    label: 'Pages',
    icon: 'FileText',
    resource: 'Page'
  }, {
    key: 'reviewCount',
    label: 'Reviews',
    icon: 'Star',
    resource: 'Review'
  }];
  const adminRoot = () => window.location.pathname.split('/resources')[0] || '';
  const Dashboard = () => {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
      api.getDashboard().then(res => setData(res.data)).catch(() => setData({}));
    }, []);
    const stats = data || {};
    const root = adminRoot();
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "grey",
      className: "tokri-dashboard"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-dashboard-hero",
      p: "xxl",
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      mb: "sm"
    }, "Welcome to Tokriii CMS"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.9
    }, "Manage your store content, products, orders, and website settings from one place.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "grid",
      className: "tokri-stat-grid",
      mb: "xl"
    }, statCards.map(card => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: card.key,
      className: "tokri-stat-card",
      p: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, card.label), /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: card.icon
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: 32,
      fontWeight: "bold"
    }, stats[card.key] ?? '—'), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      mt: "default",
      size: "sm",
      variant: "text",
      as: "a",
      href: `/tokri-backoffice/resources/${card.resource}`
    }, "View all")))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "grid",
      className: "tokri-dashboard-grid"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "lg"
    }, "Quick actions"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      flexWrap: "wrap",
      className: "tokri-quick-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      as: "a",
      href: `${root}/resources/Product/actions/new`,
      variant: "contained"
    }, "Add product"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      as: "a",
      href: `${root}/resources/Page/actions/new`,
      variant: "outlined"
    }, "Add page"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      as: "a",
      href: `${root}/resources/Setting/records/1/edit`,
      variant: "outlined"
    }, "Store settings"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      as: "a",
      href: `${root}/resources/Order`,
      variant: "outlined"
    }, "View orders"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "lg"
    }, "Recent orders"), (stats.recentOrders || []).length === 0 ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "No orders yet.") : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "table",
      className: "tokri-recent-table"
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Order"), /*#__PURE__*/React__default.default.createElement("th", null, "Status"), /*#__PURE__*/React__default.default.createElement("th", null, "Total"))), /*#__PURE__*/React__default.default.createElement("tbody", null, stats.recentOrders.map(order => /*#__PURE__*/React__default.default.createElement("tr", {
      key: order.orderNo
    }, /*#__PURE__*/React__default.default.createElement("td", null, order.orderNo), /*#__PURE__*/React__default.default.createElement("td", null, order.status), /*#__PURE__*/React__default.default.createElement("td", null, "\u20B9", order.grandTotal))))))));
  };

  const normalizeSlugInput$1 = value => {
    return String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };
  const withoutTrailingSlash$2 = value => String(value || '').replace(/\/+$/, '');
  const ProductEdit = props => {
    const {
      record: initialRecord,
      resource
    } = props;
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const addNotice = adminjs.useNotice();
    const fileRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [slugEdited, setSlugEdited] = React.useState(Boolean(initialRecord?.params?.slug));
    const [previewUrl, setPreviewUrl] = React.useState('');
    const [descriptionMode, setDescriptionMode] = React.useState('wysiwyg');
    const [descriptionValue, setDescriptionValue] = React.useState('');
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$2(custom.apiBaseUrl || '/api/v1');
    const productUrlBase = withoutTrailingSlash$2(custom.productUrlBase || `${window.location.origin}/product`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput$1(slugInput) || normalizeSlugInput$1(params.name);
    const productUrl = previewSlug ? `${productUrlBase}/${previewSlug}` : null;
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$2(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    React.useEffect(() => {
      return () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);
    React.useEffect(() => {
      setDescriptionValue(String(params.description || ''));
    }, [params.description]);
    const onPropertyChange = (propertyPath, value, ...rest) => {
      if (propertyPath === 'slug') {
        setSlugEdited(true);
        handleChange(propertyPath, normalizeSlugInput$1(value), ...rest);
        return;
      }
      handleChange(propertyPath, value, ...rest);
      if (propertyPath === 'name' && !slugEdited) {
        handleChange('slug', normalizeSlugInput$1(value));
      }
    };
    const uploadImage = async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('folder', 'products');
      formData.append('file', file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      setUploading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/media/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Image upload failed');
        }
        const media = await response.json();
        handleChange('image', media.path);
        handleChange('mediaId', media.id);
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$2(custom.appUrl || window.location.origin)}${media.path}`);
        addNotice({
          message: 'Image uploaded successfully',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not upload image',
          type: 'error'
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    const submit = event => {
      event.preventDefault();
      handleSubmit().catch(() => {
        addNotice({
          message: 'Could not save product',
          type: 'error'
        });
      });
    };
    const propertyByPath = Object.fromEntries(resource.editProperties.map(property => [property.propertyPath, property]));
    const renderProperty = propertyPath => {
      const property = propertyByPath[propertyPath];
      if (!property) return null;
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
        key: property.propertyPath,
        where: "edit",
        onChange: onPropertyChange,
        property: property,
        resource: resource,
        record: record
      });
    };
    const remainingProperties = resource.editProperties.filter(property => !['name', 'slug', 'description', 'image', 'mediaId'].includes(property.propertyPath));
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "sm"
    }, "Product"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.75
    }, "Upload the product image, edit the slug, and save. Duplicate slugs are automatically renamed like WordPress.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, renderProperty('name')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "lg",
      border: "1px solid #dbe3ea",
      borderRadius: "12px",
      bg: "#f8fafc"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Slug"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "sm"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      as: "span",
      fontWeight: "bold"
    }, `${productUrlBase}/`), /*#__PURE__*/React__default.default.createElement("input", {
      value: slugInput,
      placeholder: "Leave empty to auto-generate from name",
      onChange: event => onPropertyChange('slug', event.target.value),
      style: {
        minWidth: 260,
        flex: '1 1 260px',
        padding: '10px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        fontSize: 14
      }
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Preview:", ' ', productUrl ? /*#__PURE__*/React__default.default.createElement("a", {
      href: productUrl,
      target: "_blank",
      rel: "noreferrer"
    }, productUrl) : 'Generated from product name when saved'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Leave empty to auto-generate from the product name. If the slug already exists, a number suffix is added automatically (for example, mango-2).")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Description"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "md",
      opacity: 0.75
    }, "Use the WYSIWYG toolbar, or switch to HTML source and preview mode."), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      gap: "sm",
      mb: "md"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('wysiwyg'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'wysiwyg' ? '#047857' : '#ffffff',
        color: descriptionMode === 'wysiwyg' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "WYSIWYG"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('html'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'html' ? '#047857' : '#ffffff',
        color: descriptionMode === 'html' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "HTML"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('preview'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'preview' ? '#047857' : '#ffffff',
        color: descriptionMode === 'preview' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Preview")), descriptionMode === 'wysiwyg' ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        minHeight: 220
      }
    }, renderProperty('description')) : descriptionMode === 'html' ? /*#__PURE__*/React__default.default.createElement("textarea", {
      value: descriptionValue,
      onChange: event => {
        setDescriptionValue(event.target.value);
        onPropertyChange('description', event.target.value);
      },
      rows: 10,
      placeholder: "<p>Write product description in HTML...</p>",
      style: {
        width: '100%',
        minHeight: 220,
        border: '1px solid #cbd5e1',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        lineHeight: 1.45,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      }
    }) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      p: "lg",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      style: {
        minHeight: 220,
        background: '#f8fafc'
      }
    }, descriptionValue ? /*#__PURE__*/React__default.default.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: descriptionValue
      }
    }) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "Preview will appear here."))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "md"
    }, "Product Image"), displayedImageUrl ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.name || 'Product preview',
      style: {
        width: 220,
        height: 220,
        objectFit: 'cover',
        borderRadius: 16,
        border: '1px solid #dbe3ea'
      }
    })) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "lg",
      opacity: 0.7
    }, "No image selected yet."), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadImage
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "JPG, PNG, GIF, or WebP up to 5MB.")), remainingProperties.map(property => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: property.propertyPath
    }, renderProperty(property.propertyPath))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || uploading
    }, loading || uploading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save product")));
  };

  const normalizeSlugInput = value => {
    return String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };
  const withoutTrailingSlash$1 = value => String(value || '').replace(/\/+$/, '');
  const CategoryEdit = props => {
    const {
      record: initialRecord,
      resource
    } = props;
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const addNotice = adminjs.useNotice();
    const fileRef = React.useRef(null);
    const bannerFileRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [bannerUploading, setBannerUploading] = React.useState(false);
    const [slugEdited, setSlugEdited] = React.useState(Boolean(initialRecord?.params?.slug));
    const [previewUrl, setPreviewUrl] = React.useState('');
    const [bannerPreviewUrl, setBannerPreviewUrl] = React.useState('');
    const [descriptionMode, setDescriptionMode] = React.useState('wysiwyg');
    const [descriptionValue, setDescriptionValue] = React.useState('');
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$1(custom.apiBaseUrl || '/api/v1');
    const categoryUrlBase = withoutTrailingSlash$1(custom.categoryUrlBase || `${window.location.origin}/category`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput(slugInput) || normalizeSlugInput(params.label);
    const categoryUrl = previewSlug ? `${categoryUrlBase}/${previewSlug}` : null;
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$1(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    const bannerImageUrl = React.useMemo(() => {
      if (!params.bannerImage) return '';
      if (/^(https?:|data:|blob:)/.test(params.bannerImage)) return params.bannerImage;
      return `${withoutTrailingSlash$1(custom.appUrl || window.location.origin)}${params.bannerImage}`;
    }, [custom.appUrl, params.bannerImage]);
    const displayedBannerUrl = bannerPreviewUrl || bannerImageUrl;
    React.useEffect(() => {
      return () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);
    React.useEffect(() => {
      return () => {
        if (bannerPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(bannerPreviewUrl);
      };
    }, [bannerPreviewUrl]);
    React.useEffect(() => {
      setDescriptionValue(String(params.description || ''));
    }, [params.description]);
    const onPropertyChange = (propertyPath, value, ...rest) => {
      if (propertyPath === 'slug') {
        setSlugEdited(true);
        handleChange(propertyPath, normalizeSlugInput(value), ...rest);
        return;
      }
      handleChange(propertyPath, value, ...rest);
      if (propertyPath === 'label' && !slugEdited) {
        handleChange('slug', normalizeSlugInput(value));
      }
    };
    const uploadImage = async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('folder', 'categories');
      formData.append('file', file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      setUploading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/media/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Image upload failed');
        }
        const media = await response.json();
        onPropertyChange('image', media.path);
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$1(custom.appUrl || window.location.origin)}${media.path}`);
        addNotice({
          message: 'Image uploaded successfully',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not upload image',
          type: 'error'
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    const uploadBanner = async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('folder', 'categories');
      formData.append('file', file);
      const localPreviewUrl = URL.createObjectURL(file);
      setBannerPreviewUrl(localPreviewUrl);
      setBannerUploading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/media/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Image upload failed');
        }
        const media = await response.json();
        onPropertyChange('bannerImage', media.path);
        setBannerPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$1(custom.appUrl || window.location.origin)}${media.path}`);
        addNotice({
          message: 'Banner uploaded successfully',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not upload banner',
          type: 'error'
        });
      } finally {
        setBannerUploading(false);
        if (bannerFileRef.current) bannerFileRef.current.value = '';
      }
    };
    const submit = event => {
      event.preventDefault();
      handleSubmit().catch(() => {
        addNotice({
          message: 'Could not save category',
          type: 'error'
        });
      });
    };
    const propertyByPath = Object.fromEntries(resource.editProperties.map(property => [property.propertyPath, property]));
    const renderProperty = propertyPath => {
      const property = propertyByPath[propertyPath];
      if (!property) return null;
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
        key: property.propertyPath,
        where: "edit",
        onChange: onPropertyChange,
        property: property,
        resource: resource,
        record: record
      });
    };
    const remainingProperties = resource.editProperties.filter(property => !['label', 'slug', 'description', 'image', 'bannerImage'].includes(property.propertyPath));
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "sm"
    }, "Category"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.75
    }, "Upload the category image, edit the slug, and save. Duplicate slugs are automatically renamed like WordPress.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, renderProperty('label')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "lg",
      border: "1px solid #dbe3ea",
      borderRadius: "12px",
      bg: "#f8fafc"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Slug"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "sm"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      as: "span",
      fontWeight: "bold"
    }, `${categoryUrlBase}/`), /*#__PURE__*/React__default.default.createElement("input", {
      value: slugInput,
      placeholder: "Leave empty to auto-generate from label",
      onChange: event => onPropertyChange('slug', event.target.value),
      style: {
        minWidth: 260,
        flex: '1 1 260px',
        padding: '10px 12px',
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        fontSize: 14
      }
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Preview:", ' ', categoryUrl ? /*#__PURE__*/React__default.default.createElement("a", {
      href: categoryUrl,
      target: "_blank",
      rel: "noreferrer"
    }, categoryUrl) : 'Generated from category label when saved'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Leave empty to auto-generate from the category label. If the slug already exists, a number suffix is added automatically (for example, fruits-2).")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Description"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "md",
      opacity: 0.75
    }, "Use the WYSIWYG toolbar, or switch to HTML source and preview mode."), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      gap: "sm",
      mb: "md"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('wysiwyg'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'wysiwyg' ? '#047857' : '#ffffff',
        color: descriptionMode === 'wysiwyg' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "WYSIWYG"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('html'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'html' ? '#047857' : '#ffffff',
        color: descriptionMode === 'html' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "HTML"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setDescriptionMode('preview'),
      style: {
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '6px 12px',
        background: descriptionMode === 'preview' ? '#047857' : '#ffffff',
        color: descriptionMode === 'preview' ? '#ffffff' : '#0f172a',
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Preview")), descriptionMode === 'wysiwyg' ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        minHeight: 220
      }
    }, renderProperty('description')) : descriptionMode === 'html' ? /*#__PURE__*/React__default.default.createElement("textarea", {
      value: descriptionValue,
      onChange: event => {
        setDescriptionValue(event.target.value);
        onPropertyChange('description', event.target.value);
      },
      rows: 10,
      placeholder: "<p>Write category description in HTML...</p>",
      style: {
        width: '100%',
        minHeight: 220,
        border: '1px solid #cbd5e1',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        lineHeight: 1.45,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      }
    }) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      p: "lg",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      style: {
        minHeight: 220,
        background: '#f8fafc'
      }
    }, descriptionValue ? /*#__PURE__*/React__default.default.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: descriptionValue
      }
    }) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "Preview will appear here."))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "md"
    }, "Category Image"), displayedImageUrl ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.label || 'Category preview',
      style: {
        width: 220,
        height: 220,
        objectFit: 'cover',
        borderRadius: 16,
        border: '1px solid #dbe3ea'
      }
    })) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "lg",
      opacity: 0.7
    }, "No image selected yet."), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadImage
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "JPG, PNG, GIF, or WebP up to 5MB.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "md"
    }, "Category Banner"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "md",
      opacity: 0.75
    }, "Wide banner shown at the top of the category page on the website."), displayedBannerUrl ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedBannerUrl,
      alt: params.label || 'Category banner',
      style: {
        width: '100%',
        maxWidth: 640,
        height: 200,
        objectFit: 'cover',
        borderRadius: 16,
        border: '1px solid #dbe3ea'
      }
    })) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "lg",
      opacity: 0.7
    }, "No banner selected yet."), /*#__PURE__*/React__default.default.createElement("input", {
      ref: bannerFileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadBanner
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "JPG, PNG, GIF, or WebP up to 5MB. Recommended wide image (e.g. 1600\xD7400).")), remainingProperties.map(property => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: property.propertyPath
    }, renderProperty(property.propertyPath))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'none'
      },
      "aria-hidden": "true"
    }, renderProperty('image'), renderProperty('bannerImage')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || uploading || bannerUploading
    }, loading || uploading || bannerUploading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save category")));
  };

  const CmsList = props => {
    const {
      resource,
      setTag
    } = props;
    const titleProp = resource.titleProperty?.name || resource.titleProperty?.propertyPath || 'id';
    const {
      storeParams,
      filters
    } = adminjs.useQueryParams();
    const {
      records,
      loading,
      direction,
      sortBy,
      page,
      total,
      fetchData,
      perPage
    } = adminjs.useRecords(resource.id);
    const {
      selectedRecords,
      handleSelect,
      handleSelectAll,
      setSelectedRecords
    } = adminjs.useSelectedRecords(records);
    const [query, setQuery] = React.useState(() => String(filters?.[titleProp] || ''));
    const debounceRef = React.useRef(null);
    const storeParamsRef = React.useRef(storeParams);
    storeParamsRef.current = storeParams;
    React.useEffect(() => {
      setQuery(String(filters?.[titleProp] || ''));
      setSelectedRecords([]);
    }, [resource.id, titleProp, setSelectedRecords]);
    React.useEffect(() => {
      if (setTag) setTag(total.toString());
    }, [total, setTag]);
    const handleQueryChange = event => {
      const value = event.target.value;
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const trimmed = value.trim();
        storeParamsRef.current({
          page: '1',
          filters: trimmed ? {
            [titleProp]: trimmed
          } : {}
        });
      }, 300);
    };
    React.useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, []);
    const handleActionPerformed = () => fetchData();
    const handlePaginationChange = pageNumber => {
      storeParams({
        page: pageNumber.toString()
      });
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "grey"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg",
      style: {
        position: 'relative',
        maxWidth: 420
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        position: 'absolute',
        top: '50%',
        left: 12,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        opacity: 0.6
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Search"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      value: query,
      onChange: handleQueryChange,
      placeholder: `Search ${resource.name}...`,
      style: {
        width: '100%',
        paddingLeft: 36
      }
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "container"
    }, /*#__PURE__*/React__default.default.createElement(adminjs.RecordsTable, {
      resource: resource,
      records: records,
      actionPerformed: handleActionPerformed,
      onSelect: handleSelect,
      onSelectAll: handleSelectAll,
      selectedRecords: selectedRecords,
      direction: direction,
      sortBy: sortBy,
      isLoading: loading
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "xl",
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Pagination, {
      page: page,
      perPage: perPage,
      total: total,
      onChange: handlePaginationChange
    }))));
  };

  const withoutTrailingSlash = value => String(value || '').replace(/\/+$/, '');
  const ReviewEdit = props => {
    const {
      record: initialRecord,
      resource
    } = props;
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const addNotice = adminjs.useNotice();
    const fileRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState('');
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1');
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    React.useEffect(() => {
      return () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);
    const uploadImage = async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('folder', 'reviews');
      formData.append('file', file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      setUploading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/media/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Image upload failed');
        }
        const media = await response.json();
        handleChange('image', media.path);
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash(custom.appUrl || window.location.origin)}${media.path}`);
        addNotice({
          message: 'Image uploaded successfully',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not upload image',
          type: 'error'
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    const submit = event => {
      event.preventDefault();
      handleSubmit().catch(() => {
        addNotice({
          message: 'Could not save review',
          type: 'error'
        });
      });
    };
    const propertyByPath = Object.fromEntries(resource.editProperties.map(property => [property.propertyPath, property]));
    const renderProperty = propertyPath => {
      const property = propertyByPath[propertyPath];
      if (!property) return null;
      return /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
        key: property.propertyPath,
        where: "edit",
        onChange: handleChange,
        property: property,
        resource: resource,
        record: record
      });
    };
    const remainingProperties = resource.editProperties.filter(property => !['title', 'name', 'content', 'image'].includes(property.propertyPath));
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "sm"
    }, "Review"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.75
    }, "Add the review title, reviewer name, content, and an optional reviewer image.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, renderProperty('title')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, renderProperty('name')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, renderProperty('content')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl",
      p: "xl",
      border: "1px solid #dbe3ea",
      borderRadius: "16px",
      bg: "#ffffff"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "md"
    }, "Reviewer Image"), displayedImageUrl ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.name || 'Reviewer',
      style: {
        width: 140,
        height: 140,
        objectFit: 'cover',
        borderRadius: '50%',
        border: '1px solid #dbe3ea'
      }
    })) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "lg",
      opacity: 0.7
    }, "No image selected yet."), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadImage
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "JPG, PNG, GIF, or WebP up to 5MB.")), remainingProperties.map(property => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: property.propertyPath,
      mb: "lg"
    }, renderProperty(property.propertyPath))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || uploading
    }, loading || uploading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save review")));
  };

  const TABS = [{
    id: 'general',
    label: 'General',
    fields: ['storeName', 'storeTagline', 'storeEmail', 'storePhone1', 'storePhone2', 'storeAddress', 'promoBanner', 'earlyDelivery']
  }, {
    id: 'appearance',
    label: 'Appearance',
    fields: ['colorPrimary', 'colorPrimaryLight', 'colorAccent', 'colorBackground', 'colorFooterFrom', 'colorFooterVia', 'fontFamily']
  }, {
    id: 'homepage',
    label: 'Homepage',
    fields: ['homeBannerEnabled', 'homeCategoriesEnabled', 'homeBestSellersEnabled', 'homeBestSellersTitle', 'homeShopOurRangeEnabled', 'homeFruitHighlightEnabled', 'homeImportedFruitsEnabled', 'homeReviewsEnabled']
  }, {
    id: 'payments',
    label: 'Payments',
    fields: ['razorpayEnabled', 'razorpayKeyId', 'razorpayKeySecret']
  }, {
    id: 'notifications',
    label: 'Notifications',
    fields: ['twilioEnabled', 'twilioAccountSid', 'twilioAuthToken', 'twilioSmsFrom', 'twilioWhatsappFrom']
  }];
  const SettingsEdit = props => {
    const {
      record: initialRecord,
      resource
    } = props;
    const [activeTab, setActiveTab] = React.useState('general');
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    React.useEffect(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash && TABS.some(tab => tab.id === hash)) {
        setActiveTab(hash);
      }
    }, []);
    React.useEffect(() => {
      window.history.replaceState(null, '', `#${activeTab}`);
    }, [activeTab]);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'success' || response?.data?.record) {
          addNotice({
            message: 'Settings saved successfully',
            type: 'success'
          });
        } else if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save settings',
            type: 'error'
          });
        }
      }).catch(() => {
        addNotice({
          message: 'Could not save settings. Please try again.',
          type: 'error'
        });
      });
      return false;
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      flex: true,
      flexDirection: "column",
      className: "tokri-settings-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-settings-tabs",
      mb: "xl"
    }, TABS.map(tab => /*#__PURE__*/React__default.default.createElement("button", {
      key: tab.id,
      type: "button",
      className: `tokri-settings-tab${activeTab === tab.id ? ' is-active' : ''}`,
      onClick: () => setActiveTab(tab.id)
    }, tab.label))), /*#__PURE__*/React__default.default.createElement(designSystem.DrawerContent, null, TABS.map(tab => {
      const properties = resource.editProperties.filter(property => tab.fields.includes(property.propertyPath));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        key: tab.id,
        className: "tokri-settings-panel",
        p: "xl",
        style: {
          display: activeTab === tab.id ? 'block' : 'none'
        }
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
        mb: "sm"
      }, tab.label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        mb: "xl",
        opacity: 0.75
      }, "Update your store settings and click Save changes below."), properties.map(property => /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
        key: property.propertyPath,
        where: "edit",
        onChange: handleChange,
        property: property,
        resource: resource,
        record: record
      })));
    })), /*#__PURE__*/React__default.default.createElement(designSystem.DrawerFooter, null, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save changes")));
  };

  const formatMoney = value => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return '₹0';
    return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })}`;
  };
  const formatDateTime = value => {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };
  const resolveImage = value => {
    if (!value) return '';
    if (/^(https?:|data:|blob:)/.test(value)) return value;
    if (value.startsWith('/')) return `${window.location.origin.replace(/:\d+$/, ':5000')}${value}`;
    return value;
  };
  const OrderDetail = props => {
    const {
      record: initialRecord,
      resource,
      action
    } = props;
    const isEdit = action?.name === 'edit';
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const params = record?.params || {};
    const [saving, setSaving] = React.useState(false);
    const items = React.useMemo(() => {
      try {
        const parsed = JSON.parse(params.itemsJson || '[]');
        return parsed.map(item => ({
          ...item,
          image: resolveImage(item.image)
        }));
      } catch {
        return [];
      }
    }, [params.itemsJson]);
    const handleSave = async event => {
      event.preventDefault();
      setSaving(true);
      try {
        await submit();
        addNotice({
          message: 'Order updated successfully.',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not update order.',
          type: 'error'
        });
      } finally {
        setSaving(false);
      }
    };
    const statusOptions = [{
      value: 'pending',
      label: 'Pending'
    }, {
      value: 'paid',
      label: 'Paid'
    }, {
      value: 'packed',
      label: 'Packed'
    }, {
      value: 'shipped',
      label: 'Shipped'
    }, {
      value: 'delivered',
      label: 'Delivered'
    }, {
      value: 'cancelled',
      label: 'Cancelled'
    }];
    const paymentOptions = [{
      value: 'pending',
      label: 'Pending'
    }, {
      value: 'paid',
      label: 'Paid'
    }, {
      value: 'failed',
      label: 'Failed'
    }, {
      value: 'refunded',
      label: 'Refunded'
    }];
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "grey",
      className: "tokri-order-detail"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "xl",
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H4, {
      mb: "sm"
    }, "Order #", params.orderNo, " details"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.8
    }, "Payment via ", params.paymentMethod || 'Cash on delivery', params.razorpayPaymentId ? ` · Payment ID: ${params.razorpayPaymentId}` : '')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "grid",
      className: "tokri-order-grid",
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "lg"
    }, "General"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Order date"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, formatDateTime(params.createdAt))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Customer name"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "bold"
    }, params.customerName || 'Guest')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Customer phone"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, params.customerPhone || '—')), params.customerEmail ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Customer email"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, params.customerEmail)) : null, isEdit ? /*#__PURE__*/React__default.default.createElement("form", {
      onSubmit: handleSave
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Order status"), /*#__PURE__*/React__default.default.createElement(designSystem.Select, {
      value: statusOptions.find(option => option.value === params.status),
      options: statusOptions,
      onChange: selected => handleChange('status', selected?.value)
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Payment status"), /*#__PURE__*/React__default.default.createElement(designSystem.Select, {
      value: paymentOptions.find(option => option.value === params.paymentStatus),
      options: paymentOptions,
      onChange: selected => handleChange('paymentStatus', selected?.value)
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || saving
    }, saving ? 'Saving...' : 'Update order')) : /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Order status"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      textTransform: "capitalize"
    }, params.status)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Payment status"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      textTransform: "capitalize"
    }, params.paymentStatus)))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "lg"
    }, "Delivery address"), params.addressFormatted ? /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Address type"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, params.addressLabel || 'Delivery')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Deliver to"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, params.customerName)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Phone"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, params.customerPhone || '—')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, "Full address"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      style: {
        lineHeight: 1.7
      }
    }, params.addressFormatted))) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "No delivery address saved for this order."))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-panel",
      p: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "lg"
    }, "Order items"), items.length === 0 ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "No items found for this order.") : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "table",
      className: "tokri-order-items-table"
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Item"), /*#__PURE__*/React__default.default.createElement("th", null, "Cost"), /*#__PURE__*/React__default.default.createElement("th", null, "Qty"), /*#__PURE__*/React__default.default.createElement("th", null, "Total"))), /*#__PURE__*/React__default.default.createElement("tbody", null, items.map(item => /*#__PURE__*/React__default.default.createElement("tr", {
      key: item.id
    }, /*#__PURE__*/React__default.default.createElement("td", null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      alignItems: "center",
      style: {
        gap: 12
      }
    }, item.image ? /*#__PURE__*/React__default.default.createElement("img", {
      src: item.image,
      alt: item.name,
      className: "tokri-order-item-image"
    }) : null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "bold"
    }, item.name), item.weight ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      opacity: 0.7
    }, item.weight) : null))), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(item.priceValue)), /*#__PURE__*/React__default.default.createElement("td", null, item.quantity), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(item.lineTotal))))), /*#__PURE__*/React__default.default.createElement("tfoot", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Items subtotal"), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(params.itemsTotal))), /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Delivery charges"), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(params.deliveryCharge))), /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Cart handling"), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(params.handlingCharge))), /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Small cart charge"), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(params.smallCartCharge))), Number(params.discount) > 0 ? /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Discount"), /*#__PURE__*/React__default.default.createElement("td", null, "-", formatMoney(params.discount))) : null, /*#__PURE__*/React__default.default.createElement("tr", {
      className: "is-total"
    }, /*#__PURE__*/React__default.default.createElement("td", {
      colSpan: 3
    }, "Order total"), /*#__PURE__*/React__default.default.createElement("td", null, formatMoney(params.grandTotal)))))));
  };

  const REMEMBERED_LOGIN_KEY = 'tokri_admin_login';
  const Login = () => {
    const {
      action,
      errorMessage
    } = window.__APP_STATE__ || {};
    const {
      translateMessage
    } = adminjs.useTranslation();
    const adminRoot = action?.replace(/\/login$/, '') || '';
    const forgotPasswordUrl = `${adminRoot}/forgot-password`;
    const [identifier, setIdentifier] = React.useState('');
    const [rememberLogin, setRememberLogin] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    React.useEffect(() => {
      const rememberedLogin = window.localStorage.getItem(REMEMBERED_LOGIN_KEY);
      if (rememberedLogin) {
        setIdentifier(rememberedLogin);
        setRememberLogin(true);
      }
    }, []);
    const handleSubmit = event => {
      const form = event.currentTarget;
      const emailInput = form.elements.namedItem('email');
      const value = (emailInput && 'value' in emailInput ? String(emailInput.value) : identifier).trim();
      if (emailInput && 'value' in emailInput) {
        emailInput.value = value;
      }
      if (rememberLogin && value) {
        window.localStorage.setItem(REMEMBERED_LOGIN_KEY, value);
      } else {
        window.localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      bg: "linear-gradient(135deg, #022c22, #047857)",
      p: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      bg: "white",
      width: ['100%', '440px'],
      borderRadius: "18px",
      boxShadow: "0 24px 70px rgba(2, 44, 34, 0.35)",
      p: "x3"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      color: "#022c22",
      mb: "sm"
    }, "Tokriii CMS"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "#64748b",
      mb: "xl"
    }, "Sign in with your admin email or username to manage products, orders, and content."), errorMessage ? /*#__PURE__*/React__default.default.createElement(designSystem.MessageBox, {
      mb: "lg",
      message: errorMessage.split(' ').length > 1 ? errorMessage : translateMessage(errorMessage),
      variant: "danger"
    }) : null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      action: action,
      method: "POST",
      onSubmit: handleSubmit
    }, /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: true
    }, "Email or username"), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      name: "email",
      placeholder: "Enter email or username",
      autoComplete: "username",
      defaultValue: identifier,
      key: identifier || 'login-email'
    })), /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: true
    }, "Password"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      position: "relative",
      width: "100%"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      type: showPassword ? 'text' : 'password',
      name: "password",
      placeholder: "Enter password",
      autoComplete: "current-password",
      style: {
        width: '100%',
        paddingRight: 42
      }
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      "aria-label": showPassword ? 'Hide password' : 'Show password',
      onClick: () => setShowPassword(value => !value),
      style: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        border: 0,
        background: 'transparent',
        color: '#047857',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        padding: 0
      }
    }, showPassword ? /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M3 3l18 18"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M10.6 10.6A2 2 0 0 0 13.4 13.4"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4.5 10 8a12.8 12.8 0 0 1-2.1 3.6"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M6.6 6.6C4.3 8 2.7 10.2 2 12c1 3.5 5 8 10 8 1.5 0 2.9-.4 4.1-1"
    })) : /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }))))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      alignItems: "center",
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement("input", {
      id: "remember-login",
      type: "checkbox",
      checked: rememberLogin,
      onChange: event => setRememberLogin(event.target.checked),
      style: {
        marginRight: 8
      }
    }), /*#__PURE__*/React__default.default.createElement("label", {
      htmlFor: "remember-login",
      style: {
        color: '#475569',
        fontSize: 14
      }
    }, "Remember my email or username on this device")), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      type: "submit",
      variant: "contained",
      width: "100%",
      mt: "lg"
    }, "Sign in")), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "xl",
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: forgotPasswordUrl,
      style: {
        color: '#047857',
        fontWeight: 700
      }
    }, "Forgot password?"))));
  };

  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  function adminRootPath() {
    const match = window.location.pathname.match(/^(.*)\/resources\//);
    return match ? match[1] : window.location.pathname.replace(/\/$/, '');
  }
  function catalogConfig(resourceId) {
    if (resourceId === 'Category') {
      return {
        exportUrl: 'categories/export',
        importUrl: 'categories/import'
      };
    }
    if (resourceId === 'Product') {
      return {
        exportUrl: 'products/export',
        importUrl: 'products/import'
      };
    }
    return null;
  }
  function CatalogListHeaderActions({
    resource,
    onImported
  }) {
    const {
      translateButton,
      translateAction
    } = adminjs.useTranslation();
    const {
      toggleFilter,
      filtersCount
    } = adminjs.useFilterDrawer();
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const fileRef = React.useRef(null);
    const resourceId = resource.id;
    const config = catalogConfig(resourceId);
    const root = adminRootPath();
    const handleImport = async event => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !config) return;
      setLoading(true);
      setMessage(null);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${root}/catalog/${config.importUrl}`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || 'Import failed.');
        }
        const errorCount = data.errors?.length || 0;
        setMessage({
          type: errorCount ? 'info' : 'success',
          text: errorCount > 0 ? `Import finished. ${data.created} added, ${data.updated} updated. ${errorCount} row(s) could not be imported.` : `Import finished. ${data.created} added, ${data.updated} updated.`
        });
        onImported?.();
      } catch (error) {
        setMessage({
          type: 'danger',
          text: error.message || 'Import failed.'
        });
      } finally {
        setLoading(false);
      }
    };
    const buttons = React.useMemo(() => {
      if (!config) return [];
      const items = [{
        label: 'Export',
        variant: 'text',
        href: `${root}/catalog/${config.exportUrl}`
      }, {
        label: loading ? 'Importing...' : 'Import',
        variant: 'text',
        onClick: loading ? undefined : () => fileRef.current?.click()
      }];
      const newAction = resource.resourceActions?.find(action => action.name === 'new');
      if (newAction) {
        items.push({
          icon: newAction.icon,
          label: translateAction(newAction.label, resourceId),
          variant: newAction.variant,
          href: `${root}/resources/${resourceId}/actions/new`,
          'data-css': `${resourceId}-new-button`
        });
      }
      const filterKey = filtersCount > 0 ? 'filterActive' : 'filter';
      items.push({
        label: translateButton(filterKey, resourceId, {
          count: filtersCount
        }),
        onClick: toggleFilter,
        icon: 'Filter',
        'data-css': `${resourceId}-filter-button`
      });
      return items;
    }, [config, root, loading, resource.resourceActions, resourceId, translateAction, translateButton, filtersCount, toggleFilter]);
    if (!config) return null;
    return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "xl",
      mb: "default",
      display: "flex",
      justifyContent: "flex-end",
      flexShrink: 0,
      px: ['default', 0],
      style: {
        marginTop: '-52px'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.ButtonGroup, {
      buttons: buttons
    }), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: ".csv,text/csv",
      style: {
        display: 'none'
      },
      onChange: handleImport
    })), message && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "default",
      px: ['default', 0]
    }, /*#__PURE__*/React__default.default.createElement(designSystem.MessageBox, {
      variant: message.type,
      message: message.text,
      onCloseClick: () => setMessage(null)
    })));
  }

  const CATALOG_RESOURCES = new Set(['Product', 'Category']);
  function ActionHeader(props) {
    const {
      OriginalComponent,
      action,
      resource
    } = props;
    const BaseHeader = OriginalComponent || adminjs.OriginalActionHeader;
    const isCatalogList = action?.name === 'list' && CATALOG_RESOURCES.has(resource?.id);
    if (!isCatalogList) {
      return /*#__PURE__*/React__default.default.createElement(BaseHeader, props);
    }
    const {
      OriginalComponent: _ignored,
      ...headerProps
    } = props;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(BaseHeader, _extends({}, headerProps, {
      omitActions: true
    })), /*#__PURE__*/React__default.default.createElement(CatalogListHeaderActions, {
      resource: resource,
      onImported: props.actionPerformed
    }));
  }

  const DEFAULT_OPTIONS = {
    plugins: ['code', 'link', 'lists', 'image', 'table', 'autolink', 'preview', 'searchreplace', 'wordcount', 'media', 'codesample'],
    toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table codesample | code | removeformat',
    height: 400
  };
  const RichtextEdit = props => {
    const {
      property,
      record,
      onChange
    } = props;
    const value = record.params?.[property.path] ?? '';
    const error = record.errors?.[property.path];
    const handleUpdate = React.useCallback(newValue => {
      onChange(property.path, newValue);
    }, [onChange, property.path]);
    const options = {
      ...DEFAULT_OPTIONS,
      ...(property.props || {})
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
      error: Boolean(error)
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: property.isRequired
    }, property.label), /*#__PURE__*/React__default.default.createElement(designSystem.TinyMCE, {
      value: value,
      onChange: handleUpdate,
      options: options
    }), /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, error?.message));
  };
  var DefaultRichtextEditProperty = /*#__PURE__*/React.memo(RichtextEdit);

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ProductEdit = ProductEdit;
  AdminJS.UserComponents.CategoryEdit = CategoryEdit;
  AdminJS.UserComponents.CmsList = CmsList;
  AdminJS.UserComponents.ReviewEdit = ReviewEdit;
  AdminJS.UserComponents.SettingsEdit = SettingsEdit;
  AdminJS.UserComponents.OrderDetail = OrderDetail;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vcmRlci1kZXRhaWwuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEJveCwgSDIsIEg1LCBUZXh0LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3Qgc3RhdENhcmRzID0gW1xuICB7IGtleTogJ3Byb2R1Y3RDb3VudCcsIGxhYmVsOiAnUHJvZHVjdHMnLCBpY29uOiAnU2hvcHBpbmdDYXJ0JywgcmVzb3VyY2U6ICdQcm9kdWN0JyB9LFxuICB7IGtleTogJ29yZGVyQ291bnQnLCBsYWJlbDogJ09yZGVycycsIGljb246ICdTaG9wcGluZ0JhZycsIHJlc291cmNlOiAnT3JkZXInIH0sXG4gIHsga2V5OiAncGFnZUNvdW50JywgbGFiZWw6ICdQYWdlcycsIGljb246ICdGaWxlVGV4dCcsIHJlc291cmNlOiAnUGFnZScgfSxcbiAgeyBrZXk6ICdyZXZpZXdDb3VudCcsIGxhYmVsOiAnUmV2aWV3cycsIGljb246ICdTdGFyJywgcmVzb3VyY2U6ICdSZXZpZXcnIH0sXG5dXG5cbmNvbnN0IGFkbWluUm9vdCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnL3Jlc291cmNlcycpWzBdIHx8ICcnXG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFwaS5nZXREYXNoYm9hcmQoKS50aGVuKChyZXMpID0+IHNldERhdGEocmVzLmRhdGEpKS5jYXRjaCgoKSA9PiBzZXREYXRhKHt9KSlcbiAgfSwgW10pXG5cbiAgY29uc3Qgc3RhdHMgPSBkYXRhIHx8IHt9XG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3QoKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiIGNsYXNzTmFtZT1cInRva3JpLWRhc2hib2FyZFwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1kYXNoYm9hcmQtaGVyb1wiIHA9XCJ4eGxcIiBtYj1cInhsXCI+XG4gICAgICAgIDxIMiBtYj1cInNtXCI+V2VsY29tZSB0byBUb2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuOX0+XG4gICAgICAgICAgTWFuYWdlIHlvdXIgc3RvcmUgY29udGVudCwgcHJvZHVjdHMsIG9yZGVycywgYW5kIHdlYnNpdGUgc2V0dGluZ3MgZnJvbSBvbmUgcGxhY2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktc3RhdC1ncmlkXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7c3RhdENhcmRzLm1hcCgoY2FyZCkgPT4gKFxuICAgICAgICAgIDxCb3gga2V5PXtjYXJkLmtleX0gY2xhc3NOYW1lPVwidG9rcmktc3RhdC1jYXJkXCIgcD1cImxnXCI+XG4gICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICA8SDU+e2NhcmQubGFiZWx9PC9INT5cbiAgICAgICAgICAgICAgPEljb24gaWNvbj17Y2FyZC5pY29ufSAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8VGV4dCBmb250U2l6ZT17MzJ9IGZvbnRXZWlnaHQ9XCJib2xkXCI+XG4gICAgICAgICAgICAgIHtzdGF0c1tjYXJkLmtleV0gPz8gJ+KAlCd9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIG10PVwiZGVmYXVsdFwiXG4gICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgaHJlZj17YC90b2tyaS1iYWNrb2ZmaWNlL3Jlc291cmNlcy8ke2NhcmQucmVzb3VyY2V9YH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgVmlldyBhbGxcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktZGFzaGJvYXJkLWdyaWRcIj5cbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJ4bFwiPlxuICAgICAgICAgIDxINSBtYj1cImxnXCI+UXVpY2sgYWN0aW9uczwvSDU+XG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGNsYXNzTmFtZT1cInRva3JpLXF1aWNrLWFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1Byb2R1Y3QvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwiY29udGFpbmVkXCI+XG4gICAgICAgICAgICAgIEFkZCBwcm9kdWN0XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1BhZ2UvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgQWRkIHBhZ2VcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgJHtyb290fS9yZXNvdXJjZXMvU2V0dGluZy9yZWNvcmRzLzEvZWRpdGB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBTdG9yZSBzZXR0aW5nc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9PcmRlcmB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBWaWV3IG9yZGVyc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPlJlY2VudCBvcmRlcnM8L0g1PlxuICAgICAgICAgIHsoc3RhdHMucmVjZW50T3JkZXJzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIG9yZGVycyB5ZXQuPC9UZXh0PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8Qm94IGFzPVwidGFibGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1yZWNlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0aD5PcmRlcjwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD5Ub3RhbDwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgIHtzdGF0cy5yZWNlbnRPcmRlcnMubWFwKChvcmRlcikgPT4gKFxuICAgICAgICAgICAgICAgICAgPHRyIGtleT17b3JkZXIub3JkZXJOb30+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD57b3JkZXIub3JkZXJOb308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+e29yZGVyLnN0YXR1c308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+4oK5e29yZGVyLmdyYW5kVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBJY29uLCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBCYXNlUHJvcGVydHlDb21wb25lbnQsXG4gIHVzZU5vdGljZSxcbiAgdXNlUmVjb3JkLFxufSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxufVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBQcm9kdWN0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uTW9kZSwgc2V0RGVzY3JpcHRpb25Nb2RlXSA9IHVzZVN0YXRlKCd3eXNpd3lnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uVmFsdWUsIHNldERlc2NyaXB0aW9uVmFsdWVdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBwcm9kdWN0VXJsQmFzZSA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKFxuICAgIGN1c3RvbS5wcm9kdWN0VXJsQmFzZSB8fCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9wcm9kdWN0YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubmFtZSlcbiAgY29uc3QgcHJvZHVjdFVybCA9IHByZXZpZXdTbHVnID8gYCR7cHJvZHVjdFVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldERlc2NyaXB0aW9uVmFsdWUoU3RyaW5nKHBhcmFtcy5kZXNjcmlwdGlvbiB8fCAnJykpXG4gIH0sIFtwYXJhbXMuZGVzY3JpcHRpb25dKVxuXG4gIGNvbnN0IG9uUHJvcGVydHlDaGFuZ2UgPSAocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdCkgPT4ge1xuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdzbHVnJykge1xuICAgICAgc2V0U2x1Z0VkaXRlZCh0cnVlKVxuICAgICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSwgLi4ucmVzdClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ25hbWUnICYmICFzbHVnRWRpdGVkKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ3NsdWcnLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdwcm9kdWN0cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIGhhbmRsZUNoYW5nZSgnbWVkaWFJZCcsIG1lZGlhLmlkKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpLmNhdGNoKCgpID0+IHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBwcm9wZXJ0eUJ5UGF0aCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiBbcHJvcGVydHkucHJvcGVydHlQYXRoLCBwcm9wZXJ0eV0pLFxuICApXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gKHByb3BlcnR5UGF0aCkgPT4ge1xuICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydHlCeVBhdGhbcHJvcGVydHlQYXRoXVxuICAgIGlmICghcHJvcGVydHkpIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVtYWluaW5nUHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcihcbiAgICAocHJvcGVydHkpID0+XG4gICAgICAhWyduYW1lJywgJ3NsdWcnLCAnZGVzY3JpcHRpb24nLCAnaW1hZ2UnLCAnbWVkaWFJZCddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gcD1cInhsXCI+XG4gICAgICA8Qm94IG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5Qcm9kdWN0PC9IND5cbiAgICAgICAgPFRleHQgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgVXBsb2FkIHRoZSBwcm9kdWN0IGltYWdlLCBlZGl0IHRoZSBzbHVnLCBhbmQgc2F2ZS4gRHVwbGljYXRlIHNsdWdzIGFyZSBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgcmVuYW1lZCBsaWtlIFdvcmRQcmVzcy5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnbmFtZScpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwibGdcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjEycHhcIiBiZz1cIiNmOGZhZmNcIj5cbiAgICAgICAgPExhYmVsPlNsdWc8L0xhYmVsPlxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGZsZXhXcmFwPVwid3JhcFwiIGdhcD1cInNtXCI+XG4gICAgICAgICAgPFRleHQgYXM9XCJzcGFuXCIgZm9udFdlaWdodD1cImJvbGRcIj5cbiAgICAgICAgICAgIHtgJHtwcm9kdWN0VXJsQmFzZX0vYH1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB2YWx1ZT17c2x1Z0lucHV0fVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJMZWF2ZSBlbXB0eSB0byBhdXRvLWdlbmVyYXRlIGZyb20gbmFtZVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1pbldpZHRoOiAyNjAsXG4gICAgICAgICAgICAgIGZsZXg6ICcxIDEgMjYwcHgnLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnMTBweCAxMnB4JyxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICB7cHJvZHVjdFVybCA/IChcbiAgICAgICAgICAgIDxhIGhyZWY9e3Byb2R1Y3RVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAge3Byb2R1Y3RVcmx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBwcm9kdWN0IG5hbWUgd2hlbiBzYXZlZCdcbiAgICAgICAgICApfVxuICAgICAgICA8L1RleHQ+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIExlYXZlIGVtcHR5IHRvIGF1dG8tZ2VuZXJhdGUgZnJvbSB0aGUgcHJvZHVjdCBuYW1lLiBJZiB0aGUgc2x1ZyBhbHJlYWR5IGV4aXN0cywgYSBudW1iZXJcbiAgICAgICAgICBzdWZmaXggaXMgYWRkZWQgYXV0b21hdGljYWxseSAoZm9yIGV4YW1wbGUsIG1hbmdvLTIpLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxMYWJlbD5EZXNjcmlwdGlvbjwvTGFiZWw+XG4gICAgICAgIDxUZXh0IG1iPVwibWRcIiBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICBVc2UgdGhlIFdZU0lXWUcgdG9vbGJhciwgb3Igc3dpdGNoIHRvIEhUTUwgc291cmNlIGFuZCBwcmV2aWV3IG1vZGUuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ2FwPVwic21cIiBtYj1cIm1kXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXREZXNjcmlwdGlvbk1vZGUoJ3d5c2l3eWcnKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBkZXNjcmlwdGlvbk1vZGUgPT09ICd3eXNpd3lnJyA/ICcjMDQ3ODU3JyA6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgY29sb3I6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3d5c2l3eWcnID8gJyNmZmZmZmYnIDogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBXWVNJV1lHXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXREZXNjcmlwdGlvbk1vZGUoJ2h0bWwnKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/ICcjMDQ3ODU3JyA6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgY29sb3I6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ2h0bWwnID8gJyNmZmZmZmYnIDogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBIVE1MXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXREZXNjcmlwdGlvbk1vZGUoJ3ByZXZpZXcnKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdwcmV2aWV3JyA/ICcjMDQ3ODU3JyA6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgY29sb3I6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3ByZXZpZXcnID8gJyNmZmZmZmYnIDogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBQcmV2aWV3XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIHtkZXNjcmlwdGlvbk1vZGUgPT09ICd3eXNpd3lnJyA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PntyZW5kZXJQcm9wZXJ0eSgnZGVzY3JpcHRpb24nKX08L0JveD5cbiAgICAgICAgKSA6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ2h0bWwnID8gKFxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgdmFsdWU9e2Rlc2NyaXB0aW9uVmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIHNldERlc2NyaXB0aW9uVmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgICBvblByb3BlcnR5Q2hhbmdlKCdkZXNjcmlwdGlvbicsIGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByb3dzPXsxMH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiPHA+V3JpdGUgcHJvZHVjdCBkZXNjcmlwdGlvbiBpbiBIVE1MLi4uPC9wPlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBtaW5IZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAxMixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQ1LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndWktbW9ub3NwYWNlLCBTRk1vbm8tUmVndWxhciwgTWVubG8sIE1vbmFjbywgQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgcD1cImxnXCJcbiAgICAgICAgICAgIGJvcmRlcj1cIjFweCBzb2xpZCAjZTJlOGYwXCJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cIjEwcHhcIlxuICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAsIGJhY2tncm91bmQ6ICcjZjhmYWZjJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtkZXNjcmlwdGlvblZhbHVlID8gKFxuICAgICAgICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZGVzY3JpcHRpb25WYWx1ZSB9fSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5QcmV2aWV3IHdpbGwgYXBwZWFyIGhlcmUuPC9UZXh0PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5Qcm9kdWN0IEltYWdlPC9IND5cblxuICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9XG4gICAgICAgICAgICAgIGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Byb2R1Y3QgcHJldmlldyd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNixcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofT57cmVuZGVyUHJvcGVydHkocHJvcGVydHkucHJvcGVydHlQYXRoKX08L0JveD5cbiAgICAgICkpfVxuXG4gICAgICA8Qm94IG10PVwieGxcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgcHJvZHVjdFxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDQsIEljb24sIExhYmVsLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxufVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBDYXRlZ29yeUVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Jhbm5lclVwbG9hZGluZywgc2V0QmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyUHJldmlld1VybCwgc2V0QmFubmVyUHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uTW9kZSwgc2V0RGVzY3JpcHRpb25Nb2RlXSA9IHVzZVN0YXRlKCd3eXNpd3lnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uVmFsdWUsIHNldERlc2NyaXB0aW9uVmFsdWVdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubGFiZWwpXG4gIGNvbnN0IGNhdGVnb3J5VXJsID0gcHJldmlld1NsdWcgPyBgJHtjYXRlZ29yeVVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYW5uZXJJbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5iYW5uZXJJbWFnZSkpIHJldHVybiBwYXJhbXMuYmFubmVySW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5iYW5uZXJJbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuYmFubmVySW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEJhbm5lclVybCA9IGJhbm5lclByZXZpZXdVcmwgfHwgYmFubmVySW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChiYW5uZXJQcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGJhbm5lclByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbYmFubmVyUHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXREZXNjcmlwdGlvblZhbHVlKFN0cmluZyhwYXJhbXMuZGVzY3JpcHRpb24gfHwgJycpKVxuICB9LCBbcGFyYW1zLmRlc2NyaXB0aW9uXSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdClcblxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdsYWJlbCcgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ2NhdGVnb3JpZXMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkQmFubmVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdjYXRlZ29yaWVzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldEJhbm5lclByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldEJhbm5lclVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIG9uUHJvcGVydHlDaGFuZ2UoJ2Jhbm5lckltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldEJhbm5lclByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0Jhbm5lciB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBiYW5uZXInLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJhbm5lclVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChiYW5uZXJGaWxlUmVmLmN1cnJlbnQpIGJhbm5lckZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpLmNhdGNoKCgpID0+IHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcHJvcGVydHlCeVBhdGggPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gW3Byb3BlcnR5LnByb3BlcnR5UGF0aCwgcHJvcGVydHldKSxcbiAgKVxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IChwcm9wZXJ0eVBhdGgpID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnR5QnlQYXRoW3Byb3BlcnR5UGF0aF1cbiAgICBpZiAoIXByb3BlcnR5KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZ1Byb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoXG4gICAgKHByb3BlcnR5KSA9PlxuICAgICAgIVsnbGFiZWwnLCAnc2x1ZycsICdkZXNjcmlwdGlvbicsICdpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gcD1cInhsXCI+XG4gICAgICA8Qm94IG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5DYXRlZ29yeTwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFVwbG9hZCB0aGUgY2F0ZWdvcnkgaW1hZ2UsIGVkaXQgdGhlIHNsdWcsIGFuZCBzYXZlLiBEdXBsaWNhdGUgc2x1Z3MgYXJlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICByZW5hbWVkIGxpa2UgV29yZFByZXNzLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCdsYWJlbCcpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwibGdcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjEycHhcIiBiZz1cIiNmOGZhZmNcIj5cbiAgICAgICAgPExhYmVsPlNsdWc8L0xhYmVsPlxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGZsZXhXcmFwPVwid3JhcFwiIGdhcD1cInNtXCI+XG4gICAgICAgICAgPFRleHQgYXM9XCJzcGFuXCIgZm9udFdlaWdodD1cImJvbGRcIj5cbiAgICAgICAgICAgIHtgJHtjYXRlZ29yeVVybEJhc2V9L2B9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTGVhdmUgZW1wdHkgdG8gYXV0by1nZW5lcmF0ZSBmcm9tIGxhYmVsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ3NsdWcnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDI2MCxcbiAgICAgICAgICAgICAgZmxleDogJzEgMSAyNjBweCcsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICcxMHB4IDEycHgnLFxuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgUHJldmlldzp7JyAnfVxuICAgICAgICAgIHtjYXRlZ29yeVVybCA/IChcbiAgICAgICAgICAgIDxhIGhyZWY9e2NhdGVnb3J5VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgIHtjYXRlZ29yeVVybH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgJ0dlbmVyYXRlZCBmcm9tIGNhdGVnb3J5IGxhYmVsIHdoZW4gc2F2ZWQnXG4gICAgICAgICAgKX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBMZWF2ZSBlbXB0eSB0byBhdXRvLWdlbmVyYXRlIGZyb20gdGhlIGNhdGVnb3J5IGxhYmVsLiBJZiB0aGUgc2x1ZyBhbHJlYWR5IGV4aXN0cywgYSBudW1iZXJcbiAgICAgICAgICBzdWZmaXggaXMgYWRkZWQgYXV0b21hdGljYWxseSAoZm9yIGV4YW1wbGUsIGZydWl0cy0yKS5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8TGFiZWw+RGVzY3JpcHRpb248L0xhYmVsPlxuICAgICAgICA8VGV4dCBtYj1cIm1kXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgVXNlIHRoZSBXWVNJV1lHIHRvb2xiYXIsIG9yIHN3aXRjaCB0byBIVE1MIHNvdXJjZSBhbmQgcHJldmlldyBtb2RlLlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGdhcD1cInNtXCIgbWI9XCJtZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCd3eXNpd3lnJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICd3eXNpd3lnJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgV1lTSVdZR1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdodG1sJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgSFRNTFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdwcmV2aWV3Jyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAncHJldmlldycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdwcmV2aWV3JyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUHJldmlld1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICB7ZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT57cmVuZGVyUHJvcGVydHkoJ2Rlc2NyaXB0aW9uJyl9PC9Cb3g+XG4gICAgICAgICkgOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/IChcbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIHZhbHVlPXtkZXNjcmlwdGlvblZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBzZXREZXNjcmlwdGlvblZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgICAgb25Qcm9wZXJ0eUNoYW5nZSgnZGVzY3JpcHRpb24nLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcm93cz17MTB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjxwPldyaXRlIGNhdGVnb3J5IGRlc2NyaXB0aW9uIGluIEhUTUwuLi48L3A+XCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogMjIwLFxuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTAsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDEyLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNDUsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd1aS1tb25vc3BhY2UsIFNGTW9uby1SZWd1bGFyLCBNZW5sbywgTW9uYWNvLCBDb25zb2xhcywgbW9ub3NwYWNlJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8Qm94XG4gICAgICAgICAgICBwPVwibGdcIlxuICAgICAgICAgICAgYm9yZGVyPVwiMXB4IHNvbGlkICNlMmU4ZjBcIlxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwiMTBweFwiXG4gICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCwgYmFja2dyb3VuZDogJyNmOGZhZmMnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2Rlc2NyaXB0aW9uVmFsdWUgPyAoXG4gICAgICAgICAgICAgIDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBkZXNjcmlwdGlvblZhbHVlIH19IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlByZXZpZXcgd2lsbCBhcHBlYXIgaGVyZS48L1RleHQ+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8SDQgbWI9XCJtZFwiPkNhdGVnb3J5IEltYWdlPC9IND5cblxuICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9XG4gICAgICAgICAgICAgIGFsdD17cGFyYW1zLmxhYmVsIHx8ICdDYXRlZ29yeSBwcmV2aWV3J31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMjIwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjIwLFxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvdmVyJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDE2LFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGJlM2VhJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBObyBpbWFnZSBzZWxlY3RlZCB5ZXQuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICApfVxuXG4gICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5DYXRlZ29yeSBCYW5uZXI8L0g0PlxuICAgICAgICA8VGV4dCBtYj1cIm1kXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgV2lkZSBiYW5uZXIgc2hvd24gYXQgdGhlIHRvcCBvZiB0aGUgY2F0ZWdvcnkgcGFnZSBvbiB0aGUgd2Vic2l0ZS5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIHtkaXNwbGF5ZWRCYW5uZXJVcmwgPyAoXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZGlzcGxheWVkQmFubmVyVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgYmFubmVyJ31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiA2NDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY292ZXInLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkYmUzZWEnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIE5vIGJhbm5lciBzZWxlY3RlZCB5ZXQuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICApfVxuXG4gICAgICAgIDxpbnB1dCByZWY9e2Jhbm5lckZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRCYW5uZXJ9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLiBSZWNvbW1lbmRlZCB3aWRlIGltYWdlIChlLmcuIDE2MDDDlzQwMCkuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7cmVtYWluaW5nUHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgIDxCb3gga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9PntyZW5kZXJQcm9wZXJ0eShwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpfTwvQm94PlxuICAgICAgKSl9XG5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7cmVuZGVyUHJvcGVydHkoJ2ltYWdlJyl9XG4gICAgICAgIHtyZW5kZXJQcm9wZXJ0eSgnYmFubmVySW1hZ2UnKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG10PVwieGxcIj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmd9XG4gICAgICAgID5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgfHwgYmFubmVyVXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY2F0ZWdvcnlcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXRlZ29yeUVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgSWNvbiwgSW5wdXQsIFBhZ2luYXRpb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHtcbiAgUmVjb3Jkc1RhYmxlLFxuICB1c2VRdWVyeVBhcmFtcyxcbiAgdXNlUmVjb3JkcyxcbiAgdXNlU2VsZWN0ZWRSZWNvcmRzLFxufSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBDbXNMaXN0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVzb3VyY2UsIHNldFRhZyB9ID0gcHJvcHNcbiAgY29uc3QgdGl0bGVQcm9wID0gcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ubmFtZSB8fCByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5wcm9wZXJ0eVBhdGggfHwgJ2lkJ1xuXG4gIGNvbnN0IHsgc3RvcmVQYXJhbXMsIGZpbHRlcnMgfSA9IHVzZVF1ZXJ5UGFyYW1zKClcbiAgY29uc3Qge1xuICAgIHJlY29yZHMsXG4gICAgbG9hZGluZyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc29ydEJ5LFxuICAgIHBhZ2UsXG4gICAgdG90YWwsXG4gICAgZmV0Y2hEYXRhLFxuICAgIHBlclBhZ2UsXG4gIH0gPSB1c2VSZWNvcmRzKHJlc291cmNlLmlkKVxuICBjb25zdCB7XG4gICAgc2VsZWN0ZWRSZWNvcmRzLFxuICAgIGhhbmRsZVNlbGVjdCxcbiAgICBoYW5kbGVTZWxlY3RBbGwsXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzLFxuICB9ID0gdXNlU2VsZWN0ZWRSZWNvcmRzKHJlY29yZHMpXG5cbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgoKSA9PiBTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICBjb25zdCBkZWJvdW5jZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBzdG9yZVBhcmFtc1JlZiA9IHVzZVJlZihzdG9yZVBhcmFtcylcbiAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCA9IHN0b3JlUGFyYW1zXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRRdWVyeShTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyhbXSlcbiAgfSwgW3Jlc291cmNlLmlkLCB0aXRsZVByb3AsIHNldFNlbGVjdGVkUmVjb3Jkc10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2V0VGFnKSBzZXRUYWcodG90YWwudG9TdHJpbmcoKSlcbiAgfSwgW3RvdGFsLCBzZXRUYWddKVxuXG4gIGNvbnN0IGhhbmRsZVF1ZXJ5Q2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWVcbiAgICBzZXRRdWVyeSh2YWx1ZSlcblxuICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICBkZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpXG4gICAgICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50KHtcbiAgICAgICAgcGFnZTogJzEnLFxuICAgICAgICBmaWx0ZXJzOiB0cmltbWVkID8geyBbdGl0bGVQcm9wXTogdHJpbW1lZCB9IDoge30sXG4gICAgICB9KVxuICAgIH0sIDMwMClcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUFjdGlvblBlcmZvcm1lZCA9ICgpID0+IGZldGNoRGF0YSgpXG5cbiAgY29uc3QgaGFuZGxlUGFnaW5hdGlvbkNoYW5nZSA9IChwYWdlTnVtYmVyKSA9PiB7XG4gICAgc3RvcmVQYXJhbXMoeyBwYWdlOiBwYWdlTnVtYmVyLnRvU3RyaW5nKCkgfSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiPlxuICAgICAgPEJveCBtYj1cImxnXCIgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIG1heFdpZHRoOiA0MjAgfX0+XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgbGVmdDogMTIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEljb24gaWNvbj1cIlNlYXJjaFwiIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVF1ZXJ5Q2hhbmdlfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtgU2VhcmNoICR7cmVzb3VyY2UubmFtZX0uLi5gfVxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmdMZWZ0OiAzNiB9fVxuICAgICAgICAvPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggdmFyaWFudD1cImNvbnRhaW5lclwiPlxuICAgICAgICA8UmVjb3Jkc1RhYmxlXG4gICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgIHJlY29yZHM9e3JlY29yZHN9XG4gICAgICAgICAgYWN0aW9uUGVyZm9ybWVkPXtoYW5kbGVBY3Rpb25QZXJmb3JtZWR9XG4gICAgICAgICAgb25TZWxlY3Q9e2hhbmRsZVNlbGVjdH1cbiAgICAgICAgICBvblNlbGVjdEFsbD17aGFuZGxlU2VsZWN0QWxsfVxuICAgICAgICAgIHNlbGVjdGVkUmVjb3Jkcz17c2VsZWN0ZWRSZWNvcmRzfVxuICAgICAgICAgIGRpcmVjdGlvbj17ZGlyZWN0aW9ufVxuICAgICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICAgIGlzTG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgLz5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxQYWdpbmF0aW9uXG4gICAgICAgICAgICBwYWdlPXtwYWdlfVxuICAgICAgICAgICAgcGVyUGFnZT17cGVyUGFnZX1cbiAgICAgICAgICAgIHRvdGFsPXt0b3RhbH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVQYWdpbmF0aW9uQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENtc0xpc3RcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgUmV2aWV3RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdyZXZpZXdzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpLmNhdGNoKCgpID0+IHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSByZXZpZXcnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHByb3BlcnR5QnlQYXRoID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgIHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IFtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgsIHByb3BlcnR5XSksXG4gIClcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSAocHJvcGVydHlQYXRoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydHkgPSBwcm9wZXJ0eUJ5UGF0aFtwcm9wZXJ0eVBhdGhdXG4gICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZ1Byb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoXG4gICAgKHByb3BlcnR5KSA9PiAhWyd0aXRsZScsICduYW1lJywgJ2NvbnRlbnQnLCAnaW1hZ2UnXS5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IHA9XCJ4bFwiPlxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxINCBtYj1cInNtXCI+UmV2aWV3PC9IND5cbiAgICAgICAgPFRleHQgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgQWRkIHRoZSByZXZpZXcgdGl0bGUsIHJldmlld2VyIG5hbWUsIGNvbnRlbnQsIGFuZCBhbiBvcHRpb25hbCByZXZpZXdlciBpbWFnZS5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgndGl0bGUnKX08L0JveD5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnbmFtZScpfTwvQm94PlxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCdjb250ZW50Jyl9PC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8SDQgbWI9XCJtZFwiPlJldmlld2VyIEltYWdlPC9IND5cblxuICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9XG4gICAgICAgICAgICAgIGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Jldmlld2VyJ31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTQwLFxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvdmVyJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGJlM2VhJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBObyBpbWFnZSBzZWxlY3RlZCB5ZXQuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICApfVxuXG4gICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7cmVtYWluaW5nUHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgIDxCb3gga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9IG1iPVwibGdcIj5cbiAgICAgICAgICB7cmVuZGVyUHJvcGVydHkocHJvcGVydHkucHJvcGVydHlQYXRoKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICApKX1cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHJldmlld1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJldmlld0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRHJhd2VyQ29udGVudCxcbiAgRHJhd2VyRm9vdGVyLFxuICBINCxcbiAgSWNvbixcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlUmVjb3JkLCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBUQUJTID0gW1xuICB7XG4gICAgaWQ6ICdnZW5lcmFsJyxcbiAgICBsYWJlbDogJ0dlbmVyYWwnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3N0b3JlTmFtZScsXG4gICAgICAnc3RvcmVUYWdsaW5lJyxcbiAgICAgICdzdG9yZUVtYWlsJyxcbiAgICAgICdzdG9yZVBob25lMScsXG4gICAgICAnc3RvcmVQaG9uZTInLFxuICAgICAgJ3N0b3JlQWRkcmVzcycsXG4gICAgICAncHJvbW9CYW5uZXInLFxuICAgICAgJ2Vhcmx5RGVsaXZlcnknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2FwcGVhcmFuY2UnLFxuICAgIGxhYmVsOiAnQXBwZWFyYW5jZScsXG4gICAgZmllbGRzOiBbXG4gICAgICAnY29sb3JQcmltYXJ5JyxcbiAgICAgICdjb2xvclByaW1hcnlMaWdodCcsXG4gICAgICAnY29sb3JBY2NlbnQnLFxuICAgICAgJ2NvbG9yQmFja2dyb3VuZCcsXG4gICAgICAnY29sb3JGb290ZXJGcm9tJyxcbiAgICAgICdjb2xvckZvb3RlclZpYScsXG4gICAgICAnZm9udEZhbWlseScsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaG9tZXBhZ2UnLFxuICAgIGxhYmVsOiAnSG9tZXBhZ2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2hvbWVCYW5uZXJFbmFibGVkJyxcbiAgICAgICdob21lQ2F0ZWdvcmllc0VuYWJsZWQnLFxuICAgICAgJ2hvbWVCZXN0U2VsbGVyc0VuYWJsZWQnLFxuICAgICAgJ2hvbWVCZXN0U2VsbGVyc1RpdGxlJyxcbiAgICAgICdob21lU2hvcE91clJhbmdlRW5hYmxlZCcsXG4gICAgICAnaG9tZUZydWl0SGlnaGxpZ2h0RW5hYmxlZCcsXG4gICAgICAnaG9tZUltcG9ydGVkRnJ1aXRzRW5hYmxlZCcsXG4gICAgICAnaG9tZVJldmlld3NFbmFibGVkJyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYXltZW50cycsXG4gICAgbGFiZWw6ICdQYXltZW50cycsXG4gICAgZmllbGRzOiBbJ3Jhem9ycGF5RW5hYmxlZCcsICdyYXpvcnBheUtleUlkJywgJ3Jhem9ycGF5S2V5U2VjcmV0J10sXG4gIH0sXG4gIHtcbiAgICBpZDogJ25vdGlmaWNhdGlvbnMnLFxuICAgIGxhYmVsOiAnTm90aWZpY2F0aW9ucycsXG4gICAgZmllbGRzOiBbXG4gICAgICAndHdpbGlvRW5hYmxlZCcsXG4gICAgICAndHdpbGlvQWNjb3VudFNpZCcsXG4gICAgICAndHdpbGlvQXV0aFRva2VuJyxcbiAgICAgICd0d2lsaW9TbXNGcm9tJyxcbiAgICAgICd0d2lsaW9XaGF0c2FwcEZyb20nLFxuICAgIF0sXG4gIH0sXG5dXG5cbmNvbnN0IFNldHRpbmdzRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgnZ2VuZXJhbCcpXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJylcbiAgICBpZiAoaGFzaCAmJiBUQUJTLnNvbWUoKHRhYikgPT4gdGFiLmlkID09PSBoYXNoKSkge1xuICAgICAgc2V0QWN0aXZlVGFiKGhhc2gpXG4gICAgfVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgYCMke2FjdGl2ZVRhYn1gKVxuICB9LCBbYWN0aXZlVGFiXSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ3N1Y2Nlc3MnIHx8IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogJ1NldHRpbmdzIHNhdmVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzLiBQbGVhc2UgdHJ5IGFnYWluLicsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBmbGV4IGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIiBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXRhYnNcIiBtYj1cInhsXCI+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNldHRpbmdzLXRhYiR7YWN0aXZlVGFiID09PSB0YWIuaWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKHRhYi5pZCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RhYi5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPERyYXdlckNvbnRlbnQ+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcigocHJvcGVydHkpID0+XG4gICAgICAgICAgICB0YWIuZmllbGRzLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXBhbmVsXCJcbiAgICAgICAgICAgICAgcD1cInhsXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogYWN0aXZlVGFiID09PSB0YWIuaWQgPyAnYmxvY2snIDogJ25vbmUnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxINCBtYj1cInNtXCI+e3RhYi5sYWJlbH08L0g0PlxuICAgICAgICAgICAgICA8VGV4dCBtYj1cInhsXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgICAgICAgVXBkYXRlIHlvdXIgc3RvcmUgc2V0dGluZ3MgYW5kIGNsaWNrIFNhdmUgY2hhbmdlcyBiZWxvdy5cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICB7cHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvRHJhd2VyQ29udGVudD5cblxuICAgICAgPERyYXdlckZvb3Rlcj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNoYW5nZXNcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0RyYXdlckZvb3Rlcj5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBINSwgTGFiZWwsIFNlbGVjdCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihhbW91bnQpKSByZXR1cm4gJ+KCuTAnXG4gIHJldHVybiBg4oK5JHthbW91bnQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSl9YFxufVxuXG5jb25zdCBmb3JtYXREYXRlVGltZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJ+KAlCdcbiAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7XG4gICAgZGF0ZVN0eWxlOiAnbWVkaXVtJyxcbiAgICB0aW1lU3R5bGU6ICdzaG9ydCcsXG4gIH0pXG59XG5cbmNvbnN0IHJlc29sdmVJbWFnZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHZhbHVlKSkgcmV0dXJuIHZhbHVlXG4gIGlmICh2YWx1ZS5zdGFydHNXaXRoKCcvJykpIHJldHVybiBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2luLnJlcGxhY2UoLzpcXGQrJC8sICc6NTAwMCcpfSR7dmFsdWV9YFxuICByZXR1cm4gdmFsdWVcbn1cblxuY29uc3QgT3JkZXJEZXRhaWwgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGlzRWRpdCA9IGFjdGlvbj8ubmFtZSA9PT0gJ2VkaXQnXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKGluaXRpYWxSZWNvcmQsIHJlc291cmNlLmlkKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBbc2F2aW5nLCBzZXRTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgaXRlbXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShwYXJhbXMuaXRlbXNKc29uIHx8ICdbXScpXG4gICAgICByZXR1cm4gcGFyc2VkLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgaW1hZ2U6IHJlc29sdmVJbWFnZShpdGVtLmltYWdlKSxcbiAgICAgIH0pKVxuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9LCBbcGFyYW1zLml0ZW1zSnNvbl0pXG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgYXdhaXQgc3VibWl0KClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdPcmRlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwZGF0ZSBvcmRlci4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0dXNPcHRpb25zID0gW1xuICAgIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJyB9LFxuICAgIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQYWlkJyB9LFxuICAgIHsgdmFsdWU6ICdwYWNrZWQnLCBsYWJlbDogJ1BhY2tlZCcgfSxcbiAgICB7IHZhbHVlOiAnc2hpcHBlZCcsIGxhYmVsOiAnU2hpcHBlZCcgfSxcbiAgICB7IHZhbHVlOiAnZGVsaXZlcmVkJywgbGFiZWw6ICdEZWxpdmVyZWQnIH0sXG4gICAgeyB2YWx1ZTogJ2NhbmNlbGxlZCcsIGxhYmVsOiAnQ2FuY2VsbGVkJyB9LFxuICBdXG5cbiAgY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogJ3BlbmRpbmcnLCBsYWJlbDogJ1BlbmRpbmcnIH0sXG4gICAgeyB2YWx1ZTogJ3BhaWQnLCBsYWJlbDogJ1BhaWQnIH0sXG4gICAgeyB2YWx1ZTogJ2ZhaWxlZCcsIGxhYmVsOiAnRmFpbGVkJyB9LFxuICAgIHsgdmFsdWU6ICdyZWZ1bmRlZCcsIGxhYmVsOiAnUmVmdW5kZWQnIH0sXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1kZXRhaWxcIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIiBtYj1cInhsXCI+XG4gICAgICAgIDxINCBtYj1cInNtXCI+XG4gICAgICAgICAgT3JkZXIgI3twYXJhbXMub3JkZXJOb30gZGV0YWlsc1xuICAgICAgICA8L0g0PlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjh9PlxuICAgICAgICAgIFBheW1lbnQgdmlhIHtwYXJhbXMucGF5bWVudE1ldGhvZCB8fCAnQ2FzaCBvbiBkZWxpdmVyeSd9XG4gICAgICAgICAge3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZCA/IGAgwrcgUGF5bWVudCBJRDogJHtwYXJhbXMucmF6b3JwYXlQYXltZW50SWR9YCA6ICcnfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWdyaWRcIiBtYj1cInhsXCI+XG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwibGdcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPkdlbmVyYWw8L0g1PlxuICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICA8TGFiZWw+T3JkZXIgZGF0ZTwvTGFiZWw+XG4gICAgICAgICAgICA8VGV4dD57Zm9ybWF0RGF0ZVRpbWUocGFyYW1zLmNyZWF0ZWRBdCl9PC9UZXh0PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICA8TGFiZWw+Q3VzdG9tZXIgbmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8VGV4dCBmb250V2VpZ2h0PVwiYm9sZFwiPntwYXJhbXMuY3VzdG9tZXJOYW1lIHx8ICdHdWVzdCd9PC9UZXh0PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICA8TGFiZWw+Q3VzdG9tZXIgcGhvbmU8L0xhYmVsPlxuICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lclBob25lIHx8ICfigJQnfTwvVGV4dD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICB7cGFyYW1zLmN1c3RvbWVyRW1haWwgPyAoXG4gICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICA8TGFiZWw+Q3VzdG9tZXIgZW1haWw8L0xhYmVsPlxuICAgICAgICAgICAgICA8VGV4dD57cGFyYW1zLmN1c3RvbWVyRW1haWx9PC9UZXh0PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2lzRWRpdCA/IChcbiAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTYXZlfT5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+T3JkZXIgc3RhdHVzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c3RhdHVzT3B0aW9ucy5maW5kKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSA9PT0gcGFyYW1zLnN0YXR1cyl9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtzdGF0dXNPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhzZWxlY3RlZCkgPT4gaGFuZGxlQ2hhbmdlKCdzdGF0dXMnLCBzZWxlY3RlZD8udmFsdWUpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+UGF5bWVudCBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXltZW50T3B0aW9ucy5maW5kKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSA9PT0gcGFyYW1zLnBheW1lbnRTdGF0dXMpfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17cGF5bWVudE9wdGlvbnN9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHNlbGVjdGVkKSA9PiBoYW5kbGVDaGFuZ2UoJ3BheW1lbnRTdGF0dXMnLCBzZWxlY3RlZD8udmFsdWUpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgc2F2aW5nfT5cbiAgICAgICAgICAgICAgICB7c2F2aW5nID8gJ1NhdmluZy4uLicgOiAnVXBkYXRlIG9yZGVyJ31cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPk9yZGVyIHN0YXR1czwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQgdGV4dFRyYW5zZm9ybT1cImNhcGl0YWxpemVcIj57cGFyYW1zLnN0YXR1c308L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5QYXltZW50IHN0YXR1czwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQgdGV4dFRyYW5zZm9ybT1cImNhcGl0YWxpemVcIj57cGFyYW1zLnBheW1lbnRTdGF0dXN9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwibGdcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPkRlbGl2ZXJ5IGFkZHJlc3M8L0g1PlxuICAgICAgICAgIHtwYXJhbXMuYWRkcmVzc0Zvcm1hdHRlZCA/IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPkFkZHJlc3MgdHlwZTwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5hZGRyZXNzTGFiZWwgfHwgJ0RlbGl2ZXJ5J308L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5EZWxpdmVyIHRvPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dD57cGFyYW1zLmN1c3RvbWVyTmFtZX08L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5QaG9uZTwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lclBob25lIHx8ICfigJQnfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgPExhYmVsPkZ1bGwgYWRkcmVzczwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e3sgbGluZUhlaWdodDogMS43IH19PntwYXJhbXMuYWRkcmVzc0Zvcm1hdHRlZH08L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+Tm8gZGVsaXZlcnkgYWRkcmVzcyBzYXZlZCBmb3IgdGhpcyBvcmRlci48L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJsZ1wiPlxuICAgICAgICA8SDUgbWI9XCJsZ1wiPk9yZGVyIGl0ZW1zPC9INT5cbiAgICAgICAge2l0ZW1zLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIGl0ZW1zIGZvdW5kIGZvciB0aGlzIG9yZGVyLjwvVGV4dD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8Qm94IGFzPVwidGFibGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pdGVtcy10YWJsZVwiPlxuICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRoPkl0ZW08L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5Db3N0PC90aD5cbiAgICAgICAgICAgICAgICA8dGg+UXR5PC90aD5cbiAgICAgICAgICAgICAgICA8dGg+VG90YWw8L3RoPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN0eWxlPXt7IGdhcDogMTIgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaW1hZ2UgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aXRlbS5pbWFnZX0gYWx0PXtpdGVtLm5hbWV9IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWl0ZW0taW1hZ2VcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250V2VpZ2h0PVwiYm9sZFwiPntpdGVtLm5hbWV9PC9UZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0ud2VpZ2h0ID8gPFRleHQgZm9udFNpemU9XCJzbVwiIG9wYWNpdHk9ezAuN30+e2l0ZW0ud2VpZ2h0fTwvVGV4dD4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KGl0ZW0ucHJpY2VWYWx1ZSl9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5xdWFudGl0eX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShpdGVtLmxpbmVUb3RhbCl9PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8dGZvb3Q+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+SXRlbXMgc3VidG90YWw8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLml0ZW1zVG90YWwpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+RGVsaXZlcnkgY2hhcmdlczwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShwYXJhbXMuZGVsaXZlcnlDaGFyZ2UpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+Q2FydCBoYW5kbGluZzwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShwYXJhbXMuaGFuZGxpbmdDaGFyZ2UpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+U21hbGwgY2FydCBjaGFyZ2U8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLnNtYWxsQ2FydENoYXJnZSl9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAge051bWJlcihwYXJhbXMuZGlzY291bnQpID4gMCA/IChcbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+RGlzY291bnQ8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPi17Zm9ybWF0TW9uZXkocGFyYW1zLmRpc2NvdW50KX08L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8dHIgY2xhc3NOYW1lPVwiaXMtdG90YWxcIj5cbiAgICAgICAgICAgICAgICA8dGQgY29sU3Bhbj17M30+T3JkZXIgdG90YWw8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLmdyYW5kVG90YWwpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3Rmb290PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgT3JkZXJEZXRhaWxcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRm9ybUdyb3VwLFxuICBIMixcbiAgSW5wdXQsXG4gIExhYmVsLFxuICBNZXNzYWdlQm94LFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBSRU1FTUJFUkVEX0xPR0lOX0tFWSA9ICd0b2tyaV9hZG1pbl9sb2dpbidcblxuY29uc3QgTG9naW4gPSAoKSA9PiB7XG4gIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHdpbmRvdy5fX0FQUF9TVEFURV9fIHx8IHt9XG4gIGNvbnN0IHsgdHJhbnNsYXRlTWVzc2FnZSB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBhZG1pblJvb3QgPSBhY3Rpb24/LnJlcGxhY2UoL1xcL2xvZ2luJC8sICcnKSB8fCAnJ1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZFVybCA9IGAke2FkbWluUm9vdH0vZm9yZ290LXBhc3N3b3JkYFxuICBjb25zdCBbaWRlbnRpZmllciwgc2V0SWRlbnRpZmllcl0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3JlbWVtYmVyTG9naW4sIHNldFJlbWVtYmVyTG9naW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlbWVtYmVyZWRMb2dpbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSlcbiAgICBpZiAocmVtZW1iZXJlZExvZ2luKSB7XG4gICAgICBzZXRJZGVudGlmaWVyKHJlbWVtYmVyZWRMb2dpbilcbiAgICAgIHNldFJlbWVtYmVyTG9naW4odHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZvcm0gPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZW1haWxJbnB1dCA9IGZvcm0uZWxlbWVudHMubmFtZWRJdGVtKCdlbWFpbCcpXG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0ID8gU3RyaW5nKGVtYWlsSW5wdXQudmFsdWUpIDogaWRlbnRpZmllcikudHJpbSgpXG5cbiAgICBpZiAoZW1haWxJbnB1dCAmJiAndmFsdWUnIGluIGVtYWlsSW5wdXQpIHtcbiAgICAgIGVtYWlsSW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgIH1cblxuICAgIGlmIChyZW1lbWJlckxvZ2luICYmIHZhbHVlKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVksIHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBmbGV4XG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgIG1pbkhlaWdodD1cIjEwMHZoXCJcbiAgICAgIGJnPVwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzAyMmMyMiwgIzA0Nzg1NylcIlxuICAgICAgcD1cInhsXCJcbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGJnPVwid2hpdGVcIlxuICAgICAgICB3aWR0aD17WycxMDAlJywgJzQ0MHB4J119XG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjE4cHhcIlxuICAgICAgICBib3hTaGFkb3c9XCIwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4zNSlcIlxuICAgICAgICBwPVwieDNcIlxuICAgICAgPlxuICAgICAgICA8SDIgY29sb3I9XCIjMDIyYzIyXCIgbWI9XCJzbVwiPlRva3JpaWkgQ01TPC9IMj5cbiAgICAgICAgPFRleHQgY29sb3I9XCIjNjQ3NDhiXCIgbWI9XCJ4bFwiPlxuICAgICAgICAgIFNpZ24gaW4gd2l0aCB5b3VyIGFkbWluIGVtYWlsIG9yIHVzZXJuYW1lIHRvIG1hbmFnZSBwcm9kdWN0cywgb3JkZXJzLCBhbmQgY29udGVudC5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIHtlcnJvck1lc3NhZ2UgPyAoXG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIG1iPVwibGdcIlxuICAgICAgICAgICAgbWVzc2FnZT17ZXJyb3JNZXNzYWdlLnNwbGl0KCcgJykubGVuZ3RoID4gMSA/IGVycm9yTWVzc2FnZSA6IHRyYW5zbGF0ZU1lc3NhZ2UoZXJyb3JNZXNzYWdlKX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJkYW5nZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggYXM9XCJmb3JtXCIgYWN0aW9uPXthY3Rpb259IG1ldGhvZD1cIlBPU1RcIiBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPkVtYWlsIG9yIHVzZXJuYW1lPC9MYWJlbD5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwidXNlcm5hbWVcIlxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2lkZW50aWZpZXJ9XG4gICAgICAgICAgICAgIGtleT17aWRlbnRpZmllciB8fCAnbG9naW4tZW1haWwnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICA8TGFiZWwgcmVxdWlyZWQ+UGFzc3dvcmQ8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9e3Nob3dQYXNzd29yZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtzaG93UGFzc3dvcmQgPyAnSGlkZSBwYXNzd29yZCcgOiAnU2hvdyBwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1Bhc3N3b3JkKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3Nob3dQYXNzd29yZCA/IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOS45IDQuMkExMC43IDEwLjcgMCAwIDEgMTIgNGM1IDAgOSA0LjUgMTAgOGExMi44IDEyLjggMCAwIDEtMi4xIDMuNlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgN1MyIDEyIDIgMTJ6XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZD1cInJlbWVtYmVyLWxvZ2luXCJcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17cmVtZW1iZXJMb2dpbn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UmVtZW1iZXJMb2dpbihldmVudC50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiA4IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1lbWJlci1sb2dpblwiIHN0eWxlPXt7IGNvbG9yOiAnIzQ3NTU2OScsIGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICAgICAgUmVtZW1iZXIgbXkgZW1haWwgb3IgdXNlcm5hbWUgb24gdGhpcyBkZXZpY2VcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgd2lkdGg9XCIxMDAlXCIgbXQ9XCJsZ1wiPlxuICAgICAgICAgICAgU2lnbiBpblxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj17Zm9yZ290UGFzc3dvcmRVcmx9IHN0eWxlPXt7IGNvbG9yOiAnIzA0Nzg1NycsIGZvbnRXZWlnaHQ6IDcwMCB9fT5cbiAgICAgICAgICAgIEZvcmdvdCBwYXNzd29yZD9cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2luXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b25Hcm91cCwgTWVzc2FnZUJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VGaWx0ZXJEcmF3ZXIsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuZnVuY3Rpb24gYWRtaW5Sb290UGF0aCgpIHtcbiAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL14oLiopXFwvcmVzb3VyY2VzXFwvLylcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKVxufVxuXG5mdW5jdGlvbiBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpIHtcbiAgaWYgKHJlc291cmNlSWQgPT09ICdDYXRlZ29yeScpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdjYXRlZ29yaWVzL2V4cG9ydCcsIGltcG9ydFVybDogJ2NhdGVnb3JpZXMvaW1wb3J0JyB9XG4gIH1cbiAgaWYgKHJlc291cmNlSWQgPT09ICdQcm9kdWN0Jykge1xuICAgIHJldHVybiB7IGV4cG9ydFVybDogJ3Byb2R1Y3RzL2V4cG9ydCcsIGltcG9ydFVybDogJ3Byb2R1Y3RzL2ltcG9ydCcgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyh7IHJlc291cmNlLCBvbkltcG9ydGVkIH0pIHtcbiAgY29uc3QgeyB0cmFuc2xhdGVCdXR0b24sIHRyYW5zbGF0ZUFjdGlvbiB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IHRvZ2dsZUZpbHRlciwgZmlsdGVyc0NvdW50IH0gPSB1c2VGaWx0ZXJEcmF3ZXIoKVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuXG4gIGNvbnN0IHJlc291cmNlSWQgPSByZXNvdXJjZS5pZFxuICBjb25zdCBjb25maWcgPSBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpXG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3RQYXRoKClcblxuICBjb25zdCBoYW5kbGVJbXBvcnQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgIGlmICghZmlsZSB8fCAhY29uZmlnKSByZXR1cm5cblxuICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICBzZXRNZXNzYWdlKG51bGwpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmltcG9ydFVybH1gLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvckNvdW50ID0gZGF0YS5lcnJvcnM/Lmxlbmd0aCB8fCAwXG4gICAgICBzZXRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogZXJyb3JDb3VudCA/ICdpbmZvJyA6ICdzdWNjZXNzJyxcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICBlcnJvckNvdW50ID4gMFxuICAgICAgICAgICAgPyBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiAke2Vycm9yQ291bnR9IHJvdyhzKSBjb3VsZCBub3QgYmUgaW1wb3J0ZWQuYFxuICAgICAgICAgICAgOiBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLmAsXG4gICAgICB9KVxuICAgICAgb25JbXBvcnRlZD8uKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6ICdkYW5nZXInLCB0ZXh0OiBlcnJvci5tZXNzYWdlIHx8ICdJbXBvcnQgZmFpbGVkLicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBidXR0b25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFjb25maWcpIHJldHVybiBbXVxuXG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRXhwb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBocmVmOiBgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmV4cG9ydFVybH1gLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGxvYWRpbmcgPyAnSW1wb3J0aW5nLi4uJyA6ICdJbXBvcnQnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIG9uQ2xpY2s6IGxvYWRpbmcgPyB1bmRlZmluZWQgOiAoKSA9PiBmaWxlUmVmLmN1cnJlbnQ/LmNsaWNrKCksXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IG5ld0FjdGlvbiA9IHJlc291cmNlLnJlc291cmNlQWN0aW9ucz8uZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24ubmFtZSA9PT0gJ25ldycpXG4gICAgaWYgKG5ld0FjdGlvbikge1xuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIGljb246IG5ld0FjdGlvbi5pY29uLFxuICAgICAgICBsYWJlbDogdHJhbnNsYXRlQWN0aW9uKG5ld0FjdGlvbi5sYWJlbCwgcmVzb3VyY2VJZCksXG4gICAgICAgIHZhcmlhbnQ6IG5ld0FjdGlvbi52YXJpYW50LFxuICAgICAgICBocmVmOiBgJHtyb290fS9yZXNvdXJjZXMvJHtyZXNvdXJjZUlkfS9hY3Rpb25zL25ld2AsXG4gICAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LW5ldy1idXR0b25gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJLZXkgPSBmaWx0ZXJzQ291bnQgPiAwID8gJ2ZpbHRlckFjdGl2ZScgOiAnZmlsdGVyJ1xuICAgIGl0ZW1zLnB1c2goe1xuICAgICAgbGFiZWw6IHRyYW5zbGF0ZUJ1dHRvbihmaWx0ZXJLZXksIHJlc291cmNlSWQsIHsgY291bnQ6IGZpbHRlcnNDb3VudCB9KSxcbiAgICAgIG9uQ2xpY2s6IHRvZ2dsZUZpbHRlcixcbiAgICAgIGljb246ICdGaWx0ZXInLFxuICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tZmlsdGVyLWJ1dHRvbmAsXG4gICAgfSlcblxuICAgIHJldHVybiBpdGVtc1xuICB9LCBbXG4gICAgY29uZmlnLFxuICAgIHJvb3QsXG4gICAgbG9hZGluZyxcbiAgICByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnMsXG4gICAgcmVzb3VyY2VJZCxcbiAgICB0cmFuc2xhdGVBY3Rpb24sXG4gICAgdHJhbnNsYXRlQnV0dG9uLFxuICAgIGZpbHRlcnNDb3VudCxcbiAgICB0b2dnbGVGaWx0ZXIsXG4gIF0pXG5cbiAgaWYgKCFjb25maWcpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEJveFxuICAgICAgICBtdD1cInhsXCJcbiAgICAgICAgbWI9XCJkZWZhdWx0XCJcbiAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCJcbiAgICAgICAgZmxleFNocmluaz17MH1cbiAgICAgICAgcHg9e1snZGVmYXVsdCcsIDBdfVxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Ub3A6ICctNTJweCcgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvbkdyb3VwIGJ1dHRvbnM9e2J1dHRvbnN9IC8+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17ZmlsZVJlZn1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgYWNjZXB0PVwiLmNzdix0ZXh0L2NzdlwiXG4gICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUltcG9ydH1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCIgcHg9e1snZGVmYXVsdCcsIDBdfT5cbiAgICAgICAgICA8TWVzc2FnZUJveFxuICAgICAgICAgICAgdmFyaWFudD17bWVzc2FnZS50eXBlfVxuICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZS50ZXh0fVxuICAgICAgICAgICAgb25DbG9zZUNsaWNrPXsoKSA9PiBzZXRNZXNzYWdlKG51bGwpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IE9yaWdpbmFsQWN0aW9uSGVhZGVyIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMgZnJvbSAnLi9jYXRhbG9nLWxpc3QtaGVhZGVyLWFjdGlvbnMuanN4J1xuXG5jb25zdCBDQVRBTE9HX1JFU09VUkNFUyA9IG5ldyBTZXQoWydQcm9kdWN0JywgJ0NhdGVnb3J5J10pXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFjdGlvbkhlYWRlcihwcm9wcykge1xuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50LCBhY3Rpb24sIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBCYXNlSGVhZGVyID0gT3JpZ2luYWxDb21wb25lbnQgfHwgT3JpZ2luYWxBY3Rpb25IZWFkZXJcbiAgY29uc3QgaXNDYXRhbG9nTGlzdCA9IGFjdGlvbj8ubmFtZSA9PT0gJ2xpc3QnICYmIENBVEFMT0dfUkVTT1VSQ0VTLmhhcyhyZXNvdXJjZT8uaWQpXG5cbiAgaWYgKCFpc0NhdGFsb2dMaXN0KSB7XG4gICAgcmV0dXJuIDxCYXNlSGVhZGVyIHsuLi5wcm9wc30gLz5cbiAgfVxuXG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQ6IF9pZ25vcmVkLCAuLi5oZWFkZXJQcm9wcyB9ID0gcHJvcHNcblxuICByZXR1cm4gKFxuICAgIDxCb3g+XG4gICAgICA8QmFzZUhlYWRlciB7Li4uaGVhZGVyUHJvcHN9IG9taXRBY3Rpb25zIC8+XG4gICAgICA8Q2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zXG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgb25JbXBvcnRlZD17cHJvcHMuYWN0aW9uUGVyZm9ybWVkfVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IG1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBMYWJlbCwgVGlueU1DRSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGx1Z2luczogW1xuICAgICdjb2RlJyxcbiAgICAnbGluaycsXG4gICAgJ2xpc3RzJyxcbiAgICAnaW1hZ2UnLFxuICAgICd0YWJsZScsXG4gICAgJ2F1dG9saW5rJyxcbiAgICAncHJldmlldycsXG4gICAgJ3NlYXJjaHJlcGxhY2UnLFxuICAgICd3b3JkY291bnQnLFxuICAgICdtZWRpYScsXG4gICAgJ2NvZGVzYW1wbGUnLFxuICBdLFxuICB0b29sYmFyOlxuICAgICd1bmRvIHJlZG8gfCBibG9ja3MgfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgc3RyaWtldGhyb3VnaCB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCBvdXRkZW50IGluZGVudCB8IGxpbmsgaW1hZ2UgdGFibGUgY29kZXNhbXBsZSB8IGNvZGUgfCByZW1vdmVmb3JtYXQnLFxuICBoZWlnaHQ6IDQwMCxcbn1cblxuY29uc3QgUmljaHRleHRFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IHZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/ICcnXG4gIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBuZXdWYWx1ZSlcbiAgICB9LFxuICAgIFtvbkNoYW5nZSwgcHJvcGVydHkucGF0aF0sXG4gIClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLkRFRkFVTFRfT1BUSU9OUyxcbiAgICAuLi4ocHJvcGVydHkucHJvcHMgfHwge30pLFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybUdyb3VwIGVycm9yPXtCb29sZWFuKGVycm9yKX0+XG4gICAgICA8TGFiZWwgcmVxdWlyZWQ9e3Byb3BlcnR5LmlzUmVxdWlyZWR9Pntwcm9wZXJ0eS5sYWJlbH08L0xhYmVsPlxuICAgICAgPFRpbnlNQ0UgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlVXBkYXRlfSBvcHRpb25zPXtvcHRpb25zfSAvPlxuICAgICAgPEZvcm1NZXNzYWdlPntlcnJvcj8ubWVzc2FnZX08L0Zvcm1NZXNzYWdlPlxuICAgIDwvRm9ybUdyb3VwPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oUmljaHRleHRFZGl0KVxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUHJvZHVjdEVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0RWRpdCA9IFByb2R1Y3RFZGl0XG5pbXBvcnQgQ2F0ZWdvcnlFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdGVnb3J5RWRpdCA9IENhdGVnb3J5RWRpdFxuaW1wb3J0IENtc0xpc3QgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNtc0xpc3QgPSBDbXNMaXN0XG5pbXBvcnQgUmV2aWV3RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmV2aWV3RWRpdCA9IFJldmlld0VkaXRcbmltcG9ydCBTZXR0aW5nc0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2V0dGluZ3NFZGl0ID0gU2V0dGluZ3NFZGl0XG5pbXBvcnQgT3JkZXJEZXRhaWwgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvb3JkZXItZGV0YWlsJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckRldGFpbCA9IE9yZGVyRGV0YWlsXG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBBY3Rpb25IZWFkZXIgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvYWN0aW9uLWhlYWRlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQWN0aW9uSGVhZGVyID0gQWN0aW9uSGVhZGVyXG5pbXBvcnQgRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JpY2h0ZXh0LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSA9IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSJdLCJuYW1lcyI6WyJhcGkiLCJBcGlDbGllbnQiLCJzdGF0Q2FyZHMiLCJrZXkiLCJsYWJlbCIsImljb24iLCJyZXNvdXJjZSIsImFkbWluUm9vdCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzcGxpdCIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJnZXREYXNoYm9hcmQiLCJ0aGVuIiwicmVzIiwiY2F0Y2giLCJzdGF0cyIsInJvb3QiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJCb3giLCJ2YXJpYW50IiwiY2xhc3NOYW1lIiwicCIsIm1iIiwiSDIiLCJUZXh0Iiwib3BhY2l0eSIsImRpc3BsYXkiLCJtYXAiLCJjYXJkIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiSDUiLCJJY29uIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiQnV0dG9uIiwibXQiLCJzaXplIiwiYXMiLCJocmVmIiwiZmxleFdyYXAiLCJyZWNlbnRPcmRlcnMiLCJsZW5ndGgiLCJvcmRlciIsIm9yZGVyTm8iLCJzdGF0dXMiLCJncmFuZFRvdGFsIiwibm9ybWFsaXplU2x1Z0lucHV0IiwidmFsdWUiLCJTdHJpbmciLCJ0b0xvd2VyQ2FzZSIsInRyaW0iLCJyZXBsYWNlIiwid2l0aG91dFRyYWlsaW5nU2xhc2giLCJQcm9kdWN0RWRpdCIsInByb3BzIiwicmVjb3JkIiwiaW5pdGlhbFJlY29yZCIsImhhbmRsZUNoYW5nZSIsInN1Ym1pdCIsImhhbmRsZVN1Ym1pdCIsImxvYWRpbmciLCJ1c2VSZWNvcmQiLCJpZCIsImFkZE5vdGljZSIsInVzZU5vdGljZSIsImZpbGVSZWYiLCJ1c2VSZWYiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJzbHVnRWRpdGVkIiwic2V0U2x1Z0VkaXRlZCIsIkJvb2xlYW4iLCJwYXJhbXMiLCJzbHVnIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJkZXNjcmlwdGlvbk1vZGUiLCJzZXREZXNjcmlwdGlvbk1vZGUiLCJkZXNjcmlwdGlvblZhbHVlIiwic2V0RGVzY3JpcHRpb25WYWx1ZSIsImN1c3RvbSIsIm9wdGlvbnMiLCJhcGlCYXNlVXJsIiwicHJvZHVjdFVybEJhc2UiLCJvcmlnaW4iLCJzbHVnSW5wdXQiLCJwcmV2aWV3U2x1ZyIsIm5hbWUiLCJwcm9kdWN0VXJsIiwiaW1hZ2VVcmwiLCJ1c2VNZW1vIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiZGVzY3JpcHRpb24iLCJvblByb3BlcnR5Q2hhbmdlIiwicHJvcGVydHlQYXRoIiwicmVzdCIsInVwbG9hZEltYWdlIiwiZXZlbnQiLCJmaWxlIiwidGFyZ2V0IiwiZmlsZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwibG9jYWxQcmV2aWV3VXJsIiwiY3JlYXRlT2JqZWN0VVJMIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJvayIsImVycm9yIiwianNvbiIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsInR5cGUiLCJjdXJyZW50IiwicHJldmVudERlZmF1bHQiLCJwcm9wZXJ0eUJ5UGF0aCIsIk9iamVjdCIsImZyb21FbnRyaWVzIiwiZWRpdFByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsInJlbmRlclByb3BlcnR5IiwiQmFzZVByb3BlcnR5Q29tcG9uZW50Iiwid2hlcmUiLCJvbkNoYW5nZSIsInJlbWFpbmluZ1Byb3BlcnRpZXMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsIm9uU3VibWl0IiwiSDQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiZyIsIkxhYmVsIiwiZ2FwIiwicGxhY2Vob2xkZXIiLCJzdHlsZSIsIm1pbldpZHRoIiwiZmxleCIsInBhZGRpbmciLCJyZWwiLCJvbkNsaWNrIiwiYmFja2dyb3VuZCIsImNvbG9yIiwiY3Vyc29yIiwibWluSGVpZ2h0Iiwicm93cyIsIndpZHRoIiwibGluZUhlaWdodCIsImZvbnRGYW1pbHkiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsInNyYyIsImFsdCIsImhlaWdodCIsIm9iamVjdEZpdCIsInJlZiIsImFjY2VwdCIsImRpc2FibGVkIiwic3BpbiIsIkNhdGVnb3J5RWRpdCIsImJhbm5lckZpbGVSZWYiLCJiYW5uZXJVcGxvYWRpbmciLCJzZXRCYW5uZXJVcGxvYWRpbmciLCJiYW5uZXJQcmV2aWV3VXJsIiwic2V0QmFubmVyUHJldmlld1VybCIsImNhdGVnb3J5VXJsQmFzZSIsImNhdGVnb3J5VXJsIiwiYmFubmVySW1hZ2VVcmwiLCJiYW5uZXJJbWFnZSIsImRpc3BsYXllZEJhbm5lclVybCIsInVwbG9hZEJhbm5lciIsIm1heFdpZHRoIiwiQ21zTGlzdCIsInNldFRhZyIsInRpdGxlUHJvcCIsInRpdGxlUHJvcGVydHkiLCJzdG9yZVBhcmFtcyIsImZpbHRlcnMiLCJ1c2VRdWVyeVBhcmFtcyIsInJlY29yZHMiLCJkaXJlY3Rpb24iLCJzb3J0QnkiLCJwYWdlIiwidG90YWwiLCJmZXRjaERhdGEiLCJwZXJQYWdlIiwidXNlUmVjb3JkcyIsInNlbGVjdGVkUmVjb3JkcyIsImhhbmRsZVNlbGVjdCIsImhhbmRsZVNlbGVjdEFsbCIsInNldFNlbGVjdGVkUmVjb3JkcyIsInVzZVNlbGVjdGVkUmVjb3JkcyIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJkZWJvdW5jZVJlZiIsInN0b3JlUGFyYW1zUmVmIiwidG9TdHJpbmciLCJoYW5kbGVRdWVyeUNoYW5nZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ0cmltbWVkIiwiaGFuZGxlQWN0aW9uUGVyZm9ybWVkIiwiaGFuZGxlUGFnaW5hdGlvbkNoYW5nZSIsInBhZ2VOdW1iZXIiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJwb2ludGVyRXZlbnRzIiwiSW5wdXQiLCJwYWRkaW5nTGVmdCIsIlJlY29yZHNUYWJsZSIsImFjdGlvblBlcmZvcm1lZCIsIm9uU2VsZWN0Iiwib25TZWxlY3RBbGwiLCJpc0xvYWRpbmciLCJ0ZXh0QWxpZ24iLCJQYWdpbmF0aW9uIiwiUmV2aWV3RWRpdCIsIlRBQlMiLCJmaWVsZHMiLCJTZXR0aW5nc0VkaXQiLCJhY3RpdmVUYWIiLCJzZXRBY3RpdmVUYWIiLCJoYXNoIiwic29tZSIsInRhYiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJub3RpY2UiLCJmbGV4RGlyZWN0aW9uIiwiRHJhd2VyQ29udGVudCIsInByb3BlcnRpZXMiLCJEcmF3ZXJGb290ZXIiLCJmb3JtYXRNb25leSIsImFtb3VudCIsIk51bWJlciIsImlzTmFOIiwidG9Mb2NhbGVTdHJpbmciLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJmb3JtYXREYXRlVGltZSIsIkRhdGUiLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJyZXNvbHZlSW1hZ2UiLCJPcmRlckRldGFpbCIsImFjdGlvbiIsImlzRWRpdCIsInNhdmluZyIsInNldFNhdmluZyIsIml0ZW1zIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwiaXRlbXNKc29uIiwiaXRlbSIsImhhbmRsZVNhdmUiLCJzdGF0dXNPcHRpb25zIiwicGF5bWVudE9wdGlvbnMiLCJwYXltZW50TWV0aG9kIiwicmF6b3JwYXlQYXltZW50SWQiLCJjcmVhdGVkQXQiLCJjdXN0b21lck5hbWUiLCJjdXN0b21lclBob25lIiwiY3VzdG9tZXJFbWFpbCIsIlNlbGVjdCIsImZpbmQiLCJvcHRpb24iLCJzZWxlY3RlZCIsInBheW1lbnRTdGF0dXMiLCJGcmFnbWVudCIsInRleHRUcmFuc2Zvcm0iLCJhZGRyZXNzRm9ybWF0dGVkIiwiYWRkcmVzc0xhYmVsIiwid2VpZ2h0IiwicHJpY2VWYWx1ZSIsInF1YW50aXR5IiwibGluZVRvdGFsIiwiY29sU3BhbiIsIml0ZW1zVG90YWwiLCJkZWxpdmVyeUNoYXJnZSIsImhhbmRsaW5nQ2hhcmdlIiwic21hbGxDYXJ0Q2hhcmdlIiwiZGlzY291bnQiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInNob3dQYXNzd29yZCIsInNldFNob3dQYXNzd29yZCIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiYm94U2hhZG93IiwiTWVzc2FnZUJveCIsIkZvcm1Hcm91cCIsInJlcXVpcmVkIiwiYXV0b0NvbXBsZXRlIiwiZGVmYXVsdFZhbHVlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJ2aWV3Qm94IiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiZCIsImN4IiwiY3kiLCJyIiwiY2hlY2tlZCIsIm1hcmdpblJpZ2h0IiwiaHRtbEZvciIsImFkbWluUm9vdFBhdGgiLCJtYXRjaCIsImNhdGFsb2dDb25maWciLCJyZXNvdXJjZUlkIiwiZXhwb3J0VXJsIiwiaW1wb3J0VXJsIiwiQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIiwib25JbXBvcnRlZCIsInRyYW5zbGF0ZUJ1dHRvbiIsInRyYW5zbGF0ZUFjdGlvbiIsInRvZ2dsZUZpbHRlciIsImZpbHRlcnNDb3VudCIsInVzZUZpbHRlckRyYXdlciIsInNldExvYWRpbmciLCJzZXRNZXNzYWdlIiwiY29uZmlnIiwiaGFuZGxlSW1wb3J0IiwiY3JlZGVudGlhbHMiLCJlcnJvckNvdW50IiwiZXJyb3JzIiwidGV4dCIsImNyZWF0ZWQiLCJ1cGRhdGVkIiwiYnV0dG9ucyIsInVuZGVmaW5lZCIsImNsaWNrIiwibmV3QWN0aW9uIiwicmVzb3VyY2VBY3Rpb25zIiwicHVzaCIsImZpbHRlcktleSIsImNvdW50IiwiZmxleFNocmluayIsInB4IiwibWFyZ2luVG9wIiwiQnV0dG9uR3JvdXAiLCJvbkNsb3NlQ2xpY2siLCJDQVRBTE9HX1JFU09VUkNFUyIsIlNldCIsIkFjdGlvbkhlYWRlciIsIk9yaWdpbmFsQ29tcG9uZW50IiwiQmFzZUhlYWRlciIsIk9yaWdpbmFsQWN0aW9uSGVhZGVyIiwiaXNDYXRhbG9nTGlzdCIsImhhcyIsIl9pZ25vcmVkIiwiaGVhZGVyUHJvcHMiLCJfZXh0ZW5kcyIsIm9taXRBY3Rpb25zIiwiREVGQVVMVF9PUFRJT05TIiwicGx1Z2lucyIsInRvb2xiYXIiLCJSaWNodGV4dEVkaXQiLCJoYW5kbGVVcGRhdGUiLCJ1c2VDYWxsYmFjayIsIm5ld1ZhbHVlIiwiaXNSZXF1aXJlZCIsIlRpbnlNQ0UiLCJGb3JtTWVzc2FnZSIsIm1lbW8iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFJQSxNQUFNQSxHQUFHLEdBQUcsSUFBSUMsaUJBQVMsRUFBRTtFQUUzQixNQUFNQyxTQUFTLEdBQUcsQ0FDaEI7RUFBRUMsRUFBQUEsR0FBRyxFQUFFLGNBQWM7RUFBRUMsRUFBQUEsS0FBSyxFQUFFLFVBQVU7RUFBRUMsRUFBQUEsSUFBSSxFQUFFLGNBQWM7RUFBRUMsRUFBQUEsUUFBUSxFQUFFO0VBQVUsQ0FBQyxFQUNyRjtFQUFFSCxFQUFBQSxHQUFHLEVBQUUsWUFBWTtFQUFFQyxFQUFBQSxLQUFLLEVBQUUsUUFBUTtFQUFFQyxFQUFBQSxJQUFJLEVBQUUsYUFBYTtFQUFFQyxFQUFBQSxRQUFRLEVBQUU7RUFBUSxDQUFDLEVBQzlFO0VBQUVILEVBQUFBLEdBQUcsRUFBRSxXQUFXO0VBQUVDLEVBQUFBLEtBQUssRUFBRSxPQUFPO0VBQUVDLEVBQUFBLElBQUksRUFBRSxVQUFVO0VBQUVDLEVBQUFBLFFBQVEsRUFBRTtFQUFPLENBQUMsRUFDeEU7RUFBRUgsRUFBQUEsR0FBRyxFQUFFLGFBQWE7RUFBRUMsRUFBQUEsS0FBSyxFQUFFLFNBQVM7RUFBRUMsRUFBQUEsSUFBSSxFQUFFLE1BQU07RUFBRUMsRUFBQUEsUUFBUSxFQUFFO0VBQVMsQ0FBQyxDQUMzRTtFQUVELE1BQU1DLFNBQVMsR0FBR0EsTUFBTUMsTUFBTSxDQUFDQyxRQUFRLENBQUNDLFFBQVEsQ0FBQ0MsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7RUFFN0UsTUFBTUMsU0FBUyxHQUFHQSxNQUFNO0lBQ3RCLE1BQU0sQ0FBQ0MsSUFB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
