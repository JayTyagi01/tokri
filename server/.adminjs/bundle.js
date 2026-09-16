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

  function useAnchoredMenu$1(open) {
    const wrapRef = React.useRef(null);
    const [coords, setCoords] = React.useState(null);
    React.useEffect(() => {
      if (!open) return undefined;
      const update = () => {
        const node = wrapRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < 280 && rect.top > spaceBelow;
        setCoords({
          top: openUp ? undefined : rect.bottom + 6,
          bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
          left: Math.max(12, rect.left),
          width: rect.width
        });
      };
      update();
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
      return () => {
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      };
    }, [open]);
    return {
      wrapRef,
      coords
    };
  }
  function SearchableMultiSelect$1({
    options,
    selected,
    onChange,
    placeholder,
    searchPlaceholder
  }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const {
      wrapRef,
      coords
    } = useAnchoredMenu$1(open);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    const selectedSet = React.useMemo(() => new Set(selected), [selected]);
    const selectedOptions = options.filter(item => selectedSet.has(item.value));
    const filtered = options.filter(item => `${item.label} ${item.value}`.toLowerCase().includes(query.trim().toLowerCase()));
    const toggle = value => {
      if (selectedSet.has(value)) onChange(selected.filter(item => item !== value));else onChange([...selected, value]);
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-multiselect-control",
      onClick: () => setOpen(value => !value)
    }, selectedOptions.length ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-chips"
    }, selectedOptions.map(item => /*#__PURE__*/React__default.default.createElement("span", {
      key: item.value,
      className: "tokri-multiselect-chip"
    }, item.label, /*#__PURE__*/React__default.default.createElement("span", {
      role: "button",
      tabIndex: 0,
      onClick: event => {
        event.stopPropagation();
        toggle(item.value);
      }
    }, "\xD7")))) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-placeholder"
    }, placeholder), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-caret"
    }, open ? '▴' : '▾')), open && coords ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-menu",
      style: {
        position: 'fixed',
        top: coords.top,
        bottom: coords.bottom,
        left: coords.left,
        width: Math.max(coords.width, 260),
        zIndex: 1000
      }
    }, /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: query,
      onChange: event => setQuery(event.target.value),
      placeholder: searchPlaceholder,
      autoFocus: true
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-list"
    }, filtered.length ? filtered.map(item => {
      const checked = selectedSet.has(item.value);
      return /*#__PURE__*/React__default.default.createElement("label", {
        key: item.value,
        className: `tokri-multiselect-option${checked ? ' is-selected' : ''}`
      }, /*#__PURE__*/React__default.default.createElement("input", {
        type: "checkbox",
        checked: checked,
        onChange: () => toggle(item.value)
      }), /*#__PURE__*/React__default.default.createElement("span", null, item.label));
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-empty"
    }, "No matches"))) : null);
  }
  function FlagCard({
    selected,
    title,
    hint,
    onClick
  }) {
    return /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: `tokri-choice-card${selected ? ' is-selected' : ''}`,
      onClick: onClick
    }, /*#__PURE__*/React__default.default.createElement("strong", null, title), /*#__PURE__*/React__default.default.createElement("span", null, hint));
  }

  const normalizeSlugInput$1 = value => String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const withoutTrailingSlash$3 = value => String(value || '').replace(/\/+$/, '');
  function parseSlugs$1(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(item => String(item).trim()).filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parseSlugs$1(parsed);
      } catch {
        // ignore
      }
      return raw.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  }
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
    const [categories, setCategories] = React.useState([]);
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$3(custom.apiBaseUrl || '/api/v1');
    const productUrlBase = withoutTrailingSlash$3(custom.productUrlBase || `${window.location.origin}/product`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput$1(slugInput) || normalizeSlugInput$1(params.name);
    const productUrl = previewSlug ? `${productUrlBase}/${previewSlug}` : null;
    const selectedCategorySlugs = parseSlugs$1(params.categoryIds);
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$3(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    React.useEffect(() => {
      return () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);
    React.useEffect(() => {
      let ignore = false;
      fetch(`${apiBaseUrl}/categories`).then(response => response.json()).then(data => {
        if (!ignore) setCategories(Array.isArray(data) ? data : []);
      }).catch(() => {
        if (!ignore) setCategories([]);
      });
      return () => {
        ignore = true;
      };
    }, [apiBaseUrl]);
    const setField = (key, value) => handleChange(key, value);
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
    const setSelectedCategories = slugs => setField('categoryIds', JSON.stringify(slugs));
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
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$3(custom.appUrl || window.location.origin)}${media.path}`);
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
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save product',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: 'Product saved',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save product',
          type: 'error'
        });
      });
    };
    const descriptionProperty = resource.editProperties.find(property => property.propertyPath === 'description');
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      className: "tokri-coupon-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-hero"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      color: "white"
    }, params.name || 'New product'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Add photos, prices, and one or more categories for the website and app.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Product details"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.name || '',
      onChange: event => onPropertyChange('name', event.target.value),
      placeholder: "Alphonso Mango",
      required: true
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Slug", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: slugInput,
      onChange: event => onPropertyChange('slug', event.target.value),
      placeholder: "auto-generated from name"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Preview:", ' ', productUrl ? /*#__PURE__*/React__default.default.createElement("a", {
      href: productUrl,
      target: "_blank",
      rel: "noreferrer"
    }, productUrl) : 'Generated from product name when saved'), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Price (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      step: "0.01",
      value: params.priceValue ?? '',
      onChange: event => setField('priceValue', event.target.value),
      required: true
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Old price (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      step: "0.01",
      value: params.oldPriceValue ?? '',
      onChange: event => setField('oldPriceValue', event.target.value),
      placeholder: "Optional"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Weight", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.weight || '',
      onChange: event => setField('weight', event.target.value),
      placeholder: "1 kg"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Badge", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.badge || '',
      onChange: event => setField('badge', event.target.value),
      placeholder: "Fresh"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Stock", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      value: params.stock ?? 100,
      onChange: event => setField('stock', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Sort order", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      value: params.sortOrder ?? 0,
      onChange: event => setField('sortOrder', event.target.value)
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Product image"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-upload-drop"
    }, displayedImageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.name || 'Product preview'
    }) : /*#__PURE__*/React__default.default.createElement("span", null, "Click to upload a square product photo"), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadImage
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "JPG, PNG, GIF, or WebP up to 5MB."))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Categories"), /*#__PURE__*/React__default.default.createElement("p", null, "A product can appear in more than one category on the website and app."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Select categories", /*#__PURE__*/React__default.default.createElement(SearchableMultiSelect$1, {
      options: categories.map(item => ({
        value: item.slug,
        label: item.label
      })),
      selected: selectedCategorySlugs,
      onChange: setSelectedCategories,
      placeholder: "Search and select categories",
      searchPlaceholder: "Search categories"
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Store placement"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isBestSeller === true || params.isBestSeller === 'true',
      title: "Bestseller",
      hint: "Show in bestsellers",
      onClick: () => setField('isBestSeller', !(params.isBestSeller === true || params.isBestSeller === 'true'))
    }), /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isImported === true || params.isImported === 'true',
      title: "Imported",
      hint: "Show in imported fruits",
      onClick: () => setField('isImported', !(params.isImported === true || params.isImported === 'true'))
    }), /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isFeatured === true || params.isFeatured === 'true',
      title: "Featured",
      hint: "Highlight this fruit",
      onClick: () => setField('isFeatured', !(params.isFeatured === true || params.isFeatured === 'true'))
    }), /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isActive !== false && params.isActive !== 'false',
      title: "Active",
      hint: "Visible to customers",
      onClick: () => setField('isActive', !(params.isActive !== false && params.isActive !== 'false'))
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Description"), descriptionProperty ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        minHeight: 220
      }
    }, /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
      where: "edit",
      onChange: onPropertyChange,
      property: descriptionProperty,
      resource: resource,
      record: record
    })) : null), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || uploading
    }, loading || uploading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save product")));
  };

  const normalizeSlugInput = value => String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const withoutTrailingSlash$2 = value => String(value || '').replace(/\/+$/, '');
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
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$2(custom.apiBaseUrl || '/api/v1');
    const categoryUrlBase = withoutTrailingSlash$2(custom.categoryUrlBase || `${window.location.origin}/category`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput(slugInput) || normalizeSlugInput(params.label);
    const categoryUrl = previewSlug ? `${categoryUrlBase}/${previewSlug}` : null;
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$2(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    const bannerImageUrl = React.useMemo(() => {
      if (!params.bannerImage) return '';
      if (/^(https?:|data:|blob:)/.test(params.bannerImage)) return params.bannerImage;
      return `${withoutTrailingSlash$2(custom.appUrl || window.location.origin)}${params.bannerImage}`;
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
    const setField = (key, value) => handleChange(key, value);
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
    const uploadTo = async (file, field, setLocalPreview, setBusy, successMessage) => {
      const formData = new FormData();
      formData.append('folder', 'categories');
      formData.append('file', file);
      setLocalPreview(URL.createObjectURL(file));
      setBusy(true);
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
        onPropertyChange(field, media.path);
        setLocalPreview(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$2(custom.appUrl || window.location.origin)}${media.path}`);
        addNotice({
          message: successMessage,
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not upload image',
          type: 'error'
        });
      } finally {
        setBusy(false);
      }
    };
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save category',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: 'Category saved',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save category',
          type: 'error'
        });
      });
    };
    const descriptionProperty = resource.editProperties.find(property => property.propertyPath === 'description');
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      className: "tokri-coupon-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-hero"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      color: "white"
    }, params.label || 'New category'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Create a shop section with a thumbnail, banner, and page copy.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Category details"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Label", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.label || '',
      onChange: event => onPropertyChange('label', event.target.value),
      placeholder: "Fresh Fruits",
      required: true
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Page heading", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.title || '',
      onChange: event => setField('title', event.target.value),
      placeholder: "Same as label if empty"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Subtitle", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.subtitle || '',
      onChange: event => setField('subtitle', event.target.value),
      placeholder: "Short line under the heading"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Slug", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: slugInput,
      onChange: event => onPropertyChange('slug', event.target.value),
      placeholder: "auto-generated from label"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7
    }, "Preview:", ' ', categoryUrl ? /*#__PURE__*/React__default.default.createElement("a", {
      href: categoryUrl,
      target: "_blank",
      rel: "noreferrer"
    }, categoryUrl) : 'Generated from category label when saved'), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Sort order", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      value: params.sortOrder ?? 0,
      onChange: event => setField('sortOrder', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Status", /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row",
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isActive !== false && params.isActive !== 'false',
      title: "Active",
      hint: "Shown on website and app",
      onClick: () => setField('isActive', !(params.isActive !== false && params.isActive !== 'false'))
    }))))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Category image"), /*#__PURE__*/React__default.default.createElement("p", null, "Square thumbnail used in the home category grid."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-upload-drop"
    }, displayedImageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.label || 'Category preview'
    }) : /*#__PURE__*/React__default.default.createElement("span", null, "Click to upload category image"), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: event => {
        const file = event.target.files?.[0];
        if (file) {
          uploadTo(file, 'image', setPreviewUrl, setUploading, 'Image uploaded successfully');
        }
        event.target.value = '';
      }
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Category banner"), /*#__PURE__*/React__default.default.createElement("p", null, "Wide image shown at the top of the category page."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-upload-drop tokri-upload-drop-wide"
    }, displayedBannerUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedBannerUrl,
      alt: params.label || 'Category banner'
    }) : /*#__PURE__*/React__default.default.createElement("span", null, "Click to upload a wide banner (1600\xD7400 recommended)"), /*#__PURE__*/React__default.default.createElement("input", {
      ref: bannerFileRef,
      type: "file",
      accept: "image/*",
      onChange: event => {
        const file = event.target.files?.[0];
        if (file) {
          uploadTo(file, 'bannerImage', setBannerPreviewUrl, setBannerUploading, 'Banner uploaded successfully');
        }
        event.target.value = '';
      }
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Description"), descriptionProperty ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        minHeight: 220
      }
    }, /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
      where: "edit",
      onChange: onPropertyChange,
      property: descriptionProperty,
      resource: resource,
      record: record
    })) : null), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'none'
      },
      "aria-hidden": "true"
    }, resource.editProperties.filter(property => ['image', 'bannerImage'].includes(property.propertyPath)).map(property => /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
      key: property.propertyPath,
      where: "edit",
      onChange: onPropertyChange,
      property: property,
      resource: resource,
      record: record
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
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

  const withoutTrailingSlash$1 = value => String(value || '').replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$1(custom.apiBaseUrl || '/api/v1');
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$1(custom.appUrl || window.location.origin)}${params.image}`;
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
    id: 'charges',
    label: 'Charges',
    fields: ['shippingFee', 'handlingFee']
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
    fields: ['msg91Enabled', 'msg91AuthKey', 'msg91SenderId', 'msg91OtpTemplateId', 'msg91OrderTemplateId', 'msg91WhatsappEnabled', 'msg91WhatsappNumber', 'msg91WhatsappOtpTemplate', 'msg91WhatsappOrderTemplate', 'msg91WhatsappLanguage', 'msg91WhatsappNamespace', 'msg91WhatsappOtpButton']
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
      if (hash === 'appearance') {
        setActiveTab('charges');
        return;
      }
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
      }, tab.id === 'charges' ? 'Shipping fee and handling charge are added to every order on the website and the app.' : 'Update your store settings and click Save changes below.'), tab.id === 'charges' ? /*#__PURE__*/React__default.default.createElement("div", {
        className: "tokri-charges-fields"
      }, /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Shipping fee (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.shippingFee ?? '',
        onChange: event => handleChange('shippingFee', event.target.value)
      }), /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-field-hint"
      }, "Delivery charge added to every order")), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Handling charge (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.handlingFee ?? '',
        onChange: event => handleChange('handlingFee', event.target.value)
      }), /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-field-hint"
      }, "Cart handling fee added to every order"))) : properties.map(property => /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
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

  const withoutTrailingSlash = value => String(value).replace(/\/+$/, '');
  function parseSlugs(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(item => String(item).trim()).filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parseSlugs(parsed);
      } catch {
        // ignore
      }
      return raw.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [];
  }
  function pad(num) {
    return String(num).padStart(2, '0');
  }
  function toDatetimeValue(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function formatDatetimeLabel(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  function useAnchoredMenu(open) {
    const wrapRef = React.useRef(null);
    const [coords, setCoords] = React.useState(null);
    React.useEffect(() => {
      if (!open) return undefined;
      const update = () => {
        const node = wrapRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < 280 && rect.top > spaceBelow;
        setCoords({
          top: openUp ? undefined : rect.bottom + 6,
          bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
          left: Math.max(12, rect.left),
          width: rect.width
        });
      };
      update();
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
      return () => {
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      };
    }, [open]);
    return {
      wrapRef,
      coords
    };
  }
  function ChoiceCard({
    selected,
    title,
    hint,
    onClick
  }) {
    return /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: `tokri-choice-card${selected ? ' is-selected' : ''}`,
      onClick: onClick
    }, /*#__PURE__*/React__default.default.createElement("strong", null, title), /*#__PURE__*/React__default.default.createElement("span", null, hint));
  }
  function AnchoredSelect({
    value,
    options,
    onChange,
    placeholder
  }) {
    const [open, setOpen] = React.useState(false);
    const {
      wrapRef,
      coords
    } = useAnchoredMenu(open);
    const selected = options.find(item => item.value === value);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-multiselect-control",
      onClick: () => setOpen(current => !current)
    }, /*#__PURE__*/React__default.default.createElement("span", null, selected?.label || placeholder), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-caret"
    }, open ? '▴' : '▾')), open && coords ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-menu",
      style: {
        position: 'fixed',
        top: coords.top,
        bottom: coords.bottom,
        left: coords.left,
        width: Math.max(coords.width, 220),
        zIndex: 1000
      }
    }, options.map(item => /*#__PURE__*/React__default.default.createElement("button", {
      key: item.value,
      type: "button",
      className: `tokri-multiselect-option${item.value === value ? ' is-selected' : ''}`,
      onClick: () => {
        onChange(item.value);
        setOpen(false);
      }
    }, item.label))) : null);
  }
  function SearchableMultiSelect({
    options,
    selected,
    onChange,
    placeholder,
    searchPlaceholder
  }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const {
      wrapRef,
      coords
    } = useAnchoredMenu(open);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    const selectedSet = React.useMemo(() => new Set(selected), [selected]);
    const selectedOptions = options.filter(item => selectedSet.has(item.value));
    const filtered = options.filter(item => `${item.label} ${item.value}`.toLowerCase().includes(query.trim().toLowerCase()));
    const toggle = value => {
      if (selectedSet.has(value)) onChange(selected.filter(item => item !== value));else onChange([...selected, value]);
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-multiselect-control",
      onClick: () => setOpen(value => !value)
    }, selectedOptions.length ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-chips"
    }, selectedOptions.map(item => /*#__PURE__*/React__default.default.createElement("span", {
      key: item.value,
      className: "tokri-multiselect-chip"
    }, item.label, /*#__PURE__*/React__default.default.createElement("span", {
      role: "button",
      tabIndex: 0,
      onClick: event => {
        event.stopPropagation();
        toggle(item.value);
      }
    }, "\xD7")))) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-placeholder"
    }, placeholder), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-caret"
    }, open ? '▴' : '▾')), open && coords ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-menu",
      style: {
        position: 'fixed',
        top: coords.top,
        bottom: coords.bottom,
        left: coords.left,
        width: Math.max(coords.width, 260),
        zIndex: 1000
      }
    }, /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: query,
      onChange: event => setQuery(event.target.value),
      placeholder: searchPlaceholder,
      autoFocus: true
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-list"
    }, filtered.length ? filtered.map(item => {
      const checked = selectedSet.has(item.value);
      return /*#__PURE__*/React__default.default.createElement("label", {
        key: item.value,
        className: `tokri-multiselect-option${checked ? ' is-selected' : ''}`
      }, /*#__PURE__*/React__default.default.createElement("input", {
        type: "checkbox",
        checked: checked,
        onChange: () => toggle(item.value)
      }), /*#__PURE__*/React__default.default.createElement("span", null, item.label));
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-empty"
    }, "No matches"))) : null);
  }
  function DateTimePicker({
    value,
    onChange,
    placeholder
  }) {
    const parsed = value ? new Date(value) : null;
    const valid = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
    const [open, setOpen] = React.useState(false);
    const [monthDate, setMonthDate] = React.useState(valid || new Date());
    const [hours, setHours] = React.useState(valid ? pad(valid.getHours()) : '00');
    const [minutes, setMinutes] = React.useState(valid ? pad(valid.getMinutes()) : '00');
    const {
      wrapRef,
      coords
    } = useAnchoredMenu(open);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    React.useEffect(() => {
      if (!valid) return;
      setMonthDate(valid);
      setHours(pad(valid.getHours()));
      setMinutes(pad(valid.getMinutes()));
    }, [value]);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let day = 1; day <= totalDays; day += 1) cells.push(day);
    const apply = (day, nextHours = hours, nextMinutes = minutes) => {
      const next = `${year}-${pad(month + 1)}-${pad(day)}T${pad(Number(nextHours) || 0)}:${pad(Number(nextMinutes) || 0)}`;
      onChange(next);
    };
    const selectedDay = valid && valid.getFullYear() === year && valid.getMonth() === month ? valid.getDate() : null;
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-datepicker-control",
      onClick: () => setOpen(current => !current)
    }, /*#__PURE__*/React__default.default.createElement("span", null, valid ? formatDatetimeLabel(valid) : placeholder), /*#__PURE__*/React__default.default.createElement("span", null, "\uD83D\uDCC5")), open && coords ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker-pop",
      style: {
        position: 'fixed',
        top: coords.top,
        bottom: coords.bottom,
        left: coords.left,
        width: 300,
        zIndex: 1000
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker-nav"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setMonthDate(new Date(year, month - 1, 1))
    }, "\u2039"), /*#__PURE__*/React__default.default.createElement("strong", null, monthDate.toLocaleString('en-IN', {
      month: 'long',
      year: 'numeric'
    })), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setMonthDate(new Date(year, month + 1, 1))
    }, "\u203A")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker-week"
    }, ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(label => /*#__PURE__*/React__default.default.createElement("span", {
      key: label
    }, label))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker-grid"
    }, cells.map((day, index) => day ? /*#__PURE__*/React__default.default.createElement("button", {
      key: `${year}-${month}-${day}`,
      type: "button",
      className: selectedDay === day ? 'is-selected' : '',
      onClick: () => apply(day)
    }, day) : /*#__PURE__*/React__default.default.createElement("span", {
      key: `empty-${index}`
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-datepicker-time"
    }, /*#__PURE__*/React__default.default.createElement("label", null, "Hour", /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      min: "0",
      max: "23",
      value: hours,
      onChange: event => {
        const next = pad(Math.min(23, Math.max(0, Number(event.target.value) || 0)));
        setHours(next);
        if (selectedDay) apply(selectedDay, next, minutes);
      }
    })), /*#__PURE__*/React__default.default.createElement("label", null, "Minute", /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      min: "0",
      max: "59",
      value: minutes,
      onChange: event => {
        const next = pad(Math.min(59, Math.max(0, Number(event.target.value) || 0)));
        setMinutes(next);
        if (selectedDay) apply(selectedDay, hours, next);
      }
    })), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-datepicker-clear",
      onClick: () => {
        onChange('');
        setOpen(false);
      }
    }, "Clear"))) : null);
  }
  const CouponEdit = props => {
    const {
      record: initialRecord,
      resource
    } = props;
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1');
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const selectedSlugs = parseSlugs(params.targetSlugs);
    const targetType = params.targetType || 'all';
    const applyOn = params.applyOn || 'cart';
    const usageType = params.usageType || 'unlimited';
    const couponType = params.type || 'percent';
    const isActive = params.isActive !== false && params.isActive !== 'false';
    React.useEffect(() => {
      let ignore = false;
      async function loadCatalog() {
        try {
          const categoryData = await fetch(`${apiBaseUrl}/categories`).then(response => response.json());
          const allProducts = [];
          let page = 1;
          let hasMore = true;
          while (hasMore && page <= 20) {
            const productData = await fetch(`${apiBaseUrl}/products?page=${page}&limit=100`).then(response => response.json());
            allProducts.push(...(productData.products || []));
            hasMore = Boolean(productData.hasMore);
            page += 1;
          }
          if (ignore) return;
          setProducts(allProducts);
          setCategories(Array.isArray(categoryData) ? categoryData : []);
        } catch {
          if (!ignore) {
            setProducts([]);
            setCategories([]);
          }
        }
      }
      loadCatalog();
      return () => {
        ignore = true;
      };
    }, [apiBaseUrl]);
    const setField = (key, value) => handleChange(key, value);
    const setSelectedSlugs = next => setField('targetSlugs', JSON.stringify(next));
    const productOptions = React.useMemo(() => products.map(item => ({
      value: item.slug,
      label: item.name
    })), [products]);
    const categoryOptions = React.useMemo(() => categories.map(item => ({
      value: item.slug,
      label: item.label
    })), [categories]);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save coupon',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: 'Coupon saved',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save coupon. Please try again.',
          type: 'error'
        });
      });
      return false;
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: submit,
      className: "tokri-coupon-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-hero"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      color: "white"
    }, "Create a store coupon"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Set who gets the discount, where it applies, and how many times it can be used.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Coupon code"), /*#__PURE__*/React__default.default.createElement("p", null, "Customers will type this at checkout on the website and app."), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input tokri-coupon-code",
      value: params.code || '',
      onChange: event => setField('code', event.target.value.toUpperCase()),
      placeholder: "WELCOME10",
      required: true
    }), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-toggle"
    }, /*#__PURE__*/React__default.default.createElement("input", {
      type: "checkbox",
      checked: isActive,
      onChange: event => setField('isActive', event.target.checked)
    }), "Coupon is active")), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Discount"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: couponType === 'percent',
      title: "Percent off",
      hint: "e.g. 10% off",
      onClick: () => setField('type', 'percent')
    }), /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: couponType === 'flat',
      title: "Flat amount",
      hint: "e.g. \u20B950 off",
      onClick: () => setField('type', 'flat')
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, couponType === 'percent' ? 'Percent value' : 'Amount (₹)', /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      step: "0.01",
      value: params.value ?? '',
      onChange: event => setField('value', event.target.value),
      required: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Min cart (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      step: "0.01",
      value: params.minCart ?? '',
      onChange: event => setField('minCart', event.target.value),
      placeholder: "0"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Max discount (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "0",
      step: "0.01",
      value: params.maxDiscount ?? '',
      onChange: event => setField('maxDiscount', event.target.value),
      placeholder: "No cap"
    }))))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Apply discount on"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: applyOn === 'cart',
      title: "Cart total",
      hint: "Reduce the items subtotal",
      onClick: () => setField('applyOn', 'cart')
    }), /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: applyOn === 'shipping',
      title: "Shipping fee",
      hint: "Reduce delivery charges",
      onClick: () => setField('applyOn', 'shipping')
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Who can get this discount"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Apply to", /*#__PURE__*/React__default.default.createElement(AnchoredSelect, {
      value: targetType,
      placeholder: "Choose who this coupon applies to",
      onChange: next => {
        setField('targetType', next);
        setSelectedSlugs([]);
      },
      options: [{
        value: 'all',
        label: 'All products'
      }, {
        value: 'products',
        label: 'Selected products'
      }, {
        value: 'categories',
        label: 'Selected categories'
      }]
    })), targetType === 'products' ? /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Products", /*#__PURE__*/React__default.default.createElement(SearchableMultiSelect, {
      options: productOptions,
      selected: selectedSlugs,
      onChange: setSelectedSlugs,
      placeholder: "Select products",
      searchPlaceholder: "Search products"
    })) : null, targetType === 'categories' ? /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Categories", /*#__PURE__*/React__default.default.createElement(SearchableMultiSelect, {
      options: categoryOptions,
      selected: selectedSlugs,
      onChange: setSelectedSlugs,
      placeholder: "Select categories",
      searchPlaceholder: "Search categories"
    })) : null), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Usage"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: usageType === 'unlimited',
      title: "Unlimited",
      hint: "Customers can reuse it",
      onClick: () => setField('usageType', 'unlimited')
    }), /*#__PURE__*/React__default.default.createElement(ChoiceCard, {
      selected: usageType === 'single',
      title: "Single use",
      hint: "One use per customer",
      onClick: () => setField('usageType', 'single')
    })), usageType === 'unlimited' ? /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Optional global cap", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      min: "1",
      value: params.usageLimit ?? '',
      onChange: event => setField('usageLimit', event.target.value),
      placeholder: "Leave blank for unlimited"
    })) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, "Each logged-in customer can use this coupon once."), params.usedCount ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "default"
    }, "Used ", params.usedCount, " time(s) so far.") : null), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Schedule"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Starts at", /*#__PURE__*/React__default.default.createElement(DateTimePicker, {
      value: toDatetimeValue(params.startsAt),
      onChange: next => setField('startsAt', next || null),
      placeholder: "Select start date and time"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Expires at", /*#__PURE__*/React__default.default.createElement(DateTimePicker, {
      value: toDatetimeValue(params.expiresAt),
      onChange: next => setField('expiresAt', next || null),
      placeholder: "Select expiry date and time"
    })))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save coupon")));
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
  AdminJS.UserComponents.CouponEdit = CouponEdit;
  AdminJS.UserComponents.OrderDetail = OrderDetail;
  AdminJS.UserComponents.ChangePassword = ChangePassword;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvZm9ybS1jb250cm9scy5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEJveCwgSDIsIEg1LCBUZXh0LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3Qgc3RhdENhcmRzID0gW1xuICB7IGtleTogJ3Byb2R1Y3RDb3VudCcsIGxhYmVsOiAnUHJvZHVjdHMnLCBpY29uOiAnU2hvcHBpbmdDYXJ0JywgcmVzb3VyY2U6ICdQcm9kdWN0JyB9LFxuICB7IGtleTogJ29yZGVyQ291bnQnLCBsYWJlbDogJ09yZGVycycsIGljb246ICdTaG9wcGluZ0JhZycsIHJlc291cmNlOiAnT3JkZXInIH0sXG4gIHsga2V5OiAncGFnZUNvdW50JywgbGFiZWw6ICdQYWdlcycsIGljb246ICdGaWxlVGV4dCcsIHJlc291cmNlOiAnUGFnZScgfSxcbiAgeyBrZXk6ICdyZXZpZXdDb3VudCcsIGxhYmVsOiAnUmV2aWV3cycsIGljb246ICdTdGFyJywgcmVzb3VyY2U6ICdSZXZpZXcnIH0sXG5dXG5cbmNvbnN0IGFkbWluUm9vdCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnL3Jlc291cmNlcycpWzBdIHx8ICcnXG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFwaS5nZXREYXNoYm9hcmQoKS50aGVuKChyZXMpID0+IHNldERhdGEocmVzLmRhdGEpKS5jYXRjaCgoKSA9PiBzZXREYXRhKHt9KSlcbiAgfSwgW10pXG5cbiAgY29uc3Qgc3RhdHMgPSBkYXRhIHx8IHt9XG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3QoKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiIGNsYXNzTmFtZT1cInRva3JpLWRhc2hib2FyZFwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1kYXNoYm9hcmQtaGVyb1wiIHA9XCJ4eGxcIiBtYj1cInhsXCI+XG4gICAgICAgIDxIMiBtYj1cInNtXCI+V2VsY29tZSB0byBUb2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuOX0+XG4gICAgICAgICAgTWFuYWdlIHlvdXIgc3RvcmUgY29udGVudCwgcHJvZHVjdHMsIG9yZGVycywgYW5kIHdlYnNpdGUgc2V0dGluZ3MgZnJvbSBvbmUgcGxhY2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktc3RhdC1ncmlkXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7c3RhdENhcmRzLm1hcCgoY2FyZCkgPT4gKFxuICAgICAgICAgIDxCb3gga2V5PXtjYXJkLmtleX0gY2xhc3NOYW1lPVwidG9rcmktc3RhdC1jYXJkXCIgcD1cImxnXCI+XG4gICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICA8SDU+e2NhcmQubGFiZWx9PC9INT5cbiAgICAgICAgICAgICAgPEljb24gaWNvbj17Y2FyZC5pY29ufSAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8VGV4dCBmb250U2l6ZT17MzJ9IGZvbnRXZWlnaHQ9XCJib2xkXCI+XG4gICAgICAgICAgICAgIHtzdGF0c1tjYXJkLmtleV0gPz8gJ+KAlCd9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIG10PVwiZGVmYXVsdFwiXG4gICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgaHJlZj17YC90b2tyaS1iYWNrb2ZmaWNlL3Jlc291cmNlcy8ke2NhcmQucmVzb3VyY2V9YH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgVmlldyBhbGxcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktZGFzaGJvYXJkLWdyaWRcIj5cbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJ4bFwiPlxuICAgICAgICAgIDxINSBtYj1cImxnXCI+UXVpY2sgYWN0aW9uczwvSDU+XG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGNsYXNzTmFtZT1cInRva3JpLXF1aWNrLWFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1Byb2R1Y3QvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwiY29udGFpbmVkXCI+XG4gICAgICAgICAgICAgIEFkZCBwcm9kdWN0XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1BhZ2UvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgQWRkIHBhZ2VcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgJHtyb290fS9yZXNvdXJjZXMvU2V0dGluZy9yZWNvcmRzLzEvZWRpdGB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBTdG9yZSBzZXR0aW5nc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9PcmRlcmB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBWaWV3IG9yZGVyc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPlJlY2VudCBvcmRlcnM8L0g1PlxuICAgICAgICAgIHsoc3RhdHMucmVjZW50T3JkZXJzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIG9yZGVycyB5ZXQuPC9UZXh0PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8Qm94IGFzPVwidGFibGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1yZWNlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0aD5PcmRlcjwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD5Ub3RhbDwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgIHtzdGF0cy5yZWNlbnRPcmRlcnMubWFwKChvcmRlcikgPT4gKFxuICAgICAgICAgICAgICAgICAgPHRyIGtleT17b3JkZXIub3JkZXJOb30+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD57b3JkZXIub3JkZXJOb308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+e29yZGVyLnN0YXR1c308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+4oK5e29yZGVyLmdyYW5kVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQW5jaG9yZWRNZW51KG9wZW4pIHtcbiAgY29uc3Qgd3JhcFJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbY29vcmRzLCBzZXRDb29yZHNdID0gdXNlU3RhdGUobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdyYXBSZWYuY3VycmVudFxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBzcGFjZUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b21cbiAgICAgIGNvbnN0IG9wZW5VcCA9IHNwYWNlQmVsb3cgPCAyODAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93XG4gICAgICBzZXRDb29yZHMoe1xuICAgICAgICB0b3A6IG9wZW5VcCA/IHVuZGVmaW5lZCA6IHJlY3QuYm90dG9tICsgNixcbiAgICAgICAgYm90dG9tOiBvcGVuVXAgPyB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LnRvcCArIDYgOiB1bmRlZmluZWQsXG4gICAgICAgIGxlZnQ6IE1hdGgubWF4KDEyLCByZWN0LmxlZnQpLFxuICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIH1cbiAgfSwgW29wZW5dKVxuXG4gIHJldHVybiB7IHdyYXBSZWYsIGNvb3JkcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2hhYmxlTXVsdGlTZWxlY3QoeyBvcHRpb25zLCBzZWxlY3RlZCwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCB7IHdyYXBSZWYsIGNvb3JkcyB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IHNlbGVjdGVkU2V0ID0gdXNlTWVtbygoKSA9PiBuZXcgU2V0KHNlbGVjdGVkKSwgW3NlbGVjdGVkXSlcbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKSlcbiAgY29uc3QgZmlsdGVyZWQgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT5cbiAgICBgJHtpdGVtLmxhYmVsfSAke2l0ZW0udmFsdWV9YC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcbiAgKVxuXG4gIGNvbnN0IHRvZ2dsZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZWxlY3RlZFNldC5oYXModmFsdWUpKSBvbkNoYW5nZShzZWxlY3RlZC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHZhbHVlKSlcbiAgICBlbHNlIG9uQ2hhbmdlKFsuLi5zZWxlY3RlZCwgdmFsdWVdKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBzXCI+XG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBcIj5cbiAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGUoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgw5dcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1wbGFjZWhvbGRlclwiPntwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgY29vcmRzID8gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbWVudVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgdG9wOiBjb29yZHMudG9wLFxuICAgICAgICAgICAgYm90dG9tOiBjb29yZHMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogY29vcmRzLmxlZnQsXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5tYXgoY29vcmRzLndpZHRoLCAyNjApLFxuICAgICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtjaGVja2VkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGUoaXRlbS52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZsYWdDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuY29uc3QgUHJvZHVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgcHJvZHVjdFVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20ucHJvZHVjdFVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcHJvZHVjdGAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLm5hbWUpXG4gIGNvbnN0IHByb2R1Y3RVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke3Byb2R1Y3RVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmNhdGVnb3J5SWRzKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZXRTZWxlY3RlZENhdGVnb3JpZXMgPSAoc2x1Z3MpID0+IHNldEZpZWxkKCdjYXRlZ29yeUlkcycsIEpTT04uc3RyaW5naWZ5KHNsdWdzKSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncHJvZHVjdHMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ21lZGlhSWQnLCBtZWRpYS5pZClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdQcm9kdWN0IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRpb25Qcm9wZXJ0eSA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbmQoXG4gICAgKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS5wcm9wZXJ0eVBhdGggPT09ICdkZXNjcmlwdGlvbicsXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ05ldyBwcm9kdWN0J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+QWRkIHBob3RvcywgcHJpY2VzLCBhbmQgb25lIG9yIG1vcmUgY2F0ZWdvcmllcyBmb3IgdGhlIHdlYnNpdGUgYW5kIGFwcC48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9kdWN0IGRldGFpbHM8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFscGhvbnNvIE1hbmdvXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtwcm9kdWN0VXJsID8gKFxuICAgICAgICAgICAgICA8YSBocmVmPXtwcm9kdWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge3Byb2R1Y3RVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBwcm9kdWN0IG5hbWUgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBQcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPbGQgcHJpY2UgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5vbGRQcmljZVZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdvbGRQcmljZVZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9wdGlvbmFsXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFdlaWdodFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMud2VpZ2h0IHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd3ZWlnaHQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMSBrZ1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBCYWRnZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYmFkZ2UgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2JhZGdlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNoXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0b2NrXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdG9jayA/PyAxMDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N0b2NrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Byb2R1Y3QgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSBzcXVhcmUgcHJvZHVjdCBwaG90bzwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yaWVzPC9oND5cbiAgICAgICAgPHA+QSBwcm9kdWN0IGNhbiBhcHBlYXIgaW4gbW9yZSB0aGFuIG9uZSBjYXRlZ29yeSBvbiB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFNlbGVjdCBjYXRlZ29yaWVzXG4gICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKX1cbiAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENhdGVnb3J5U2x1Z3N9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRDYXRlZ29yaWVzfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggYW5kIHNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5TdG9yZSBwbGFjZW1lbnQ8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiQmVzdHNlbGxlclwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBiZXN0c2VsbGVyc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNCZXN0U2VsbGVyJywgIShwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzSW1wb3J0ZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzSW1wb3J0ZWQgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiSW1wb3J0ZWRcIlxuICAgICAgICAgICAgaGludD1cIlNob3cgaW4gaW1wb3J0ZWQgZnJ1aXRzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0ltcG9ydGVkJywgIShwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNGZWF0dXJlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNGZWF0dXJlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJGZWF0dXJlZFwiXG4gICAgICAgICAgICBoaW50PVwiSGlnaGxpZ2h0IHRoaXMgZnJ1aXRcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzRmVhdHVyZWQnLCAhKHBhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnfVxuICAgICAgICAgICAgdGl0bGU9XCJBY3RpdmVcIlxuICAgICAgICAgICAgaGludD1cIlZpc2libGUgdG8gY3VzdG9tZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBwcm9kdWN0XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PlxuICBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgQ2F0ZWdvcnlFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgYmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Jhbm5lclByZXZpZXdVcmwsIHNldEJhbm5lclByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubGFiZWwpXG4gIGNvbnN0IGNhdGVnb3J5VXJsID0gcHJldmlld1NsdWcgPyBgJHtjYXRlZ29yeVVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYW5uZXJJbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5iYW5uZXJJbWFnZSkpIHJldHVybiBwYXJhbXMuYmFubmVySW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5iYW5uZXJJbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuYmFubmVySW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEJhbm5lclVybCA9IGJhbm5lclByZXZpZXdVcmwgfHwgYmFubmVySW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChiYW5uZXJQcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGJhbm5lclByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbYmFubmVyUHJldmlld1VybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdsYWJlbCcgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkVG8gPSBhc3luYyAoZmlsZSwgZmllbGQsIHNldExvY2FsUHJldmlldywgc2V0QnVzeSwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnY2F0ZWdvcmllcycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBzZXRMb2NhbFByZXZpZXcoVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgICBzZXRCdXN5KHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldExvY2FsUHJldmlldyhcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDYXRlZ29yeSBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubGFiZWwgfHwgJ05ldyBjYXRlZ29yeSd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHNob3Agc2VjdGlvbiB3aXRoIGEgdGh1bWJuYWlsLCBiYW5uZXIsIGFuZCBwYWdlIGNvcHkuPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTGFiZWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdsYWJlbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2ggRnJ1aXRzXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQYWdlIGhlYWRpbmdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNhbWUgYXMgbGFiZWwgaWYgZW1wdHlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN1YnRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdWJ0aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaG9ydCBsaW5lIHVuZGVyIHRoZSBoZWFkaW5nXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBsYWJlbFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgICB7Y2F0ZWdvcnlVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e2NhdGVnb3J5VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge2NhdGVnb3J5VXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gY2F0ZWdvcnkgbGFiZWwgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTb3J0IG9yZGVyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zb3J0T3JkZXIgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc29ydE9yZGVyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gd2Vic2l0ZSBhbmQgYXBwXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNhdGVnb3J5IGltYWdlPC9oND5cbiAgICAgICAgICA8cD5TcXVhcmUgdGh1bWJuYWlsIHVzZWQgaW4gdGhlIGhvbWUgY2F0ZWdvcnkgZ3JpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IHByZXZpZXcnfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGNhdGVnb3J5IGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkVG8oZmlsZSwgJ2ltYWdlJywgc2V0UHJldmlld1VybCwgc2V0VXBsb2FkaW5nLCAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yeSBiYW5uZXI8L2g0PlxuICAgICAgICA8cD5XaWRlIGltYWdlIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2UuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3AgdG9rcmktdXBsb2FkLWRyb3Atd2lkZVwiPlxuICAgICAgICAgIHtkaXNwbGF5ZWRCYW5uZXJVcmwgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkQmFubmVyVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgYmFubmVyJ30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGEgd2lkZSBiYW5uZXIgKDE2MDDDlzQwMCByZWNvbW1lbmRlZCk8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRUbyhcbiAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAnYmFubmVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyUHJldmlld1VybCxcbiAgICAgICAgICAgICAgICAgIHNldEJhbm5lclVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICdCYW5uZXIgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkRlc2NyaXB0aW9uPC9oND5cbiAgICAgICAge2Rlc2NyaXB0aW9uUHJvcGVydHkgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT5cbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtkZXNjcmlwdGlvblByb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7cmVzb3VyY2UuZWRpdFByb3BlcnRpZXNcbiAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gWydpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCkpXG4gICAgICAgICAgLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjYXRlZ29yeVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBJY29uLCBJbnB1dCwgUGFnaW5hdGlvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBSZWNvcmRzVGFibGUsXG4gIHVzZVF1ZXJ5UGFyYW1zLFxuICB1c2VSZWNvcmRzLFxuICB1c2VTZWxlY3RlZFJlY29yZHMsXG59IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IENtc0xpc3QgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZXNvdXJjZSwgc2V0VGFnIH0gPSBwcm9wc1xuICBjb25zdCB0aXRsZVByb3AgPSByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5uYW1lIHx8IHJlc291cmNlLnRpdGxlUHJvcGVydHk/LnByb3BlcnR5UGF0aCB8fCAnaWQnXG5cbiAgY29uc3QgeyBzdG9yZVBhcmFtcywgZmlsdGVycyB9ID0gdXNlUXVlcnlQYXJhbXMoKVxuICBjb25zdCB7XG4gICAgcmVjb3JkcyxcbiAgICBsb2FkaW5nLFxuICAgIGRpcmVjdGlvbixcbiAgICBzb3J0QnksXG4gICAgcGFnZSxcbiAgICB0b3RhbCxcbiAgICBmZXRjaERhdGEsXG4gICAgcGVyUGFnZSxcbiAgfSA9IHVzZVJlY29yZHMocmVzb3VyY2UuaWQpXG4gIGNvbnN0IHtcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgaGFuZGxlU2VsZWN0LFxuICAgIGhhbmRsZVNlbGVjdEFsbCxcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMsXG4gIH0gPSB1c2VTZWxlY3RlZFJlY29yZHMocmVjb3JkcylcblxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCgpID0+IFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gIGNvbnN0IGRlYm91bmNlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IHN0b3JlUGFyYW1zUmVmID0gdXNlUmVmKHN0b3JlUGFyYW1zKVxuICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50ID0gc3RvcmVQYXJhbXNcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFF1ZXJ5KFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzKFtdKVxuICB9LCBbcmVzb3VyY2UuaWQsIHRpdGxlUHJvcCwgc2V0U2VsZWN0ZWRSZWNvcmRzXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZXRUYWcpIHNldFRhZyh0b3RhbC50b1N0cmluZygpKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgY29uc3QgaGFuZGxlUXVlcnlDaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIHNldFF1ZXJ5KHZhbHVlKVxuXG4gICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIGRlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKClcbiAgICAgIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQoe1xuICAgICAgICBwYWdlOiAnMScsXG4gICAgICAgIGZpbHRlcnM6IHRyaW1tZWQgPyB7IFt0aXRsZVByb3BdOiB0cmltbWVkIH0gOiB7fSxcbiAgICAgIH0pXG4gICAgfSwgMzAwKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQWN0aW9uUGVyZm9ybWVkID0gKCkgPT4gZmV0Y2hEYXRhKClcblxuICBjb25zdCBoYW5kbGVQYWdpbmF0aW9uQ2hhbmdlID0gKHBhZ2VOdW1iZXIpID0+IHtcbiAgICBzdG9yZVBhcmFtcyh7IHBhZ2U6IHBhZ2VOdW1iZXIudG9TdHJpbmcoKSB9KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCI+XG4gICAgICA8Qm94IG1iPVwibGdcIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbWF4V2lkdGg6IDQyMCB9fT5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICBsZWZ0OiAxMixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8SWNvbiBpY29uPVwiU2VhcmNoXCIgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUXVlcnlDaGFuZ2V9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2BTZWFyY2ggJHtyZXNvdXJjZS5uYW1lfS4uLmB9XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ0xlZnQ6IDM2IH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCB2YXJpYW50PVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxSZWNvcmRzVGFibGVcbiAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgcmVjb3Jkcz17cmVjb3Jkc31cbiAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2hhbmRsZUFjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgaXNMb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAvPlxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICAgIHBhZ2U9e3BhZ2V9XG4gICAgICAgICAgICBwZXJQYWdlPXtwZXJQYWdlfVxuICAgICAgICAgICAgdG90YWw9e3RvdGFsfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVBhZ2luYXRpb25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ21zTGlzdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBSZXZpZXdFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ3Jldmlld3MnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3VXJsKFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHJldmlldycsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcHJvcGVydHlCeVBhdGggPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gW3Byb3BlcnR5LnByb3BlcnR5UGF0aCwgcHJvcGVydHldKSxcbiAgKVxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IChwcm9wZXJ0eVBhdGgpID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnR5QnlQYXRoW3Byb3BlcnR5UGF0aF1cbiAgICBpZiAoIXByb3BlcnR5KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVtYWluaW5nUHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcihcbiAgICAocHJvcGVydHkpID0+ICFbJ3RpdGxlJywgJ25hbWUnLCAnY29udGVudCcsICdpbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gcD1cInhsXCI+XG4gICAgICA8Qm94IG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5SZXZpZXc8L0g0PlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICBBZGQgdGhlIHJldmlldyB0aXRsZSwgcmV2aWV3ZXIgbmFtZSwgY29udGVudCwgYW5kIGFuIG9wdGlvbmFsIHJldmlld2VyIGltYWdlLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCd0aXRsZScpfTwvQm94PlxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCduYW1lJyl9PC9Cb3g+XG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ2NvbnRlbnQnKX08L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+UmV2aWV3ZXIgSW1hZ2U8L0g0PlxuXG4gICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH1cbiAgICAgICAgICAgICAgYWx0PXtwYXJhbXMubmFtZSB8fCAnUmV2aWV3ZXInfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxNDAsXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY292ZXInLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkYmUzZWEnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIE5vIGltYWdlIHNlbGVjdGVkIHlldC5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e3VwbG9hZEltYWdlfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHtyZW1haW5pbmdQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgPEJveCBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH0gbWI9XCJsZ1wiPlxuICAgICAgICAgIHtyZW5kZXJQcm9wZXJ0eShwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpfVxuICAgICAgICA8L0JveD5cbiAgICAgICkpfVxuXG4gICAgICA8Qm94IG10PVwieGxcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgcmV2aWV3XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmV2aWV3RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBEcmF3ZXJDb250ZW50LFxuICBEcmF3ZXJGb290ZXIsXG4gIEg0LFxuICBJY29uLFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VSZWNvcmQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IFRBQlMgPSBbXG4gIHtcbiAgICBpZDogJ2dlbmVyYWwnLFxuICAgIGxhYmVsOiAnR2VuZXJhbCcsXG4gICAgZmllbGRzOiBbXG4gICAgICAnc3RvcmVOYW1lJyxcbiAgICAgICdzdG9yZVRhZ2xpbmUnLFxuICAgICAgJ3N0b3JlRW1haWwnLFxuICAgICAgJ3N0b3JlUGhvbmUxJyxcbiAgICAgICdzdG9yZVBob25lMicsXG4gICAgICAnc3RvcmVBZGRyZXNzJyxcbiAgICAgICdwcm9tb0Jhbm5lcicsXG4gICAgICAnZWFybHlEZWxpdmVyeScsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnY2hhcmdlcycsXG4gICAgbGFiZWw6ICdDaGFyZ2VzJyxcbiAgICBmaWVsZHM6IFsnc2hpcHBpbmdGZWUnLCAnaGFuZGxpbmdGZWUnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaG9tZXBhZ2UnLFxuICAgIGxhYmVsOiAnSG9tZXBhZ2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2hvbWVCYW5uZXJFbmFibGVkJyxcbiAgICAgICdob21lQ2F0ZWdvcmllc0VuYWJsZWQnLFxuICAgICAgJ2hvbWVCZXN0U2VsbGVyc0VuYWJsZWQnLFxuICAgICAgJ2hvbWVCZXN0U2VsbGVyc1RpdGxlJyxcbiAgICAgICdob21lU2hvcE91clJhbmdlRW5hYmxlZCcsXG4gICAgICAnaG9tZUZydWl0SGlnaGxpZ2h0RW5hYmxlZCcsXG4gICAgICAnaG9tZUltcG9ydGVkRnJ1aXRzRW5hYmxlZCcsXG4gICAgICAnaG9tZVJldmlld3NFbmFibGVkJyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYXltZW50cycsXG4gICAgbGFiZWw6ICdQYXltZW50cycsXG4gICAgZmllbGRzOiBbJ3Jhem9ycGF5RW5hYmxlZCcsICdyYXpvcnBheUtleUlkJywgJ3Jhem9ycGF5S2V5U2VjcmV0J10sXG4gIH0sXG4gIHtcbiAgICBpZDogJ25vdGlmaWNhdGlvbnMnLFxuICAgIGxhYmVsOiAnTm90aWZpY2F0aW9ucycsXG4gICAgZmllbGRzOiBbXG4gICAgICAnbXNnOTFFbmFibGVkJyxcbiAgICAgICdtc2c5MUF1dGhLZXknLFxuICAgICAgJ21zZzkxU2VuZGVySWQnLFxuICAgICAgJ21zZzkxT3RwVGVtcGxhdGVJZCcsXG4gICAgICAnbXNnOTFPcmRlclRlbXBsYXRlSWQnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBFbmFibGVkJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwTnVtYmVyJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3RwVGVtcGxhdGUnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBPcmRlclRlbXBsYXRlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwTGFuZ3VhZ2UnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBOYW1lc3BhY2UnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBPdHBCdXR0b24nLFxuICAgIF0sXG4gIH0sXG5dXG5cbmNvbnN0IFNldHRpbmdzRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgnZ2VuZXJhbCcpXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJylcbiAgICBpZiAoaGFzaCA9PT0gJ2FwcGVhcmFuY2UnKSB7XG4gICAgICBzZXRBY3RpdmVUYWIoJ2NoYXJnZXMnKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChoYXNoICYmIFRBQlMuc29tZSgodGFiKSA9PiB0YWIuaWQgPT09IGhhc2gpKSB7XG4gICAgICBzZXRBY3RpdmVUYWIoaGFzaClcbiAgICB9XG4gIH0sIFtdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCBgIyR7YWN0aXZlVGFifWApXG4gIH0sIFthY3RpdmVUYWJdKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnc3VjY2VzcycgfHwgcmVzcG9uc2U/LmRhdGE/LnJlY29yZCkge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiAnU2V0dGluZ3Mgc2F2ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGZsZXggZmxleERpcmVjdGlvbj1cImNvbHVtblwiIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtdGFic1wiIG1iPVwieGxcIj5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2V0dGluZ3MtdGFiJHthY3RpdmVUYWIgPT09IHRhYi5pZCA/ICcgaXMtYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIodGFiLmlkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGFiLmxhYmVsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8RHJhd2VyQ29udGVudD5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKChwcm9wZXJ0eSkgPT5cbiAgICAgICAgICAgIHRhYi5maWVsZHMuaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgICAgICAgICApXG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtcGFuZWxcIlxuICAgICAgICAgICAgICBwPVwieGxcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiBhY3RpdmVUYWIgPT09IHRhYi5pZCA/ICdibG9jaycgOiAnbm9uZScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEg0IG1iPVwic21cIj57dGFiLmxhYmVsfTwvSDQ+XG4gICAgICAgICAgICAgIDxUZXh0IG1iPVwieGxcIiBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICAgICAgICB7dGFiLmlkID09PSAnY2hhcmdlcydcbiAgICAgICAgICAgICAgICAgID8gJ1NoaXBwaW5nIGZlZSBhbmQgaGFuZGxpbmcgY2hhcmdlIGFyZSBhZGRlZCB0byBldmVyeSBvcmRlciBvbiB0aGUgd2Vic2l0ZSBhbmQgdGhlIGFwcC4nXG4gICAgICAgICAgICAgICAgICA6ICdVcGRhdGUgeW91ciBzdG9yZSBzZXR0aW5ncyBhbmQgY2xpY2sgU2F2ZSBjaGFuZ2VzIGJlbG93Lid9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcmdlcy1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgU2hpcHBpbmcgZmVlICjigrkpXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uc2hpcHBpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdzaGlwcGluZ0ZlZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5EZWxpdmVyeSBjaGFyZ2UgYWRkZWQgdG8gZXZlcnkgb3JkZXI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBIYW5kbGluZyBjaGFyZ2UgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5oYW5kbGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2hhbmRsaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkNhcnQgaGFuZGxpbmcgZmVlIGFkZGVkIHRvIGV2ZXJ5IG9yZGVyPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L0RyYXdlckNvbnRlbnQ+XG5cbiAgICAgIDxEcmF3ZXJGb290ZXI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjaGFuZ2VzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EcmF3ZXJGb290ZXI+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcGFkKG51bSkge1xuICByZXR1cm4gU3RyaW5nKG51bSkucGFkU3RhcnQoMiwgJzAnKVxufVxuXG5mdW5jdGlvbiB0b0RhdGV0aW1lVmFsdWUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke3BhZChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtwYWQoZGF0ZS5nZXREYXRlKCkpfVQke3BhZChkYXRlLmdldEhvdXJzKCkpfToke3BhZChkYXRlLmdldE1pbnV0ZXMoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRldGltZUxhYmVsKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRheTogJzItZGlnaXQnLFxuICAgIG1vbnRoOiAnc2hvcnQnLFxuICAgIHllYXI6ICdudW1lcmljJyxcbiAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgbWludXRlOiAnMi1kaWdpdCcsXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW2Nvb3Jkcywgc2V0Q29vcmRzXSA9IHVzZVN0YXRlKG51bGwpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW9wZW4pIHJldHVybiB1bmRlZmluZWRcblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGUgPSB3cmFwUmVmLmN1cnJlbnRcbiAgICAgIGlmICghbm9kZSkgcmV0dXJuXG4gICAgICBjb25zdCByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgY29uc3Qgc3BhY2VCZWxvdyA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHJlY3QuYm90dG9tXG4gICAgICBjb25zdCBvcGVuVXAgPSBzcGFjZUJlbG93IDwgMjgwICYmIHJlY3QudG9wID4gc3BhY2VCZWxvd1xuICAgICAgc2V0Q29vcmRzKHtcbiAgICAgICAgdG9wOiBvcGVuVXAgPyB1bmRlZmluZWQgOiByZWN0LmJvdHRvbSArIDYsXG4gICAgICAgIGJvdHRvbTogb3BlblVwID8gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC50b3AgKyA2IDogdW5kZWZpbmVkLFxuICAgICAgICBsZWZ0OiBNYXRoLm1heCgxMiwgcmVjdC5sZWZ0KSxcbiAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBjb29yZHMgfVxufVxuXG5mdW5jdGlvbiBDaG9pY2VDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZnVuY3Rpb24gQW5jaG9yZWRTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIHBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgY29vcmRzIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPntzZWxlY3RlZD8ubGFiZWwgfHwgcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuICYmIGNvb3JkcyA/IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LW1lbnVcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgIHRvcDogY29vcmRzLnRvcCxcbiAgICAgICAgICAgIGJvdHRvbTogY29vcmRzLmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IGNvb3Jkcy5sZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IE1hdGgubWF4KGNvb3Jkcy53aWR0aCwgMjIwKSxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge29wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7aXRlbS52YWx1ZSA9PT0gdmFsdWUgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBjb29yZHMgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuICYmIGNvb3JkcyA/IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LW1lbnVcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgIHRvcDogY29vcmRzLnRvcCxcbiAgICAgICAgICAgIGJvdHRvbTogY29vcmRzLmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IGNvb3Jkcy5sZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IE1hdGgubWF4KGNvb3Jkcy53aWR0aCwgMjYwKSxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIERhdGVUaW1lUGlja2VyKHsgdmFsdWUsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IHBhcnNlZCA9IHZhbHVlID8gbmV3IERhdGUodmFsdWUpIDogbnVsbFxuICBjb25zdCB2YWxpZCA9IHBhcnNlZCAmJiAhTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpID8gcGFyc2VkIDogbnVsbFxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21vbnRoRGF0ZSwgc2V0TW9udGhEYXRlXSA9IHVzZVN0YXRlKHZhbGlkIHx8IG5ldyBEYXRlKCkpXG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0SG91cnMoKSkgOiAnMDAnKVxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSh2YWxpZCA/IHBhZCh2YWxpZC5nZXRNaW51dGVzKCkpIDogJzAwJylcbiAgY29uc3QgeyB3cmFwUmVmLCBjb29yZHMgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghdmFsaWQpIHJldHVyblxuICAgIHNldE1vbnRoRGF0ZSh2YWxpZClcbiAgICBzZXRIb3VycyhwYWQodmFsaWQuZ2V0SG91cnMoKSkpXG4gICAgc2V0TWludXRlcyhwYWQodmFsaWQuZ2V0TWludXRlcygpKSlcbiAgfSwgW3ZhbHVlXSlcblxuICBjb25zdCB5ZWFyID0gbW9udGhEYXRlLmdldEZ1bGxZZWFyKClcbiAgY29uc3QgbW9udGggPSBtb250aERhdGUuZ2V0TW9udGgoKVxuICBjb25zdCBmaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKS5nZXREYXkoKVxuICBjb25zdCB0b3RhbERheXMgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLmdldERhdGUoKVxuICBjb25zdCBjZWxscyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3REYXk7IGkgKz0gMSkgY2VsbHMucHVzaChudWxsKVxuICBmb3IgKGxldCBkYXkgPSAxOyBkYXkgPD0gdG90YWxEYXlzOyBkYXkgKz0gMSkgY2VsbHMucHVzaChkYXkpXG5cbiAgY29uc3QgYXBwbHkgPSAoZGF5LCBuZXh0SG91cnMgPSBob3VycywgbmV4dE1pbnV0ZXMgPSBtaW51dGVzKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGAke3llYXJ9LSR7cGFkKG1vbnRoICsgMSl9LSR7cGFkKGRheSl9VCR7cGFkKE51bWJlcihuZXh0SG91cnMpIHx8IDApfToke3BhZChOdW1iZXIobmV4dE1pbnV0ZXMpIHx8IDApfWBcbiAgICBvbkNoYW5nZShuZXh0KVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWREYXkgPVxuICAgIHZhbGlkICYmIHZhbGlkLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiYgdmFsaWQuZ2V0TW9udGgoKSA9PT0gbW9udGggPyB2YWxpZC5nZXREYXRlKCkgOiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXJcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpfT5cbiAgICAgICAgPHNwYW4+e3ZhbGlkID8gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWxpZCkgOiBwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgIDxzcGFuPvCfk4U8L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuICYmIGNvb3JkcyA/IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItcG9wXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICB0b3A6IGNvb3Jkcy50b3AsXG4gICAgICAgICAgICBib3R0b206IGNvb3Jkcy5ib3R0b20sXG4gICAgICAgICAgICBsZWZ0OiBjb29yZHMubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1uYXZcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldE1vbnRoRGF0ZShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIDEpKX0+XG4gICAgICAgICAgICAgIOKAuVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8c3Ryb25nPlxuICAgICAgICAgICAgICB7bW9udGhEYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbW9udGg6ICdsb25nJywgeWVhcjogJ251bWVyaWMnIH0pfVxuICAgICAgICAgICAgPC9zdHJvbmc+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLpcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci13ZWVrXCI+XG4gICAgICAgICAgICB7WydTdScsICdNbycsICdUdScsICdXZScsICdUaCcsICdGcicsICdTYSddLm1hcCgobGFiZWwpID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtsYWJlbH0+e2xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1ncmlkXCI+XG4gICAgICAgICAgICB7Y2VsbHMubWFwKChkYXksIGluZGV4KSA9PlxuICAgICAgICAgICAgICBkYXkgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3NlbGVjdGVkRGF5ID09PSBkYXkgPyAnaXMtc2VsZWN0ZWQnIDogJyd9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBhcHBseShkYXkpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtkYXl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgZW1wdHktJHtpbmRleH1gfSAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItdGltZVwiPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBIb3VyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjIzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17aG91cnN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbigyMywgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0SG91cnMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIG5leHQsIG1pbnV0ZXMpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIE1pbnV0ZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCI1OVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e21pbnV0ZXN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbig1OSwgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0TWludXRlcyhuZXh0KVxuICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF5KSBhcHBseShzZWxlY3RlZERheSwgaG91cnMsIG5leHQpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLWNsZWFyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKCcnKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIENsZWFyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBDb3Vwb25FZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBzZWxlY3RlZFNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMudGFyZ2V0U2x1Z3MpXG4gIGNvbnN0IHRhcmdldFR5cGUgPSBwYXJhbXMudGFyZ2V0VHlwZSB8fCAnYWxsJ1xuICBjb25zdCBhcHBseU9uID0gcGFyYW1zLmFwcGx5T24gfHwgJ2NhcnQnXG4gIGNvbnN0IHVzYWdlVHlwZSA9IHBhcmFtcy51c2FnZVR5cGUgfHwgJ3VubGltaXRlZCdcbiAgY29uc3QgY291cG9uVHlwZSA9IHBhcmFtcy50eXBlIHx8ICdwZXJjZW50J1xuICBjb25zdCBpc0FjdGl2ZSA9IHBhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRDYXRhbG9nKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlEYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIGNvbnN0IGFsbFByb2R1Y3RzID0gW11cbiAgICAgICAgbGV0IHBhZ2UgPSAxXG4gICAgICAgIGxldCBoYXNNb3JlID0gdHJ1ZVxuICAgICAgICB3aGlsZSAoaGFzTW9yZSAmJiBwYWdlIDw9IDIwKSB7XG4gICAgICAgICAgY29uc3QgcHJvZHVjdERhdGEgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9wcm9kdWN0cz9wYWdlPSR7cGFnZX0mbGltaXQ9MTAwYCkudGhlbigocmVzcG9uc2UpID0+XG4gICAgICAgICAgICByZXNwb25zZS5qc29uKCksXG4gICAgICAgICAgKVxuICAgICAgICAgIGFsbFByb2R1Y3RzLnB1c2goLi4uKHByb2R1Y3REYXRhLnByb2R1Y3RzIHx8IFtdKSlcbiAgICAgICAgICBoYXNNb3JlID0gQm9vbGVhbihwcm9kdWN0RGF0YS5oYXNNb3JlKVxuICAgICAgICAgIHBhZ2UgKz0gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBzZXRQcm9kdWN0cyhhbGxQcm9kdWN0cylcbiAgICAgICAgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGNhdGVnb3J5RGF0YSkgPyBjYXRlZ29yeURhdGEgOiBbXSlcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgIHNldFByb2R1Y3RzKFtdKVxuICAgICAgICAgIHNldENhdGVnb3JpZXMoW10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkQ2F0YWxvZygpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzZXRTZWxlY3RlZFNsdWdzID0gKG5leHQpID0+IHNldEZpZWxkKCd0YXJnZXRTbHVncycsIEpTT04uc3RyaW5naWZ5KG5leHQpKVxuXG4gIGNvbnN0IHByb2R1Y3RPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBwcm9kdWN0cy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLm5hbWUgfSkpLFxuICAgIFtwcm9kdWN0c10sXG4gIClcbiAgY29uc3QgY2F0ZWdvcnlPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubGFiZWwgfSkpLFxuICAgIFtjYXRlZ29yaWVzXSxcbiAgKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdXBvbiBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24uIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHN0b3JlIGNvdXBvbjwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBTZXQgd2hvIGdldHMgdGhlIGRpc2NvdW50LCB3aGVyZSBpdCBhcHBsaWVzLCBhbmQgaG93IG1hbnkgdGltZXMgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNvdXBvbiBjb2RlPC9oND5cbiAgICAgICAgICA8cD5DdXN0b21lcnMgd2lsbCB0eXBlIHRoaXMgYXQgY2hlY2tvdXQgb24gdGhlIHdlYnNpdGUgYW5kIGFwcC48L3A+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXQgdG9rcmktY291cG9uLWNvZGVcIlxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2NvZGUnLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldFTENPTUUxMFwiXG4gICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10b2dnbGVcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIENvdXBvbiBpcyBhY3RpdmVcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGlzY291bnQ8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdwZXJjZW50J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJQZXJjZW50IG9mZlwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIDEwJSBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdwZXJjZW50Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdmbGF0J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJGbGF0IGFtb3VudFwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIOKCuTUwIG9mZlwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd0eXBlJywgJ2ZsYXQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAge2NvdXBvblR5cGUgPT09ICdwZXJjZW50JyA/ICdQZXJjZW50IHZhbHVlJyA6ICdBbW91bnQgKOKCuSknfVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNaW4gY2FydCAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm1pbkNhcnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21pbkNhcnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNYXggZGlzY291bnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5tYXhEaXNjb3VudCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbWF4RGlzY291bnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTm8gY2FwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QXBwbHkgZGlzY291bnQgb248L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdjYXJ0J31cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FydCB0b3RhbFwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIHRoZSBpdGVtcyBzdWJ0b3RhbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnYXBwbHlPbicsICdjYXJ0Jyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdzaGlwcGluZyd9XG4gICAgICAgICAgICB0aXRsZT1cIlNoaXBwaW5nIGZlZVwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIGRlbGl2ZXJ5IGNoYXJnZXNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnc2hpcHBpbmcnKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PldobyBjYW4gZ2V0IHRoaXMgZGlzY291bnQ8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgQXBwbHkgdG9cbiAgICAgICAgICA8QW5jaG9yZWRTZWxlY3RcbiAgICAgICAgICAgIHZhbHVlPXt0YXJnZXRUeXBlfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDaG9vc2Ugd2hvIHRoaXMgY291cG9uIGFwcGxpZXMgdG9cIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgIHNldEZpZWxkKCd0YXJnZXRUeXBlJywgbmV4dClcbiAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRTbHVncyhbXSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdhbGwnLCBsYWJlbDogJ0FsbCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ3Byb2R1Y3RzJywgbGFiZWw6ICdTZWxlY3RlZCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ2NhdGVnb3JpZXMnLCBsYWJlbDogJ1NlbGVjdGVkIGNhdGVnb3JpZXMnIH0sXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAge3RhcmdldFR5cGUgPT09ICdwcm9kdWN0cycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUHJvZHVjdHNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17cHJvZHVjdE9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgcHJvZHVjdHNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwcm9kdWN0c1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAnY2F0ZWdvcmllcycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2F0ZWdvcmllc1xuICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yeU9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Vc2FnZTwvaDQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJ31cbiAgICAgICAgICAgICAgdGl0bGU9XCJVbmxpbWl0ZWRcIlxuICAgICAgICAgICAgICBoaW50PVwiQ3VzdG9tZXJzIGNhbiByZXVzZSBpdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAndW5saW1pdGVkJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3NpbmdsZSd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiU2luZ2xlIHVzZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJPbmUgdXNlIHBlciBjdXN0b21lclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAnc2luZ2xlJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt1c2FnZVR5cGUgPT09ICd1bmxpbWl0ZWQnID8gKFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPcHRpb25hbCBnbG9iYWwgY2FwXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy51c2FnZUxpbWl0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd1c2FnZUxpbWl0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxlYXZlIGJsYW5rIGZvciB1bmxpbWl0ZWRcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQ+RWFjaCBsb2dnZWQtaW4gY3VzdG9tZXIgY2FuIHVzZSB0aGlzIGNvdXBvbiBvbmNlLjwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtwYXJhbXMudXNlZENvdW50ID8gPFRleHQgbXQ9XCJkZWZhdWx0XCI+VXNlZCB7cGFyYW1zLnVzZWRDb3VudH0gdGltZShzKSBzbyBmYXIuPC9UZXh0PiA6IG51bGx9XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5TY2hlZHVsZTwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhcnRzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuc3RhcnRzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdzdGFydHNBdCcsIG5leHQgfHwgbnVsbCl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHN0YXJ0IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEV4cGlyZXMgYXRcbiAgICAgICAgICAgIDxEYXRlVGltZVBpY2tlclxuICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRldGltZVZhbHVlKHBhcmFtcy5leHBpcmVzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdleHBpcmVzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBleHBpcnkgZGF0ZSBhbmQgdGltZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjb3Vwb25cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb3Vwb25FZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSDUsIExhYmVsLCBTZWxlY3QsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oYW1vdW50KSkgcmV0dXJuICfigrkwJ1xuICByZXR1cm4gYOKCuSR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pfWBcbn1cblxuY29uc3QgZm9ybWF0RGF0ZVRpbWUgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICfigJQnXG4gIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRhdGVTdHlsZTogJ21lZGl1bScsXG4gICAgdGltZVN0eWxlOiAnc2hvcnQnLFxuICB9KVxufVxuXG5jb25zdCByZXNvbHZlSW1hZ2UgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdCh2YWx1ZSkpIHJldHVybiB2YWx1ZVxuICBpZiAodmFsdWUuc3RhcnRzV2l0aCgnLycpKSByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3ZhbHVlfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbmNvbnN0IE9yZGVyRGV0YWlsID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBpc0VkaXQgPSBhY3Rpb24/Lm5hbWUgPT09ICdlZGl0J1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChpbml0aWFsUmVjb3JkLCByZXNvdXJjZS5pZClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGl0ZW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocGFyYW1zLml0ZW1zSnNvbiB8fCAnW10nKVxuICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgIC4uLml0ZW0sXG4gICAgICAgIGltYWdlOiByZXNvbHZlSW1hZ2UoaXRlbS5pbWFnZSksXG4gICAgICB9KSlcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSwgW3BhcmFtcy5pdGVtc0pzb25dKVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0U2F2aW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHN1Ym1pdCgpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnT3JkZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGRhdGUgb3JkZXIuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhdHVzT3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycgfSxcbiAgICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUGFpZCcgfSxcbiAgICB7IHZhbHVlOiAncGFja2VkJywgbGFiZWw6ICdQYWNrZWQnIH0sXG4gICAgeyB2YWx1ZTogJ3NoaXBwZWQnLCBsYWJlbDogJ1NoaXBwZWQnIH0sXG4gICAgeyB2YWx1ZTogJ2RlbGl2ZXJlZCcsIGxhYmVsOiAnRGVsaXZlcmVkJyB9LFxuICAgIHsgdmFsdWU6ICdjYW5jZWxsZWQnLCBsYWJlbDogJ0NhbmNlbGxlZCcgfSxcbiAgXVxuXG4gIGNvbnN0IHBheW1lbnRPcHRpb25zID0gW1xuICAgIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJyB9LFxuICAgIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQYWlkJyB9LFxuICAgIHsgdmFsdWU6ICdmYWlsZWQnLCBsYWJlbDogJ0ZhaWxlZCcgfSxcbiAgICB7IHZhbHVlOiAncmVmdW5kZWQnLCBsYWJlbDogJ1JlZnVuZGVkJyB9LFxuICBdXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZGV0YWlsXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cInhsXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlxuICAgICAgICAgIE9yZGVyICN7cGFyYW1zLm9yZGVyTm99IGRldGFpbHNcbiAgICAgICAgPC9IND5cbiAgICAgICAgPFRleHQgb3BhY2l0eT17MC44fT5cbiAgICAgICAgICBQYXltZW50IHZpYSB7cGFyYW1zLnBheW1lbnRNZXRob2QgfHwgJ0Nhc2ggb24gZGVsaXZlcnknfVxuICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgPyBgIMK3IFBheW1lbnQgSUQ6ICR7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkfWAgOiAnJ31cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1ncmlkXCIgbWI9XCJ4bFwiPlxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cImxnXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5HZW5lcmFsPC9INT5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPk9yZGVyIGRhdGU8L0xhYmVsPlxuICAgICAgICAgICAgPFRleHQ+e2Zvcm1hdERhdGVUaW1lKHBhcmFtcy5jcmVhdGVkQXQpfTwvVGV4dD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIG5hbWU8L0xhYmVsPlxuICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIj57cGFyYW1zLmN1c3RvbWVyTmFtZSB8fCAnR3Vlc3QnfTwvVGV4dD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIHBob25lPC9MYWJlbD5cbiAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJQaG9uZSB8fCAn4oCUJ308L1RleHQ+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAge3BhcmFtcy5jdXN0b21lckVtYWlsID8gKFxuICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPExhYmVsPkN1c3RvbWVyIGVtYWlsPC9MYWJlbD5cbiAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lckVtYWlsfTwvVGV4dD5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtpc0VkaXQgPyAoXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU2F2ZX0+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPk9yZGVyIHN0YXR1czwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3N0YXR1c09wdGlvbnMuZmluZCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUgPT09IHBhcmFtcy5zdGF0dXMpfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17c3RhdHVzT3B0aW9uc31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2VsZWN0ZWQpID0+IGhhbmRsZUNoYW5nZSgnc3RhdHVzJywgc2VsZWN0ZWQ/LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPlBheW1lbnQgc3RhdHVzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGF5bWVudE9wdGlvbnMuZmluZCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUgPT09IHBhcmFtcy5wYXltZW50U3RhdHVzKX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e3BheW1lbnRPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhzZWxlY3RlZCkgPT4gaGFuZGxlQ2hhbmdlKCdwYXltZW50U3RhdHVzJywgc2VsZWN0ZWQ/LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNhdmluZ30+XG4gICAgICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmcuLi4nIDogJ1VwZGF0ZSBvcmRlcid9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5PcmRlciBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHRleHRUcmFuc2Zvcm09XCJjYXBpdGFsaXplXCI+e3BhcmFtcy5zdGF0dXN9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+UGF5bWVudCBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHRleHRUcmFuc2Zvcm09XCJjYXBpdGFsaXplXCI+e3BhcmFtcy5wYXltZW50U3RhdHVzfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cImxnXCI+XG4gICAgICAgICAgPEg1IG1iPVwibGdcIj5EZWxpdmVyeSBhZGRyZXNzPC9INT5cbiAgICAgICAgICB7cGFyYW1zLmFkZHJlc3NGb3JtYXR0ZWQgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5BZGRyZXNzIHR5cGU8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuYWRkcmVzc0xhYmVsIHx8ICdEZWxpdmVyeSd9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+RGVsaXZlciB0bzwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFRleHQ+e3BhcmFtcy5jdXN0b21lck5hbWV9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+UGhvbmU8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJQaG9uZSB8fCAn4oCUJ308L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgIDxMYWJlbD5GdWxsIGFkZHJlc3M8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXt7IGxpbmVIZWlnaHQ6IDEuNyB9fT57cGFyYW1zLmFkZHJlc3NGb3JtYXR0ZWR9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIGRlbGl2ZXJ5IGFkZHJlc3Mgc2F2ZWQgZm9yIHRoaXMgb3JkZXIuPC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQm94PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwibGdcIj5cbiAgICAgICAgPEg1IG1iPVwibGdcIj5PcmRlciBpdGVtczwvSDU+XG4gICAgICAgIHtpdGVtcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5ObyBpdGVtcyBmb3VuZCBmb3IgdGhpcyBvcmRlci48L1RleHQ+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEJveCBhcz1cInRhYmxlXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbXMtdGFibGVcIj5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5JdGVtPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+Q29zdDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlF0eTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRvdGFsPC90aD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBzdHlsZT17eyBnYXA6IDEyIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmltYWdlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2l0ZW0uaW1hZ2V9IGFsdD17aXRlbS5uYW1lfSBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pdGVtLWltYWdlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIj57aXRlbS5uYW1lfTwvVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLndlaWdodCA/IDxUZXh0IGZvbnRTaXplPVwic21cIiBvcGFjaXR5PXswLjd9PntpdGVtLndlaWdodH08L1RleHQ+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShpdGVtLnByaWNlVmFsdWUpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ucXVhbnRpdHl9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkoaXRlbS5saW5lVG90YWwpfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPHRmb290PlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9Pkl0ZW1zIHN1YnRvdGFsPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5pdGVtc1RvdGFsKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkRlbGl2ZXJ5IGNoYXJnZXM8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLmRlbGl2ZXJ5Q2hhcmdlKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkNhcnQgaGFuZGxpbmc8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkocGFyYW1zLmhhbmRsaW5nQ2hhcmdlKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PlNtYWxsIGNhcnQgY2hhcmdlPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5zbWFsbENhcnRDaGFyZ2UpfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLmRpc2NvdW50KSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9PkRpc2NvdW50PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4te2Zvcm1hdE1vbmV5KHBhcmFtcy5kaXNjb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPHRyIGNsYXNzTmFtZT1cImlzLXRvdGFsXCI+XG4gICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezN9Pk9yZGVyIHRvdGFsPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5ncmFuZFRvdGFsKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKX1cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE9yZGVyRGV0YWlsXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSW5wdXQsIExhYmVsLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IEV5ZUljb24gPSAoeyBoaWRkZW4gfSkgPT5cbiAgaGlkZGVuID8gKFxuICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHBhdGggZD1cIk0zIDNsMTggMThcIiAvPlxuICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgPHBhdGggZD1cIk02LjYgNi42QzQuMyA4IDIuNyAxMC4yIDIgMTJjMSAzLjUgNSA4IDEwIDggMS41IDAgMi45LS40IDQuMS0xXCIgLz5cbiAgICA8L3N2Zz5cbiAgKSA6IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAvPlxuICAgIDwvc3ZnPlxuICApXG5cbmZ1bmN0aW9uIFBhc3N3b3JkRmllbGQoeyBpZCwgbGFiZWwsIHZhbHVlLCBvbkNoYW5nZSwgdmlzaWJsZSwgb25Ub2dnbGUgfSkge1xuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgPExhYmVsIGh0bWxGb3I9e2lkfSByZXF1aXJlZD57bGFiZWx9PC9MYWJlbD5cbiAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgdHlwZT17dmlzaWJsZSA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgYXV0b0NvbXBsZXRlPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPXt2aXNpYmxlID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzA0Nzg1NycsXG4gICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAyNixcbiAgICAgICAgICAgIGhlaWdodDogMjYsXG4gICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RXllSWNvbiBoaWRkZW49e3Zpc2libGV9IC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBbcGFzc3dvcmQsIHNldFBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbY29uZmlybVBhc3N3b3JkLCBzZXRDb25maXJtUGFzc3dvcmRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dDb25maXJtLCBzZXRTaG93Q29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKVxuICB9XG5cbiAgY29uc3Qgc2F2ZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBzZXRFcnJvcignJylcbiAgICBpZiAoIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA8IDYpIHtcbiAgICAgIHNldEVycm9yKCdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycy4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkKSB7XG4gICAgICBzZXRFcnJvcignTmV3IHBhc3N3b3JkIGFuZCBjb25maXJtIHBhc3N3b3JkIG11c3QgYmUgdGhlIHNhbWUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFNhdmluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZTogJ2NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IHsgcGFzc3dvcmQsIGNvbmZpcm1QYXNzd29yZCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlLmRhdGE/Lm5vdGljZVxuICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICBzZXRFcnJvcihub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobm90aWNlKSBhZGROb3RpY2Uobm90aWNlKVxuICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSByZXNwb25zZS5kYXRhPy5yZWRpcmVjdFVybFxuICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3RVcmxcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjbG9zZSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIGluc2V0OiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyLCAxMiwgOCwgMC42MiknLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIHpJbmRleDogODAsXG4gICAgICAgIHBhZGRpbmc6IDE2LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGFzPVwiZm9ybVwiXG4gICAgICAgIG9uU3VibWl0PXtzYXZlfVxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0MjBweCddfVxuICAgICAgICBwPVwieGxcIlxuICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6IDE2LCBib3hTaGFkb3c6ICcwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4yOCknIH19XG4gICAgICA+XG4gICAgICAgIDxIMyBtYj1cInNtXCI+Q2hhbmdlIHBhc3N3b3JkPC9IMz5cbiAgICAgICAgPFRleHQgbWI9XCJ4bFwiIGNvbG9yPVwiIzY0NzQ4YlwiPlxuICAgICAgICAgIFNldCBhIG5ldyBwYXNzd29yZCBmb3Ige3JlY29yZD8ucGFyYW1zPy5uYW1lIHx8IHJlY29yZD8ucGFyYW1zPy5lbWFpbCB8fCAndGhpcyB1c2VyJ30uXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIk5ldyBwYXNzd29yZFwiXG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRQYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93UGFzc3dvcmR9XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgIC8+XG4gICAgICAgIDxQYXNzd29yZEZpZWxkXG4gICAgICAgICAgaWQ9XCJjb25maXJtLXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIkNvbmZpcm0gcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtjb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldENvbmZpcm1QYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93Q29uZmlybX1cbiAgICAgICAgICBvblRvZ2dsZT17KCkgPT4gc2V0U2hvd0NvbmZpcm0oKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuXG4gICAgICAgIHtlcnJvciA/IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgY29sb3I9XCIjZGMyNjI2XCI+e2Vycm9yfTwvVGV4dD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIiBzdHlsZT17eyBnYXA6IDEwIH19PlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cImJ1dHRvblwiIHZhcmlhbnQ9XCJ0ZXh0XCIgb25DbGljaz17Y2xvc2V9IGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmfigKYnIDogJ1NhdmUgcGFzc3dvcmQnfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVBhc3N3b3JkXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIEZvcm1Hcm91cCxcbiAgSDIsXG4gIElucHV0LFxuICBMYWJlbCxcbiAgTWVzc2FnZUJveCxcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgUkVNRU1CRVJFRF9MT0dJTl9LRVkgPSAndG9rcmlfYWRtaW5fbG9naW4nXG5cbmNvbnN0IExvZ2luID0gKCkgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgZXJyb3JNZXNzYWdlIH0gPSB3aW5kb3cuX19BUFBfU1RBVEVfXyB8fCB7fVxuICBjb25zdCB7IHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgYWRtaW5Sb290ID0gYWN0aW9uPy5yZXBsYWNlKC9cXC9sb2dpbiQvLCAnJykgfHwgJydcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRVcmwgPSBgJHthZG1pblJvb3R9L2ZvcmdvdC1wYXNzd29yZGBcbiAgY29uc3QgW2lkZW50aWZpZXIsIHNldElkZW50aWZpZXJdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtyZW1lbWJlckxvZ2luLCBzZXRSZW1lbWJlckxvZ2luXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZW1lbWJlcmVkTG9naW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgaWYgKHJlbWVtYmVyZWRMb2dpbikge1xuICAgICAgc2V0SWRlbnRpZmllcihyZW1lbWJlcmVkTG9naW4pXG4gICAgICBzZXRSZW1lbWJlckxvZ2luKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBmb3JtLmVsZW1lbnRzLm5hbWVkSXRlbSgnZW1haWwnKVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCA/IFN0cmluZyhlbWFpbElucHV0LnZhbHVlKSA6IGlkZW50aWZpZXIpLnRyaW0oKVxuXG4gICAgaWYgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0KSB7XG4gICAgICBlbWFpbElucHV0LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAocmVtZW1iZXJMb2dpbiAmJiB2YWx1ZSkge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgZmxleFxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBtaW5IZWlnaHQ9XCIxMDB2aFwiXG4gICAgICBiZz1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwMjJjMjIsICMwNDc4NTcpXCJcbiAgICAgIHA9XCJ4bFwiXG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0NDBweCddfVxuICAgICAgICBib3JkZXJSYWRpdXM9XCIxOHB4XCJcbiAgICAgICAgYm94U2hhZG93PVwiMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMzUpXCJcbiAgICAgICAgcD1cIngzXCJcbiAgICAgID5cbiAgICAgICAgPEgyIGNvbG9yPVwiIzAyMmMyMlwiIG1iPVwic21cIj5Ub2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwiIzY0NzQ4YlwiIG1iPVwieGxcIj5cbiAgICAgICAgICBTaWduIGluIHdpdGggeW91ciBhZG1pbiBlbWFpbCBvciB1c2VybmFtZSB0byBtYW5hZ2UgcHJvZHVjdHMsIG9yZGVycywgYW5kIGNvbnRlbnQuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZXJyb3JNZXNzYWdlID8gKFxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICBtYj1cImxnXCJcbiAgICAgICAgICAgIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSl9XG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGFzPVwiZm9ybVwiIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5FbWFpbCBvciB1c2VybmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpZGVudGlmaWVyfVxuICAgICAgICAgICAgICBrZXk9e2lkZW50aWZpZXIgfHwgJ2xvZ2luLWVtYWlsJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPlBhc3N3b3JkPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPXtzaG93UGFzc3dvcmQgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17c2hvd1Bhc3N3b3JkID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgaWQ9XCJyZW1lbWJlci1sb2dpblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e3JlbWVtYmVyTG9naW59XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFJlbWVtYmVyTG9naW4oZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5SaWdodDogOCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtZW1iZXItbG9naW5cIiBzdHlsZT17eyBjb2xvcjogJyM0NzU1NjknLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgIFJlbWVtYmVyIG15IGVtYWlsIG9yIHVzZXJuYW1lIG9uIHRoaXMgZGV2aWNlXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIHdpZHRoPVwiMTAwJVwiIG10PVwibGdcIj5cbiAgICAgICAgICAgIFNpZ24gaW5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxhIGhyZWY9e2ZvcmdvdFBhc3N3b3JkVXJsfSBzdHlsZT17eyBjb2xvcjogJyMwNDc4NTcnLCBmb250V2VpZ2h0OiA3MDAgfX0+XG4gICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpblxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uR3JvdXAsIE1lc3NhZ2VCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlRmlsdGVyRHJhd2VyLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnXG5cbmZ1bmN0aW9uIGFkbWluUm9vdFBhdGgoKSB7XG4gIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9eKC4qKVxcL3Jlc291cmNlc1xcLy8pXG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKSB7XG4gIGlmIChyZXNvdXJjZUlkID09PSAnQ2F0ZWdvcnknKSB7XG4gICAgcmV0dXJuIHsgZXhwb3J0VXJsOiAnY2F0ZWdvcmllcy9leHBvcnQnLCBpbXBvcnRVcmw6ICdjYXRlZ29yaWVzL2ltcG9ydCcgfVxuICB9XG4gIGlmIChyZXNvdXJjZUlkID09PSAnUHJvZHVjdCcpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdwcm9kdWN0cy9leHBvcnQnLCBpbXBvcnRVcmw6ICdwcm9kdWN0cy9pbXBvcnQnIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMoeyByZXNvdXJjZSwgb25JbXBvcnRlZCB9KSB7XG4gIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uLCB0cmFuc2xhdGVBY3Rpb24gfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyB0b2dnbGVGaWx0ZXIsIGZpbHRlcnNDb3VudCB9ID0gdXNlRmlsdGVyRHJhd2VyKClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcblxuICBjb25zdCByZXNvdXJjZUlkID0gcmVzb3VyY2UuaWRcbiAgY29uc3QgY29uZmlnID0gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKVxuICBjb25zdCByb290ID0gYWRtaW5Sb290UGF0aCgpXG5cbiAgY29uc3QgaGFuZGxlSW1wb3J0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICBpZiAoIWZpbGUgfHwgIWNvbmZpZykgcmV0dXJuXG5cbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgc2V0TWVzc2FnZShudWxsKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5pbXBvcnRVcmx9YCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JDb3VudCA9IGRhdGEuZXJyb3JzPy5sZW5ndGggfHwgMFxuICAgICAgc2V0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IGVycm9yQ291bnQgPyAnaW5mbycgOiAnc3VjY2VzcycsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgZXJyb3JDb3VudCA+IDBcbiAgICAgICAgICAgID8gYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC4gJHtlcnJvckNvdW50fSByb3cocykgY291bGQgbm90IGJlIGltcG9ydGVkLmBcbiAgICAgICAgICAgIDogYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC5gLFxuICAgICAgfSlcbiAgICAgIG9uSW1wb3J0ZWQ/LigpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnZGFuZ2VyJywgdGV4dDogZXJyb3IubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnV0dG9ucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY29uZmlnKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0V4cG9ydCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5leHBvcnRVcmx9YCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBsb2FkaW5nID8gJ0ltcG9ydGluZy4uLicgOiAnSW1wb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBvbkNsaWNrOiBsb2FkaW5nID8gdW5kZWZpbmVkIDogKCkgPT4gZmlsZVJlZi5jdXJyZW50Py5jbGljaygpLFxuICAgICAgfSxcbiAgICBdXG5cbiAgICBjb25zdCBuZXdBY3Rpb24gPSByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnM/LmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uLm5hbWUgPT09ICduZXcnKVxuICAgIGlmIChuZXdBY3Rpb24pIHtcbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICBpY29uOiBuZXdBY3Rpb24uaWNvbixcbiAgICAgICAgbGFiZWw6IHRyYW5zbGF0ZUFjdGlvbihuZXdBY3Rpb24ubGFiZWwsIHJlc291cmNlSWQpLFxuICAgICAgICB2YXJpYW50OiBuZXdBY3Rpb24udmFyaWFudCxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vcmVzb3VyY2VzLyR7cmVzb3VyY2VJZH0vYWN0aW9ucy9uZXdgLFxuICAgICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1uZXctYnV0dG9uYCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyS2V5ID0gZmlsdGVyc0NvdW50ID4gMCA/ICdmaWx0ZXJBY3RpdmUnIDogJ2ZpbHRlcidcbiAgICBpdGVtcy5wdXNoKHtcbiAgICAgIGxhYmVsOiB0cmFuc2xhdGVCdXR0b24oZmlsdGVyS2V5LCByZXNvdXJjZUlkLCB7IGNvdW50OiBmaWx0ZXJzQ291bnQgfSksXG4gICAgICBvbkNsaWNrOiB0b2dnbGVGaWx0ZXIsXG4gICAgICBpY29uOiAnRmlsdGVyJyxcbiAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LWZpbHRlci1idXR0b25gLFxuICAgIH0pXG5cbiAgICByZXR1cm4gaXRlbXNcbiAgfSwgW1xuICAgIGNvbmZpZyxcbiAgICByb290LFxuICAgIGxvYWRpbmcsXG4gICAgcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zLFxuICAgIHJlc291cmNlSWQsXG4gICAgdHJhbnNsYXRlQWN0aW9uLFxuICAgIHRyYW5zbGF0ZUJ1dHRvbixcbiAgICBmaWx0ZXJzQ291bnQsXG4gICAgdG9nZ2xlRmlsdGVyLFxuICBdKVxuXG4gIGlmICghY29uZmlnKSByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxCb3hcbiAgICAgICAgbXQ9XCJ4bFwiXG4gICAgICAgIG1iPVwiZGVmYXVsdFwiXG4gICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJmbGV4LWVuZFwiXG4gICAgICAgIGZsZXhTaHJpbms9ezB9XG4gICAgICAgIHB4PXtbJ2RlZmF1bHQnLCAwXX1cbiAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiAnLTUycHgnIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25Hcm91cCBidXR0b25zPXtidXR0b25zfSAvPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIGFjY2VwdD1cIi5jc3YsdGV4dC9jc3ZcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVJbXBvcnR9XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiIHB4PXtbJ2RlZmF1bHQnLCAwXX0+XG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIHZhcmlhbnQ9e21lc3NhZ2UudHlwZX1cbiAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2UudGV4dH1cbiAgICAgICAgICAgIG9uQ2xvc2VDbGljaz17KCkgPT4gc2V0TWVzc2FnZShudWxsKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC8+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBPcmlnaW5hbEFjdGlvbkhlYWRlciB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIGZyb20gJy4vY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCdcblxuY29uc3QgQ0FUQUxPR19SRVNPVVJDRVMgPSBuZXcgU2V0KFsnUHJvZHVjdCcsICdDYXRlZ29yeSddKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBY3Rpb25IZWFkZXIocHJvcHMpIHtcbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudCwgYWN0aW9uLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgQmFzZUhlYWRlciA9IE9yaWdpbmFsQ29tcG9uZW50IHx8IE9yaWdpbmFsQWN0aW9uSGVhZGVyXG4gIGNvbnN0IGlzQ2F0YWxvZ0xpc3QgPSBhY3Rpb24/Lm5hbWUgPT09ICdsaXN0JyAmJiBDQVRBTE9HX1JFU09VUkNFUy5oYXMocmVzb3VyY2U/LmlkKVxuXG4gIGlmICghaXNDYXRhbG9nTGlzdCkge1xuICAgIHJldHVybiA8QmFzZUhlYWRlciB7Li4ucHJvcHN9IC8+XG4gIH1cblxuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50OiBfaWdub3JlZCwgLi4uaGVhZGVyUHJvcHMgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAgPEJhc2VIZWFkZXIgey4uLmhlYWRlclByb3BzfSBvbWl0QWN0aW9ucyAvPlxuICAgICAgPENhdGFsb2dMaXN0SGVhZGVyQWN0aW9uc1xuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIG9uSW1wb3J0ZWQ9e3Byb3BzLmFjdGlvblBlcmZvcm1lZH1cbiAgICAgIC8+XG4gICAgPC9Cb3g+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBtZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSwgTGFiZWwsIFRpbnlNQ0UgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsdWdpbnM6IFtcbiAgICAnY29kZScsXG4gICAgJ2xpbmsnLFxuICAgICdsaXN0cycsXG4gICAgJ2ltYWdlJyxcbiAgICAndGFibGUnLFxuICAgICdhdXRvbGluaycsXG4gICAgJ3ByZXZpZXcnLFxuICAgICdzZWFyY2hyZXBsYWNlJyxcbiAgICAnd29yZGNvdW50JyxcbiAgICAnbWVkaWEnLFxuICAgICdjb2Rlc2FtcGxlJyxcbiAgXSxcbiAgdG9vbGJhcjpcbiAgICAndW5kbyByZWRvIHwgYmxvY2tzIHwgYm9sZCBpdGFsaWMgdW5kZXJsaW5lIHN0cmlrZXRocm91Z2ggfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCBhbGlnbmp1c3RpZnkgfCBidWxsaXN0IG51bWxpc3Qgb3V0ZGVudCBpbmRlbnQgfCBsaW5rIGltYWdlIHRhYmxlIGNvZGVzYW1wbGUgfCBjb2RlIHwgcmVtb3ZlZm9ybWF0JyxcbiAgaGVpZ2h0OiA0MDAsXG59XG5cbmNvbnN0IFJpY2h0ZXh0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCB2YWx1ZSA9IHJlY29yZC5wYXJhbXM/Lltwcm9wZXJ0eS5wYXRoXSA/PyAnJ1xuICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgb25DaGFuZ2UocHJvcGVydHkucGF0aCwgbmV3VmFsdWUpXG4gICAgfSxcbiAgICBbb25DaGFuZ2UsIHByb3BlcnR5LnBhdGhdLFxuICApXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5ERUZBVUxUX09QVElPTlMsXG4gICAgLi4uKHByb3BlcnR5LnByb3BzIHx8IHt9KSxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cCBlcnJvcj17Qm9vbGVhbihlcnJvcil9PlxuICAgICAgPExhYmVsIHJlcXVpcmVkPXtwcm9wZXJ0eS5pc1JlcXVpcmVkfT57cHJvcGVydHkubGFiZWx9PC9MYWJlbD5cbiAgICAgIDxUaW55TUNFIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e2hhbmRsZVVwZGF0ZX0gb3B0aW9ucz17b3B0aW9uc30gLz5cbiAgICAgIDxGb3JtTWVzc2FnZT57ZXJyb3I/Lm1lc3NhZ2V9PC9Gb3JtTWVzc2FnZT5cbiAgICA8L0Zvcm1Hcm91cD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFJpY2h0ZXh0RWRpdClcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Byb2R1Y3QtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEVkaXQgPSBQcm9kdWN0RWRpdFxuaW1wb3J0IENhdGVnb3J5RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jYXRlZ29yeS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeUVkaXQgPSBDYXRlZ29yeUVkaXRcbmltcG9ydCBDbXNMaXN0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Ntcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DbXNMaXN0ID0gQ21zTGlzdFxuaW1wb3J0IFJldmlld0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJldmlld0VkaXQgPSBSZXZpZXdFZGl0XG5pbXBvcnQgU2V0dGluZ3NFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNldHRpbmdzRWRpdCA9IFNldHRpbmdzRWRpdFxuaW1wb3J0IENvdXBvbkVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY291cG9uLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNvdXBvbkVkaXQgPSBDb3Vwb25FZGl0XG5pbXBvcnQgT3JkZXJEZXRhaWwgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvb3JkZXItZGV0YWlsJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckRldGFpbCA9IE9yZGVyRGV0YWlsXG5pbXBvcnQgQ2hhbmdlUGFzc3dvcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2hhbmdlLXBhc3N3b3JkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DaGFuZ2VQYXNzd29yZCA9IENoYW5nZVBhc3N3b3JkXG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBBY3Rpb25IZWFkZXIgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvYWN0aW9uLWhlYWRlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQWN0aW9uSGVhZGVyID0gQWN0aW9uSGVhZGVyXG5pbXBvcnQgRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JpY2h0ZXh0LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSA9IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSJdLCJuYW1lcyI6WyJhcGkiLCJBcGlDbGllbnQiLCJzdGF0Q2FyZHMiLCJrZXkiLCJsYWJlbCIsImljb24iLCJyZXNvdXJjZSIsImFkbWluUm9vdCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzcGxpdCIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJnZXREYXNoYm9hcmQiLCJ0aGVuIiwicmVzIiwiY2F0Y2giLCJzdGF0cyIsInJvb3QiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJCb3giLCJ2YXJpYW50IiwiY2xhc3NOYW1lIiwicCIsIm1iIiwiSDIiLCJUZXh0Iiwib3BhY2l0eSIsImRpc3BsYXkiLCJtYXAiLCJjYXJkIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiSDUiLCJJY29uIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiQnV0dG9uIiwibXQiLCJzaXplIiwiYXMiLCJocmVmIiwiZmxleFdyYXAiLCJyZWNlbnRPcmRlcnMiLCJsZW5ndGgiLCJvcmRlciIsIm9yZGVyTm8iLCJzdGF0dXMiLCJncmFuZFRvdGFsIiwidXNlQW5jaG9yZWRNZW51Iiwib3BlbiIsIndyYXBSZWYiLCJ1c2VSZWYiLCJjb29yZHMiLCJzZXRDb29yZHMiLCJ1bmRlZmluZWQiLCJ1cGRhdGUiLCJub2RlIiwiY3VycmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzcGFjZUJlbG93IiwiaW5uZXJIZWlnaHQiLCJib3R0b20iLCJvcGVuVXAiLCJ0b3AiLCJsZWZ0IiwiTWF0aCIsIm1heCIsIndpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJTZWFyY2hhYmxlTXVsdGlTZWxlY3QiLCJvcHRpb25zIiwic2VsZWN0ZWQiLCJvbkNoYW5nZSIsInBsYWNlaG9sZGVyIiwic2VhcmNoUGxhY2Vob2xkZXIiLCJzZXRPcGVuIiwicXVlcnkiLCJzZXRRdWVyeSIsIm9uRG9jQ2xpY2siLCJldmVudCIsImNvbnRhaW5zIiwidGFyZ2V0IiwiZG9jdW1lbnQiLCJzZWxlY3RlZFNldCIsInVzZU1lbW8iLCJTZXQiLCJzZWxlY3RlZE9wdGlvbnMiLCJmaWx0ZXIiLCJpdGVtIiwiaGFzIiwidmFsdWUiLCJmaWx0ZXJlZCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJ0cmltIiwidG9nZ2xlIiwicmVmIiwidHlwZSIsIm9uQ2xpY2siLCJyb2xlIiwidGFiSW5kZXgiLCJzdG9wUHJvcGFnYXRpb24iLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4IiwiYXV0b0ZvY3VzIiwiY2hlY2tlZCIsIkZsYWdDYXJkIiwidGl0bGUiLCJoaW50Iiwibm9ybWFsaXplU2x1Z0lucHV0IiwiU3RyaW5nIiwicmVwbGFjZSIsIndpdGhvdXRUcmFpbGluZ1NsYXNoIiwicGFyc2VTbHVncyIsInJhdyIsIkFycmF5IiwiaXNBcnJheSIsIkJvb2xlYW4iLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJQcm9kdWN0RWRpdCIsInByb3BzIiwicmVjb3JkIiwiaW5pdGlhbFJlY29yZCIsImhhbmRsZUNoYW5nZSIsInN1Ym1pdCIsImhhbmRsZVN1Ym1pdCIsImxvYWRpbmciLCJ1c2VSZWNvcmQiLCJpZCIsImFkZE5vdGljZSIsInVzZU5vdGljZSIsImZpbGVSZWYiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJzbHVnRWRpdGVkIiwic2V0U2x1Z0VkaXRlZCIsInBhcmFtcyIsInNsdWciLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsImNhdGVnb3JpZXMiLCJzZXRDYXRlZ29yaWVzIiwiY3VzdG9tIiwiYXBpQmFzZVVybCIsInByb2R1Y3RVcmxCYXNlIiwib3JpZ2luIiwic2x1Z0lucHV0IiwicHJldmlld1NsdWciLCJuYW1lIiwicHJvZHVjdFVybCIsInNlbGVjdGVkQ2F0ZWdvcnlTbHVncyIsImNhdGVnb3J5SWRzIiwiaW1hZ2VVcmwiLCJpbWFnZSIsInRlc3QiLCJhcHBVcmwiLCJkaXNwbGF5ZWRJbWFnZVVybCIsInN0YXJ0c1dpdGgiLCJVUkwiLCJyZXZva2VPYmplY3RVUkwiLCJpZ25vcmUiLCJmZXRjaCIsInJlc3BvbnNlIiwianNvbiIsInNldEZpZWxkIiwib25Qcm9wZXJ0eUNoYW5nZSIsInByb3BlcnR5UGF0aCIsInJlc3QiLCJzZXRTZWxlY3RlZENhdGVnb3JpZXMiLCJzbHVncyIsInN0cmluZ2lmeSIsInVwbG9hZEltYWdlIiwiZmlsZSIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImxvY2FsUHJldmlld1VybCIsImNyZWF0ZU9iamVjdFVSTCIsIm1ldGhvZCIsImJvZHkiLCJvayIsImVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwibWVkaWEiLCJwYXRoIiwicHJldmVudERlZmF1bHQiLCJub3RpY2UiLCJkZXNjcmlwdGlvblByb3BlcnR5IiwiZWRpdFByb3BlcnRpZXMiLCJmaW5kIiwicHJvcGVydHkiLCJvblN1Ym1pdCIsIkgzIiwiY29sb3IiLCJyZXF1aXJlZCIsInJlbCIsIm1pbiIsInN0ZXAiLCJwcmljZVZhbHVlIiwib2xkUHJpY2VWYWx1ZSIsIndlaWdodCIsImJhZGdlIiwic3RvY2siLCJzb3J0T3JkZXIiLCJzcmMiLCJhbHQiLCJhY2NlcHQiLCJpc0Jlc3RTZWxsZXIiLCJpc0ltcG9ydGVkIiwiaXNGZWF0dXJlZCIsImlzQWN0aXZlIiwibWluSGVpZ2h0IiwiQmFzZVByb3BlcnR5Q29tcG9uZW50Iiwid2hlcmUiLCJkaXNhYmxlZCIsInNwaW4iLCJDYXRlZ29yeUVkaXQiLCJiYW5uZXJGaWxlUmVmIiwiYmFubmVyVXBsb2FkaW5nIiwic2V0QmFubmVyVXBsb2FkaW5nIiwiYmFubmVyUHJldmlld1VybCIsInNldEJhbm5lclByZXZpZXdVcmwiLCJjYXRlZ29yeVVybEJhc2UiLCJjYXRlZ29yeVVybCIsImJhbm5lckltYWdlVXJsIiwiYmFubmVySW1hZ2UiLCJkaXNwbGF5ZWRCYW5uZXJVcmwiLCJ1cGxvYWRUbyIsImZpZWxkIiwic2V0TG9jYWxQcmV2aWV3Iiwic2V0QnVzeSIsInN1Y2Nlc3NNZXNzYWdlIiwic3VidGl0bGUiLCJtYXJnaW5Ub3AiLCJDbXNMaXN0Iiwic2V0VGFnIiwidGl0bGVQcm9wIiwidGl0bGVQcm9wZXJ0eSIsInN0b3JlUGFyYW1zIiwiZmlsdGVycyIsInVzZVF1ZXJ5UGFyYW1zIiwicmVjb3JkcyIsImRpcmVjdGlvbiIsInNvcnRCeSIsInBhZ2UiLCJ0b3RhbCIsImZldGNoRGF0YSIsInBlclBhZ2UiLCJ1c2VSZWNvcmRzIiwic2VsZWN0ZWRSZWNvcmRzIiwiaGFuZGxlU2VsZWN0IiwiaGFuZGxlU2VsZWN0QWxsIiwic2V0U2VsZWN0ZWRSZWNvcmRzIiwidXNlU2VsZWN0ZWRSZWNvcmRzIiwiZGVib3VuY2VSZWYiLCJzdG9yZVBhcmFtc1JlZiIsInRvU3RyaW5nIiwiaGFuZGxlUXVlcnlDaGFuZ2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidHJpbW1lZCIsImhhbmRsZUFjdGlvblBlcmZvcm1lZCIsImhhbmRsZVBhZ2luYXRpb25DaGFuZ2UiLCJwYWdlTnVtYmVyIiwibWF4V2lkdGgiLCJ0cmFuc2Zvcm0iLCJwb2ludGVyRXZlbnRzIiwiSW5wdXQiLCJwYWRkaW5nTGVmdCIsIlJlY29yZHNUYWJsZSIsImFjdGlvblBlcmZvcm1lZCIsIm9uU2VsZWN0Iiwib25TZWxlY3RBbGwiLCJpc0xvYWRpbmciLCJ0ZXh0QWxpZ24iLCJQYWdpbmF0aW9uIiwiUmV2aWV3RWRpdCIsInByb3BlcnR5QnlQYXRoIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJyZW5kZXJQcm9wZXJ0eSIsInJlbWFpbmluZ1Byb3BlcnRpZXMiLCJINCIsImJvcmRlciIsImJvcmRlclJhZGl1cyIsImJnIiwiaGVpZ2h0Iiwib2JqZWN0Rml0IiwiVEFCUyIsImZpZWxkcyIsIlNldHRpbmdzRWRpdCIsImFjdGl2ZVRhYiIsInNldEFjdGl2ZVRhYiIsImhhc2giLCJzb21lIiwidGFiIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsImZsZXgiLCJmbGV4RGlyZWN0aW9uIiwiRHJhd2VyQ29udGVudCIsInByb3BlcnRpZXMiLCJzaGlwcGluZ0ZlZSIsImhhbmRsaW5nRmVlIiwiRHJhd2VyRm9vdGVyIiwicGFkIiwibnVtIiwicGFkU3RhcnQiLCJ0b0RhdGV0aW1lVmFsdWUiLCJkYXRlIiwiRGF0ZSIsIk51bWJlciIsImlzTmFOIiwiZ2V0VGltZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZm9ybWF0RGF0ZXRpbWVMYWJlbCIsInRvTG9jYWxlU3RyaW5nIiwiZGF5IiwibW9udGgiLCJ5ZWFyIiwiaG91ciIsIm1pbnV0ZSIsIkNob2ljZUNhcmQiLCJBbmNob3JlZFNlbGVjdCIsIkRhdGVUaW1lUGlja2VyIiwidmFsaWQiLCJtb250aERhdGUiLCJzZXRNb250aERhdGUiLCJob3VycyIsInNldEhvdXJzIiwibWludXRlcyIsInNldE1pbnV0ZXMiLCJmaXJzdERheSIsImdldERheSIsInRvdGFsRGF5cyIsImNlbGxzIiwiaSIsInB1c2giLCJhcHBseSIsIm5leHRIb3VycyIsIm5leHRNaW51dGVzIiwibmV4dCIsInNlbGVjdGVkRGF5IiwiaW5kZXgiLCJDb3Vwb25FZGl0IiwicHJvZHVjdHMiLCJzZXRQcm9kdWN0cyIsInNlbGVjdGVkU2x1Z3MiLCJ0YXJnZXRTbHVncyIsInRhcmdldFR5cGUiLCJhcHBseU9uIiwidXNhZ2VUeXBlIiwiY291cG9uVHlwZSIsImxvYWRDYXRhbG9nIiwiY2F0ZWdvcnlEYXRhIiwiYWxsUHJvZHVjdHMiLCJoYXNNb3JlIiwicHJvZHVjdERhdGEiLCJzZXRTZWxlY3RlZFNsdWdzIiwicHJvZHVjdE9wdGlvbnMiLCJjYXRlZ29yeU9wdGlvbnMiLCJjb2RlIiwidG9VcHBlckNhc2UiLCJtaW5DYXJ0IiwibWF4RGlzY291bnQiLCJ1c2FnZUxpbWl0IiwidXNlZENvdW50Iiwic3RhcnRzQXQiLCJleHBpcmVzQXQiLCJmb3JtYXRNb25leSIsImFtb3VudCIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsImZvcm1hdERhdGVUaW1lIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwicmVzb2x2ZUltYWdlIiwiT3JkZXJEZXRhaWwiLCJhY3Rpb24iLCJpc0VkaXQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJpdGVtcyIsIml0ZW1zSnNvbiIsImhhbmRsZVNhdmUiLCJzdGF0dXNPcHRpb25zIiwicGF5bWVudE9wdGlvbnMiLCJwYXltZW50TWV0aG9kIiwicmF6b3JwYXlQYXltZW50SWQiLCJMYWJlbCIsImNyZWF0ZWRBdCIsImN1c3RvbWVyTmFtZSIsImN1c3RvbWVyUGhvbmUiLCJjdXN0b21lckVtYWlsIiwiU2VsZWN0Iiwib3B0aW9uIiwicGF5bWVudFN0YXR1cyIsIkZyYWdtZW50IiwidGV4dFRyYW5zZm9ybSIsImFkZHJlc3NGb3JtYXR0ZWQiLCJhZGRyZXNzTGFiZWwiLCJsaW5lSGVpZ2h0IiwiZ2FwIiwicXVhbnRpdHkiLCJsaW5lVG90YWwiLCJjb2xTcGFuIiwiaXRlbXNUb3RhbCIsImRlbGl2ZXJ5Q2hhcmdlIiwiaGFuZGxpbmdDaGFyZ2UiLCJzbWFsbENhcnRDaGFyZ2UiLCJkaXNjb3VudCIsIkV5ZUljb24iLCJoaWRkZW4iLCJ2aWV3Qm94IiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiZCIsImN4IiwiY3kiLCJyIiwiUGFzc3dvcmRGaWVsZCIsInZpc2libGUiLCJvblRvZ2dsZSIsImh0bWxGb3IiLCJhdXRvQ29tcGxldGUiLCJwYWRkaW5nUmlnaHQiLCJyaWdodCIsImJhY2tncm91bmQiLCJjdXJzb3IiLCJwYWRkaW5nIiwiQ2hhbmdlUGFzc3dvcmQiLCJwYXNzd29yZCIsInNldFBhc3N3b3JkIiwiY29uZmlybVBhc3N3b3JkIiwic2V0Q29uZmlybVBhc3N3b3JkIiwic2hvd1Bhc3N3b3JkIiwic2V0U2hvd1Bhc3N3b3JkIiwic2hvd0NvbmZpcm0iLCJzZXRTaG93Q29uZmlybSIsInNldEVycm9yIiwiY2xvc2UiLCJiYWNrIiwic2F2ZSIsInJlY29yZEFjdGlvbiIsInJlc291cmNlSWQiLCJyZWNvcmRJZCIsImFjdGlvbk5hbWUiLCJyZWRpcmVjdFVybCIsImVyciIsImluc2V0IiwiYm94U2hhZG93IiwiZW1haWwiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiTWVzc2FnZUJveCIsIkZvcm1Hcm91cCIsImRlZmF1bHRWYWx1ZSIsIm1hcmdpblJpZ2h0IiwiYWRtaW5Sb290UGF0aCIsIm1hdGNoIiwiY2F0YWxvZ0NvbmZpZyIsImV4cG9ydFVybCIsImltcG9ydFVybCIsIkNhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyIsIm9uSW1wb3J0ZWQiLCJ0cmFuc2xhdGVCdXR0b24iLCJ0cmFuc2xhdGVBY3Rpb24iLCJ0b2dnbGVGaWx0ZXIiLCJmaWx0ZXJzQ291bnQiLCJ1c2VGaWx0ZXJEcmF3ZXIiLCJzZXRMb2FkaW5nIiwic2V0TWVzc2FnZSIsImNvbmZpZyIsImhhbmRsZUltcG9ydCIsImNyZWRlbnRpYWxzIiwiZXJyb3JDb3VudCIsImVycm9ycyIsInRleHQiLCJjcmVhdGVkIiwidXBkYXRlZCIsImJ1dHRvbnMiLCJjbGljayIsIm5ld0FjdGlvbiIsInJlc291cmNlQWN0aW9ucyIsImZpbHRlcktleSIsImNvdW50IiwiZmxleFNocmluayIsInB4IiwiQnV0dG9uR3JvdXAiLCJvbkNsb3NlQ2xpY2siLCJDQVRBTE9HX1JFU09VUkNFUyIsIkFjdGlvbkhlYWRlciIsIk9yaWdpbmFsQ29tcG9uZW50IiwiQmFzZUhlYWRlciIsIk9yaWdpbmFsQWN0aW9uSGVhZGVyIiwiaXNDYXRhbG9nTGlzdCIsIl9pZ25vcmVkIiwiaGVhZGVyUHJvcHMiLCJfZXh0ZW5kcyIsIm9taXRBY3Rpb25zIiwiREVGQVVMVF9PUFRJT05TIiwicGx1Z2lucyIsInRvb2xiYXIiLCJSaWNodGV4dEVkaXQiLCJoYW5kbGVVcGRhdGUiLCJ1c2VDYWxsYmFjayIsIm5ld1ZhbHVlIiwiaXNSZXF1aXJlZCIsIlRpbnlNQ0UiLCJGb3JtTWVzc2FnZSIsIm1lbW8iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFJQSxNQUFNQSxLQUFHLEdBQUcsSUFBSUMsaUJBQVMs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
