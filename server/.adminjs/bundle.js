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
    icon: 'Receipt',
    resource: 'Order'
  }, {
    key: 'pageCount',
    label: 'Pages',
    icon: 'Document',
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

  const slugify$1 = value => {
    const slug = String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug || 'product';
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
    const currentSlug = slugify$1(params.slug || params.name);
    const productUrl = `${productUrlBase}/${currentSlug}`;
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
        handleChange(propertyPath, slugify$1(value), ...rest);
        return;
      }
      handleChange(propertyPath, value, ...rest);
      if (propertyPath === 'name' && !slugEdited) {
        handleChange('slug', slugify$1(value));
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
      value: currentSlug,
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
    }, "Preview:", ' ', /*#__PURE__*/React__default.default.createElement("a", {
      href: productUrl,
      target: "_blank",
      rel: "noreferrer"
    }, productUrl)), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "If this slug already exists, the saved URL will receive a number suffix.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
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

  const slugify = value => {
    const slug = String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug || 'category';
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
    const currentSlug = slugify(params.slug || params.label);
    const categoryUrl = `${categoryUrlBase}/${currentSlug}`;
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
        handleChange(propertyPath, slugify(value), ...rest);
        return;
      }
      handleChange(propertyPath, value, ...rest);
      if (propertyPath === 'label' && !slugEdited) {
        handleChange('slug', slugify(value));
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
      value: currentSlug,
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
    }, "Preview:", ' ', /*#__PURE__*/React__default.default.createElement("a", {
      href: categoryUrl,
      target: "_blank",
      rel: "noreferrer"
    }, categoryUrl)), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "If this slug already exists, the saved URL will receive a number suffix.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
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
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9sb2dpbi5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yaWNodGV4dC1lZGl0LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgQm94LCBIMiwgSDUsIFRleHQsIEJ1dHRvbiwgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBzdGF0Q2FyZHMgPSBbXG4gIHsga2V5OiAncHJvZHVjdENvdW50JywgbGFiZWw6ICdQcm9kdWN0cycsIGljb246ICdTaG9wcGluZ0NhcnQnLCByZXNvdXJjZTogJ1Byb2R1Y3QnIH0sXG4gIHsga2V5OiAnb3JkZXJDb3VudCcsIGxhYmVsOiAnT3JkZXJzJywgaWNvbjogJ1JlY2VpcHQnLCByZXNvdXJjZTogJ09yZGVyJyB9LFxuICB7IGtleTogJ3BhZ2VDb3VudCcsIGxhYmVsOiAnUGFnZXMnLCBpY29uOiAnRG9jdW1lbnQnLCByZXNvdXJjZTogJ1BhZ2UnIH0sXG4gIHsga2V5OiAncmV2aWV3Q291bnQnLCBsYWJlbDogJ1Jldmlld3MnLCBpY29uOiAnU3RhcicsIHJlc291cmNlOiAnUmV2aWV3JyB9LFxuXVxuXG5jb25zdCBhZG1pblJvb3QgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy9yZXNvdXJjZXMnKVswXSB8fCAnJ1xuXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhcGkuZ2V0RGFzaGJvYXJkKCkudGhlbigocmVzKSA9PiBzZXREYXRhKHJlcy5kYXRhKSkuY2F0Y2goKCkgPT4gc2V0RGF0YSh7fSkpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IHN0YXRzID0gZGF0YSB8fCB7fVxuICBjb25zdCByb290ID0gYWRtaW5Sb290KClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIiBjbGFzc05hbWU9XCJ0b2tyaS1kYXNoYm9hcmRcIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktZGFzaGJvYXJkLWhlcm9cIiBwPVwieHhsXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8SDIgbWI9XCJzbVwiPldlbGNvbWUgdG8gVG9rcmlpaSBDTVM8L0gyPlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjl9PlxuICAgICAgICAgIE1hbmFnZSB5b3VyIHN0b3JlIGNvbnRlbnQsIHByb2R1Y3RzLCBvcmRlcnMsIGFuZCB3ZWJzaXRlIHNldHRpbmdzIGZyb20gb25lIHBsYWNlLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGNsYXNzTmFtZT1cInRva3JpLXN0YXQtZ3JpZFwiIG1iPVwieGxcIj5cbiAgICAgICAge3N0YXRDYXJkcy5tYXAoKGNhcmQpID0+IChcbiAgICAgICAgICA8Qm94IGtleT17Y2FyZC5rZXl9IGNsYXNzTmFtZT1cInRva3JpLXN0YXQtY2FyZFwiIHA9XCJsZ1wiPlxuICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPEg1PntjYXJkLmxhYmVsfTwvSDU+XG4gICAgICAgICAgICAgIDxJY29uIGljb249e2NhcmQuaWNvbn0gLz5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPFRleHQgZm9udFNpemU9ezMyfSBmb250V2VpZ2h0PVwiYm9sZFwiPlxuICAgICAgICAgICAgICB7c3RhdHNbY2FyZC5rZXldID8/ICfigJQnfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBtdD1cImRlZmF1bHRcIlxuICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICAgIGhyZWY9e2AvdG9rcmktYmFja29mZmljZS9yZXNvdXJjZXMvJHtjYXJkLnJlc291cmNlfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFZpZXcgYWxsXG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGNsYXNzTmFtZT1cInRva3JpLWRhc2hib2FyZC1ncmlkXCI+XG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPlF1aWNrIGFjdGlvbnM8L0g1PlxuICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBmbGV4V3JhcD1cIndyYXBcIiBjbGFzc05hbWU9XCJ0b2tyaS1xdWljay1hY3Rpb25zXCI+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9Qcm9kdWN0L2FjdGlvbnMvbmV3YH0gdmFyaWFudD1cImNvbnRhaW5lZFwiPlxuICAgICAgICAgICAgICBBZGQgcHJvZHVjdFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9QYWdlL2FjdGlvbnMvbmV3YH0gdmFyaWFudD1cIm91dGxpbmVkXCI+XG4gICAgICAgICAgICAgIEFkZCBwYWdlXG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1NldHRpbmcvcmVjb3Jkcy8xL2VkaXRgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgU3RvcmUgc2V0dGluZ3NcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgJHtyb290fS9yZXNvdXJjZXMvT3JkZXJgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgVmlldyBvcmRlcnNcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cInhsXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5SZWNlbnQgb3JkZXJzPC9INT5cbiAgICAgICAgICB7KHN0YXRzLnJlY2VudE9yZGVycyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5ObyBvcmRlcnMgeWV0LjwvVGV4dD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPEJveCBhcz1cInRhYmxlXCIgY2xhc3NOYW1lPVwidG9rcmktcmVjZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGg+T3JkZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+VG90YWw8L3RoPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICB7c3RhdHMucmVjZW50T3JkZXJzLm1hcCgob3JkZXIpID0+IChcbiAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e29yZGVyLm9yZGVyTm99PlxuICAgICAgICAgICAgICAgICAgICA8dGQ+e29yZGVyLm9yZGVyTm99PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPntvcmRlci5zdGF0dXN9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPuKCuXtvcmRlci5ncmFuZFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSWNvbiwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHtcbiAgQmFzZVByb3BlcnR5Q29tcG9uZW50LFxuICB1c2VOb3RpY2UsXG4gIHVzZVJlY29yZCxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgc2x1Z2lmeSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBzbHVnID0gU3RyaW5nKHZhbHVlIHx8ICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bJ1wiXS9nLCAnJylcbiAgICAucmVwbGFjZSgvW15hLXowLTldKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG5cbiAgcmV0dXJuIHNsdWcgfHwgJ3Byb2R1Y3QnXG59XG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmNvbnN0IFByb2R1Y3RFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbZGVzY3JpcHRpb25Nb2RlLCBzZXREZXNjcmlwdGlvbk1vZGVdID0gdXNlU3RhdGUoJ3d5c2l3eWcnKVxuICBjb25zdCBbZGVzY3JpcHRpb25WYWx1ZSwgc2V0RGVzY3JpcHRpb25WYWx1ZV0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IHByb2R1Y3RVcmxCYXNlID0gd2l0aG91dFRyYWlsaW5nU2xhc2goXG4gICAgY3VzdG9tLnByb2R1Y3RVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3Byb2R1Y3RgLFxuICApXG4gIGNvbnN0IGN1cnJlbnRTbHVnID0gc2x1Z2lmeShwYXJhbXMuc2x1ZyB8fCBwYXJhbXMubmFtZSlcbiAgY29uc3QgcHJvZHVjdFVybCA9IGAke3Byb2R1Y3RVcmxCYXNlfS8ke2N1cnJlbnRTbHVnfWBcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldERlc2NyaXB0aW9uVmFsdWUoU3RyaW5nKHBhcmFtcy5kZXNjcmlwdGlvbiB8fCAnJykpXG4gIH0sIFtwYXJhbXMuZGVzY3JpcHRpb25dKVxuXG4gIGNvbnN0IG9uUHJvcGVydHlDaGFuZ2UgPSAocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdCkgPT4ge1xuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdzbHVnJykge1xuICAgICAgc2V0U2x1Z0VkaXRlZCh0cnVlKVxuICAgICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgc2x1Z2lmeSh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdClcblxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgc2x1Z2lmeSh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ3Byb2R1Y3RzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdtZWRpYUlkJywgbWVkaWEuaWQpXG4gICAgICBzZXRQcmV2aWV3VXJsKFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHByb3BlcnR5QnlQYXRoID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgIHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IFtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgsIHByb3BlcnR5XSksXG4gIClcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSAocHJvcGVydHlQYXRoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydHkgPSBwcm9wZXJ0eUJ5UGF0aFtwcm9wZXJ0eVBhdGhdXG4gICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmdQcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKFxuICAgIChwcm9wZXJ0eSkgPT5cbiAgICAgICFbJ25hbWUnLCAnc2x1ZycsICdkZXNjcmlwdGlvbicsICdpbWFnZScsICdtZWRpYUlkJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBwPVwieGxcIj5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlByb2R1Y3Q8L0g0PlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICBVcGxvYWQgdGhlIHByb2R1Y3QgaW1hZ2UsIGVkaXQgdGhlIHNsdWcsIGFuZCBzYXZlLiBEdXBsaWNhdGUgc2x1Z3MgYXJlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICByZW5hbWVkIGxpa2UgV29yZFByZXNzLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCduYW1lJyl9PC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJsZ1wiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTJweFwiIGJnPVwiI2Y4ZmFmY1wiPlxuICAgICAgICA8TGFiZWw+U2x1ZzwvTGFiZWw+XG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgZmxleFdyYXA9XCJ3cmFwXCIgZ2FwPVwic21cIj5cbiAgICAgICAgICA8VGV4dCBhcz1cInNwYW5cIiBmb250V2VpZ2h0PVwiYm9sZFwiPlxuICAgICAgICAgICAge2Ake3Byb2R1Y3RVcmxCYXNlfS9gfVxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtjdXJyZW50U2x1Z31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ3NsdWcnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDI2MCxcbiAgICAgICAgICAgICAgZmxleDogJzEgMSAyNjBweCcsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICcxMHB4IDEycHgnLFxuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgUHJldmlldzp7JyAnfVxuICAgICAgICAgIDxhIGhyZWY9e3Byb2R1Y3RVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgIHtwcm9kdWN0VXJsfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBJZiB0aGlzIHNsdWcgYWxyZWFkeSBleGlzdHMsIHRoZSBzYXZlZCBVUkwgd2lsbCByZWNlaXZlIGEgbnVtYmVyIHN1ZmZpeC5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8TGFiZWw+RGVzY3JpcHRpb248L0xhYmVsPlxuICAgICAgICA8VGV4dCBtYj1cIm1kXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgVXNlIHRoZSBXWVNJV1lHIHRvb2xiYXIsIG9yIHN3aXRjaCB0byBIVE1MIHNvdXJjZSBhbmQgcHJldmlldyBtb2RlLlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGdhcD1cInNtXCIgbWI9XCJtZFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCd3eXNpd3lnJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICd3eXNpd3lnJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgV1lTSVdZR1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdodG1sJyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgSFRNTFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RGVzY3JpcHRpb25Nb2RlKCdwcmV2aWV3Jyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NiZDVlMScsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogOCxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogZGVzY3JpcHRpb25Nb2RlID09PSAncHJldmlldycgPyAnIzA0Nzg1NycgOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIGNvbG9yOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdwcmV2aWV3JyA/ICcjZmZmZmZmJyA6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUHJldmlld1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICB7ZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT57cmVuZGVyUHJvcGVydHkoJ2Rlc2NyaXB0aW9uJyl9PC9Cb3g+XG4gICAgICAgICkgOiBkZXNjcmlwdGlvbk1vZGUgPT09ICdodG1sJyA/IChcbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIHZhbHVlPXtkZXNjcmlwdGlvblZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBzZXREZXNjcmlwdGlvblZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgICAgb25Qcm9wZXJ0eUNoYW5nZSgnZGVzY3JpcHRpb24nLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcm93cz17MTB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjxwPldyaXRlIHByb2R1Y3QgZGVzY3JpcHRpb24gaW4gSFRNTC4uLjwvcD5cIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgbWluSGVpZ2h0OiAyMjAsXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcbiAgICAgICAgICAgICAgcGFkZGluZzogMTIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS40NSxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3VpLW1vbm9zcGFjZSwgU0ZNb25vLVJlZ3VsYXIsIE1lbmxvLCBNb25hY28sIENvbnNvbGFzLCBtb25vc3BhY2UnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgIHA9XCJsZ1wiXG4gICAgICAgICAgICBib3JkZXI9XCIxcHggc29saWQgI2UyZThmMFwiXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM9XCIxMHB4XCJcbiAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogMjIwLCBiYWNrZ3JvdW5kOiAnI2Y4ZmFmYycgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7ZGVzY3JpcHRpb25WYWx1ZSA/IChcbiAgICAgICAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGRlc2NyaXB0aW9uVmFsdWUgfX0gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+UHJldmlldyB3aWxsIGFwcGVhciBoZXJlLjwvVGV4dD5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+UHJvZHVjdCBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdQcm9kdWN0IHByZXZpZXcnfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAyMjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMjAsXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY292ZXInLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTYsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkYmUzZWEnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIE5vIGltYWdlIHNlbGVjdGVkIHlldC5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e3VwbG9hZEltYWdlfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHtyZW1haW5pbmdQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgPEJveCBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH0+e3JlbmRlclByb3BlcnR5KHByb3BlcnR5LnByb3BlcnR5UGF0aCl9PC9Cb3g+XG4gICAgICApKX1cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHByb2R1Y3RcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBJY29uLCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgc2x1Z2lmeSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBzbHVnID0gU3RyaW5nKHZhbHVlIHx8ICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bJ1wiXS9nLCAnJylcbiAgICAucmVwbGFjZSgvW15hLXowLTldKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG5cbiAgcmV0dXJuIHNsdWcgfHwgJ2NhdGVnb3J5J1xufVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBDYXRlZ29yeUVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Jhbm5lclVwbG9hZGluZywgc2V0QmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyUHJldmlld1VybCwgc2V0QmFubmVyUHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uTW9kZSwgc2V0RGVzY3JpcHRpb25Nb2RlXSA9IHVzZVN0YXRlKCd3eXNpd3lnJylcbiAgY29uc3QgW2Rlc2NyaXB0aW9uVmFsdWUsIHNldERlc2NyaXB0aW9uVmFsdWVdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBjdXJyZW50U2x1ZyA9IHNsdWdpZnkocGFyYW1zLnNsdWcgfHwgcGFyYW1zLmxhYmVsKVxuICBjb25zdCBjYXRlZ29yeVVybCA9IGAke2NhdGVnb3J5VXJsQmFzZX0vJHtjdXJyZW50U2x1Z31gXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuYmFubmVySW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuYmFubmVySW1hZ2UpKSByZXR1cm4gcGFyYW1zLmJhbm5lckltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuYmFubmVySW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmJhbm5lckltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRCYW5uZXJVcmwgPSBiYW5uZXJQcmV2aWV3VXJsIHx8IGJhbm5lckltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0RGVzY3JpcHRpb25WYWx1ZShTdHJpbmcocGFyYW1zLmRlc2NyaXB0aW9uIHx8ICcnKSlcbiAgfSwgW3BhcmFtcy5kZXNjcmlwdGlvbl0pXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBzbHVnaWZ5KHZhbHVlKSwgLi4ucmVzdClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ2xhYmVsJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgc2x1Z2lmeSh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ2NhdGVnb3JpZXMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkQmFubmVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdjYXRlZ29yaWVzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldEJhbm5lclByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldEJhbm5lclVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIG9uUHJvcGVydHlDaGFuZ2UoJ2Jhbm5lckltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldEJhbm5lclByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0Jhbm5lciB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBiYW5uZXInLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJhbm5lclVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChiYW5uZXJGaWxlUmVmLmN1cnJlbnQpIGJhbm5lckZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpLmNhdGNoKCgpID0+IHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcHJvcGVydHlCeVBhdGggPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gW3Byb3BlcnR5LnByb3BlcnR5UGF0aCwgcHJvcGVydHldKSxcbiAgKVxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IChwcm9wZXJ0eVBhdGgpID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnR5QnlQYXRoW3Byb3BlcnR5UGF0aF1cbiAgICBpZiAoIXByb3BlcnR5KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZ1Byb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoXG4gICAgKHByb3BlcnR5KSA9PlxuICAgICAgIVsnbGFiZWwnLCAnc2x1ZycsICdkZXNjcmlwdGlvbicsICdpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gcD1cInhsXCI+XG4gICAgICA8Qm94IG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5DYXRlZ29yeTwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFVwbG9hZCB0aGUgY2F0ZWdvcnkgaW1hZ2UsIGVkaXQgdGhlIHNsdWcsIGFuZCBzYXZlLiBEdXBsaWNhdGUgc2x1Z3MgYXJlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICByZW5hbWVkIGxpa2UgV29yZFByZXNzLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCdsYWJlbCcpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwibGdcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjEycHhcIiBiZz1cIiNmOGZhZmNcIj5cbiAgICAgICAgPExhYmVsPlNsdWc8L0xhYmVsPlxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGZsZXhXcmFwPVwid3JhcFwiIGdhcD1cInNtXCI+XG4gICAgICAgICAgPFRleHQgYXM9XCJzcGFuXCIgZm9udFdlaWdodD1cImJvbGRcIj5cbiAgICAgICAgICAgIHtgJHtjYXRlZ29yeVVybEJhc2V9L2B9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnRTbHVnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBtaW5XaWR0aDogMjYwLFxuICAgICAgICAgICAgICBmbGV4OiAnMSAxIDI2MHB4JyxcbiAgICAgICAgICAgICAgcGFkZGluZzogJzEwcHggMTJweCcsXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2JkNWUxJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgPGEgaHJlZj17Y2F0ZWdvcnlVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgIHtjYXRlZ29yeVVybH1cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgSWYgdGhpcyBzbHVnIGFscmVhZHkgZXhpc3RzLCB0aGUgc2F2ZWQgVVJMIHdpbGwgcmVjZWl2ZSBhIG51bWJlciBzdWZmaXguXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPExhYmVsPkRlc2NyaXB0aW9uPC9MYWJlbD5cbiAgICAgICAgPFRleHQgbWI9XCJtZFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFVzZSB0aGUgV1lTSVdZRyB0b29sYmFyLCBvciBzd2l0Y2ggdG8gSFRNTCBzb3VyY2UgYW5kIHByZXZpZXcgbW9kZS5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBnYXA9XCJzbVwiIG1iPVwibWRcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgnd3lzaXd5ZycpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3d5c2l3eWcnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAnd3lzaXd5ZycgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFdZU0lXWUdcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgnaHRtbCcpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ2h0bWwnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIEhUTUxcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERlc2NyaXB0aW9uTW9kZSgncHJldmlldycpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDgsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IGRlc2NyaXB0aW9uTW9kZSA9PT0gJ3ByZXZpZXcnID8gJyMwNDc4NTcnIDogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICBjb2xvcjogZGVzY3JpcHRpb25Nb2RlID09PSAncHJldmlldycgPyAnI2ZmZmZmZicgOiAnIzBmMTcyYScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFByZXZpZXdcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAge2Rlc2NyaXB0aW9uTW9kZSA9PT0gJ3d5c2l3eWcnID8gKFxuICAgICAgICAgIDxCb3ggc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAgfX0+e3JlbmRlclByb3BlcnR5KCdkZXNjcmlwdGlvbicpfTwvQm94PlxuICAgICAgICApIDogZGVzY3JpcHRpb25Nb2RlID09PSAnaHRtbCcgPyAoXG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICB2YWx1ZT17ZGVzY3JpcHRpb25WYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgc2V0RGVzY3JpcHRpb25WYWx1ZShldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICAgIG9uUHJvcGVydHlDaGFuZ2UoJ2Rlc2NyaXB0aW9uJywgZXZlbnQudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHJvd3M9ezEwfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI8cD5Xcml0ZSBjYXRlZ29yeSBkZXNjcmlwdGlvbiBpbiBIVE1MLi4uPC9wPlwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBtaW5IZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjYmQ1ZTEnLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAxMixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQ1LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiAndWktbW9ub3NwYWNlLCBTRk1vbm8tUmVndWxhciwgTWVubG8sIE1vbmFjbywgQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgcD1cImxnXCJcbiAgICAgICAgICAgIGJvcmRlcj1cIjFweCBzb2xpZCAjZTJlOGYwXCJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cIjEwcHhcIlxuICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAsIGJhY2tncm91bmQ6ICcjZjhmYWZjJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtkZXNjcmlwdGlvblZhbHVlID8gKFxuICAgICAgICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogZGVzY3JpcHRpb25WYWx1ZSB9fSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5QcmV2aWV3IHdpbGwgYXBwZWFyIGhlcmUuPC9UZXh0PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5DYXRlZ29yeSBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgcHJldmlldyd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxNixcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+Q2F0ZWdvcnkgQmFubmVyPC9IND5cbiAgICAgICAgPFRleHQgbWI9XCJtZFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIFdpZGUgYmFubmVyIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2Ugb24gdGhlIHdlYnNpdGUuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZGlzcGxheWVkQmFubmVyVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEJhbm5lclVybH1cbiAgICAgICAgICAgICAgYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IGJhbm5lcid9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogNjQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvdmVyJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDE2LFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGJlM2VhJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBObyBiYW5uZXIgc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtiYW5uZXJGaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkQmFubmVyfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi4gUmVjb21tZW5kZWQgd2lkZSBpbWFnZSAoZS5nLiAxNjAww5c0MDApLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofT57cmVuZGVyUHJvcGVydHkocHJvcGVydHkucHJvcGVydHlQYXRoKX08L0JveD5cbiAgICAgICkpfVxuXG4gICAgICA8Qm94IHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAge3JlbmRlclByb3BlcnR5KCdpbWFnZScpfVxuICAgICAgICB7cmVuZGVyUHJvcGVydHkoJ2Jhbm5lckltYWdlJyl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmcgfHwgYmFubmVyVXBsb2FkaW5nfVxuICAgICAgICA+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNhdGVnb3J5XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEljb24sIElucHV0LCBQYWdpbmF0aW9uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIFJlY29yZHNUYWJsZSxcbiAgdXNlUXVlcnlQYXJhbXMsXG4gIHVzZVJlY29yZHMsXG4gIHVzZVNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgQ21zTGlzdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlUHJvcCA9IHJlc291cmNlLnRpdGxlUHJvcGVydHk/Lm5hbWUgfHwgcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ucHJvcGVydHlQYXRoIHx8ICdpZCdcblxuICBjb25zdCB7IHN0b3JlUGFyYW1zLCBmaWx0ZXJzIH0gPSB1c2VRdWVyeVBhcmFtcygpXG4gIGNvbnN0IHtcbiAgICByZWNvcmRzLFxuICAgIGxvYWRpbmcsXG4gICAgZGlyZWN0aW9uLFxuICAgIHNvcnRCeSxcbiAgICBwYWdlLFxuICAgIHRvdGFsLFxuICAgIGZldGNoRGF0YSxcbiAgICBwZXJQYWdlLFxuICB9ID0gdXNlUmVjb3JkcyhyZXNvdXJjZS5pZClcbiAgY29uc3Qge1xuICAgIHNlbGVjdGVkUmVjb3JkcyxcbiAgICBoYW5kbGVTZWxlY3QsXG4gICAgaGFuZGxlU2VsZWN0QWxsLFxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyxcbiAgfSA9IHVzZVNlbGVjdGVkUmVjb3JkcyhyZWNvcmRzKVxuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoKCkgPT4gU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgY29uc3QgZGVib3VuY2VSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3Qgc3RvcmVQYXJhbXNSZWYgPSB1c2VSZWYoc3RvcmVQYXJhbXMpXG4gIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQgPSBzdG9yZVBhcmFtc1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0UXVlcnkoU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMoW10pXG4gIH0sIFtyZXNvdXJjZS5pZCwgdGl0bGVQcm9wLCBzZXRTZWxlY3RlZFJlY29yZHNdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNldFRhZykgc2V0VGFnKHRvdGFsLnRvU3RyaW5nKCkpXG4gIH0sIFt0b3RhbCwgc2V0VGFnXSlcblxuICBjb25zdCBoYW5kbGVRdWVyeUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgc2V0UXVlcnkodmFsdWUpXG5cbiAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgZGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKVxuICAgICAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCh7XG4gICAgICAgIHBhZ2U6ICcxJyxcbiAgICAgICAgZmlsdGVyczogdHJpbW1lZCA/IHsgW3RpdGxlUHJvcF06IHRyaW1tZWQgfSA6IHt9LFxuICAgICAgfSlcbiAgICB9LCAzMDApXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVBY3Rpb25QZXJmb3JtZWQgPSAoKSA9PiBmZXRjaERhdGEoKVxuXG4gIGNvbnN0IGhhbmRsZVBhZ2luYXRpb25DaGFuZ2UgPSAocGFnZU51bWJlcikgPT4ge1xuICAgIHN0b3JlUGFyYW1zKHsgcGFnZTogcGFnZU51bWJlci50b1N0cmluZygpIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIj5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtYXhXaWR0aDogNDIwIH19PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIGxlZnQ6IDEyLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJY29uIGljb249XCJTZWFyY2hcIiAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVRdWVyeUNoYW5nZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17YFNlYXJjaCAke3Jlc291cmNlLm5hbWV9Li4uYH1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nTGVmdDogMzYgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IHZhcmlhbnQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPFJlY29yZHNUYWJsZVxuICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICByZWNvcmRzPXtyZWNvcmRzfVxuICAgICAgICAgIGFjdGlvblBlcmZvcm1lZD17aGFuZGxlQWN0aW9uUGVyZm9ybWVkfVxuICAgICAgICAgIG9uU2VsZWN0PXtoYW5kbGVTZWxlY3R9XG4gICAgICAgICAgb25TZWxlY3RBbGw9e2hhbmRsZVNlbGVjdEFsbH1cbiAgICAgICAgICBzZWxlY3RlZFJlY29yZHM9e3NlbGVjdGVkUmVjb3Jkc31cbiAgICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgICBzb3J0Qnk9e3NvcnRCeX1cbiAgICAgICAgICBpc0xvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIC8+XG4gICAgICAgIDxUZXh0IG10PVwieGxcIiB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8UGFnaW5hdGlvblxuICAgICAgICAgICAgcGFnZT17cGFnZX1cbiAgICAgICAgICAgIHBlclBhZ2U9e3BlclBhZ2V9XG4gICAgICAgICAgICB0b3RhbD17dG90YWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUGFnaW5hdGlvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbXNMaXN0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDQsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmNvbnN0IFJldmlld0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncmV2aWV3cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcmV2aWV3JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBwcm9wZXJ0eUJ5UGF0aCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiBbcHJvcGVydHkucHJvcGVydHlQYXRoLCBwcm9wZXJ0eV0pLFxuICApXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gKHByb3BlcnR5UGF0aCkgPT4ge1xuICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydHlCeVBhdGhbcHJvcGVydHlQYXRoXVxuICAgIGlmICghcHJvcGVydHkpIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmdQcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKFxuICAgIChwcm9wZXJ0eSkgPT4gIVsndGl0bGUnLCAnbmFtZScsICdjb250ZW50JywgJ2ltYWdlJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBwPVwieGxcIj5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlJldmlldzwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIEFkZCB0aGUgcmV2aWV3IHRpdGxlLCByZXZpZXdlciBuYW1lLCBjb250ZW50LCBhbmQgYW4gb3B0aW9uYWwgcmV2aWV3ZXIgaW1hZ2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ3RpdGxlJyl9PC9Cb3g+XG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ25hbWUnKX08L0JveD5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnY29udGVudCcpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5SZXZpZXdlciBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdSZXZpZXdlcid9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE0MCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofSBtYj1cImxnXCI+XG4gICAgICAgICAge3JlbmRlclByb3BlcnR5KHByb3BlcnR5LnByb3BlcnR5UGF0aCl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKSl9XG5cbiAgICAgIDxCb3ggbXQ9XCJ4bFwiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSByZXZpZXdcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXZpZXdFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIERyYXdlckNvbnRlbnQsXG4gIERyYXdlckZvb3RlcixcbiAgSDQsXG4gIEljb24sXG4gIFRleHQsXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZVJlY29yZCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgVEFCUyA9IFtcbiAge1xuICAgIGlkOiAnZ2VuZXJhbCcsXG4gICAgbGFiZWw6ICdHZW5lcmFsJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdzdG9yZU5hbWUnLFxuICAgICAgJ3N0b3JlVGFnbGluZScsXG4gICAgICAnc3RvcmVFbWFpbCcsXG4gICAgICAnc3RvcmVQaG9uZTEnLFxuICAgICAgJ3N0b3JlUGhvbmUyJyxcbiAgICAgICdzdG9yZUFkZHJlc3MnLFxuICAgICAgJ3Byb21vQmFubmVyJyxcbiAgICAgICdlYXJseURlbGl2ZXJ5JyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdhcHBlYXJhbmNlJyxcbiAgICBsYWJlbDogJ0FwcGVhcmFuY2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2NvbG9yUHJpbWFyeScsXG4gICAgICAnY29sb3JQcmltYXJ5TGlnaHQnLFxuICAgICAgJ2NvbG9yQWNjZW50JyxcbiAgICAgICdjb2xvckJhY2tncm91bmQnLFxuICAgICAgJ2NvbG9yRm9vdGVyRnJvbScsXG4gICAgICAnY29sb3JGb290ZXJWaWEnLFxuICAgICAgJ2ZvbnRGYW1pbHknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvbWVwYWdlJyxcbiAgICBsYWJlbDogJ0hvbWVwYWdlJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdob21lQmFubmVyRW5hYmxlZCcsXG4gICAgICAnaG9tZUNhdGVnb3JpZXNFbmFibGVkJyxcbiAgICAgICdob21lQmVzdFNlbGxlcnNFbmFibGVkJyxcbiAgICAgICdob21lQmVzdFNlbGxlcnNUaXRsZScsXG4gICAgICAnaG9tZVNob3BPdXJSYW5nZUVuYWJsZWQnLFxuICAgICAgJ2hvbWVGcnVpdEhpZ2hsaWdodEVuYWJsZWQnLFxuICAgICAgJ2hvbWVJbXBvcnRlZEZydWl0c0VuYWJsZWQnLFxuICAgICAgJ2hvbWVSZXZpZXdzRW5hYmxlZCcsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGF5bWVudHMnLFxuICAgIGxhYmVsOiAnUGF5bWVudHMnLFxuICAgIGZpZWxkczogWydyYXpvcnBheUVuYWJsZWQnLCAncmF6b3JwYXlLZXlJZCcsICdyYXpvcnBheUtleVNlY3JldCddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdub3RpZmljYXRpb25zJyxcbiAgICBsYWJlbDogJ05vdGlmaWNhdGlvbnMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3R3aWxpb0VuYWJsZWQnLFxuICAgICAgJ3R3aWxpb0FjY291bnRTaWQnLFxuICAgICAgJ3R3aWxpb0F1dGhUb2tlbicsXG4gICAgICAndHdpbGlvU21zRnJvbScsXG4gICAgICAndHdpbGlvV2hhdHNhcHBGcm9tJyxcbiAgICBdLFxuICB9LFxuXVxuXG5jb25zdCBTZXR0aW5nc0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGUoJ2dlbmVyYWwnKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpXG4gICAgaWYgKGhhc2ggJiYgVEFCUy5zb21lKCh0YWIpID0+IHRhYi5pZCA9PT0gaGFzaCkpIHtcbiAgICAgIHNldEFjdGl2ZVRhYihoYXNoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIGAjJHthY3RpdmVUYWJ9YClcbiAgfSwgW2FjdGl2ZVRhYl0pXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdzdWNjZXNzJyB8fCByZXNwb25zZT8uZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTZXR0aW5ncyBzYXZlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncycsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncy4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gZmxleCBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCIgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy10YWJzXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1zZXR0aW5ncy10YWIke2FjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJyBpcy1hY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYih0YWIuaWQpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0YWIubGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxEcmF3ZXJDb250ZW50PlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoKHByb3BlcnR5KSA9PlxuICAgICAgICAgICAgdGFiLmZpZWxkcy5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICAgICAgICAgIClcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1wYW5lbFwiXG4gICAgICAgICAgICAgIHA9XCJ4bFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6IGFjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJ2Jsb2NrJyA6ICdub25lJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SDQgbWI9XCJzbVwiPnt0YWIubGFiZWx9PC9IND5cbiAgICAgICAgICAgICAgPFRleHQgbWI9XCJ4bFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgICAgICAgIFVwZGF0ZSB5b3VyIHN0b3JlIHNldHRpbmdzIGFuZCBjbGljayBTYXZlIGNoYW5nZXMgYmVsb3cuXG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L0RyYXdlckNvbnRlbnQ+XG5cbiAgICAgIDxEcmF3ZXJGb290ZXI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjaGFuZ2VzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EcmF3ZXJGb290ZXI+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIEZvcm1Hcm91cCxcbiAgSDIsXG4gIElucHV0LFxuICBMYWJlbCxcbiAgTWVzc2FnZUJveCxcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgUkVNRU1CRVJFRF9MT0dJTl9LRVkgPSAndG9rcmlfYWRtaW5fbG9naW4nXG5cbmNvbnN0IExvZ2luID0gKCkgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgZXJyb3JNZXNzYWdlIH0gPSB3aW5kb3cuX19BUFBfU1RBVEVfXyB8fCB7fVxuICBjb25zdCB7IHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgYWRtaW5Sb290ID0gYWN0aW9uPy5yZXBsYWNlKC9cXC9sb2dpbiQvLCAnJykgfHwgJydcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRVcmwgPSBgJHthZG1pblJvb3R9L2ZvcmdvdC1wYXNzd29yZGBcbiAgY29uc3QgW2lkZW50aWZpZXIsIHNldElkZW50aWZpZXJdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtyZW1lbWJlckxvZ2luLCBzZXRSZW1lbWJlckxvZ2luXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZW1lbWJlcmVkTG9naW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgaWYgKHJlbWVtYmVyZWRMb2dpbikge1xuICAgICAgc2V0SWRlbnRpZmllcihyZW1lbWJlcmVkTG9naW4pXG4gICAgICBzZXRSZW1lbWJlckxvZ2luKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBmb3JtLmVsZW1lbnRzLm5hbWVkSXRlbSgnZW1haWwnKVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCA/IFN0cmluZyhlbWFpbElucHV0LnZhbHVlKSA6IGlkZW50aWZpZXIpLnRyaW0oKVxuXG4gICAgaWYgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0KSB7XG4gICAgICBlbWFpbElucHV0LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAocmVtZW1iZXJMb2dpbiAmJiB2YWx1ZSkge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgZmxleFxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBtaW5IZWlnaHQ9XCIxMDB2aFwiXG4gICAgICBiZz1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwMjJjMjIsICMwNDc4NTcpXCJcbiAgICAgIHA9XCJ4bFwiXG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0NDBweCddfVxuICAgICAgICBib3JkZXJSYWRpdXM9XCIxOHB4XCJcbiAgICAgICAgYm94U2hhZG93PVwiMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMzUpXCJcbiAgICAgICAgcD1cIngzXCJcbiAgICAgID5cbiAgICAgICAgPEgyIGNvbG9yPVwiIzAyMmMyMlwiIG1iPVwic21cIj5Ub2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwiIzY0NzQ4YlwiIG1iPVwieGxcIj5cbiAgICAgICAgICBTaWduIGluIHdpdGggeW91ciBhZG1pbiBlbWFpbCBvciB1c2VybmFtZSB0byBtYW5hZ2UgcHJvZHVjdHMsIG9yZGVycywgYW5kIGNvbnRlbnQuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZXJyb3JNZXNzYWdlID8gKFxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICBtYj1cImxnXCJcbiAgICAgICAgICAgIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSl9XG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGFzPVwiZm9ybVwiIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5FbWFpbCBvciB1c2VybmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpZGVudGlmaWVyfVxuICAgICAgICAgICAgICBrZXk9e2lkZW50aWZpZXIgfHwgJ2xvZ2luLWVtYWlsJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPlBhc3N3b3JkPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPXtzaG93UGFzc3dvcmQgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17c2hvd1Bhc3N3b3JkID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgaWQ9XCJyZW1lbWJlci1sb2dpblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e3JlbWVtYmVyTG9naW59XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFJlbWVtYmVyTG9naW4oZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5SaWdodDogOCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtZW1iZXItbG9naW5cIiBzdHlsZT17eyBjb2xvcjogJyM0NzU1NjknLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgIFJlbWVtYmVyIG15IGVtYWlsIG9yIHVzZXJuYW1lIG9uIHRoaXMgZGV2aWNlXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIHdpZHRoPVwiMTAwJVwiIG10PVwibGdcIj5cbiAgICAgICAgICAgIFNpZ24gaW5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxhIGhyZWY9e2ZvcmdvdFBhc3N3b3JkVXJsfSBzdHlsZT17eyBjb2xvcjogJyMwNDc4NTcnLCBmb250V2VpZ2h0OiA3MDAgfX0+XG4gICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpblxuIiwiaW1wb3J0IFJlYWN0LCB7IG1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBMYWJlbCwgVGlueU1DRSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGx1Z2luczogW1xuICAgICdjb2RlJyxcbiAgICAnbGluaycsXG4gICAgJ2xpc3RzJyxcbiAgICAnaW1hZ2UnLFxuICAgICd0YWJsZScsXG4gICAgJ2F1dG9saW5rJyxcbiAgICAncHJldmlldycsXG4gICAgJ3NlYXJjaHJlcGxhY2UnLFxuICAgICd3b3JkY291bnQnLFxuICAgICdtZWRpYScsXG4gICAgJ2NvZGVzYW1wbGUnLFxuICBdLFxuICB0b29sYmFyOlxuICAgICd1bmRvIHJlZG8gfCBibG9ja3MgfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgc3RyaWtldGhyb3VnaCB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCBvdXRkZW50IGluZGVudCB8IGxpbmsgaW1hZ2UgdGFibGUgY29kZXNhbXBsZSB8IGNvZGUgfCByZW1vdmVmb3JtYXQnLFxuICBoZWlnaHQ6IDQwMCxcbn1cblxuY29uc3QgUmljaHRleHRFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IHZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/ICcnXG4gIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBuZXdWYWx1ZSlcbiAgICB9LFxuICAgIFtvbkNoYW5nZSwgcHJvcGVydHkucGF0aF0sXG4gIClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLkRFRkFVTFRfT1BUSU9OUyxcbiAgICAuLi4ocHJvcGVydHkucHJvcHMgfHwge30pLFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybUdyb3VwIGVycm9yPXtCb29sZWFuKGVycm9yKX0+XG4gICAgICA8TGFiZWwgcmVxdWlyZWQ9e3Byb3BlcnR5LmlzUmVxdWlyZWR9Pntwcm9wZXJ0eS5sYWJlbH08L0xhYmVsPlxuICAgICAgPFRpbnlNQ0UgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlVXBkYXRlfSBvcHRpb25zPXtvcHRpb25zfSAvPlxuICAgICAgPEZvcm1NZXNzYWdlPntlcnJvcj8ubWVzc2FnZX08L0Zvcm1NZXNzYWdlPlxuICAgIDwvRm9ybUdyb3VwPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oUmljaHRleHRFZGl0KVxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUHJvZHVjdEVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0RWRpdCA9IFByb2R1Y3RFZGl0XG5pbXBvcnQgQ2F0ZWdvcnlFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdGVnb3J5RWRpdCA9IENhdGVnb3J5RWRpdFxuaW1wb3J0IENtc0xpc3QgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNtc0xpc3QgPSBDbXNMaXN0XG5pbXBvcnQgUmV2aWV3RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmV2aWV3RWRpdCA9IFJldmlld0VkaXRcbmltcG9ydCBTZXR0aW5nc0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2V0dGluZ3NFZGl0ID0gU2V0dGluZ3NFZGl0XG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5ID0gRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5Il0sIm5hbWVzIjpbImFwaSIsIkFwaUNsaWVudCIsInN0YXRDYXJkcyIsImtleSIsImxhYmVsIiwiaWNvbiIsInJlc291cmNlIiwiYWRtaW5Sb290Iiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInNwbGl0IiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImdldERhc2hib2FyZCIsInRoZW4iLCJyZXMiLCJjYXRjaCIsInN0YXRzIiwicm9vdCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsInZhcmlhbnQiLCJjbGFzc05hbWUiLCJwIiwibWIiLCJIMiIsIlRleHQiLCJvcGFjaXR5IiwiZGlzcGxheSIsIm1hcCIsImNhcmQiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJINSIsIkljb24iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJCdXR0b24iLCJtdCIsInNpemUiLCJhcyIsImhyZWYiLCJmbGV4V3JhcCIsInJlY2VudE9yZGVycyIsImxlbmd0aCIsIm9yZGVyIiwib3JkZXJObyIsInN0YXR1cyIsImdyYW5kVG90YWwiLCJzbHVnaWZ5IiwidmFsdWUiLCJzbHVnIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJ0cmltIiwicmVwbGFjZSIsIndpdGhvdXRUcmFpbGluZ1NsYXNoIiwiUHJvZHVjdEVkaXQiLCJwcm9wcyIsInJlY29yZCIsImluaXRpYWxSZWNvcmQiLCJoYW5kbGVDaGFuZ2UiLCJzdWJtaXQiLCJoYW5kbGVTdWJtaXQiLCJsb2FkaW5nIiwidXNlUmVjb3JkIiwiaWQiLCJhZGROb3RpY2UiLCJ1c2VOb3RpY2UiLCJmaWxlUmVmIiwidXNlUmVmIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwic2x1Z0VkaXRlZCIsInNldFNsdWdFZGl0ZWQiLCJCb29sZWFuIiwicGFyYW1zIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJkZXNjcmlwdGlvbk1vZGUiLCJzZXREZXNjcmlwdGlvbk1vZGUiLCJkZXNjcmlwdGlvblZhbHVlIiwic2V0RGVzY3JpcHRpb25WYWx1ZSIsImN1c3RvbSIsIm9wdGlvbnMiLCJhcGlCYXNlVXJsIiwicHJvZHVjdFVybEJhc2UiLCJvcmlnaW4iLCJjdXJyZW50U2x1ZyIsIm5hbWUiLCJwcm9kdWN0VXJsIiwiaW1hZ2VVcmwiLCJ1c2VNZW1vIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiZGVzY3JpcHRpb24iLCJvblByb3BlcnR5Q2hhbmdlIiwicHJvcGVydHlQYXRoIiwicmVzdCIsInVwbG9hZEltYWdlIiwiZXZlbnQiLCJmaWxlIiwidGFyZ2V0IiwiZmlsZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwibG9jYWxQcmV2aWV3VXJsIiwiY3JlYXRlT2JqZWN0VVJMIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJvayIsImVycm9yIiwianNvbiIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsInR5cGUiLCJjdXJyZW50IiwicHJldmVudERlZmF1bHQiLCJwcm9wZXJ0eUJ5UGF0aCIsIk9iamVjdCIsImZyb21FbnRyaWVzIiwiZWRpdFByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsInJlbmRlclByb3BlcnR5IiwiQmFzZVByb3BlcnR5Q29tcG9uZW50Iiwid2hlcmUiLCJvbkNoYW5nZSIsInJlbWFpbmluZ1Byb3BlcnRpZXMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsIm9uU3VibWl0IiwiSDQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiZyIsIkxhYmVsIiwiZ2FwIiwic3R5bGUiLCJtaW5XaWR0aCIsImZsZXgiLCJwYWRkaW5nIiwicmVsIiwib25DbGljayIsImJhY2tncm91bmQiLCJjb2xvciIsImN1cnNvciIsIm1pbkhlaWdodCIsInJvd3MiLCJwbGFjZWhvbGRlciIsIndpZHRoIiwibGluZUhlaWdodCIsImZvbnRGYW1pbHkiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsInNyYyIsImFsdCIsImhlaWdodCIsIm9iamVjdEZpdCIsInJlZiIsImFjY2VwdCIsImRpc2FibGVkIiwic3BpbiIsIkNhdGVnb3J5RWRpdCIsImJhbm5lckZpbGVSZWYiLCJiYW5uZXJVcGxvYWRpbmciLCJzZXRCYW5uZXJVcGxvYWRpbmciLCJiYW5uZXJQcmV2aWV3VXJsIiwic2V0QmFubmVyUHJldmlld1VybCIsImNhdGVnb3J5VXJsQmFzZSIsImNhdGVnb3J5VXJsIiwiYmFubmVySW1hZ2VVcmwiLCJiYW5uZXJJbWFnZSIsImRpc3BsYXllZEJhbm5lclVybCIsInVwbG9hZEJhbm5lciIsIm1heFdpZHRoIiwiQ21zTGlzdCIsInNldFRhZyIsInRpdGxlUHJvcCIsInRpdGxlUHJvcGVydHkiLCJzdG9yZVBhcmFtcyIsImZpbHRlcnMiLCJ1c2VRdWVyeVBhcmFtcyIsInJlY29yZHMiLCJkaXJlY3Rpb24iLCJzb3J0QnkiLCJwYWdlIiwidG90YWwiLCJmZXRjaERhdGEiLCJwZXJQYWdlIiwidXNlUmVjb3JkcyIsInNlbGVjdGVkUmVjb3JkcyIsImhhbmRsZVNlbGVjdCIsImhhbmRsZVNlbGVjdEFsbCIsInNldFNlbGVjdGVkUmVjb3JkcyIsInVzZVNlbGVjdGVkUmVjb3JkcyIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJkZWJvdW5jZVJlZiIsInN0b3JlUGFyYW1zUmVmIiwidG9TdHJpbmciLCJoYW5kbGVRdWVyeUNoYW5nZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ0cmltbWVkIiwiaGFuZGxlQWN0aW9uUGVyZm9ybWVkIiwiaGFuZGxlUGFnaW5hdGlvbkNoYW5nZSIsInBhZ2VOdW1iZXIiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJwb2ludGVyRXZlbnRzIiwiSW5wdXQiLCJwYWRkaW5nTGVmdCIsIlJlY29yZHNUYWJsZSIsImFjdGlvblBlcmZvcm1lZCIsIm9uU2VsZWN0Iiwib25TZWxlY3RBbGwiLCJpc0xvYWRpbmciLCJ0ZXh0QWxpZ24iLCJQYWdpbmF0aW9uIiwiUmV2aWV3RWRpdCIsIlRBQlMiLCJmaWVsZHMiLCJTZXR0aW5nc0VkaXQiLCJhY3RpdmVUYWIiLCJzZXRBY3RpdmVUYWIiLCJoYXNoIiwic29tZSIsInRhYiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJub3RpY2UiLCJmbGV4RGlyZWN0aW9uIiwiRHJhd2VyQ29udGVudCIsInByb3BlcnRpZXMiLCJEcmF3ZXJGb290ZXIiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiYWN0aW9uIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInNob3dQYXNzd29yZCIsInNldFNob3dQYXNzd29yZCIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiYm94U2hhZG93IiwiTWVzc2FnZUJveCIsIkZvcm1Hcm91cCIsInJlcXVpcmVkIiwiYXV0b0NvbXBsZXRlIiwiZGVmYXVsdFZhbHVlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJ2aWV3Qm94IiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiZCIsImN4IiwiY3kiLCJyIiwiY2hlY2tlZCIsIm1hcmdpblJpZ2h0IiwiaHRtbEZvciIsIkRFRkFVTFRfT1BUSU9OUyIsInBsdWdpbnMiLCJ0b29sYmFyIiwiUmljaHRleHRFZGl0IiwiZXJyb3JzIiwiaGFuZGxlVXBkYXRlIiwidXNlQ2FsbGJhY2siLCJuZXdWYWx1ZSIsImlzUmVxdWlyZWQiLCJUaW55TUNFIiwiRm9ybU1lc3NhZ2UiLCJtZW1vIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBSUEsTUFBTUEsR0FBRyxHQUFHLElBQUlDLGlCQUFTLEVBQUU7RUFFM0IsTUFBTUMsU0FBUyxHQUFHLENBQ2hCO0VBQUVDLEVBQUFBLEdBQUcsRUFBRSxjQUFjO0VBQUVDLEVBQUFBLEtBQUssRUFBRSxVQUFVO0VBQUVDLEVBQUFBLElBQUksRUFBRSxjQUFjO0VBQUVDLEVBQUFBLFFBQVEsRUFBRTtFQUFVLENBQUMsRUFDckY7RUFBRUgsRUFBQUEsR0FBRyxFQUFFLFlBQVk7RUFBRUMsRUFBQUEsS0FBSyxFQUFFLFFBQVE7RUFBRUMsRUFBQUEsSUFBSSxFQUFFLFNBQVM7RUFBRUMsRUFBQUEsUUFBUSxFQUFFO0VBQVEsQ0FBQyxFQUMxRTtFQUFFSCxFQUFBQSxHQUFHLEVBQUUsV0FBVztFQUFFQyxFQUFBQSxLQUFLLEVBQUUsT0FBTztFQUFFQyxFQUFBQSxJQUFJLEVBQUUsVUFBVTtFQUFFQyxFQUFBQSxRQUFRLEVBQUU7RUFBTyxDQUFDLEVBQ3hFO0VBQUVILEVBQUFBLEdBQUcsRUFBRSxhQUFhO0VBQUVDLEVBQUFBLEtBQUssRUFBRSxTQUFTO0VBQUVDLEVBQUFBLElBQUksRUFBRSxNQUFNO0VBQUVDLEVBQUFBLFFBQVEsRUFBRTtFQUFTLENBQUMsQ0FDM0U7RUFFRCxNQUFNQyxTQUFTLEdBQUdBLE1BQU1DLE1BQU0sQ0FBQ0MsUUFBUSxDQUFD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
