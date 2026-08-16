(function (React, adminjs, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const api$1 = new adminjs.ApiClient();
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
      api$1.getDashboard().then(res => setData(res.data)).catch(() => setData({}));
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
    if (value.startsWith('/')) return `${window.location.origin}${value}`;
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

  const api = new adminjs.ApiClient();
  const EyeIcon = ({
    hidden
  }) => hidden ? /*#__PURE__*/React__default.default.createElement("svg", {
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
  }));
  function PasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle
  }) {
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      htmlFor: id,
      required: true
    }, label), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      position: "relative",
      width: "100%"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      id: id,
      type: visible ? 'text' : 'password',
      value: value,
      onChange: event => onChange(event.target.value),
      autoComplete: "new-password",
      style: {
        width: '100%',
        paddingRight: 42
      }
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      "aria-label": visible ? 'Hide password' : 'Show password',
      onClick: onToggle,
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
    }, /*#__PURE__*/React__default.default.createElement(EyeIcon, {
      hidden: visible
    }))));
  }
  const ChangePassword = props => {
    const {
      record,
      resource
    } = props;
    const addNotice = adminjs.useNotice();
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState('');
    const close = () => {
      window.history.back();
    };
    const save = async event => {
      event.preventDefault();
      setError('');
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('New password and confirm password must be the same.');
        return;
      }
      setSaving(true);
      try {
        const response = await api.recordAction({
          resourceId: resource.id,
          recordId: record.id,
          actionName: 'changePassword',
          method: 'post',
          data: {
            password,
            confirmPassword
          }
        });
        const notice = response.data?.notice;
        if (notice?.type === 'error') {
          setError(notice.message || 'Could not save password.');
          return;
        }
        if (notice) addNotice(notice);
        const redirectUrl = response.data?.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
        close();
      } catch (err) {
        setError(err.message || 'Could not save password.');
      } finally {
        setSaving(false);
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 12, 8, 0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 80,
        padding: 16
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: save,
      bg: "white",
      width: ['100%', '420px'],
      p: "xl",
      style: {
        borderRadius: 16,
        boxShadow: '0 24px 70px rgba(2, 44, 34, 0.28)'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      mb: "sm"
    }, "Change password"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "xl",
      color: "#64748b"
    }, "Set a new password for ", record?.params?.name || record?.params?.email || 'this user', "."), /*#__PURE__*/React__default.default.createElement(PasswordField, {
      id: "new-password",
      label: "New password",
      value: password,
      onChange: setPassword,
      visible: showPassword,
      onToggle: () => setShowPassword(value => !value)
    }), /*#__PURE__*/React__default.default.createElement(PasswordField, {
      id: "confirm-password",
      label: "Confirm password",
      value: confirmPassword,
      onChange: setConfirmPassword,
      visible: showConfirm,
      onToggle: () => setShowConfirm(value => !value)
    }), error ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mb: "lg",
      color: "#dc2626"
    }, error) : null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "flex",
      justifyContent: "flex-end",
      style: {
        gap: 10
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      type: "button",
      variant: "text",
      onClick: close,
      disabled: saving
    }, "Cancel"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      type: "submit",
      variant: "contained",
      disabled: saving
    }, saving ? 'Saving…' : 'Save password'))));
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
  AdminJS.UserComponents.ChangePassword = ChangePassword;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vcmRlci1kZXRhaWwuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2hhbmdlLXBhc3N3b3JkLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2xvZ2luLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGFsb2ctbGlzdC1oZWFkZXItYWN0aW9ucy5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9hY3Rpb24taGVhZGVyLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JpY2h0ZXh0LWVkaXQuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgVGV4dCwgQnV0dG9uLCBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IHN0YXRDYXJkcyA9IFtcbiAgeyBrZXk6ICdwcm9kdWN0Q291bnQnLCBsYWJlbDogJ1Byb2R1Y3RzJywgaWNvbjogJ1Nob3BwaW5nQ2FydCcsIHJlc291cmNlOiAnUHJvZHVjdCcgfSxcbiAgeyBrZXk6ICdvcmRlckNvdW50JywgbGFiZWw6ICdPcmRlcnMnLCBpY29uOiAnU2hvcHBpbmdCYWcnLCByZXNvdXJjZTogJ09yZGVyJyB9LFxuICB7IGtleTogJ3BhZ2VDb3VudCcsIGxhYmVsOiAnUGFnZXMnLCBpY29uOiAnRmlsZVRleHQnLCByZXNvdXJjZTogJ1BhZ2UnIH0sXG4gIHsga2V5OiAncmV2aWV3Q291bnQnLCBsYWJlbDogJ1Jldmlld3MnLCBpY29uOiAnU3RhcicsIHJlc291cmNlOiAnUmV2aWV3JyB9LFxuXVxuXG5jb25zdCBhZG1pblJvb3QgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy9yZXNvdXJjZXMnKVswXSB8fCAnJ1xuXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhcGkuZ2V0RGFzaGJvYXJkKCkudGhlbigocmVzKSA9PiBzZXREYXRhKHJlcy5kYXRhKSkuY2F0Y2goKCkgPT4gc2V0RGF0YSh7fSkpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IHN0YXRzID0gZGF0YSB8fCB7fVxuICBjb25zdCByb290ID0gYWRtaW5Sb290KClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIiBjbGFzc05hbWU9XCJ0b2tyaS1kYXNoYm9hcmRcIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktZGFzaGJvYXJkLWhlcm9cIiBwPVwieHhsXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8SDIgbWI9XCJzbVwiPldlbGNvbWUgdG8gVG9rcmlpaSBDTVM8L0gyPlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjl9PlxuICAgICAgICAgIE1hbmFnZSB5b3VyIHN0b3JlIGNvbnRlbnQsIHByb2R1Y3RzLCBvcmRlcnMsIGFuZCB3ZWJzaXRlIHNldHRpbmdzIGZyb20gb25lIHBsYWNlLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGNsYXNzTmFtZT1cInRva3JpLXN0YXQtZ3JpZFwiIG1iPVwieGxcIj5cbiAgICAgICAge3N0YXRDYXJkcy5tYXAoKGNhcmQpID0+IChcbiAgICAgICAgICA8Qm94IGtleT17Y2FyZC5rZXl9IGNsYXNzTmFtZT1cInRva3JpLXN0YXQtY2FyZFwiIHA9XCJsZ1wiPlxuICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPEg1PntjYXJkLmxhYmVsfTwvSDU+XG4gICAgICAgICAgICAgIDxJY29uIGljb249e2NhcmQuaWNvbn0gLz5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPFRleHQgZm9udFNpemU9ezMyfSBmb250V2VpZ2h0PVwiYm9sZFwiPlxuICAgICAgICAgICAgICB7c3RhdHNbY2FyZC5rZXldID8/ICfigJQnfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBtdD1cImRlZmF1bHRcIlxuICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICAgIGhyZWY9e2AvdG9rcmktYmFja29mZmljZS9yZXNvdXJjZXMvJHtjYXJkLnJlc291cmNlfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFZpZXcgYWxsXG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGNsYXNzTmFtZT1cInRva3JpLWRhc2hib2FyZC1ncmlkXCI+XG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPlF1aWNrIGFjdGlvbnM8L0g1PlxuICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBmbGV4V3JhcD1cIndyYXBcIiBjbGFzc05hbWU9XCJ0b2tyaS1xdWljay1hY3Rpb25zXCI+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9Qcm9kdWN0L2FjdGlvbnMvbmV3YH0gdmFyaWFudD1cImNvbnRhaW5lZFwiPlxuICAgICAgICAgICAgICBBZGQgcHJvZHVjdFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9QYWdlL2FjdGlvbnMvbmV3YH0gdmFyaWFudD1cIm91dGxpbmVkXCI+XG4gICAgICAgICAgICAgIEFkZCBwYWdlXG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1NldHRpbmcvcmVjb3Jkcy8xL2VkaXRgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgU3RvcmUgc2V0dGluZ3NcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgJHtyb290fS9yZXNvdXJjZXMvT3JkZXJgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgVmlldyBvcmRlcnNcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cInhsXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5SZWNlbnQgb3JkZXJzPC9INT5cbiAgICAgICAgICB7KHN0YXRzLnJlY2VudE9yZGVycyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5ObyBvcmRlcnMgeWV0LjwvVGV4dD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPEJveCBhcz1cInRhYmxlXCIgY2xhc3NOYW1lPVwidG9rcmktcmVjZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGg+T3JkZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+VG90YWw8L3RoPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICB7c3RhdHMucmVjZW50T3JkZXJzLm1hcCgob3JkZXIpID0+IChcbiAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e29yZGVyLm9yZGVyTm99PlxuICAgICAgICAgICAgICAgICAgICA8dGQ+e29yZGVyLm9yZGVyTm99PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPntvcmRlci5zdGF0dXN9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPuKCuXtvcmRlci5ncmFuZFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSWNvbiwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHtcbiAgQmFzZVByb3BlcnR5Q29tcG9uZW50LFxuICB1c2VOb3RpY2UsXG4gIHVzZVJlY29yZCxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcbn1cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgUHJvZHVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtkZXNjcmlwdGlvbk1vZGUsIHNldERlc2NyaXB0aW9uTW9kZV0gPSB1c2VTdGF0ZSgnd3lzaXd5ZycpXG4gIGNvbnN0IFtkZXNjcmlwdGlvblZhbHVlLCBzZXREZXNjcmlwdGlvblZhbHVlXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgcHJvZHVjdFVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20ucHJvZHVjdFVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcHJvZHVjdGAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLm5hbWUpXG4gIGNvbnN0IHByb2R1Y3RVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke3Byb2R1Y3RVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXREZXNjcmlwdGlvblZhbHVlKFN0cmluZyhwYXJhbXMuZGVzY3JpcHRpb24gfHwgJycpKVxuICB9LCBbcGFyYW1zLmRlc2NyaXB0aW9uXSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdClcblxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncHJvZHVjdHMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ21lZGlhSWQnLCBtZWRpYS5pZClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcHJvZHVjdCcsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcHJvcGVydHlCeVBhdGggPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gW3Byb3BlcnR5LnByb3BlcnR5UGF0aCwgcHJvcGVydHldKSxcbiAgKVxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IChwcm9wZXJ0eVBhdGgpID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnR5QnlQYXRoW3Byb3BlcnR5UGF0aF1cbiAgICBpZiAoIXByb3BlcnR5KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZ1Byb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoXG4gICAgKHByb3BlcnR5KSA9PlxuICAgICAgIVsnbmFtZScsICdzbHVnJywgJ2Rlc2NyaXB0aW9uJywgJ2ltYWdlJywgJ21lZGlhSWQnXS5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IHA9XCJ4bFwiPlxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxINCBtYj1cInNtXCI+UHJvZHVjdDwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFVwbG9hZCB0aGUgcHJvZHVjdCBpbWFnZSwgZWRpdCB0aGUgc2x1ZywgYW5kIHNhdmUuIER1cGxpY2F0ZSBzbHVncyBhcmUgYXV0b21hdGljYWxseVxuICAgICAgICAgIHJlbmFtZWQgbGlrZSBXb3JkUHJlc3MuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ25hbWUnKX08L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cImxnXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxMnB4XCIgYmc9XCIjZjhmYWZjXCI+XG4gICAgICAgIDxMYWJlbD5TbHVnPC9MYWJlbD5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBmbGV4V3JhcD1cIndyYXBcIiBnYXA9XCJzbVwiPlxuICAgICAgICAgIDxUZXh0IGFzPVwic3BhblwiIGZvbnRXZWlnaHQ9XCJib2xkXCI+XG4gICAgICAgICAgICB7YCR7cHJvZHVjdFVybEJhc2V9L2B9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTGVhdmUgZW1wdHkgdG8gYXV0by1nZW5lcmF0ZSBmcm9tIG5hbWVcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBtaW5XaWR0aDogMjYwLFxuICAgICAgICAgICAgICBmbGV4OiAnMSAxIDI2MHB4JyxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzEwcHggMTJweCcsXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAge3Byb2R1Y3RVcmwgPyAoXG4gICAgICAgICAgICA8YSBocmVmPXtwcm9kdWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgIHtwcm9kdWN0VXJsfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gcHJvZHVjdCBuYW1lIHdoZW4gc2F2ZWQnXG4gICAgICAgICAgKX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBMZWF2ZSBlbXB0eSB0byBhdXRvLWdlbmVyYXRlIGZyb20gdGhlIHByb2R1Y3QgbmFtZS4gSWYgdGhlIHNsdWcgYWxyZWFkeSBleGlzdHMsIGEgbnVtYmVyXG4gICAgICAgICAgc3VmZml4IGlzIGFkZGVkIGF1dG9tYXRpY2FsbHkgKGZvciBleGFtcGxlLCBtYW5nby0yKS5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8TGFiZWw+RGVzY3JpcHRpb248L0xhYmVsPlxuICAgICAgICA8VGV4dCBtYj1cIm1kXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgVXNlIHRoZSBXWVNJV1lHIHRvb2xiYXIsIG9yIHN3aXRjaCB0byBIVE1MIHNvdXJjZSBhbmQgcHJldmlldyBtb2RlLlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGdhcD1cInNtXCIgbWI9XCJtZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCd3eXNpd3lnJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICd3eXNpd3lnJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgV1lTSVdZR1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdodG1sJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgSFRNTFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdwcmV2aWV3Jyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAncHJldmlldycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdwcmV2aWV3JyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUHJldmlld1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICB7ZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT57cmVuZGVyUHJvcGVydHkoJ2Rlc2NyaXB0aW9uJyl9PC9Cb3g+XG4gICAgICAgICkgOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/IChcbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIHZhbHVlPXtkZXNjcmlwdGlvblZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBzZXREZXNjcmlwdGlvblZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgICAgb25Qcm9wZXJ0eUNoYW5nZSgnZGVzY3JpcHRpb24nLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcm93cz17MTB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjxwPldyaXRlIHByb2R1Y3QgZGVzY3JpcHRpb24gaW4gSFRNTC4uLjwvcD5cIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgbWluSGVpZ2h0OiAyMjAsXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogMTIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS40NSxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3VpLW1vbm9zcGFjZSwgU0ZNb25vLVJlZ3VsYXIsIE1lbmxvLCBNb25hY28sIENvbnNvbGFzLCBtb25vc3BhY2UnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIHA9XCJsZ1wiXG4gICAgICAgICAgICBib3JkZXI9XCIxcHggc29saWQgI2UyZThmMFwiXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM9XCIxMHB4XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogMjIwLCBiYWNrZ3JvdW5kOiAnI2Y4ZmFmYycgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7ZGVzY3JpcHRpb25WYWx1ZSA/IChcbiAgICAgICAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGRlc2NyaXB0aW9uVmFsdWUgfX0gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+UHJldmlldyB3aWxsIGFwcGVhciBoZXJlLjwvVGV4dD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+UHJvZHVjdCBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdQcm9kdWN0IHByZXZpZXcnfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAyMjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMjAsXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY292ZXInLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkYmUzZWEnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIE5vIGltYWdlIHNlbGVjdGVkIHlldC5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e3VwbG9hZEltYWdlfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHtyZW1haW5pbmdQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgPEJveCBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH0+e3JlbmRlclByb3BlcnR5KHByb3BlcnR5LnByb3BlcnR5UGF0aCl9PC9Cb3g+XG4gICAgICApKX1cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHByb2R1Y3RcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBJY29uLCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcbn1cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgQ2F0ZWdvcnlFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgYmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Jhbm5lclByZXZpZXdVcmwsIHNldEJhbm5lclByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtkZXNjcmlwdGlvbk1vZGUsIHNldERlc2NyaXB0aW9uTW9kZV0gPSB1c2VTdGF0ZSgnd3lzaXd5ZycpXG4gIGNvbnN0IFtkZXNjcmlwdGlvblZhbHVlLCBzZXREZXNjcmlwdGlvblZhbHVlXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgY2F0ZWdvcnlVcmxCYXNlID0gd2l0aG91dFRyYWlsaW5nU2xhc2goXG4gICAgY3VzdG9tLmNhdGVnb3J5VXJsQmFzZSB8fCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9jYXRlZ29yeWAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLmxhYmVsKVxuICBjb25zdCBjYXRlZ29yeVVybCA9IHByZXZpZXdTbHVnID8gYCR7Y2F0ZWdvcnlVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuYmFubmVySW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuYmFubmVySW1hZ2UpKSByZXR1cm4gcGFyYW1zLmJhbm5lckltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuYmFubmVySW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmJhbm5lckltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRCYW5uZXJVcmwgPSBiYW5uZXJQcmV2aWV3VXJsIHx8IGJhbm5lckltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0RGVzY3JpcHRpb25WYWx1ZShTdHJpbmcocGFyYW1zLmRlc2NyaXB0aW9uIHx8ICcnKSlcbiAgfSwgW3BhcmFtcy5kZXNjcmlwdGlvbl0pXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpXG5cbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnbGFiZWwnICYmICFzbHVnRWRpdGVkKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ3NsdWcnLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdjYXRlZ29yaWVzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIG9uUHJvcGVydHlDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVwbG9hZEJhbm5lciA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnY2F0ZWdvcmllcycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRCYW5uZXJQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRCYW5uZXJVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBvblByb3BlcnR5Q2hhbmdlKCdiYW5uZXJJbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRCYW5uZXJQcmV2aWV3VXJsKFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdCYW5uZXIgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgYmFubmVyJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCYW5uZXJVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoYmFubmVyRmlsZVJlZi5jdXJyZW50KSBiYW5uZXJGaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY2F0ZWdvcnknLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHByb3BlcnR5QnlQYXRoID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgIHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IFtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgsIHByb3BlcnR5XSksXG4gIClcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSAocHJvcGVydHlQYXRoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydHkgPSBwcm9wZXJ0eUJ5UGF0aFtwcm9wZXJ0eVBhdGhdXG4gICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmdQcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKFxuICAgIChwcm9wZXJ0eSkgPT5cbiAgICAgICFbJ2xhYmVsJywgJ3NsdWcnLCAnZGVzY3JpcHRpb24nLCAnaW1hZ2UnLCAnYmFubmVySW1hZ2UnXS5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IHA9XCJ4bFwiPlxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxINCBtYj1cInNtXCI+Q2F0ZWdvcnk8L0g0PlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICBVcGxvYWQgdGhlIGNhdGVnb3J5IGltYWdlLCBlZGl0IHRoZSBzbHVnLCBhbmQgc2F2ZS4gRHVwbGljYXRlIHNsdWdzIGFyZSBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgcmVuYW1lZCBsaWtlIFdvcmRQcmVzcy5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnbGFiZWwnKX08L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cImxnXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxMnB4XCIgYmc9XCIjZjhmYWZjXCI+XG4gICAgICAgIDxMYWJlbD5TbHVnPC9MYWJlbD5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBmbGV4V3JhcD1cIndyYXBcIiBnYXA9XCJzbVwiPlxuICAgICAgICAgIDxUZXh0IGFzPVwic3BhblwiIGZvbnRXZWlnaHQ9XCJib2xkXCI+XG4gICAgICAgICAgICB7YCR7Y2F0ZWdvcnlVcmxCYXNlfS9gfVxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtzbHVnSW5wdXR9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxlYXZlIGVtcHR5IHRvIGF1dG8tZ2VuZXJhdGUgZnJvbSBsYWJlbFwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1pbldpZHRoOiAyNjAsXG4gICAgICAgICAgICAgIGZsZXg6ICcxIDEgMjYwcHgnLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnMTBweCAxMnB4JyxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICB7Y2F0ZWdvcnlVcmwgPyAoXG4gICAgICAgICAgICA8YSBocmVmPXtjYXRlZ29yeVVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICB7Y2F0ZWdvcnlVcmx9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBjYXRlZ29yeSBsYWJlbCB3aGVuIHNhdmVkJ1xuICAgICAgICAgICl9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgTGVhdmUgZW1wdHkgdG8gYXV0by1nZW5lcmF0ZSBmcm9tIHRoZSBjYXRlZ29yeSBsYWJlbC4gSWYgdGhlIHNsdWcgYWxyZWFkeSBleGlzdHMsIGEgbnVtYmVyXG4gICAgICAgICAgc3VmZml4IGlzIGFkZGVkIGF1dG9tYXRpY2FsbHkgKGZvciBleGFtcGxlLCBmcnVpdHMtMikuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPExhYmVsPkRlc2NyaXB0aW9uPC9MYWJlbD5cbiAgICAgICAgPFRleHQgbWI9XCJtZFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFVzZSB0aGUgV1lTSVdZRyB0b29sYmFyLCBvciBzd2l0Y2ggdG8gSFRNTCBzb3VyY2UgYW5kIHByZXZpZXcgbW9kZS5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBnYXA9XCJzbVwiIG1iPVwibWRcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgnd3lzaXd5ZycpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3d5c2l3eWcnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFdZU0lXWUdcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgnaHRtbCcpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ2h0bWwnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIEhUTUxcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgncHJldmlldycpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3ByZXZpZXcnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAncHJldmlldycgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFByZXZpZXdcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAge2Rlc2NyaXB0aW9uTW9kZSA9PT0gJ3d5c2l3eWcnID8gKFxuICAgICAgICAgIDxCb3ggc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAgfX0+e3JlbmRlclByb3BlcnR5KCdkZXNjcmlwdGlvbicpfTwvQm94PlxuICAgICAgICApIDogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAoXG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICB2YWx1ZT17ZGVzY3JpcHRpb25WYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgc2V0RGVzY3JpcHRpb25WYWx1ZShldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgIG9uUHJvcGVydHlDaGFuZ2UoJ2Rlc2NyaXB0aW9uJywgZXZlbnQudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHJvd3M9ezEwfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI8cD5Xcml0ZSBjYXRlZ29yeSBkZXNjcmlwdGlvbiBpbiBIVE1MLi4uPC9wPlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBtaW5IZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAxMixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQ1LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndWktbW9ub3NwYWNlLCBTRk1vbm8tUmVndWxhciwgTWVubG8sIE1vbmFjbywgQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgcD1cImxnXCJcbiAgICAgICAgICAgIGJvcmRlcj1cIjFweCBzb2xpZCAjZTJlOGYwXCJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cIjEwcHhcIlxuICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAsIGJhY2tncm91bmQ6ICcjZjhmYWZjJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtkZXNjcmlwdGlvblZhbHVlID8gKFxuICAgICAgICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZGVzY3JpcHRpb25WYWx1ZSB9fSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5QcmV2aWV3IHdpbGwgYXBwZWFyIGhlcmUuPC9UZXh0PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5DYXRlZ29yeSBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgcHJldmlldyd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNixcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+Q2F0ZWdvcnkgQmFubmVyPC9IND5cbiAgICAgICAgPFRleHQgbWI9XCJtZFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFdpZGUgYmFubmVyIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2Ugb24gdGhlIHdlYnNpdGUuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZGlzcGxheWVkQmFubmVyVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEJhbm5lclVybH1cbiAgICAgICAgICAgICAgYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IGJhbm5lcid9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogNjQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvdmVyJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDE2LFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGJlM2VhJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBObyBiYW5uZXIgc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtiYW5uZXJGaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkQmFubmVyfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi4gUmVjb21tZW5kZWQgd2lkZSBpbWFnZSAoZS5nLiAxNjAww5c0MDApLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofT57cmVuZGVyUHJvcGVydHkocHJvcGVydHkucHJvcGVydHlQYXRoKX08L0JveD5cbiAgICAgICkpfVxuXG4gICAgICA8Qm94IHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAge3JlbmRlclByb3BlcnR5KCdpbWFnZScpfVxuICAgICAgICB7cmVuZGVyUHJvcGVydHkoJ2Jhbm5lckltYWdlJyl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmcgfHwgYmFubmVyVXBsb2FkaW5nfVxuICAgICAgICA+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNhdGVnb3J5XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEljb24sIElucHV0LCBQYWdpbmF0aW9uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIFJlY29yZHNUYWJsZSxcbiAgdXNlUXVlcnlQYXJhbXMsXG4gIHVzZVJlY29yZHMsXG4gIHVzZVNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgQ21zTGlzdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlUHJvcCA9IHJlc291cmNlLnRpdGxlUHJvcGVydHk/Lm5hbWUgfHwgcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ucHJvcGVydHlQYXRoIHx8ICdpZCdcblxuICBjb25zdCB7IHN0b3JlUGFyYW1zLCBmaWx0ZXJzIH0gPSB1c2VRdWVyeVBhcmFtcygpXG4gIGNvbnN0IHtcbiAgICByZWNvcmRzLFxuICAgIGxvYWRpbmcsXG4gICAgZGlyZWN0aW9uLFxuICAgIHNvcnRCeSxcbiAgICBwYWdlLFxuICAgIHRvdGFsLFxuICAgIGZldGNoRGF0YSxcbiAgICBwZXJQYWdlLFxuICB9ID0gdXNlUmVjb3JkcyhyZXNvdXJjZS5pZClcbiAgY29uc3Qge1xuICAgIHNlbGVjdGVkUmVjb3JkcyxcbiAgICBoYW5kbGVTZWxlY3QsXG4gICAgaGFuZGxlU2VsZWN0QWxsLFxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyxcbiAgfSA9IHVzZVNlbGVjdGVkUmVjb3JkcyhyZWNvcmRzKVxuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoKCkgPT4gU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgY29uc3QgZGVib3VuY2VSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3Qgc3RvcmVQYXJhbXNSZWYgPSB1c2VSZWYoc3RvcmVQYXJhbXMpXG4gIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQgPSBzdG9yZVBhcmFtc1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0UXVlcnkoU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMoW10pXG4gIH0sIFtyZXNvdXJjZS5pZCwgdGl0bGVQcm9wLCBzZXRTZWxlY3RlZFJlY29yZHNdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNldFRhZykgc2V0VGFnKHRvdGFsLnRvU3RyaW5nKCkpXG4gIH0sIFt0b3RhbCwgc2V0VGFnXSlcblxuICBjb25zdCBoYW5kbGVRdWVyeUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgc2V0UXVlcnkodmFsdWUpXG5cbiAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgZGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKVxuICAgICAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCh7XG4gICAgICAgIHBhZ2U6ICcxJyxcbiAgICAgICAgZmlsdGVyczogdHJpbW1lZCA/IHsgW3RpdGxlUHJvcF06IHRyaW1tZWQgfSA6IHt9LFxuICAgICAgfSlcbiAgICB9LCAzMDApXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVBY3Rpb25QZXJmb3JtZWQgPSAoKSA9PiBmZXRjaERhdGEoKVxuXG4gIGNvbnN0IGhhbmRsZVBhZ2luYXRpb25DaGFuZ2UgPSAocGFnZU51bWJlcikgPT4ge1xuICAgIHN0b3JlUGFyYW1zKHsgcGFnZTogcGFnZU51bWJlci50b1N0cmluZygpIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIj5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtYXhXaWR0aDogNDIwIH19PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIGxlZnQ6IDEyLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJY29uIGljb249XCJTZWFyY2hcIiAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVRdWVyeUNoYW5nZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17YFNlYXJjaCAke3Jlc291cmNlLm5hbWV9Li4uYH1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nTGVmdDogMzYgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IHZhcmlhbnQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPFJlY29yZHNUYWJsZVxuICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICByZWNvcmRzPXtyZWNvcmRzfVxuICAgICAgICAgIGFjdGlvblBlcmZvcm1lZD17aGFuZGxlQWN0aW9uUGVyZm9ybWVkfVxuICAgICAgICAgIG9uU2VsZWN0PXtoYW5kbGVTZWxlY3R9XG4gICAgICAgICAgb25TZWxlY3RBbGw9e2hhbmRsZVNlbGVjdEFsbH1cbiAgICAgICAgICBzZWxlY3RlZFJlY29yZHM9e3NlbGVjdGVkUmVjb3Jkc31cbiAgICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgICBzb3J0Qnk9e3NvcnRCeX1cbiAgICAgICAgICBpc0xvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0IG10PVwieGxcIiB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8UGFnaW5hdGlvblxuICAgICAgICAgICAgcGFnZT17cGFnZX1cbiAgICAgICAgICAgIHBlclBhZ2U9e3BlclBhZ2V9XG4gICAgICAgICAgICB0b3RhbD17dG90YWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUGFnaW5hdGlvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbXNMaXN0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDQsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmNvbnN0IFJldmlld0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncmV2aWV3cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcmV2aWV3JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBwcm9wZXJ0eUJ5UGF0aCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiBbcHJvcGVydHkucHJvcGVydHlQYXRoLCBwcm9wZXJ0eV0pLFxuICApXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gKHByb3BlcnR5UGF0aCkgPT4ge1xuICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydHlCeVBhdGhbcHJvcGVydHlQYXRoXVxuICAgIGlmICghcHJvcGVydHkpIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmdQcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKFxuICAgIChwcm9wZXJ0eSkgPT4gIVsndGl0bGUnLCAnbmFtZScsICdjb250ZW50JywgJ2ltYWdlJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBwPVwieGxcIj5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlJldmlldzwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIEFkZCB0aGUgcmV2aWV3IHRpdGxlLCByZXZpZXdlciBuYW1lLCBjb250ZW50LCBhbmQgYW4gb3B0aW9uYWwgcmV2aWV3ZXIgaW1hZ2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ3RpdGxlJyl9PC9Cb3g+XG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ25hbWUnKX08L0JveD5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnY29udGVudCcpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5SZXZpZXdlciBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdSZXZpZXdlcid9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE0MCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofSBtYj1cImxnXCI+XG4gICAgICAgICAge3JlbmRlclByb3BlcnR5KHByb3BlcnR5LnByb3BlcnR5UGF0aCl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKSl9XG5cbiAgICAgIDxCb3ggbXQ9XCJ4bFwiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSByZXZpZXdcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXZpZXdFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIERyYXdlckNvbnRlbnQsXG4gIERyYXdlckZvb3RlcixcbiAgSDQsXG4gIEljb24sXG4gIFRleHQsXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZVJlY29yZCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgVEFCUyA9IFtcbiAge1xuICAgIGlkOiAnZ2VuZXJhbCcsXG4gICAgbGFiZWw6ICdHZW5lcmFsJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdzdG9yZU5hbWUnLFxuICAgICAgJ3N0b3JlVGFnbGluZScsXG4gICAgICAnc3RvcmVFbWFpbCcsXG4gICAgICAnc3RvcmVQaG9uZTEnLFxuICAgICAgJ3N0b3JlUGhvbmUyJyxcbiAgICAgICdzdG9yZUFkZHJlc3MnLFxuICAgICAgJ3Byb21vQmFubmVyJyxcbiAgICAgICdlYXJseURlbGl2ZXJ5JyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdhcHBlYXJhbmNlJyxcbiAgICBsYWJlbDogJ0FwcGVhcmFuY2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2NvbG9yUHJpbWFyeScsXG4gICAgICAnY29sb3JQcmltYXJ5TGlnaHQnLFxuICAgICAgJ2NvbG9yQWNjZW50JyxcbiAgICAgICdjb2xvckJhY2tncm91bmQnLFxuICAgICAgJ2NvbG9yRm9vdGVyRnJvbScsXG4gICAgICAnY29sb3JGb290ZXJWaWEnLFxuICAgICAgJ2ZvbnRGYW1pbHknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvbWVwYWdlJyxcbiAgICBsYWJlbDogJ0hvbWVwYWdlJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdob21lQmFubmVyRW5hYmxlZCcsXG4gICAgICAnaG9tZUNhdGVnb3JpZXNFbmFibGVkJyxcbiAgICAgICdob21lQmVzdFNlbGxlcnNFbmFibGVkJyxcbiAgICAgICdob21lQmVzdFNlbGxlcnNUaXRsZScsXG4gICAgICAnaG9tZVNob3BPdXJSYW5nZUVuYWJsZWQnLFxuICAgICAgJ2hvbWVGcnVpdEhpZ2hsaWdodEVuYWJsZWQnLFxuICAgICAgJ2hvbWVJbXBvcnRlZEZydWl0c0VuYWJsZWQnLFxuICAgICAgJ2hvbWVSZXZpZXdzRW5hYmxlZCcsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGF5bWVudHMnLFxuICAgIGxhYmVsOiAnUGF5bWVudHMnLFxuICAgIGZpZWxkczogWydyYXpvcnBheUVuYWJsZWQnLCAncmF6b3JwYXlLZXlJZCcsICdyYXpvcnBheUtleVNlY3JldCddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdub3RpZmljYXRpb25zJyxcbiAgICBsYWJlbDogJ05vdGlmaWNhdGlvbnMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3R3aWxpb0VuYWJsZWQnLFxuICAgICAgJ3R3aWxpb0FjY291bnRTaWQnLFxuICAgICAgJ3R3aWxpb0F1dGhUb2tlbicsXG4gICAgICAndHdpbGlvU21zRnJvbScsXG4gICAgICAndHdpbGlvV2hhdHNhcHBGcm9tJyxcbiAgICBdLFxuICB9LFxuXVxuXG5jb25zdCBTZXR0aW5nc0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGUoJ2dlbmVyYWwnKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpXG4gICAgaWYgKGhhc2ggJiYgVEFCUy5zb21lKCh0YWIpID0+IHRhYi5pZCA9PT0gaGFzaCkpIHtcbiAgICAgIHNldEFjdGl2ZVRhYihoYXNoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIGAjJHthY3RpdmVUYWJ9YClcbiAgfSwgW2FjdGl2ZVRhYl0pXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdzdWNjZXNzJyB8fCByZXNwb25zZT8uZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTZXR0aW5ncyBzYXZlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncycsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncy4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gZmxleCBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCIgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy10YWJzXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1zZXR0aW5ncy10YWIke2FjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJyBpcy1hY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYih0YWIuaWQpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0YWIubGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxEcmF3ZXJDb250ZW50PlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoKHByb3BlcnR5KSA9PlxuICAgICAgICAgICAgdGFiLmZpZWxkcy5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICAgICAgICAgIClcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1wYW5lbFwiXG4gICAgICAgICAgICAgIHA9XCJ4bFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6IGFjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJ2Jsb2NrJyA6ICdub25lJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SDQgbWI9XCJzbVwiPnt0YWIubGFiZWx9PC9IND5cbiAgICAgICAgICAgICAgPFRleHQgbWI9XCJ4bFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgICAgICAgIFVwZGF0ZSB5b3VyIHN0b3JlIHNldHRpbmdzIGFuZCBjbGljayBTYXZlIGNoYW5nZXMgYmVsb3cuXG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L0RyYXdlckNvbnRlbnQ+XG5cbiAgICAgIDxEcmF3ZXJGb290ZXI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjaGFuZ2VzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EcmF3ZXJGb290ZXI+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSDUsIExhYmVsLCBTZWxlY3QsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oYW1vdW50KSkgcmV0dXJuICfigrkwJ1xuICByZXR1cm4gYOKCuSR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pfWBcbn1cblxuY29uc3QgZm9ybWF0RGF0ZVRpbWUgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICfigJQnXG4gIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRhdGVTdHlsZTogJ21lZGl1bScsXG4gICAgdGltZVN0eWxlOiAnc2hvcnQnLFxuICB9KVxufVxuXG5jb25zdCByZXNvbHZlSW1hZ2UgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdCh2YWx1ZSkpIHJldHVybiB2YWx1ZVxuICBpZiAodmFsdWUuc3RhcnRzV2l0aCgnLycpKSByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3ZhbHVlfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbmNvbnN0IE9yZGVyRGV0YWlsID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBpc0VkaXQgPSBhY3Rpb24/Lm5hbWUgPT09ICdlZGl0J1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChpbml0aWFsUmVjb3JkLCByZXNvdXJjZS5pZClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGl0ZW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocGFyYW1zLml0ZW1zSnNvbiB8fCAnW10nKVxuICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgIC4uLml0ZW0sXG4gICAgICAgIGltYWdlOiByZXNvbHZlSW1hZ2UoaXRlbS5pbWFnZSksXG4gICAgICB9KSlcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSwgW3BhcmFtcy5pdGVtc0pzb25dKVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0U2F2aW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHN1Ym1pdCgpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnT3JkZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGRhdGUgb3JkZXIuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhdHVzT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycgfSxcbiAgICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUGFpZCcgfSxcbiAgICB7IHZhbHVlOiAncGFja2VkJywgbGFiZWw6ICdQYWNrZWQnIH0sXG4gICAgeyB2YWx1ZTogJ3NoaXBwZWQnLCBsYWJlbDogJ1NoaXBwZWQnIH0sXG4gICAgeyB2YWx1ZTogJ2RlbGl2ZXJlZCcsIGxhYmVsOiAnRGVsaXZlcmVkJyB9LFxuICAgIHsgdmFsdWU6ICdjYW5jZWxsZWQnLCBsYWJlbDogJ0NhbmNlbGxlZCcgfSxcbiAgXVxuXG4gIGNvbnN0IHBheW1lbnRPcHRpb25zID0gW1xuICAgIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJyB9LFxuICAgIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQYWlkJyB9LFxuICAgIHsgdmFsdWU6ICdmYWlsZWQnLCBsYWJlbDogJ0ZhaWxlZCcgfSxcbiAgICB7IHZhbHVlOiAncmVmdW5kZWQnLCBsYWJlbDogJ1JlZnVuZGVkJyB9LFxuICBdXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZGV0YWlsXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cInhsXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlxuICAgICAgICAgIE9yZGVyICN7cGFyYW1zLm9yZGVyTm99IGRldGFpbHNcbiAgICAgICAgPC9IND5cbiAgICAgICAgPFRleHQgb3BhY2l0eT17MC44fT5cbiAgICAgICAgICBQYXltZW50IHZpYSB7cGFyYW1zLnBheW1lbnRNZXRob2QgfHwgJ0Nhc2ggb24gZGVsaXZlcnknfVxuICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgPyBgIMK3IFBheW1lbnQgSUQ6ICR7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkfWAgOiAnJ31cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1ncmlkXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cImxnXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5HZW5lcmFsPC9INT5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPk9yZGVyIGRhdGU8L0xhYmVsPlxuICAgICAgICAgICAgPFRleHQ+e2Zvcm1hdERhdGVUaW1lKHBhcmFtcy5jcmVhdGVkQXQpfTwvVGV4dD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIG5hbWU8L0xhYmVsPlxuICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIj57cGFyYW1zLmN1c3RvbWVyTmFtZSB8fCAnR3Vlc3QnfTwvVGV4dD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIHBob25lPC9MYWJlbD5cbiAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJQaG9uZSB8fCAn4oCUJ308L1RleHQ+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAge3BhcmFtcy5jdXN0b21lckVtYWlsID8gKFxuICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIGVtYWlsPC9MYWJlbD5cbiAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lckVtYWlsfTwvVGV4dD5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtpc0VkaXQgPyAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU2F2ZX0+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPk9yZGVyIHN0YXR1czwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXR1c09wdGlvbnMuZmluZCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUgPT09IHBhcmFtcy5zdGF0dXMpfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17c3RhdHVzT3B0aW9uc31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2VsZWN0ZWQpID0+IGhhbmRsZUNoYW5nZSgnc3RhdHVzJywgc2VsZWN0ZWQ/LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPlBheW1lbnQgc3RhdHVzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGF5bWVudE9wdGlvbnMuZmluZCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUgPT09IHBhcmFtcy5wYXltZW50U3RhdHVzKX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e3BheW1lbnRPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhzZWxlY3RlZCkgPT4gaGFuZGxlQ2hhbmdlKCdwYXltZW50U3RhdHVzJywgc2VsZWN0ZWQ/LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNhdmluZ30+XG4gICAgICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmcuLi4nIDogJ1VwZGF0ZSBvcmRlcid9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5PcmRlciBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHRleHRUcmFuc2Zvcm09XCJjYXBpdGFsaXplXCI+e3BhcmFtcy5zdGF0dXN9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+UGF5bWVudCBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHRleHRUcmFuc2Zvcm09XCJjYXBpdGFsaXplXCI+e3BhcmFtcy5wYXltZW50U3RhdHVzfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cImxnXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5EZWxpdmVyeSBhZGRyZXNzPC9INT5cbiAgICAgICAgICB7cGFyYW1zLmFkZHJlc3NGb3JtYXR0ZWQgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5BZGRyZXNzIHR5cGU8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuYWRkcmVzc0xhYmVsIHx8ICdEZWxpdmVyeSd9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+RGVsaXZlciB0bzwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lck5hbWV9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+UGhvbmU8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJQaG9uZSB8fCAn4oCUJ308L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgIDxMYWJlbD5GdWxsIGFkZHJlc3M8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGxpbmVIZWlnaHQ6IDEuNyB9fT57cGFyYW1zLmFkZHJlc3NGb3JtYXR0ZWR9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIGRlbGl2ZXJ5IGFkZHJlc3Mgc2F2ZWQgZm9yIHRoaXMgb3JkZXIuPC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQm94PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwibGdcIj5cbiAgICAgICAgPEg1IG1iPVwibGdcIj5PcmRlciBpdGVtczwvSDU+XG4gICAgICAgIHtpdGVtcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5ObyBpdGVtcyBmb3VuZCBmb3IgdGhpcyBvcmRlci48L1RleHQ+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEJveCBhcz1cInRhYmxlXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbXMtdGFibGVcIj5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5JdGVtPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+Q29zdDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlF0eTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRvdGFsPC90aD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBzdHlsZT17eyBnYXA6IDEyIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmltYWdlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2l0ZW0uaW1hZ2V9IGFsdD17aXRlbS5uYW1lfSBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pdGVtLWltYWdlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIj57aXRlbS5uYW1lfTwvVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLndlaWdodCA/IDxUZXh0IGZvbnRTaXplPVwic21cIiBvcGFjaXR5PXswLjd9PntpdGVtLndlaWdodH08L1RleHQ+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShpdGVtLnByaWNlVmFsdWUpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ucXVhbnRpdHl9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkoaXRlbS5saW5lVG90YWwpfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPHRmb290PlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9Pkl0ZW1zIHN1YnRvdGFsPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5pdGVtc1RvdGFsKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkRlbGl2ZXJ5IGNoYXJnZXM8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLmRlbGl2ZXJ5Q2hhcmdlKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkNhcnQgaGFuZGxpbmc8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLmhhbmRsaW5nQ2hhcmdlKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PlNtYWxsIGNhcnQgY2hhcmdlPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5zbWFsbENhcnRDaGFyZ2UpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLmRpc2NvdW50KSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkRpc2NvdW50PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4te2Zvcm1hdE1vbmV5KHBhcmFtcy5kaXNjb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImlzLXRvdGFsXCI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9Pk9yZGVyIHRvdGFsPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5ncmFuZFRvdGFsKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE9yZGVyRGV0YWlsXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSW5wdXQsIExhYmVsLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IEV5ZUljb24gPSAoeyBoaWRkZW4gfSkgPT5cbiAgaGlkZGVuID8gKFxuICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHBhdGggZD1cIk0zIDNsMTggMThcIiAvPlxuICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgPHBhdGggZD1cIk02LjYgNi42QzQuMyA4IDIuNyAxMC4yIDIgMTJjMSAzLjUgNSA4IDEwIDggMS41IDAgMi45LS40IDQuMS0xXCIgLz5cbiAgICA8L3N2Zz5cbiAgKSA6IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAvPlxuICAgIDwvc3ZnPlxuICApXG5cbmZ1bmN0aW9uIFBhc3N3b3JkRmllbGQoeyBpZCwgbGFiZWwsIHZhbHVlLCBvbkNoYW5nZSwgdmlzaWJsZSwgb25Ub2dnbGUgfSkge1xuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgPExhYmVsIGh0bWxGb3I9e2lkfSByZXF1aXJlZD57bGFiZWx9PC9MYWJlbD5cbiAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgdHlwZT17dmlzaWJsZSA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgYXV0b0NvbXBsZXRlPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPXt2aXNpYmxlID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzA0Nzg1NycsXG4gICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAyNixcbiAgICAgICAgICAgIGhlaWdodDogMjYsXG4gICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RXllSWNvbiBoaWRkZW49e3Zpc2libGV9IC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBbcGFzc3dvcmQsIHNldFBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbY29uZmlybVBhc3N3b3JkLCBzZXRDb25maXJtUGFzc3dvcmRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dDb25maXJtLCBzZXRTaG93Q29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKVxuICB9XG5cbiAgY29uc3Qgc2F2ZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBzZXRFcnJvcignJylcbiAgICBpZiAoIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA8IDYpIHtcbiAgICAgIHNldEVycm9yKCdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycy4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkKSB7XG4gICAgICBzZXRFcnJvcignTmV3IHBhc3N3b3JkIGFuZCBjb25maXJtIHBhc3N3b3JkIG11c3QgYmUgdGhlIHNhbWUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFNhdmluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZTogJ2NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IHsgcGFzc3dvcmQsIGNvbmZpcm1QYXNzd29yZCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlLmRhdGE/Lm5vdGljZVxuICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICBzZXRFcnJvcihub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobm90aWNlKSBhZGROb3RpY2Uobm90aWNlKVxuICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSByZXNwb25zZS5kYXRhPy5yZWRpcmVjdFVybFxuICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3RVcmxcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjbG9zZSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIGluc2V0OiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyLCAxMiwgOCwgMC42MiknLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIHpJbmRleDogODAsXG4gICAgICAgIHBhZGRpbmc6IDE2LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGFzPVwiZm9ybVwiXG4gICAgICAgIG9uU3VibWl0PXtzYXZlfVxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0MjBweCddfVxuICAgICAgICBwPVwieGxcIlxuICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6IDE2LCBib3hTaGFkb3c6ICcwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4yOCknIH19XG4gICAgICA+XG4gICAgICAgIDxIMyBtYj1cInNtXCI+Q2hhbmdlIHBhc3N3b3JkPC9IMz5cbiAgICAgICAgPFRleHQgbWI9XCJ4bFwiIGNvbG9yPVwiIzY0NzQ4YlwiPlxuICAgICAgICAgIFNldCBhIG5ldyBwYXNzd29yZCBmb3Ige3JlY29yZD8ucGFyYW1zPy5uYW1lIHx8IHJlY29yZD8ucGFyYW1zPy5lbWFpbCB8fCAndGhpcyB1c2VyJ30uXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIk5ldyBwYXNzd29yZFwiXG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRQYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93UGFzc3dvcmR9XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgIC8+XG4gICAgICAgIDxQYXNzd29yZEZpZWxkXG4gICAgICAgICAgaWQ9XCJjb25maXJtLXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIkNvbmZpcm0gcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtjb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldENvbmZpcm1QYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93Q29uZmlybX1cbiAgICAgICAgICBvblRvZ2dsZT17KCkgPT4gc2V0U2hvd0NvbmZpcm0oKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuXG4gICAgICAgIHtlcnJvciA/IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgY29sb3I9XCIjZGMyNjI2XCI+e2Vycm9yfTwvVGV4dD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIiBzdHlsZT17eyBnYXA6IDEwIH19PlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cImJ1dHRvblwiIHZhcmlhbnQ9XCJ0ZXh0XCIgb25DbGljaz17Y2xvc2V9IGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmfigKYnIDogJ1NhdmUgcGFzc3dvcmQnfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVBhc3N3b3JkXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIEZvcm1Hcm91cCxcbiAgSDIsXG4gIElucHV0LFxuICBMYWJlbCxcbiAgTWVzc2FnZUJveCxcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgUkVNRU1CRVJFRF9MT0dJTl9LRVkgPSAndG9rcmlfYWRtaW5fbG9naW4nXG5cbmNvbnN0IExvZ2luID0gKCkgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgZXJyb3JNZXNzYWdlIH0gPSB3aW5kb3cuX19BUFBfU1RBVEVfXyB8fCB7fVxuICBjb25zdCB7IHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgYWRtaW5Sb290ID0gYWN0aW9uPy5yZXBsYWNlKC9cXC9sb2dpbiQvLCAnJykgfHwgJydcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRVcmwgPSBgJHthZG1pblJvb3R9L2ZvcmdvdC1wYXNzd29yZGBcbiAgY29uc3QgW2lkZW50aWZpZXIsIHNldElkZW50aWZpZXJdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtyZW1lbWJlckxvZ2luLCBzZXRSZW1lbWJlckxvZ2luXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZW1lbWJlcmVkTG9naW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgaWYgKHJlbWVtYmVyZWRMb2dpbikge1xuICAgICAgc2V0SWRlbnRpZmllcihyZW1lbWJlcmVkTG9naW4pXG4gICAgICBzZXRSZW1lbWJlckxvZ2luKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBmb3JtLmVsZW1lbnRzLm5hbWVkSXRlbSgnZW1haWwnKVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCA/IFN0cmluZyhlbWFpbElucHV0LnZhbHVlKSA6IGlkZW50aWZpZXIpLnRyaW0oKVxuXG4gICAgaWYgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0KSB7XG4gICAgICBlbWFpbElucHV0LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAocmVtZW1iZXJMb2dpbiAmJiB2YWx1ZSkge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgZmxleFxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBtaW5IZWlnaHQ9XCIxMDB2aFwiXG4gICAgICBiZz1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwMjJjMjIsICMwNDc4NTcpXCJcbiAgICAgIHA9XCJ4bFwiXG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0NDBweCddfVxuICAgICAgICBib3JkZXJSYWRpdXM9XCIxOHB4XCJcbiAgICAgICAgYm94U2hhZG93PVwiMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMzUpXCJcbiAgICAgICAgcD1cIngzXCJcbiAgICAgID5cbiAgICAgICAgPEgyIGNvbG9yPVwiIzAyMmMyMlwiIG1iPVwic21cIj5Ub2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwiIzY0NzQ4YlwiIG1iPVwieGxcIj5cbiAgICAgICAgICBTaWduIGluIHdpdGggeW91ciBhZG1pbiBlbWFpbCBvciB1c2VybmFtZSB0byBtYW5hZ2UgcHJvZHVjdHMsIG9yZGVycywgYW5kIGNvbnRlbnQuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZXJyb3JNZXNzYWdlID8gKFxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICBtYj1cImxnXCJcbiAgICAgICAgICAgIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSl9XG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGFzPVwiZm9ybVwiIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5FbWFpbCBvciB1c2VybmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpZGVudGlmaWVyfVxuICAgICAgICAgICAgICBrZXk9e2lkZW50aWZpZXIgfHwgJ2xvZ2luLWVtYWlsJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPlBhc3N3b3JkPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPXtzaG93UGFzc3dvcmQgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17c2hvd1Bhc3N3b3JkID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgaWQ9XCJyZW1lbWJlci1sb2dpblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e3JlbWVtYmVyTG9naW59XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFJlbWVtYmVyTG9naW4oZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5SaWdodDogOCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtZW1iZXItbG9naW5cIiBzdHlsZT17eyBjb2xvcjogJyM0NzU1NjknLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgIFJlbWVtYmVyIG15IGVtYWlsIG9yIHVzZXJuYW1lIG9uIHRoaXMgZGV2aWNlXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIHdpZHRoPVwiMTAwJVwiIG10PVwibGdcIj5cbiAgICAgICAgICAgIFNpZ24gaW5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxhIGhyZWY9e2ZvcmdvdFBhc3N3b3JkVXJsfSBzdHlsZT17eyBjb2xvcjogJyMwNDc4NTcnLCBmb250V2VpZ2h0OiA3MDAgfX0+XG4gICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpblxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uR3JvdXAsIE1lc3NhZ2VCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlRmlsdGVyRHJhd2VyLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnXG5cbmZ1bmN0aW9uIGFkbWluUm9vdFBhdGgoKSB7XG4gIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9eKC4qKVxcL3Jlc291cmNlc1xcLy8pXG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKSB7XG4gIGlmIChyZXNvdXJjZUlkID09PSAnQ2F0ZWdvcnknKSB7XG4gICAgcmV0dXJuIHsgZXhwb3J0VXJsOiAnY2F0ZWdvcmllcy9leHBvcnQnLCBpbXBvcnRVcmw6ICdjYXRlZ29yaWVzL2ltcG9ydCcgfVxuICB9XG4gIGlmIChyZXNvdXJjZUlkID09PSAnUHJvZHVjdCcpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdwcm9kdWN0cy9leHBvcnQnLCBpbXBvcnRVcmw6ICdwcm9kdWN0cy9pbXBvcnQnIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMoeyByZXNvdXJjZSwgb25JbXBvcnRlZCB9KSB7XG4gIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uLCB0cmFuc2xhdGVBY3Rpb24gfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyB0b2dnbGVGaWx0ZXIsIGZpbHRlcnNDb3VudCB9ID0gdXNlRmlsdGVyRHJhd2VyKClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcblxuICBjb25zdCByZXNvdXJjZUlkID0gcmVzb3VyY2UuaWRcbiAgY29uc3QgY29uZmlnID0gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKVxuICBjb25zdCByb290ID0gYWRtaW5Sb290UGF0aCgpXG5cbiAgY29uc3QgaGFuZGxlSW1wb3J0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICBpZiAoIWZpbGUgfHwgIWNvbmZpZykgcmV0dXJuXG5cbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgc2V0TWVzc2FnZShudWxsKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5pbXBvcnRVcmx9YCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JDb3VudCA9IGRhdGEuZXJyb3JzPy5sZW5ndGggfHwgMFxuICAgICAgc2V0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IGVycm9yQ291bnQgPyAnaW5mbycgOiAnc3VjY2VzcycsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgZXJyb3JDb3VudCA+IDBcbiAgICAgICAgICAgID8gYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC4gJHtlcnJvckNvdW50fSByb3cocykgY291bGQgbm90IGJlIGltcG9ydGVkLmBcbiAgICAgICAgICAgIDogYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC5gLFxuICAgICAgfSlcbiAgICAgIG9uSW1wb3J0ZWQ/LigpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnZGFuZ2VyJywgdGV4dDogZXJyb3IubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnV0dG9ucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY29uZmlnKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0V4cG9ydCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5leHBvcnRVcmx9YCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBsb2FkaW5nID8gJ0ltcG9ydGluZy4uLicgOiAnSW1wb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBvbkNsaWNrOiBsb2FkaW5nID8gdW5kZWZpbmVkIDogKCkgPT4gZmlsZVJlZi5jdXJyZW50Py5jbGljaygpLFxuICAgICAgfSxcbiAgICBdXG5cbiAgICBjb25zdCBuZXdBY3Rpb24gPSByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnM/LmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uLm5hbWUgPT09ICduZXcnKVxuICAgIGlmIChuZXdBY3Rpb24pIHtcbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICBpY29uOiBuZXdBY3Rpb24uaWNvbixcbiAgICAgICAgbGFiZWw6IHRyYW5zbGF0ZUFjdGlvbihuZXdBY3Rpb24ubGFiZWwsIHJlc291cmNlSWQpLFxuICAgICAgICB2YXJpYW50OiBuZXdBY3Rpb24udmFyaWFudCxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vcmVzb3VyY2VzLyR7cmVzb3VyY2VJZH0vYWN0aW9ucy9uZXdgLFxuICAgICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1uZXctYnV0dG9uYCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyS2V5ID0gZmlsdGVyc0NvdW50ID4gMCA/ICdmaWx0ZXJBY3RpdmUnIDogJ2ZpbHRlcidcbiAgICBpdGVtcy5wdXNoKHtcbiAgICAgIGxhYmVsOiB0cmFuc2xhdGVCdXR0b24oZmlsdGVyS2V5LCByZXNvdXJjZUlkLCB7IGNvdW50OiBmaWx0ZXJzQ291bnQgfSksXG4gICAgICBvbkNsaWNrOiB0b2dnbGVGaWx0ZXIsXG4gICAgICBpY29uOiAnRmlsdGVyJyxcbiAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LWZpbHRlci1idXR0b25gLFxuICAgIH0pXG5cbiAgICByZXR1cm4gaXRlbXNcbiAgfSwgW1xuICAgIGNvbmZpZyxcbiAgICByb290LFxuICAgIGxvYWRpbmcsXG4gICAgcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zLFxuICAgIHJlc291cmNlSWQsXG4gICAgdHJhbnNsYXRlQWN0aW9uLFxuICAgIHRyYW5zbGF0ZUJ1dHRvbixcbiAgICBmaWx0ZXJzQ291bnQsXG4gICAgdG9nZ2xlRmlsdGVyLFxuICBdKVxuXG4gIGlmICghY29uZmlnKSByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxCb3hcbiAgICAgICAgbXQ9XCJ4bFwiXG4gICAgICAgIG1iPVwiZGVmYXVsdFwiXG4gICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJmbGV4LWVuZFwiXG4gICAgICAgIGZsZXhTaHJpbms9ezB9XG4gICAgICAgIHB4PXtbJ2RlZmF1bHQnLCAwXX1cbiAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiAnLTUycHgnIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25Hcm91cCBidXR0b25zPXtidXR0b25zfSAvPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIGFjY2VwdD1cIi5jc3YsdGV4dC9jc3ZcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVJbXBvcnR9XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiIHB4PXtbJ2RlZmF1bHQnLCAwXX0+XG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIHZhcmlhbnQ9e21lc3NhZ2UudHlwZX1cbiAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2UudGV4dH1cbiAgICAgICAgICAgIG9uQ2xvc2VDbGljaz17KCkgPT4gc2V0TWVzc2FnZShudWxsKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC8+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBPcmlnaW5hbEFjdGlvbkhlYWRlciB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIGZyb20gJy4vY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCdcblxuY29uc3QgQ0FUQUxPR19SRVNPVVJDRVMgPSBuZXcgU2V0KFsnUHJvZHVjdCcsICdDYXRlZ29yeSddKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBY3Rpb25IZWFkZXIocHJvcHMpIHtcbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudCwgYWN0aW9uLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgQmFzZUhlYWRlciA9IE9yaWdpbmFsQ29tcG9uZW50IHx8IE9yaWdpbmFsQWN0aW9uSGVhZGVyXG4gIGNvbnN0IGlzQ2F0YWxvZ0xpc3QgPSBhY3Rpb24/Lm5hbWUgPT09ICdsaXN0JyAmJiBDQVRBTE9HX1JFU09VUkNFUy5oYXMocmVzb3VyY2U/LmlkKVxuXG4gIGlmICghaXNDYXRhbG9nTGlzdCkge1xuICAgIHJldHVybiA8QmFzZUhlYWRlciB7Li4ucHJvcHN9IC8+XG4gIH1cblxuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50OiBfaWdub3JlZCwgLi4uaGVhZGVyUHJvcHMgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAgPEJhc2VIZWFkZXIgey4uLmhlYWRlclByb3BzfSBvbWl0QWN0aW9ucyAvPlxuICAgICAgPENhdGFsb2dMaXN0SGVhZGVyQWN0aW9uc1xuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIG9uSW1wb3J0ZWQ9e3Byb3BzLmFjdGlvblBlcmZvcm1lZH1cbiAgICAgIC8+XG4gICAgPC9Cb3g+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBtZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSwgTGFiZWwsIFRpbnlNQ0UgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsdWdpbnM6IFtcbiAgICAnY29kZScsXG4gICAgJ2xpbmsnLFxuICAgICdsaXN0cycsXG4gICAgJ2ltYWdlJyxcbiAgICAndGFibGUnLFxuICAgICdhdXRvbGluaycsXG4gICAgJ3ByZXZpZXcnLFxuICAgICdzZWFyY2hyZXBsYWNlJyxcbiAgICAnd29yZGNvdW50JyxcbiAgICAnbWVkaWEnLFxuICAgICdjb2Rlc2FtcGxlJyxcbiAgXSxcbiAgdG9vbGJhcjpcbiAgICAndW5kbyByZWRvIHwgYmxvY2tzIHwgYm9sZCBpdGFsaWMgdW5kZXJsaW5lIHN0cmlrZXRocm91Z2ggfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCBhbGlnbmp1c3RpZnkgfCBidWxsaXN0IG51bWxpc3Qgb3V0ZGVudCBpbmRlbnQgfCBsaW5rIGltYWdlIHRhYmxlIGNvZGVzYW1wbGUgfCBjb2RlIHwgcmVtb3ZlZm9ybWF0JyxcbiAgaGVpZ2h0OiA0MDAsXG59XG5cbmNvbnN0IFJpY2h0ZXh0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCB2YWx1ZSA9IHJlY29yZC5wYXJhbXM/Lltwcm9wZXJ0eS5wYXRoXSA/PyAnJ1xuICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgb25DaGFuZ2UocHJvcGVydHkucGF0aCwgbmV3VmFsdWUpXG4gICAgfSxcbiAgICBbb25DaGFuZ2UsIHByb3BlcnR5LnBhdGhdLFxuICApXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5ERUZBVUxUX09QVElPTlMsXG4gICAgLi4uKHByb3BlcnR5LnByb3BzIHx8IHt9KSxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cCBlcnJvcj17Qm9vbGVhbihlcnJvcil9PlxuICAgICAgPExhYmVsIHJlcXVpcmVkPXtwcm9wZXJ0eS5pc1JlcXVpcmVkfT57cHJvcGVydHkubGFiZWx9PC9MYWJlbD5cbiAgICAgIDxUaW55TUNFIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e2hhbmRsZVVwZGF0ZX0gb3B0aW9ucz17b3B0aW9uc30gLz5cbiAgICAgIDxGb3JtTWVzc2FnZT57ZXJyb3I/Lm1lc3NhZ2V9PC9Gb3JtTWVzc2FnZT5cbiAgICA8L0Zvcm1Hcm91cD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFJpY2h0ZXh0RWRpdClcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Byb2R1Y3QtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEVkaXQgPSBQcm9kdWN0RWRpdFxuaW1wb3J0IENhdGVnb3J5RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jYXRlZ29yeS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeUVkaXQgPSBDYXRlZ29yeUVkaXRcbmltcG9ydCBDbXNMaXN0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Ntcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DbXNMaXN0ID0gQ21zTGlzdFxuaW1wb3J0IFJldmlld0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJldmlld0VkaXQgPSBSZXZpZXdFZGl0XG5pbXBvcnQgU2V0dGluZ3NFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNldHRpbmdzRWRpdCA9IFNldHRpbmdzRWRpdFxuaW1wb3J0IE9yZGVyRGV0YWlsIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJEZXRhaWwgPSBPcmRlckRldGFpbFxuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NoYW5nZS1wYXNzd29yZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2hhbmdlUGFzc3dvcmQgPSBDaGFuZ2VQYXNzd29yZFxuaW1wb3J0IExvZ2luIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgQWN0aW9uSGVhZGVyIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkFjdGlvbkhlYWRlciA9IEFjdGlvbkhlYWRlclxuaW1wb3J0IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yaWNodGV4dC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgPSBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibmFtZXMiOlsiYXBpIiwiQXBpQ2xpZW50Iiwic3RhdENhcmRzIiwia2V5IiwibGFiZWwiLCJpY29uIiwicmVzb3VyY2UiLCJhZG1pblJvb3QiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic3BsaXQiLCJEYXNoYm9hcmQiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZ2V0RGFzaGJvYXJkIiwidGhlbiIsInJlcyIsImNhdGNoIiwic3RhdHMiLCJyb290IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94IiwidmFyaWFudCIsImNsYXNzTmFtZSIsInAiLCJtYiIsIkgyIiwiVGV4dCIsIm9wYWNpdHkiLCJkaXNwbGF5IiwibWFwIiwiY2FyZCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsIkg1IiwiSWNvbiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsIkJ1dHRvbiIsIm10Iiwic2l6ZSIsImFzIiwiaHJlZiIsImZsZXhXcmFwIiwicmVjZW50T3JkZXJzIiwibGVuZ3RoIiwib3JkZXIiLCJvcmRlck5vIiwic3RhdHVzIiwiZ3JhbmRUb3RhbCIsIm5vcm1hbGl6ZVNsdWdJbnB1dCIsInZhbHVlIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJ0cmltIiwicmVwbGFjZSIsIndpdGhvdXRUcmFpbGluZ1NsYXNoIiwiUHJvZHVjdEVkaXQiLCJwcm9wcyIsInJlY29yZCIsImluaXRpYWxSZWNvcmQiLCJoYW5kbGVDaGFuZ2UiLCJzdWJtaXQiLCJoYW5kbGVTdWJtaXQiLCJsb2FkaW5nIiwidXNlUmVjb3JkIiwiaWQiLCJhZGROb3RpY2UiLCJ1c2VOb3RpY2UiLCJmaWxlUmVmIiwidXNlUmVmIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwic2x1Z0VkaXRlZCIsInNldFNsdWdFZGl0ZWQiLCJCb29sZWFuIiwicGFyYW1zIiwic2x1ZyIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwiZGVzY3JpcHRpb25Nb2RlIiwic2V0RGVzY3JpcHRpb25Nb2RlIiwiZGVzY3JpcHRpb25WYWx1ZSIsInNldERlc2NyaXB0aW9uVmFsdWUiLCJjdXN0b20iLCJvcHRpb25zIiwiYXBpQmFzZVVybCIsInByb2R1Y3RVcmxCYXNlIiwib3JpZ2luIiwic2x1Z0lucHV0IiwicHJldmlld1NsdWciLCJuYW1lIiwicHJvZHVjdFVybCIsImltYWdlVXJsIiwidXNlTWVtbyIsImltYWdlIiwidGVzdCIsImFwcFVybCIsImRpc3BsYXllZEltYWdlVXJsIiwic3RhcnRzV2l0aCIsIlVSTCIsInJldm9rZU9iamVjdFVSTCIsImRlc2NyaXB0aW9uIiwib25Qcm9wZXJ0eUNoYW5nZSIsInByb3BlcnR5UGF0aCIsInJlc3QiLCJ1cGxvYWRJbWFnZSIsImV2ZW50IiwiZmlsZSIsInRhcmdldCIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImxvY2FsUHJldmlld1VybCIsImNyZWF0ZU9iamVjdFVSTCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5Iiwib2siLCJlcnJvciIsImpzb24iLCJFcnJvciIsIm1lc3NhZ2UiLCJtZWRpYSIsInBhdGgiLCJ0eXBlIiwiY3VycmVudCIsInByZXZlbnREZWZhdWx0IiwicHJvcGVydHlCeVBhdGgiLCJPYmplY3QiLCJmcm9tRW50cmllcyIsImVkaXRQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJyZW5kZXJQcm9wZXJ0eSIsIkJhc2VQcm9wZXJ0eUNvbXBvbmVudCIsIndoZXJlIiwib25DaGFuZ2UiLCJyZW1haW5pbmdQcm9wZXJ0aWVzIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJvblN1Ym1pdCIsIkg0IiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwiYmciLCJMYWJlbCIsImdhcCIsInBsYWNlaG9sZGVyIiwic3R5bGUiLCJtaW5XaWR0aCIsImZsZXgiLCJwYWRkaW5nIiwicmVsIiwib25DbGljayIsImJhY2tncm91bmQiLCJjb2xvciIsImN1cnNvciIsIm1pbkhlaWdodCIsInJvd3MiLCJ3aWR0aCIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJzcmMiLCJhbHQiLCJoZWlnaHQiLCJvYmplY3RGaXQiLCJyZWYiLCJhY2NlcHQiLCJkaXNhYmxlZCIsInNwaW4iLCJDYXRlZ29yeUVkaXQiLCJiYW5uZXJGaWxlUmVmIiwiYmFubmVyVXBsb2FkaW5nIiwic2V0QmFubmVyVXBsb2FkaW5nIiwiYmFubmVyUHJldmlld1VybCIsInNldEJhbm5lclByZXZpZXdVcmwiLCJjYXRlZ29yeVVybEJhc2UiLCJjYXRlZ29yeVVybCIsImJhbm5lckltYWdlVXJsIiwiYmFubmVySW1hZ2UiLCJkaXNwbGF5ZWRCYW5uZXJVcmwiLCJ1cGxvYWRCYW5uZXIiLCJtYXhXaWR0aCIsIkNtc0xpc3QiLCJzZXRUYWciLCJ0aXRsZVByb3AiLCJ0aXRsZVByb3BlcnR5Iiwic3RvcmVQYXJhbXMiLCJmaWx0ZXJzIiwidXNlUXVlcnlQYXJhbXMiLCJyZWNvcmRzIiwiZGlyZWN0aW9uIiwic29ydEJ5IiwicGFnZSIsInRvdGFsIiwiZmV0Y2hEYXRhIiwicGVyUGFnZSIsInVzZVJlY29yZHMiLCJzZWxlY3RlZFJlY29yZHMiLCJoYW5kbGVTZWxlY3QiLCJoYW5kbGVTZWxlY3RBbGwiLCJzZXRTZWxlY3RlZFJlY29yZHMiLCJ1c2VTZWxlY3RlZFJlY29yZHMiLCJxdWVyeSIsInNldFF1ZXJ5IiwiZGVib3VuY2VSZWYiLCJzdG9yZVBhcmFtc1JlZiIsInRvU3RyaW5nIiwiaGFuZGxlUXVlcnlDaGFuZ2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidHJpbW1lZCIsImhhbmRsZUFjdGlvblBlcmZvcm1lZCIsImhhbmRsZVBhZ2luYXRpb25DaGFuZ2UiLCJwYWdlTnVtYmVyIiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwidHJhbnNmb3JtIiwicG9pbnRlckV2ZW50cyIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwidGV4dEFsaWduIiwiUGFnaW5hdGlvbiIsIlJldmlld0VkaXQiLCJUQUJTIiwiZmllbGRzIiwiU2V0dGluZ3NFZGl0IiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwiaGFzaCIsInNvbWUiLCJ0YWIiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwibm90aWNlIiwiZmxleERpcmVjdGlvbiIsIkRyYXdlckNvbnRlbnQiLCJwcm9wZXJ0aWVzIiwiRHJhd2VyRm9vdGVyIiwiZm9ybWF0TW9uZXkiLCJhbW91bnQiLCJOdW1iZXIiLCJpc05hTiIsInRvTG9jYWxlU3RyaW5nIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0RGF0ZVRpbWUiLCJEYXRlIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwicmVzb2x2ZUltYWdlIiwiT3JkZXJEZXRhaWwiLCJhY3Rpb24iLCJpc0VkaXQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJpdGVtcyIsInBhcnNlZCIsIkpTT04iLCJwYXJzZSIsIml0ZW1zSnNvbiIsIml0ZW0iLCJoYW5kbGVTYXZlIiwic3RhdHVzT3B0aW9ucyIsInBheW1lbnRPcHRpb25zIiwicGF5bWVudE1ldGhvZCIsInJhem9ycGF5UGF5bWVudElkIiwiY3JlYXRlZEF0IiwiY3VzdG9tZXJOYW1lIiwiY3VzdG9tZXJQaG9uZSIsImN1c3RvbWVyRW1haWwiLCJTZWxlY3QiLCJmaW5kIiwib3B0aW9uIiwic2VsZWN0ZWQiLCJwYXltZW50U3RhdHVzIiwiRnJhZ21lbnQiLCJ0ZXh0VHJhbnNmb3JtIiwiYWRkcmVzc0Zvcm1hdHRlZCIsImFkZHJlc3NMYWJlbCIsIndlaWdodCIsInByaWNlVmFsdWUiLCJxdWFudGl0eSIsImxpbmVUb3RhbCIsImNvbFNwYW4iLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlDaGFyZ2UiLCJoYW5kbGluZ0NoYXJnZSIsInNtYWxsQ2FydENoYXJnZSIsImRpc2NvdW50IiwiRXllSWNvbiIsImhpZGRlbiIsInZpZXdCb3giLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJkIiwiY3giLCJjeSIsInIiLCJQYXNzd29yZEZpZWxkIiwidmlzaWJsZSIsIm9uVG9nZ2xlIiwiaHRtbEZvciIsInJlcXVpcmVkIiwiYXV0b0NvbXBsZXRlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJDaGFuZ2VQYXNzd29yZCIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJjb25maXJtUGFzc3dvcmQiLCJzZXRDb25maXJtUGFzc3dvcmQiLCJzaG93UGFzc3dvcmQiLCJzZXRTaG93UGFzc3dvcmQiLCJzaG93Q29uZmlybSIsInNldFNob3dDb25maXJtIiwic2V0RXJyb3IiLCJjbG9zZSIsImJhY2siLCJzYXZlIiwicmVjb3JkQWN0aW9uIiwicmVzb3VyY2VJZCIsInJlY29yZElkIiwiYWN0aW9uTmFtZSIsInJlZGlyZWN0VXJsIiwiZXJyIiwiaW5zZXQiLCJ6SW5kZXgiLCJib3hTaGFkb3ciLCJIMyIsImVtYWlsIiwiUkVNRU1CRVJFRF9MT0dJTl9LRVkiLCJMb2dpbiIsImVycm9yTWVzc2FnZSIsIl9fQVBQX1NUQVRFX18iLCJ0cmFuc2xhdGVNZXNzYWdlIiwidXNlVHJhbnNsYXRpb24iLCJmb3Jnb3RQYXNzd29yZFVybCIsImlkZW50aWZpZXIiLCJzZXRJZGVudGlmaWVyIiwicmVtZW1iZXJMb2dpbiIsInNldFJlbWVtYmVyTG9naW4iLCJyZW1lbWJlcmVkTG9naW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZm9ybSIsImN1cnJlbnRUYXJnZXQiLCJlbWFpbElucHV0IiwiZWxlbWVudHMiLCJuYW1lZEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsIk1lc3NhZ2VCb3giLCJGb3JtR3JvdXAiLCJkZWZhdWx0VmFsdWUiLCJjaGVja2VkIiwibWFyZ2luUmlnaHQiLCJhZG1pblJvb3RQYXRoIiwibWF0Y2giLCJjYXRhbG9nQ29uZmlnIiwiZXhwb3J0VXJsIiwiaW1wb3J0VXJsIiwiQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIiwib25JbXBvcnRlZCIsInRyYW5zbGF0ZUJ1dHRvbiIsInRyYW5zbGF0ZUFjdGlvbiIsInRvZ2dsZUZpbHRlciIsImZpbHRlcnNDb3VudCIsInVzZUZpbHRlckRyYXdlciIsInNldExvYWRpbmciLCJzZXRNZXNzYWdlIiwiY29uZmlnIiwiaGFuZGxlSW1wb3J0IiwiY3JlZGVudGlhbHMiLCJlcnJvckNvdW50IiwiZXJyb3JzIiwidGV4dCIsImNyZWF0ZWQiLCJ1cGRhdGVkIiwiYnV0dG9ucyIsInVuZGVmaW5lZCIsImNsaWNrIiwibmV3QWN0aW9uIiwicmVzb3VyY2VBY3Rpb25zIiwicHVzaCIsImZpbHRlcktleSIsImNvdW50IiwiZmxleFNocmluayIsInB4IiwibWFyZ2luVG9wIiwiQnV0dG9uR3JvdXAiLCJvbkNsb3NlQ2xpY2siLCJDQVRBTE9HX1JFU09VUkNFUyIsIlNldCIsIkFjdGlvbkhlYWRlciIsIk9yaWdpbmFsQ29tcG9uZW50IiwiQmFzZUhlYWRlciIsIk9yaWdpbmFsQWN0aW9uSGVhZGVyIiwiaXNDYXRhbG9nTGlzdCIsImhhcyIsIl9pZ25vcmVkIiwiaGVhZGVyUHJvcHMiLCJfZXh0ZW5kcyIsIm9taXRBY3Rpb25zIiwiREVGQVVMVF9PUFRJT05TIiwicGx1Z2lucyIsInRvb2xiYXIiLCJSaWNodGV4dEVkaXQiLCJoYW5kbGVVcGRhdGUiLCJ1c2VDYWxsYmFjayIsIm5ld1ZhbHVlIiwiaXNSZXF1aXJlZCIsIlRpbnlNQ0UiLCJGb3JtTWVzc2FnZSIsIm1lbW8iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFJQSxNQUFNQSxLQUFH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
