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
  const withoutTrailingSlash$4 = value => String(value || '').replace(/\/+$/, '');
  function parseSlugs$2(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(item => String(item).trim()).filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parseSlugs$2(parsed);
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
    const apiBaseUrl = withoutTrailingSlash$4(custom.apiBaseUrl || '/api/v1');
    const productUrlBase = withoutTrailingSlash$4(custom.productUrlBase || `${window.location.origin}/product`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput$1(slugInput) || normalizeSlugInput$1(params.name);
    const productUrl = previewSlug ? `${productUrlBase}/${previewSlug}` : null;
    const selectedCategorySlugs = parseSlugs$2(params.categoryIds);
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$4(custom.appUrl || window.location.origin)}${params.image}`;
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
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$4(custom.appUrl || window.location.origin)}${media.path}`);
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
  const withoutTrailingSlash$3 = value => String(value || '').replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$3(custom.apiBaseUrl || '/api/v1');
    const categoryUrlBase = withoutTrailingSlash$3(custom.categoryUrlBase || `${window.location.origin}/category`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput(slugInput) || normalizeSlugInput(params.label);
    const categoryUrl = previewSlug ? `${categoryUrlBase}/${previewSlug}` : null;
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$3(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    const bannerImageUrl = React.useMemo(() => {
      if (!params.bannerImage) return '';
      if (/^(https?:|data:|blob:)/.test(params.bannerImage)) return params.bannerImage;
      return `${withoutTrailingSlash$3(custom.appUrl || window.location.origin)}${params.bannerImage}`;
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
        setLocalPreview(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$3(custom.appUrl || window.location.origin)}${media.path}`);
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

  const withoutTrailingSlash$2 = value => String(value || '').replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$2(custom.apiBaseUrl || '/api/v1');
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
    fields: ['homeBannerImage', 'homeHighlightImage', 'homeFeaturedCategorySlugs']
  }, {
    id: 'payments',
    label: 'Payments',
    fields: ['razorpayEnabled', 'razorpayKeyId', 'razorpayKeySecret']
  }, {
    id: 'notifications',
    label: 'Notifications',
    fields: ['msg91Enabled', 'msg91AuthKey', 'msg91SenderId', 'msg91OtpTemplateId', 'msg91OrderTemplateId', 'msg91WhatsappEnabled', 'msg91WhatsappNumber', 'msg91WhatsappOtpTemplate', 'msg91WhatsappOrderTemplate', 'msg91WhatsappLanguage', 'msg91WhatsappNamespace', 'msg91WhatsappOtpButton']
  }];
  const withoutTrailingSlash$1 = value => String(value || '').replace(/\/+$/, '');
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
  function resolveImageUrl(path, appUrl) {
    if (!path) return '';
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    return `${withoutTrailingSlash$1(appUrl || window.location.origin)}${path}`;
  }
  function ImageUploader({
    label,
    hint,
    value,
    previewUrl,
    uploading,
    fileRef,
    onUpload,
    wide
  }) {
    const displayed = previewUrl || value;
    return /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, label, /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-upload-drop${wide ? ' tokri-upload-drop-wide' : ''}`
    }, displayed ? /*#__PURE__*/React__default.default.createElement("img", {
      src: displayed,
      alt: `${label} preview`
    }) : /*#__PURE__*/React__default.default.createElement("span", null, uploading ? 'Uploading…' : 'Click to upload an image'), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: onUpload
    })), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, hint));
  }
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
    const bannerFileRef = React.useRef(null);
    const highlightFileRef = React.useRef(null);
    const [bannerPreview, setBannerPreview] = React.useState('');
    const [highlightPreview, setHighlightPreview] = React.useState('');
    const [bannerUploading, setBannerUploading] = React.useState(false);
    const [highlightUploading, setHighlightUploading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$1(custom.apiBaseUrl || '/api/v1');
    const appUrl = custom.appUrl || window.location.origin;
    const selectedCategorySlugs = parseSlugs$1(params.homeFeaturedCategorySlugs);
    const bannerImageUrl = React.useMemo(() => resolveImageUrl(params.homeBannerImage, appUrl), [appUrl, params.homeBannerImage]);
    const highlightImageUrl = React.useMemo(() => resolveImageUrl(params.homeHighlightImage, appUrl), [appUrl, params.homeHighlightImage]);
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
    React.useEffect(() => {
      return () => {
        if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
      };
    }, [bannerPreview]);
    React.useEffect(() => {
      return () => {
        if (highlightPreview?.startsWith('blob:')) URL.revokeObjectURL(highlightPreview);
      };
    }, [highlightPreview]);
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
    const uploadImage = async (event, field, setPreview, setBusy, fileRef, successMessage) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('folder', 'general');
      formData.append('file', file);
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
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
        handleChange(field, media.path);
        setPreview(resolveImageUrl(media.path, appUrl));
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
        if (fileRef.current) fileRef.current.value = '';
      }
    };
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
      }, tab.id === 'charges' ? 'Shipping fee and handling charge are added to every order on the website and the app.' : tab.id === 'homepage' ? 'These images and categories appear on the website homepage. Click Save changes after uploading.' : 'Update your store settings and click Save changes below.'), tab.id === 'charges' ? /*#__PURE__*/React__default.default.createElement("div", {
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
      }, "Cart handling fee added to every order"))) : tab.id === 'homepage' ? /*#__PURE__*/React__default.default.createElement("div", {
        className: "tokri-homepage-fields"
      }, /*#__PURE__*/React__default.default.createElement(ImageUploader, {
        label: "Home banner image",
        hint: "Shown as the website hero banner. JPG, PNG, GIF, or WebP up to 5MB.",
        value: bannerImageUrl,
        previewUrl: bannerPreview,
        uploading: bannerUploading,
        fileRef: bannerFileRef,
        wide: true,
        onUpload: event => uploadImage(event, 'homeBannerImage', setBannerPreview, setBannerUploading, bannerFileRef, 'Banner image uploaded')
      }), /*#__PURE__*/React__default.default.createElement(ImageUploader, {
        label: "Fruit highlight image",
        hint: "Replaces the kiwi image in \u201CThe Small Fruit with a Big Punch\u201D on the website.",
        value: highlightImageUrl,
        previewUrl: highlightPreview,
        uploading: highlightUploading,
        fileRef: highlightFileRef,
        onUpload: event => uploadImage(event, 'homeHighlightImage', setHighlightPreview, setHighlightUploading, highlightFileRef, 'Highlight image uploaded')
      }), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Homepage categories", /*#__PURE__*/React__default.default.createElement(SearchableMultiSelect$1, {
        options: categories.map(item => ({
          value: item.slug,
          label: item.label || item.title || item.slug
        })),
        selected: selectedCategorySlugs,
        onChange: slugs => handleChange('homeFeaturedCategorySlugs', JSON.stringify(slugs)),
        placeholder: "Search and select categories",
        searchPlaceholder: "Search categories"
      }), /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-field-hint"
      }, "These categories load on the website after the fruit highlight section, one at a time as the visitor scrolls."))) : properties.map(property => /*#__PURE__*/React__default.default.createElement(adminjs.BasePropertyComponent, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvZm9ybS1jb250cm9scy5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEJveCwgSDIsIEg1LCBUZXh0LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3Qgc3RhdENhcmRzID0gW1xuICB7IGtleTogJ3Byb2R1Y3RDb3VudCcsIGxhYmVsOiAnUHJvZHVjdHMnLCBpY29uOiAnU2hvcHBpbmdDYXJ0JywgcmVzb3VyY2U6ICdQcm9kdWN0JyB9LFxuICB7IGtleTogJ29yZGVyQ291bnQnLCBsYWJlbDogJ09yZGVycycsIGljb246ICdTaG9wcGluZ0JhZycsIHJlc291cmNlOiAnT3JkZXInIH0sXG4gIHsga2V5OiAncGFnZUNvdW50JywgbGFiZWw6ICdQYWdlcycsIGljb246ICdGaWxlVGV4dCcsIHJlc291cmNlOiAnUGFnZScgfSxcbiAgeyBrZXk6ICdyZXZpZXdDb3VudCcsIGxhYmVsOiAnUmV2aWV3cycsIGljb246ICdTdGFyJywgcmVzb3VyY2U6ICdSZXZpZXcnIH0sXG5dXG5cbmNvbnN0IGFkbWluUm9vdCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnL3Jlc291cmNlcycpWzBdIHx8ICcnXG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFwaS5nZXREYXNoYm9hcmQoKS50aGVuKChyZXMpID0+IHNldERhdGEocmVzLmRhdGEpKS5jYXRjaCgoKSA9PiBzZXREYXRhKHt9KSlcbiAgfSwgW10pXG5cbiAgY29uc3Qgc3RhdHMgPSBkYXRhIHx8IHt9XG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3QoKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiIGNsYXNzTmFtZT1cInRva3JpLWRhc2hib2FyZFwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1kYXNoYm9hcmQtaGVyb1wiIHA9XCJ4eGxcIiBtYj1cInhsXCI+XG4gICAgICAgIDxIMiBtYj1cInNtXCI+V2VsY29tZSB0byBUb2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuOX0+XG4gICAgICAgICAgTWFuYWdlIHlvdXIgc3RvcmUgY29udGVudCwgcHJvZHVjdHMsIG9yZGVycywgYW5kIHdlYnNpdGUgc2V0dGluZ3MgZnJvbSBvbmUgcGxhY2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktc3RhdC1ncmlkXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7c3RhdENhcmRzLm1hcCgoY2FyZCkgPT4gKFxuICAgICAgICAgIDxCb3gga2V5PXtjYXJkLmtleX0gY2xhc3NOYW1lPVwidG9rcmktc3RhdC1jYXJkXCIgcD1cImxnXCI+XG4gICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICA8SDU+e2NhcmQubGFiZWx9PC9INT5cbiAgICAgICAgICAgICAgPEljb24gaWNvbj17Y2FyZC5pY29ufSAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8VGV4dCBmb250U2l6ZT17MzJ9IGZvbnRXZWlnaHQ9XCJib2xkXCI+XG4gICAgICAgICAgICAgIHtzdGF0c1tjYXJkLmtleV0gPz8gJ+KAlCd9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIG10PVwiZGVmYXVsdFwiXG4gICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgaHJlZj17YC90b2tyaS1iYWNrb2ZmaWNlL3Jlc291cmNlcy8ke2NhcmQucmVzb3VyY2V9YH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgVmlldyBhbGxcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktZGFzaGJvYXJkLWdyaWRcIj5cbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJ4bFwiPlxuICAgICAgICAgIDxINSBtYj1cImxnXCI+UXVpY2sgYWN0aW9uczwvSDU+XG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGNsYXNzTmFtZT1cInRva3JpLXF1aWNrLWFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1Byb2R1Y3QvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwiY29udGFpbmVkXCI+XG4gICAgICAgICAgICAgIEFkZCBwcm9kdWN0XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YCR7cm9vdH0vcmVzb3VyY2VzL1BhZ2UvYWN0aW9ucy9uZXdgfSB2YXJpYW50PVwib3V0bGluZWRcIj5cbiAgICAgICAgICAgICAgQWRkIHBhZ2VcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgJHtyb290fS9yZXNvdXJjZXMvU2V0dGluZy9yZWNvcmRzLzEvZWRpdGB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBTdG9yZSBzZXR0aW5nc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2Ake3Jvb3R9L3Jlc291cmNlcy9PcmRlcmB9IHZhcmlhbnQ9XCJvdXRsaW5lZFwiPlxuICAgICAgICAgICAgICBWaWV3IG9yZGVyc1xuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktcGFuZWxcIiBwPVwieGxcIj5cbiAgICAgICAgICA8SDUgbWI9XCJsZ1wiPlJlY2VudCBvcmRlcnM8L0g1PlxuICAgICAgICAgIHsoc3RhdHMucmVjZW50T3JkZXJzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9Pk5vIG9yZGVycyB5ZXQuPC9UZXh0PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8Qm94IGFzPVwidGFibGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1yZWNlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0aD5PcmRlcjwvdGg+XG4gICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgIDx0aD5Ub3RhbDwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgIHtzdGF0cy5yZWNlbnRPcmRlcnMubWFwKChvcmRlcikgPT4gKFxuICAgICAgICAgICAgICAgICAgPHRyIGtleT17b3JkZXIub3JkZXJOb30+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD57b3JkZXIub3JkZXJOb308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+e29yZGVyLnN0YXR1c308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+4oK5e29yZGVyLmdyYW5kVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQW5jaG9yZWRNZW51KG9wZW4pIHtcbiAgY29uc3Qgd3JhcFJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbY29vcmRzLCBzZXRDb29yZHNdID0gdXNlU3RhdGUobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdyYXBSZWYuY3VycmVudFxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBzcGFjZUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b21cbiAgICAgIGNvbnN0IG9wZW5VcCA9IHNwYWNlQmVsb3cgPCAyODAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93XG4gICAgICBzZXRDb29yZHMoe1xuICAgICAgICB0b3A6IG9wZW5VcCA/IHVuZGVmaW5lZCA6IHJlY3QuYm90dG9tICsgNixcbiAgICAgICAgYm90dG9tOiBvcGVuVXAgPyB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LnRvcCArIDYgOiB1bmRlZmluZWQsXG4gICAgICAgIGxlZnQ6IE1hdGgubWF4KDEyLCByZWN0LmxlZnQpLFxuICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIH1cbiAgfSwgW29wZW5dKVxuXG4gIHJldHVybiB7IHdyYXBSZWYsIGNvb3JkcyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2hhYmxlTXVsdGlTZWxlY3QoeyBvcHRpb25zLCBzZWxlY3RlZCwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCB7IHdyYXBSZWYsIGNvb3JkcyB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IHNlbGVjdGVkU2V0ID0gdXNlTWVtbygoKSA9PiBuZXcgU2V0KHNlbGVjdGVkKSwgW3NlbGVjdGVkXSlcbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKSlcbiAgY29uc3QgZmlsdGVyZWQgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT5cbiAgICBgJHtpdGVtLmxhYmVsfSAke2l0ZW0udmFsdWV9YC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcbiAgKVxuXG4gIGNvbnN0IHRvZ2dsZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZWxlY3RlZFNldC5oYXModmFsdWUpKSBvbkNoYW5nZShzZWxlY3RlZC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHZhbHVlKSlcbiAgICBlbHNlIG9uQ2hhbmdlKFsuLi5zZWxlY3RlZCwgdmFsdWVdKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBzXCI+XG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBcIj5cbiAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGUoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgw5dcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1wbGFjZWhvbGRlclwiPntwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gJiYgY29vcmRzID8gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbWVudVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgdG9wOiBjb29yZHMudG9wLFxuICAgICAgICAgICAgYm90dG9tOiBjb29yZHMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogY29vcmRzLmxlZnQsXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5tYXgoY29vcmRzLndpZHRoLCAyNjApLFxuICAgICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtjaGVja2VkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGUoaXRlbS52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZsYWdDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuY29uc3QgUHJvZHVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgcHJvZHVjdFVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20ucHJvZHVjdFVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcHJvZHVjdGAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLm5hbWUpXG4gIGNvbnN0IHByb2R1Y3RVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke3Byb2R1Y3RVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmNhdGVnb3J5SWRzKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZXRTZWxlY3RlZENhdGVnb3JpZXMgPSAoc2x1Z3MpID0+IHNldEZpZWxkKCdjYXRlZ29yeUlkcycsIEpTT04uc3RyaW5naWZ5KHNsdWdzKSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncHJvZHVjdHMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ21lZGlhSWQnLCBtZWRpYS5pZClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdQcm9kdWN0IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRpb25Qcm9wZXJ0eSA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbmQoXG4gICAgKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS5wcm9wZXJ0eVBhdGggPT09ICdkZXNjcmlwdGlvbicsXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ05ldyBwcm9kdWN0J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+QWRkIHBob3RvcywgcHJpY2VzLCBhbmQgb25lIG9yIG1vcmUgY2F0ZWdvcmllcyBmb3IgdGhlIHdlYnNpdGUgYW5kIGFwcC48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9kdWN0IGRldGFpbHM8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFscGhvbnNvIE1hbmdvXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtwcm9kdWN0VXJsID8gKFxuICAgICAgICAgICAgICA8YSBocmVmPXtwcm9kdWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge3Byb2R1Y3RVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBwcm9kdWN0IG5hbWUgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBQcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPbGQgcHJpY2UgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5vbGRQcmljZVZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdvbGRQcmljZVZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9wdGlvbmFsXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFdlaWdodFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMud2VpZ2h0IHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd3ZWlnaHQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMSBrZ1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBCYWRnZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYmFkZ2UgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2JhZGdlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNoXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0b2NrXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdG9jayA/PyAxMDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N0b2NrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Byb2R1Y3QgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSBzcXVhcmUgcHJvZHVjdCBwaG90bzwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yaWVzPC9oND5cbiAgICAgICAgPHA+QSBwcm9kdWN0IGNhbiBhcHBlYXIgaW4gbW9yZSB0aGFuIG9uZSBjYXRlZ29yeSBvbiB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFNlbGVjdCBjYXRlZ29yaWVzXG4gICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKX1cbiAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENhdGVnb3J5U2x1Z3N9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRDYXRlZ29yaWVzfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggYW5kIHNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5TdG9yZSBwbGFjZW1lbnQ8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiQmVzdHNlbGxlclwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBiZXN0c2VsbGVyc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNCZXN0U2VsbGVyJywgIShwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzSW1wb3J0ZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzSW1wb3J0ZWQgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiSW1wb3J0ZWRcIlxuICAgICAgICAgICAgaGludD1cIlNob3cgaW4gaW1wb3J0ZWQgZnJ1aXRzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0ltcG9ydGVkJywgIShwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNGZWF0dXJlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNGZWF0dXJlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJGZWF0dXJlZFwiXG4gICAgICAgICAgICBoaW50PVwiSGlnaGxpZ2h0IHRoaXMgZnJ1aXRcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzRmVhdHVyZWQnLCAhKHBhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnfVxuICAgICAgICAgICAgdGl0bGU9XCJBY3RpdmVcIlxuICAgICAgICAgICAgaGludD1cIlZpc2libGUgdG8gY3VzdG9tZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBwcm9kdWN0XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PlxuICBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgQ2F0ZWdvcnlFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgYmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Jhbm5lclByZXZpZXdVcmwsIHNldEJhbm5lclByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubGFiZWwpXG4gIGNvbnN0IGNhdGVnb3J5VXJsID0gcHJldmlld1NsdWcgPyBgJHtjYXRlZ29yeVVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYW5uZXJJbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5iYW5uZXJJbWFnZSkpIHJldHVybiBwYXJhbXMuYmFubmVySW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5iYW5uZXJJbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuYmFubmVySW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEJhbm5lclVybCA9IGJhbm5lclByZXZpZXdVcmwgfHwgYmFubmVySW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChiYW5uZXJQcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGJhbm5lclByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbYmFubmVyUHJldmlld1VybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdsYWJlbCcgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkVG8gPSBhc3luYyAoZmlsZSwgZmllbGQsIHNldExvY2FsUHJldmlldywgc2V0QnVzeSwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnY2F0ZWdvcmllcycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBzZXRMb2NhbFByZXZpZXcoVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgICBzZXRCdXN5KHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldExvY2FsUHJldmlldyhcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDYXRlZ29yeSBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubGFiZWwgfHwgJ05ldyBjYXRlZ29yeSd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHNob3Agc2VjdGlvbiB3aXRoIGEgdGh1bWJuYWlsLCBiYW5uZXIsIGFuZCBwYWdlIGNvcHkuPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTGFiZWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdsYWJlbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2ggRnJ1aXRzXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQYWdlIGhlYWRpbmdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNhbWUgYXMgbGFiZWwgaWYgZW1wdHlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN1YnRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdWJ0aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaG9ydCBsaW5lIHVuZGVyIHRoZSBoZWFkaW5nXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBsYWJlbFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgICB7Y2F0ZWdvcnlVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e2NhdGVnb3J5VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge2NhdGVnb3J5VXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gY2F0ZWdvcnkgbGFiZWwgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTb3J0IG9yZGVyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zb3J0T3JkZXIgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc29ydE9yZGVyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gd2Vic2l0ZSBhbmQgYXBwXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNhdGVnb3J5IGltYWdlPC9oND5cbiAgICAgICAgICA8cD5TcXVhcmUgdGh1bWJuYWlsIHVzZWQgaW4gdGhlIGhvbWUgY2F0ZWdvcnkgZ3JpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IHByZXZpZXcnfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGNhdGVnb3J5IGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkVG8oZmlsZSwgJ2ltYWdlJywgc2V0UHJldmlld1VybCwgc2V0VXBsb2FkaW5nLCAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yeSBiYW5uZXI8L2g0PlxuICAgICAgICA8cD5XaWRlIGltYWdlIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2UuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3AgdG9rcmktdXBsb2FkLWRyb3Atd2lkZVwiPlxuICAgICAgICAgIHtkaXNwbGF5ZWRCYW5uZXJVcmwgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkQmFubmVyVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgYmFubmVyJ30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGEgd2lkZSBiYW5uZXIgKDE2MDDDlzQwMCByZWNvbW1lbmRlZCk8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRUbyhcbiAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAnYmFubmVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyUHJldmlld1VybCxcbiAgICAgICAgICAgICAgICAgIHNldEJhbm5lclVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICdCYW5uZXIgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkRlc2NyaXB0aW9uPC9oND5cbiAgICAgICAge2Rlc2NyaXB0aW9uUHJvcGVydHkgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT5cbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtkZXNjcmlwdGlvblByb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7cmVzb3VyY2UuZWRpdFByb3BlcnRpZXNcbiAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gWydpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCkpXG4gICAgICAgICAgLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjYXRlZ29yeVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBJY29uLCBJbnB1dCwgUGFnaW5hdGlvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBSZWNvcmRzVGFibGUsXG4gIHVzZVF1ZXJ5UGFyYW1zLFxuICB1c2VSZWNvcmRzLFxuICB1c2VTZWxlY3RlZFJlY29yZHMsXG59IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IENtc0xpc3QgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZXNvdXJjZSwgc2V0VGFnIH0gPSBwcm9wc1xuICBjb25zdCB0aXRsZVByb3AgPSByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5uYW1lIHx8IHJlc291cmNlLnRpdGxlUHJvcGVydHk/LnByb3BlcnR5UGF0aCB8fCAnaWQnXG5cbiAgY29uc3QgeyBzdG9yZVBhcmFtcywgZmlsdGVycyB9ID0gdXNlUXVlcnlQYXJhbXMoKVxuICBjb25zdCB7XG4gICAgcmVjb3JkcyxcbiAgICBsb2FkaW5nLFxuICAgIGRpcmVjdGlvbixcbiAgICBzb3J0QnksXG4gICAgcGFnZSxcbiAgICB0b3RhbCxcbiAgICBmZXRjaERhdGEsXG4gICAgcGVyUGFnZSxcbiAgfSA9IHVzZVJlY29yZHMocmVzb3VyY2UuaWQpXG4gIGNvbnN0IHtcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgaGFuZGxlU2VsZWN0LFxuICAgIGhhbmRsZVNlbGVjdEFsbCxcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMsXG4gIH0gPSB1c2VTZWxlY3RlZFJlY29yZHMocmVjb3JkcylcblxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCgpID0+IFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gIGNvbnN0IGRlYm91bmNlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IHN0b3JlUGFyYW1zUmVmID0gdXNlUmVmKHN0b3JlUGFyYW1zKVxuICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50ID0gc3RvcmVQYXJhbXNcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFF1ZXJ5KFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzKFtdKVxuICB9LCBbcmVzb3VyY2UuaWQsIHRpdGxlUHJvcCwgc2V0U2VsZWN0ZWRSZWNvcmRzXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZXRUYWcpIHNldFRhZyh0b3RhbC50b1N0cmluZygpKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgY29uc3QgaGFuZGxlUXVlcnlDaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIHNldFF1ZXJ5KHZhbHVlKVxuXG4gICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIGRlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKClcbiAgICAgIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQoe1xuICAgICAgICBwYWdlOiAnMScsXG4gICAgICAgIGZpbHRlcnM6IHRyaW1tZWQgPyB7IFt0aXRsZVByb3BdOiB0cmltbWVkIH0gOiB7fSxcbiAgICAgIH0pXG4gICAgfSwgMzAwKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQWN0aW9uUGVyZm9ybWVkID0gKCkgPT4gZmV0Y2hEYXRhKClcblxuICBjb25zdCBoYW5kbGVQYWdpbmF0aW9uQ2hhbmdlID0gKHBhZ2VOdW1iZXIpID0+IHtcbiAgICBzdG9yZVBhcmFtcyh7IHBhZ2U6IHBhZ2VOdW1iZXIudG9TdHJpbmcoKSB9KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCI+XG4gICAgICA8Qm94IG1iPVwibGdcIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbWF4V2lkdGg6IDQyMCB9fT5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICBsZWZ0OiAxMixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8SWNvbiBpY29uPVwiU2VhcmNoXCIgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUXVlcnlDaGFuZ2V9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2BTZWFyY2ggJHtyZXNvdXJjZS5uYW1lfS4uLmB9XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ0xlZnQ6IDM2IH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCB2YXJpYW50PVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxSZWNvcmRzVGFibGVcbiAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgcmVjb3Jkcz17cmVjb3Jkc31cbiAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2hhbmRsZUFjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgaXNMb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAvPlxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICAgIHBhZ2U9e3BhZ2V9XG4gICAgICAgICAgICBwZXJQYWdlPXtwZXJQYWdlfVxuICAgICAgICAgICAgdG90YWw9e3RvdGFsfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVBhZ2luYXRpb25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ21zTGlzdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEg0LCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBSZXZpZXdFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ3Jldmlld3MnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3VXJsKFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHJldmlldycsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcHJvcGVydHlCeVBhdGggPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gW3Byb3BlcnR5LnByb3BlcnR5UGF0aCwgcHJvcGVydHldKSxcbiAgKVxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IChwcm9wZXJ0eVBhdGgpID0+IHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IHByb3BlcnR5QnlQYXRoW3Byb3BlcnR5UGF0aF1cbiAgICBpZiAoIXByb3BlcnR5KSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVtYWluaW5nUHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcihcbiAgICAocHJvcGVydHkpID0+ICFbJ3RpdGxlJywgJ25hbWUnLCAnY29udGVudCcsICdpbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gcD1cInhsXCI+XG4gICAgICA8Qm94IG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5SZXZpZXc8L0g0PlxuICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICBBZGQgdGhlIHJldmlldyB0aXRsZSwgcmV2aWV3ZXIgbmFtZSwgY29udGVudCwgYW5kIGFuIG9wdGlvbmFsIHJldmlld2VyIGltYWdlLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCd0aXRsZScpfTwvQm94PlxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCduYW1lJyl9PC9Cb3g+XG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ2NvbnRlbnQnKX08L0JveD5cblxuICAgICAgPEJveCBtYj1cInhsXCIgcD1cInhsXCIgYm9yZGVyPVwiMXB4IHNvbGlkICNkYmUzZWFcIiBib3JkZXJSYWRpdXM9XCIxNnB4XCIgYmc9XCIjZmZmZmZmXCI+XG4gICAgICAgIDxINCBtYj1cIm1kXCI+UmV2aWV3ZXIgSW1hZ2U8L0g0PlxuXG4gICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH1cbiAgICAgICAgICAgICAgYWx0PXtwYXJhbXMubmFtZSB8fCAnUmV2aWV3ZXInfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxNDAsXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY292ZXInLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNkYmUzZWEnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIE5vIGltYWdlIHNlbGVjdGVkIHlldC5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e3VwbG9hZEltYWdlfSAvPlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHtyZW1haW5pbmdQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgPEJveCBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH0gbWI9XCJsZ1wiPlxuICAgICAgICAgIHtyZW5kZXJQcm9wZXJ0eShwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpfVxuICAgICAgICA8L0JveD5cbiAgICAgICkpfVxuXG4gICAgICA8Qm94IG10PVwieGxcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgcmV2aWV3XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmV2aWV3RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIERyYXdlckNvbnRlbnQsXG4gIERyYXdlckZvb3RlcixcbiAgSDQsXG4gIEljb24sXG4gIFRleHQsXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZVJlY29yZCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFNlYXJjaGFibGVNdWx0aVNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IFRBQlMgPSBbXG4gIHtcbiAgICBpZDogJ2dlbmVyYWwnLFxuICAgIGxhYmVsOiAnR2VuZXJhbCcsXG4gICAgZmllbGRzOiBbXG4gICAgICAnc3RvcmVOYW1lJyxcbiAgICAgICdzdG9yZVRhZ2xpbmUnLFxuICAgICAgJ3N0b3JlRW1haWwnLFxuICAgICAgJ3N0b3JlUGhvbmUxJyxcbiAgICAgICdzdG9yZVBob25lMicsXG4gICAgICAnc3RvcmVBZGRyZXNzJyxcbiAgICAgICdwcm9tb0Jhbm5lcicsXG4gICAgICAnZWFybHlEZWxpdmVyeScsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnY2hhcmdlcycsXG4gICAgbGFiZWw6ICdDaGFyZ2VzJyxcbiAgICBmaWVsZHM6IFsnc2hpcHBpbmdGZWUnLCAnaGFuZGxpbmdGZWUnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaG9tZXBhZ2UnLFxuICAgIGxhYmVsOiAnSG9tZXBhZ2UnLFxuICAgIGZpZWxkczogWydob21lQmFubmVySW1hZ2UnLCAnaG9tZUhpZ2hsaWdodEltYWdlJywgJ2hvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGF5bWVudHMnLFxuICAgIGxhYmVsOiAnUGF5bWVudHMnLFxuICAgIGZpZWxkczogWydyYXpvcnBheUVuYWJsZWQnLCAncmF6b3JwYXlLZXlJZCcsICdyYXpvcnBheUtleVNlY3JldCddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdub3RpZmljYXRpb25zJyxcbiAgICBsYWJlbDogJ05vdGlmaWNhdGlvbnMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ21zZzkxRW5hYmxlZCcsXG4gICAgICAnbXNnOTFBdXRoS2V5JyxcbiAgICAgICdtc2c5MVNlbmRlcklkJyxcbiAgICAgICdtc2c5MU90cFRlbXBsYXRlSWQnLFxuICAgICAgJ21zZzkxT3JkZXJUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwRW5hYmxlZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcE51bWJlcicsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cFRlbXBsYXRlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3JkZXJUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcExhbmd1YWdlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwTmFtZXNwYWNlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3RwQnV0dG9uJyxcbiAgICBdLFxuICB9LFxuXVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUltYWdlVXJsKHBhdGgsIGFwcFVybCkge1xuICBpZiAoIXBhdGgpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGF0aCkpIHJldHVybiBwYXRoXG4gIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChhcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXRofWBcbn1cblxuZnVuY3Rpb24gSW1hZ2VVcGxvYWRlcih7XG4gIGxhYmVsLFxuICBoaW50LFxuICB2YWx1ZSxcbiAgcHJldmlld1VybCxcbiAgdXBsb2FkaW5nLFxuICBmaWxlUmVmLFxuICBvblVwbG9hZCxcbiAgd2lkZSxcbn0pIHtcbiAgY29uc3QgZGlzcGxheWVkID0gcHJldmlld1VybCB8fCB2YWx1ZVxuXG4gIHJldHVybiAoXG4gICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAge2xhYmVsfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktdXBsb2FkLWRyb3Ake3dpZGUgPyAnIHRva3JpLXVwbG9hZC1kcm9wLXdpZGUnIDogJyd9YH0+XG4gICAgICAgIHtkaXNwbGF5ZWQgPyAoXG4gICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZH0gYWx0PXtgJHtsYWJlbH0gcHJldmlld2B9IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4+e3VwbG9hZGluZyA/ICdVcGxvYWRpbmfigKYnIDogJ0NsaWNrIHRvIHVwbG9hZCBhbiBpbWFnZSd9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17b25VcGxvYWR9IC8+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+e2hpbnR9PC9zcGFuPlxuICAgIDwvbGFiZWw+XG4gIClcbn1cblxuY29uc3QgU2V0dGluZ3NFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IHVzZVN0YXRlKCdnZW5lcmFsJylcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgaGlnaGxpZ2h0RmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbYmFubmVyUHJldmlldywgc2V0QmFubmVyUHJldmlld10gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2hpZ2hsaWdodFByZXZpZXcsIHNldEhpZ2hsaWdodFByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2hpZ2hsaWdodFVwbG9hZGluZywgc2V0SGlnaGxpZ2h0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCBzZWxlY3RlZENhdGVnb3J5U2x1Z3MgPSBwYXJzZVNsdWdzKHBhcmFtcy5ob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzKVxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmhvbWVCYW5uZXJJbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaG9tZUJhbm5lckltYWdlXSxcbiAgKVxuICBjb25zdCBoaWdobGlnaHRJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVIaWdobGlnaHRJbWFnZV0sXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpXG4gICAgaWYgKGhhc2ggPT09ICdhcHBlYXJhbmNlJykge1xuICAgICAgc2V0QWN0aXZlVGFiKCdjaGFyZ2VzJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoaGFzaCAmJiBUQUJTLnNvbWUoKHRhYikgPT4gdGFiLmlkID09PSBoYXNoKSkge1xuICAgICAgc2V0QWN0aXZlVGFiKGhhc2gpXG4gICAgfVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgYCMke2FjdGl2ZVRhYn1gKVxuICB9LCBbYWN0aXZlVGFiXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3KVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChoaWdobGlnaHRQcmV2aWV3Py5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGhpZ2hsaWdodFByZXZpZXcpXG4gICAgfVxuICB9LCBbaGlnaGxpZ2h0UHJldmlld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCwgZmllbGQsIHNldFByZXZpZXcsIHNldEJ1c3ksIGZpbGVSZWYsIHN1Y2Nlc3NNZXNzYWdlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdnZW5lcmFsJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3KGxvY2FsUHJldmlld1VybClcbiAgICBzZXRCdXN5KHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoZmllbGQsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3KHJlc29sdmVJbWFnZVVybChtZWRpYS5wYXRoLCBhcHBVcmwpKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogc3VjY2Vzc01lc3NhZ2UsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ3N1Y2Nlc3MnIHx8IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogJ1NldHRpbmdzIHNhdmVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzLiBQbGVhc2UgdHJ5IGFnYWluLicsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBmbGV4IGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIiBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXRhYnNcIiBtYj1cInhsXCI+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNldHRpbmdzLXRhYiR7YWN0aXZlVGFiID09PSB0YWIuaWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKHRhYi5pZCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RhYi5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPERyYXdlckNvbnRlbnQ+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcigocHJvcGVydHkpID0+XG4gICAgICAgICAgICB0YWIuZmllbGRzLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXBhbmVsXCJcbiAgICAgICAgICAgICAgcD1cInhsXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogYWN0aXZlVGFiID09PSB0YWIuaWQgPyAnYmxvY2snIDogJ25vbmUnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxINCBtYj1cInNtXCI+e3RhYi5sYWJlbH08L0g0PlxuICAgICAgICAgICAgICA8VGV4dCBtYj1cInhsXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnXG4gICAgICAgICAgICAgICAgICA/ICdTaGlwcGluZyBmZWUgYW5kIGhhbmRsaW5nIGNoYXJnZSBhcmUgYWRkZWQgdG8gZXZlcnkgb3JkZXIgb24gdGhlIHdlYnNpdGUgYW5kIHRoZSBhcHAuJ1xuICAgICAgICAgICAgICAgICAgOiB0YWIuaWQgPT09ICdob21lcGFnZSdcbiAgICAgICAgICAgICAgICAgICAgPyAnVGhlc2UgaW1hZ2VzIGFuZCBjYXRlZ29yaWVzIGFwcGVhciBvbiB0aGUgd2Vic2l0ZSBob21lcGFnZS4gQ2xpY2sgU2F2ZSBjaGFuZ2VzIGFmdGVyIHVwbG9hZGluZy4nXG4gICAgICAgICAgICAgICAgICAgIDogJ1VwZGF0ZSB5b3VyIHN0b3JlIHNldHRpbmdzIGFuZCBjbGljayBTYXZlIGNoYW5nZXMgYmVsb3cuJ31cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICB7dGFiLmlkID09PSAnY2hhcmdlcycgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFyZ2VzLWZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBTaGlwcGluZyBmZWUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5zaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ3NoaXBwaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkRlbGl2ZXJ5IGNoYXJnZSBhZGRlZCB0byBldmVyeSBvcmRlcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIEhhbmRsaW5nIGNoYXJnZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmhhbmRsaW5nRmVlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnaGFuZGxpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+Q2FydCBoYW5kbGluZyBmZWUgYWRkZWQgdG8gZXZlcnkgb3JkZXI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktaG9tZXBhZ2UtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkhvbWUgYmFubmVyIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIlNob3duIGFzIHRoZSB3ZWJzaXRlIGhlcm8gYmFubmVyLiBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17YmFubmVySW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e2Jhbm5lclByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17YmFubmVyVXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXtiYW5uZXJGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICB3aWRlXG4gICAgICAgICAgICAgICAgICAgIG9uVXBsb2FkPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdob21lQmFubmVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QmFubmVyUHJldmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJhbm5lclVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbm5lckZpbGVSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQmFubmVyIGltYWdlIHVwbG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkZydWl0IGhpZ2hsaWdodCBpbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGhpbnQ9XCJSZXBsYWNlcyB0aGUga2l3aSBpbWFnZSBpbiDigJxUaGUgU21hbGwgRnJ1aXQgd2l0aCBhIEJpZyBQdW5jaOKAnSBvbiB0aGUgd2Vic2l0ZS5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aGlnaGxpZ2h0SW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e2hpZ2hsaWdodFByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17aGlnaGxpZ2h0VXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXtoaWdobGlnaHRGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUhpZ2hsaWdodEltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhpZ2hsaWdodFByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIaWdobGlnaHRVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0hpZ2hsaWdodCBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBIb21lcGFnZSBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnNsdWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCB8fCBpdGVtLnRpdGxlIHx8IGl0ZW0uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2F0ZWdvcnlTbHVnc31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHNsdWdzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKCdob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzJywgSlNPTi5zdHJpbmdpZnkoc2x1Z3MpKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbmQgc2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgVGhlc2UgY2F0ZWdvcmllcyBsb2FkIG9uIHRoZSB3ZWJzaXRlIGFmdGVyIHRoZSBmcnVpdCBoaWdobGlnaHQgc2VjdGlvbiwgb25lIGF0XG4gICAgICAgICAgICAgICAgICAgICAgYSB0aW1lIGFzIHRoZSB2aXNpdG9yIHNjcm9sbHMuXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9EcmF3ZXJDb250ZW50PlxuXG4gICAgICA8RHJhd2VyRm9vdGVyPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY2hhbmdlc1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRHJhd2VyRm9vdGVyPlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHBhZChudW0pIHtcbiAgcmV0dXJuIFN0cmluZyhudW0pLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRldGltZVZhbHVlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtwYWQoZGF0ZS5nZXRNb250aCgpICsgMSl9LSR7cGFkKGRhdGUuZ2V0RGF0ZSgpKX1UJHtwYWQoZGF0ZS5nZXRIb3VycygpKX06JHtwYWQoZGF0ZS5nZXRNaW51dGVzKCkpfWBcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXk6ICcyLWRpZ2l0JyxcbiAgICBtb250aDogJ3Nob3J0JyxcbiAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgaG91cjogJzItZGlnaXQnLFxuICAgIG1pbnV0ZTogJzItZGlnaXQnLFxuICB9KVxufVxuXG5mdW5jdGlvbiB1c2VBbmNob3JlZE1lbnUob3Blbikge1xuICBjb25zdCB3cmFwUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtjb29yZHMsIHNldENvb3Jkc10gPSB1c2VTdGF0ZShudWxsKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgY29uc3Qgb3BlblVwID0gc3BhY2VCZWxvdyA8IDI4MCAmJiByZWN0LnRvcCA+IHNwYWNlQmVsb3dcbiAgICAgIHNldENvb3Jkcyh7XG4gICAgICAgIHRvcDogb3BlblVwID8gdW5kZWZpbmVkIDogcmVjdC5ib3R0b20gKyA2LFxuICAgICAgICBib3R0b206IG9wZW5VcCA/IHdpbmRvdy5pbm5lckhlaWdodCAtIHJlY3QudG9wICsgNiA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGVmdDogTWF0aC5tYXgoMTIsIHJlY3QubGVmdCksXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGUoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgfVxuICB9LCBbb3Blbl0pXG5cbiAgcmV0dXJuIHsgd3JhcFJlZiwgY29vcmRzIH1cbn1cblxuZnVuY3Rpb24gQ2hvaWNlQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIEFuY2hvcmVkU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIGNvb3JkcyB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudCl9PlxuICAgICAgICA8c3Bhbj57c2VsZWN0ZWQ/LmxhYmVsIHx8IHBsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiAmJiBjb29yZHMgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1tZW51XCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICB0b3A6IGNvb3Jkcy50b3AsXG4gICAgICAgICAgICBib3R0b206IGNvb3Jkcy5ib3R0b20sXG4gICAgICAgICAgICBsZWZ0OiBjb29yZHMubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLm1heChjb29yZHMud2lkdGgsIDIyMCksXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtvcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWV9XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2l0ZW0udmFsdWUgPT09IHZhbHVlID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFNlYXJjaGFibGVNdWx0aVNlbGVjdCh7IG9wdGlvbnMsIHNlbGVjdGVkLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHNlYXJjaFBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgY29vcmRzIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTZXQgPSB1c2VNZW1vKCgpID0+IG5ldyBTZXQoc2VsZWN0ZWQpLCBbc2VsZWN0ZWRdKVxuICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT4gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpKVxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgY29uc3QgdG9nZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkU2V0Lmhhcyh2YWx1ZSkpIG9uQ2hhbmdlKHNlbGVjdGVkLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gdmFsdWUpKVxuICAgIGVsc2Ugb25DaGFuZ2UoWy4uLnNlbGVjdGVkLCB2YWx1ZV0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHZhbHVlKSA9PiAhdmFsdWUpfT5cbiAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcHNcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcFwiPlxuICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDDl1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyXCI+e3BsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiAmJiBjb29yZHMgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1tZW51XCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICB0b3A6IGNvb3Jkcy50b3AsXG4gICAgICAgICAgICBib3R0b206IGNvb3Jkcy5ib3R0b20sXG4gICAgICAgICAgICBsZWZ0OiBjb29yZHMubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLm1heChjb29yZHMud2lkdGgsIDI2MCksXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFF1ZXJ5KGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VhcmNoUGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2NoZWNrZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9eygpID0+IHRvZ2dsZShpdGVtLnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBEYXRlVGltZVBpY2tlcih7IHZhbHVlLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBwYXJzZWQgPSB2YWx1ZSA/IG5ldyBEYXRlKHZhbHVlKSA6IG51bGxcbiAgY29uc3QgdmFsaWQgPSBwYXJzZWQgJiYgIU51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSA/IHBhcnNlZCA6IG51bGxcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttb250aERhdGUsIHNldE1vbnRoRGF0ZV0gPSB1c2VTdGF0ZSh2YWxpZCB8fCBuZXcgRGF0ZSgpKVxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKHZhbGlkID8gcGFkKHZhbGlkLmdldEhvdXJzKCkpIDogJzAwJylcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0TWludXRlcygpKSA6ICcwMCcpXG4gIGNvbnN0IHsgd3JhcFJlZiwgY29vcmRzIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXZhbGlkKSByZXR1cm5cbiAgICBzZXRNb250aERhdGUodmFsaWQpXG4gICAgc2V0SG91cnMocGFkKHZhbGlkLmdldEhvdXJzKCkpKVxuICAgIHNldE1pbnV0ZXMocGFkKHZhbGlkLmdldE1pbnV0ZXMoKSkpXG4gIH0sIFt2YWx1ZV0pXG5cbiAgY29uc3QgeWVhciA9IG1vbnRoRGF0ZS5nZXRGdWxsWWVhcigpXG4gIGNvbnN0IG1vbnRoID0gbW9udGhEYXRlLmdldE1vbnRoKClcbiAgY29uc3QgZmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSkuZ2V0RGF5KClcbiAgY29uc3QgdG90YWxEYXlzID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKS5nZXREYXRlKClcbiAgY29uc3QgY2VsbHMgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0RGF5OyBpICs9IDEpIGNlbGxzLnB1c2gobnVsbClcbiAgZm9yIChsZXQgZGF5ID0gMTsgZGF5IDw9IHRvdGFsRGF5czsgZGF5ICs9IDEpIGNlbGxzLnB1c2goZGF5KVxuXG4gIGNvbnN0IGFwcGx5ID0gKGRheSwgbmV4dEhvdXJzID0gaG91cnMsIG5leHRNaW51dGVzID0gbWludXRlcykgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBgJHt5ZWFyfS0ke3BhZChtb250aCArIDEpfS0ke3BhZChkYXkpfVQke3BhZChOdW1iZXIobmV4dEhvdXJzKSB8fCAwKX06JHtwYWQoTnVtYmVyKG5leHRNaW51dGVzKSB8fCAwKX1gXG4gICAgb25DaGFuZ2UobmV4dClcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkRGF5ID1cbiAgICB2YWxpZCAmJiB2YWxpZC5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmIHZhbGlkLmdldE1vbnRoKCkgPT09IG1vbnRoID8gdmFsaWQuZ2V0RGF0ZSgpIDogbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyXCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPnt2YWxpZCA/IGZvcm1hdERhdGV0aW1lTGFiZWwodmFsaWQpIDogcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3Bhbj7wn5OFPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiAmJiBjb29yZHMgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLXBvcFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgdG9wOiBjb29yZHMudG9wLFxuICAgICAgICAgICAgYm90dG9tOiBjb29yZHMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogY29vcmRzLmxlZnQsXG4gICAgICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItbmF2XCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHN0cm9uZz5cbiAgICAgICAgICAgICAge21vbnRoRGF0ZS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1vbnRoOiAnbG9uZycsIHllYXI6ICdudW1lcmljJyB9KX1cbiAgICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0TW9udGhEYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSkpfT5cbiAgICAgICAgICAgICAg4oC6XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItd2Vla1wiPlxuICAgICAgICAgICAge1snU3UnLCAnTW8nLCAnVHUnLCAnV2UnLCAnVGgnLCAnRnInLCAnU2EnXS5tYXAoKGxhYmVsKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17bGFiZWx9PntsYWJlbH08L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItZ3JpZFwiPlxuICAgICAgICAgICAge2NlbGxzLm1hcCgoZGF5LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgZGF5ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGtleT17YCR7eWVhcn0tJHttb250aH0tJHtkYXl9YH1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzZWxlY3RlZERheSA9PT0gZGF5ID8gJ2lzLXNlbGVjdGVkJyA6ICcnfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gYXBwbHkoZGF5KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7ZGF5fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT17YGVtcHR5LSR7aW5kZXh9YH0gLz5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLXRpbWVcIj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgSG91clxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCIyM1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2hvdXJzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oMjMsIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldEhvdXJzKG5leHQpXG4gICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXkpIGFwcGx5KHNlbGVjdGVkRGF5LCBuZXh0LCBtaW51dGVzKVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBNaW51dGVcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiNTlcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXttaW51dGVzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oNTksIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldE1pbnV0ZXMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIGhvdXJzLCBuZXh0KVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jbGVhclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSgnJylcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDbGVhclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgQ291cG9uRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG5cbiAgY29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSlcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLnRhcmdldFNsdWdzKVxuICBjb25zdCB0YXJnZXRUeXBlID0gcGFyYW1zLnRhcmdldFR5cGUgfHwgJ2FsbCdcbiAgY29uc3QgYXBwbHlPbiA9IHBhcmFtcy5hcHBseU9uIHx8ICdjYXJ0J1xuICBjb25zdCB1c2FnZVR5cGUgPSBwYXJhbXMudXNhZ2VUeXBlIHx8ICd1bmxpbWl0ZWQnXG4gIGNvbnN0IGNvdXBvblR5cGUgPSBwYXJhbXMudHlwZSB8fCAncGVyY2VudCdcbiAgY29uc3QgaXNBY3RpdmUgPSBwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG5cbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkQ2F0YWxvZygpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5RGF0YSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICBjb25zdCBhbGxQcm9kdWN0cyA9IFtdXG4gICAgICAgIGxldCBwYWdlID0gMVxuICAgICAgICBsZXQgaGFzTW9yZSA9IHRydWVcbiAgICAgICAgd2hpbGUgKGhhc01vcmUgJiYgcGFnZSA8PSAyMCkge1xuICAgICAgICAgIGNvbnN0IHByb2R1Y3REYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vcHJvZHVjdHM/cGFnZT0ke3BhZ2V9JmxpbWl0PTEwMGApLnRoZW4oKHJlc3BvbnNlKSA9PlxuICAgICAgICAgICAgcmVzcG9uc2UuanNvbigpLFxuICAgICAgICAgIClcbiAgICAgICAgICBhbGxQcm9kdWN0cy5wdXNoKC4uLihwcm9kdWN0RGF0YS5wcm9kdWN0cyB8fCBbXSkpXG4gICAgICAgICAgaGFzTW9yZSA9IEJvb2xlYW4ocHJvZHVjdERhdGEuaGFzTW9yZSlcbiAgICAgICAgICBwYWdlICs9IDFcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgc2V0UHJvZHVjdHMoYWxsUHJvZHVjdHMpXG4gICAgICAgIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShjYXRlZ29yeURhdGEpID8gY2F0ZWdvcnlEYXRhIDogW10pXG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHtcbiAgICAgICAgICBzZXRQcm9kdWN0cyhbXSlcbiAgICAgICAgICBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9hZENhdGFsb2coKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgc2V0U2VsZWN0ZWRTbHVncyA9IChuZXh0KSA9PiBzZXRGaWVsZCgndGFyZ2V0U2x1Z3MnLCBKU09OLnN0cmluZ2lmeShuZXh0KSlcblxuICBjb25zdCBwcm9kdWN0T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcHJvZHVjdHMubWFwKChpdGVtKSA9PiAoeyB2YWx1ZTogaXRlbS5zbHVnLCBsYWJlbDogaXRlbS5uYW1lIH0pKSxcbiAgICBbcHJvZHVjdHNdLFxuICApXG4gIGNvbnN0IGNhdGVnb3J5T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gY2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKSxcbiAgICBbY2F0ZWdvcmllc10sXG4gIClcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY291cG9uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3Vwb24gc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY291cG9uLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj5DcmVhdGUgYSBzdG9yZSBjb3Vwb248L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgU2V0IHdobyBnZXRzIHRoZSBkaXNjb3VudCwgd2hlcmUgaXQgYXBwbGllcywgYW5kIGhvdyBtYW55IHRpbWVzIGl0IGNhbiBiZSB1c2VkLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Db3Vwb24gY29kZTwvaDQ+XG4gICAgICAgICAgPHA+Q3VzdG9tZXJzIHdpbGwgdHlwZSB0aGlzIGF0IGNoZWNrb3V0IG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9wPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLWNvdXBvbi1jb2RlXCJcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXRUxDT01FMTBcIlxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdG9nZ2xlXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIGV2ZW50LnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICBDb3Vwb24gaXMgYWN0aXZlXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkRpc2NvdW50PC9oND5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAncGVyY2VudCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiUGVyY2VudCBvZmZcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiAxMCUgb2ZmXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3R5cGUnLCAncGVyY2VudCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAnZmxhdCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiRmxhdCBhbW91bnRcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiDigrk1MCBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdmbGF0Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIHtjb3Vwb25UeXBlID09PSAncGVyY2VudCcgPyAnUGVyY2VudCB2YWx1ZScgOiAnQW1vdW50ICjigrkpJ31cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy52YWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWluIGNhcnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5taW5DYXJ0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdtaW5DYXJ0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWF4IGRpc2NvdW50ICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubWF4RGlzY291bnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21heERpc2NvdW50JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk5vIGNhcFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkFwcGx5IGRpc2NvdW50IG9uPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnY2FydCd9XG4gICAgICAgICAgICB0aXRsZT1cIkNhcnQgdG90YWxcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSB0aGUgaXRlbXMgc3VidG90YWxcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnY2FydCcpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnc2hpcHBpbmcnfVxuICAgICAgICAgICAgdGl0bGU9XCJTaGlwcGluZyBmZWVcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSBkZWxpdmVyeSBjaGFyZ2VzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdhcHBseU9uJywgJ3NoaXBwaW5nJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5XaG8gY2FuIGdldCB0aGlzIGRpc2NvdW50PC9oND5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIEFwcGx5IHRvXG4gICAgICAgICAgPEFuY2hvcmVkU2VsZWN0XG4gICAgICAgICAgICB2YWx1ZT17dGFyZ2V0VHlwZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIHdobyB0aGlzIGNvdXBvbiBhcHBsaWVzIHRvXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICBzZXRGaWVsZCgndGFyZ2V0VHlwZScsIG5leHQpXG4gICAgICAgICAgICAgIHNldFNlbGVjdGVkU2x1Z3MoW10pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICB7IHZhbHVlOiAnYWxsJywgbGFiZWw6ICdBbGwgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdwcm9kdWN0cycsIGxhYmVsOiAnU2VsZWN0ZWQgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdjYXRlZ29yaWVzJywgbGFiZWw6ICdTZWxlY3RlZCBjYXRlZ29yaWVzJyB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAncHJvZHVjdHMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFByb2R1Y3RzXG4gICAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3Byb2R1Y3RPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHByb2R1Y3RzXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcHJvZHVjdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7dGFyZ2V0VHlwZSA9PT0gJ2NhdGVnb3JpZXMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENhdGVnb3JpZXNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcnlPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+VXNhZ2U8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3VubGltaXRlZCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiVW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgaGludD1cIkN1c3RvbWVycyBjYW4gcmV1c2UgaXRcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3VubGltaXRlZCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXt1c2FnZVR5cGUgPT09ICdzaW5nbGUnfVxuICAgICAgICAgICAgICB0aXRsZT1cIlNpbmdsZSB1c2VcIlxuICAgICAgICAgICAgICBoaW50PVwiT25lIHVzZSBwZXIgY3VzdG9tZXJcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3NpbmdsZScpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJyA/IChcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgT3B0aW9uYWwgZ2xvYmFsIGNhcFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudXNhZ2VMaW1pdCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndXNhZ2VMaW1pdCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJMZWF2ZSBibGFuayBmb3IgdW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0PkVhY2ggbG9nZ2VkLWluIGN1c3RvbWVyIGNhbiB1c2UgdGhpcyBjb3Vwb24gb25jZS48L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7cGFyYW1zLnVzZWRDb3VudCA/IDxUZXh0IG10PVwiZGVmYXVsdFwiPlVzZWQge3BhcmFtcy51c2VkQ291bnR9IHRpbWUocykgc28gZmFyLjwvVGV4dD4gOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+U2NoZWR1bGU8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXJ0cyBhdFxuICAgICAgICAgICAgPERhdGVUaW1lUGlja2VyXG4gICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGV0aW1lVmFsdWUocGFyYW1zLnN0YXJ0c0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnc3RhcnRzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBzdGFydCBkYXRlIGFuZCB0aW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBFeHBpcmVzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuZXhwaXJlc0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnZXhwaXJlc0F0JywgbmV4dCB8fCBudWxsKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgZXhwaXJ5IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY291cG9uXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ291cG9uRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDQsIEg1LCBMYWJlbCwgU2VsZWN0LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGFtb3VudCkpIHJldHVybiAn4oK5MCdcbiAgcmV0dXJuIGDigrkke2Ftb3VudC50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KX1gXG59XG5cbmNvbnN0IGZvcm1hdERhdGVUaW1lID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICByZXR1cm4gbmV3IERhdGUodmFsdWUpLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXRlU3R5bGU6ICdtZWRpdW0nLFxuICAgIHRpbWVTdHlsZTogJ3Nob3J0JyxcbiAgfSlcbn1cblxuY29uc3QgcmVzb2x2ZUltYWdlID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QodmFsdWUpKSByZXR1cm4gdmFsdWVcbiAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJy8nKSkgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHt2YWx1ZX1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG5jb25zdCBPcmRlckRldGFpbCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgaXNFZGl0ID0gYWN0aW9uPy5uYW1lID09PSAnZWRpdCdcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UuaWQpXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBpdGVtcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHBhcmFtcy5pdGVtc0pzb24gfHwgJ1tdJylcbiAgICAgIHJldHVybiBwYXJzZWQubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICAuLi5pdGVtLFxuICAgICAgICBpbWFnZTogcmVzb2x2ZUltYWdlKGl0ZW0uaW1hZ2UpLFxuICAgICAgfSkpXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH0sIFtwYXJhbXMuaXRlbXNKc29uXSlcblxuICBjb25zdCBoYW5kbGVTYXZlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHNldFNhdmluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBzdWJtaXQoKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ09yZGVyIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5LicsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBkYXRlIG9yZGVyLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXR1c09wdGlvbnMgPSBbXG4gICAgeyB2YWx1ZTogJ3BlbmRpbmcnLCBsYWJlbDogJ1BlbmRpbmcnIH0sXG4gICAgeyB2YWx1ZTogJ3BhaWQnLCBsYWJlbDogJ1BhaWQnIH0sXG4gICAgeyB2YWx1ZTogJ3BhY2tlZCcsIGxhYmVsOiAnUGFja2VkJyB9LFxuICAgIHsgdmFsdWU6ICdzaGlwcGVkJywgbGFiZWw6ICdTaGlwcGVkJyB9LFxuICAgIHsgdmFsdWU6ICdkZWxpdmVyZWQnLCBsYWJlbDogJ0RlbGl2ZXJlZCcgfSxcbiAgICB7IHZhbHVlOiAnY2FuY2VsbGVkJywgbGFiZWw6ICdDYW5jZWxsZWQnIH0sXG4gIF1cblxuICBjb25zdCBwYXltZW50T3B0aW9ucyA9IFtcbiAgICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycgfSxcbiAgICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUGFpZCcgfSxcbiAgICB7IHZhbHVlOiAnZmFpbGVkJywgbGFiZWw6ICdGYWlsZWQnIH0sXG4gICAgeyB2YWx1ZTogJ3JlZnVuZGVkJywgbGFiZWw6ICdSZWZ1bmRlZCcgfSxcbiAgXVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWRldGFpbFwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJ4bFwiIG1iPVwieGxcIj5cbiAgICAgICAgPEg0IG1iPVwic21cIj5cbiAgICAgICAgICBPcmRlciAje3BhcmFtcy5vcmRlck5vfSBkZXRhaWxzXG4gICAgICAgIDwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuOH0+XG4gICAgICAgICAgUGF5bWVudCB2aWEge3BhcmFtcy5wYXltZW50TWV0aG9kIHx8ICdDYXNoIG9uIGRlbGl2ZXJ5J31cbiAgICAgICAgICB7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkID8gYCDCtyBQYXltZW50IElEOiAke3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZH1gIDogJyd9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZ3JpZFwiIG1iPVwieGxcIj5cbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJsZ1wiPlxuICAgICAgICAgIDxINSBtYj1cImxnXCI+R2VuZXJhbDwvSDU+XG4gICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgIDxMYWJlbD5PcmRlciBkYXRlPC9MYWJlbD5cbiAgICAgICAgICAgIDxUZXh0Pntmb3JtYXREYXRlVGltZShwYXJhbXMuY3JlYXRlZEF0KX08L1RleHQ+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgIDxMYWJlbD5DdXN0b21lciBuYW1lPC9MYWJlbD5cbiAgICAgICAgICAgIDxUZXh0IGZvbnRXZWlnaHQ9XCJib2xkXCI+e3BhcmFtcy5jdXN0b21lck5hbWUgfHwgJ0d1ZXN0J308L1RleHQ+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgIDxMYWJlbD5DdXN0b21lciBwaG9uZTwvTGFiZWw+XG4gICAgICAgICAgICA8VGV4dD57cGFyYW1zLmN1c3RvbWVyUGhvbmUgfHwgJ+KAlCd9PC9UZXh0PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIHtwYXJhbXMuY3VzdG9tZXJFbWFpbCA/IChcbiAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgIDxMYWJlbD5DdXN0b21lciBlbWFpbDwvTGFiZWw+XG4gICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJFbWFpbH08L1RleHQ+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7aXNFZGl0ID8gKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVNhdmV9PlxuICAgICAgICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5PcmRlciBzdGF0dXM8L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzdGF0dXNPcHRpb25zLmZpbmQoKG9wdGlvbikgPT4gb3B0aW9uLnZhbHVlID09PSBwYXJhbXMuc3RhdHVzKX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e3N0YXR1c09wdGlvbnN9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHNlbGVjdGVkKSA9PiBoYW5kbGVDaGFuZ2UoJ3N0YXR1cycsIHNlbGVjdGVkPy52YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgICAgIDxMYWJlbD5QYXltZW50IHN0YXR1czwvTGFiZWw+XG4gICAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BheW1lbnRPcHRpb25zLmZpbmQoKG9wdGlvbikgPT4gb3B0aW9uLnZhbHVlID09PSBwYXJhbXMucGF5bWVudFN0YXR1cyl9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtwYXltZW50T3B0aW9uc31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2VsZWN0ZWQpID0+IGhhbmRsZUNoYW5nZSgncGF5bWVudFN0YXR1cycsIHNlbGVjdGVkPy52YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCBzYXZpbmd9PlxuICAgICAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5nLi4uJyA6ICdVcGRhdGUgb3JkZXInfVxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+T3JkZXIgc3RhdHVzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dCB0ZXh0VHJhbnNmb3JtPVwiY2FwaXRhbGl6ZVwiPntwYXJhbXMuc3RhdHVzfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPlBheW1lbnQgc3RhdHVzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dCB0ZXh0VHJhbnNmb3JtPVwiY2FwaXRhbGl6ZVwiPntwYXJhbXMucGF5bWVudFN0YXR1c308L1RleHQ+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1wYW5lbFwiIHA9XCJsZ1wiPlxuICAgICAgICAgIDxINSBtYj1cImxnXCI+RGVsaXZlcnkgYWRkcmVzczwvSDU+XG4gICAgICAgICAge3BhcmFtcy5hZGRyZXNzRm9ybWF0dGVkID8gKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICA8TGFiZWw+QWRkcmVzcyB0eXBlPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dD57cGFyYW1zLmFkZHJlc3NMYWJlbCB8fCAnRGVsaXZlcnknfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPkRlbGl2ZXIgdG88L0xhYmVsPlxuICAgICAgICAgICAgICAgIDxUZXh0PntwYXJhbXMuY3VzdG9tZXJOYW1lfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPExhYmVsPlBob25lPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dD57cGFyYW1zLmN1c3RvbWVyUGhvbmUgfHwgJ+KAlCd9PC9UZXh0PlxuICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICA8TGFiZWw+RnVsbCBhZGRyZXNzPC9MYWJlbD5cbiAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17eyBsaW5lSGVpZ2h0OiAxLjcgfX0+e3BhcmFtcy5hZGRyZXNzRm9ybWF0dGVkfTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5ObyBkZWxpdmVyeSBhZGRyZXNzIHNhdmVkIGZvciB0aGlzIG9yZGVyLjwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXBhbmVsXCIgcD1cImxnXCI+XG4gICAgICAgIDxINSBtYj1cImxnXCI+T3JkZXIgaXRlbXM8L0g1PlxuICAgICAgICB7aXRlbXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+Tm8gaXRlbXMgZm91bmQgZm9yIHRoaXMgb3JkZXIuPC9UZXh0PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxCb3ggYXM9XCJ0YWJsZVwiIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWl0ZW1zLXRhYmxlXCI+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+SXRlbTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkNvc3Q8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5RdHk8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5Ub3RhbDwvdGg+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0+XG4gICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgc3R5bGU9e3sgZ2FwOiAxMiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pbWFnZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpdGVtLmltYWdlfSBhbHQ9e2l0ZW0ubmFtZX0gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbS1pbWFnZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IGZvbnRXZWlnaHQ9XCJib2xkXCI+e2l0ZW0ubmFtZX08L1RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS53ZWlnaHQgPyA8VGV4dCBmb250U2l6ZT1cInNtXCIgb3BhY2l0eT17MC43fT57aXRlbS53ZWlnaHR9PC9UZXh0PiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57Zm9ybWF0TW9uZXkoaXRlbS5wcmljZVZhbHVlKX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnF1YW50aXR5fTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KGl0ZW0ubGluZVRvdGFsKX08L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgIDx0Zm9vdD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5JdGVtcyBzdWJ0b3RhbDwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShwYXJhbXMuaXRlbXNUb3RhbCl9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5EZWxpdmVyeSBjaGFyZ2VzPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5kZWxpdmVyeUNoYXJnZSl9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5DYXJ0IGhhbmRsaW5nPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5oYW5kbGluZ0NoYXJnZSl9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5TbWFsbCBjYXJ0IGNoYXJnZTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShwYXJhbXMuc21hbGxDYXJ0Q2hhcmdlKX08L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICB7TnVtYmVyKHBhcmFtcy5kaXNjb3VudCkgPiAwID8gKFxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5EaXNjb3VudDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+LXtmb3JtYXRNb25leShwYXJhbXMuZGlzY291bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJpcy10b3RhbFwiPlxuICAgICAgICAgICAgICAgIDx0ZCBjb2xTcGFuPXszfT5PcmRlciB0b3RhbDwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGZvb3Q+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICl9XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBPcmRlckRldGFpbFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIElucHV0LCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBFeWVJY29uID0gKHsgaGlkZGVuIH0pID0+XG4gIGhpZGRlbiA/IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgPHBhdGggZD1cIk05LjkgNC4yQTEwLjcgMTAuNyAwIDAgMSAxMiA0YzUgMCA5IDQuNSAxMCA4YTEyLjggMTIuOCAwIDAgMS0yLjEgMy42XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgPC9zdmc+XG4gICkgOiAoXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3UzIgMTIgMiAxMnpcIiAvPlxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICA8L3N2Zz5cbiAgKVxuXG5mdW5jdGlvbiBQYXNzd29yZEZpZWxkKHsgaWQsIGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIHZpc2libGUsIG9uVG9nZ2xlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgIDxMYWJlbCBodG1sRm9yPXtpZH0gcmVxdWlyZWQ+e2xhYmVsfTwvTGFiZWw+XG4gICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiB3aWR0aD1cIjEwMCVcIj5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgIHR5cGU9e3Zpc2libGUgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEV5ZUljb24gaGlkZGVuPXt2aXNpYmxlfSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NvbmZpcm1QYXNzd29yZCwgc2V0Q29uZmlybVBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93Q29uZmlybSwgc2V0U2hvd0NvbmZpcm1dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0RXJyb3IoJycpXG4gICAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCA2KSB7XG4gICAgICBzZXRFcnJvcignUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgc2V0RXJyb3IoJ05ldyBwYXNzd29yZCBhbmQgY29uZmlybSBwYXNzd29yZCBtdXN0IGJlIHRoZSBzYW1lLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICdjaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IHBhc3N3b3JkLCBjb25maXJtUGFzc3dvcmQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZS5kYXRhPy5ub3RpY2VcbiAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgc2V0RXJyb3Iobm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKG5vdGljZSkgYWRkTm90aWNlKG5vdGljZSlcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gcmVzcG9uc2UuZGF0YT8ucmVkaXJlY3RVcmxcbiAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2xvc2UoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICBpbnNldDogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMiwgMTIsIDgsIDAuNjIpJyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB6SW5kZXg6IDgwLFxuICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBhcz1cImZvcm1cIlxuICAgICAgICBvblN1Ym1pdD17c2F2ZX1cbiAgICAgICAgYmc9XCJ3aGl0ZVwiXG4gICAgICAgIHdpZHRoPXtbJzEwMCUnLCAnNDIwcHgnXX1cbiAgICAgICAgcD1cInhsXCJcbiAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxNiwgYm94U2hhZG93OiAnMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMjgpJyB9fVxuICAgICAgPlxuICAgICAgICA8SDMgbWI9XCJzbVwiPkNoYW5nZSBwYXNzd29yZDwvSDM+XG4gICAgICAgIDxUZXh0IG1iPVwieGxcIiBjb2xvcj1cIiM2NDc0OGJcIj5cbiAgICAgICAgICBTZXQgYSBuZXcgcGFzc3dvcmQgZm9yIHtyZWNvcmQ/LnBhcmFtcz8ubmFtZSB8fCByZWNvcmQ/LnBhcmFtcz8uZW1haWwgfHwgJ3RoaXMgdXNlcid9LlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICBpZD1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJOZXcgcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0UGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd1Bhc3N3b3JkfVxuICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRTaG93UGFzc3dvcmQoKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwiY29uZmlybS1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICB2YWx1ZT17Y29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd0NvbmZpcm19XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dDb25maXJtKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7ZXJyb3IgPyAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIGNvbG9yPVwiI2RjMjYyNlwiPntlcnJvcn08L1RleHQ+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCIgc3R5bGU9e3sgZ2FwOiAxMCB9fT5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9e2Nsb3NlfSBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIHZhcmlhbnQ9XCJjb250YWluZWRcIiBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlIHBhc3N3b3JkJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VQYXNzd29yZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBGb3JtR3JvdXAsXG4gIEgyLFxuICBJbnB1dCxcbiAgTGFiZWwsXG4gIE1lc3NhZ2VCb3gsXG4gIFRleHQsXG59IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IFJFTUVNQkVSRURfTE9HSU5fS0VZID0gJ3Rva3JpX2FkbWluX2xvZ2luJ1xuXG5jb25zdCBMb2dpbiA9ICgpID0+IHtcbiAgY29uc3QgeyBhY3Rpb24sIGVycm9yTWVzc2FnZSB9ID0gd2luZG93Ll9fQVBQX1NUQVRFX18gfHwge31cbiAgY29uc3QgeyB0cmFuc2xhdGVNZXNzYWdlIH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGFkbWluUm9vdCA9IGFjdGlvbj8ucmVwbGFjZSgvXFwvbG9naW4kLywgJycpIHx8ICcnXG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkVXJsID0gYCR7YWRtaW5Sb290fS9mb3Jnb3QtcGFzc3dvcmRgXG4gIGNvbnN0IFtpZGVudGlmaWVyLCBzZXRJZGVudGlmaWVyXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbcmVtZW1iZXJMb2dpbiwgc2V0UmVtZW1iZXJMb2dpbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dQYXNzd29yZCwgc2V0U2hvd1Bhc3N3b3JkXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmVtZW1iZXJlZExvZ2luID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIGlmIChyZW1lbWJlcmVkTG9naW4pIHtcbiAgICAgIHNldElkZW50aWZpZXIocmVtZW1iZXJlZExvZ2luKVxuICAgICAgc2V0UmVtZW1iZXJMb2dpbih0cnVlKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZm9ybSA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICBjb25zdCBlbWFpbElucHV0ID0gZm9ybS5lbGVtZW50cy5uYW1lZEl0ZW0oJ2VtYWlsJylcbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICAoZW1haWxJbnB1dCAmJiAndmFsdWUnIGluIGVtYWlsSW5wdXQgPyBTdHJpbmcoZW1haWxJbnB1dC52YWx1ZSkgOiBpZGVudGlmaWVyKS50cmltKClcblxuICAgIGlmIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCkge1xuICAgICAgZW1haWxJbnB1dC52YWx1ZSA9IHZhbHVlXG4gICAgfVxuXG4gICAgaWYgKHJlbWVtYmVyTG9naW4gJiYgdmFsdWUpIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSwgdmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIGZsZXhcbiAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIlxuICAgICAgbWluSGVpZ2h0PVwiMTAwdmhcIlxuICAgICAgYmc9XCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDIyYzIyLCAjMDQ3ODU3KVwiXG4gICAgICBwPVwieGxcIlxuICAgID5cbiAgICAgIDxCb3hcbiAgICAgICAgYmc9XCJ3aGl0ZVwiXG4gICAgICAgIHdpZHRoPXtbJzEwMCUnLCAnNDQwcHgnXX1cbiAgICAgICAgYm9yZGVyUmFkaXVzPVwiMThweFwiXG4gICAgICAgIGJveFNoYWRvdz1cIjAgMjRweCA3MHB4IHJnYmEoMiwgNDQsIDM0LCAwLjM1KVwiXG4gICAgICAgIHA9XCJ4M1wiXG4gICAgICA+XG4gICAgICAgIDxIMiBjb2xvcj1cIiMwMjJjMjJcIiBtYj1cInNtXCI+VG9rcmlpaSBDTVM8L0gyPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIiM2NDc0OGJcIiBtYj1cInhsXCI+XG4gICAgICAgICAgU2lnbiBpbiB3aXRoIHlvdXIgYWRtaW4gZW1haWwgb3IgdXNlcm5hbWUgdG8gbWFuYWdlIHByb2R1Y3RzLCBvcmRlcnMsIGFuZCBjb250ZW50LlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAge2Vycm9yTWVzc2FnZSA/IChcbiAgICAgICAgICA8TWVzc2FnZUJveFxuICAgICAgICAgICAgbWI9XCJsZ1wiXG4gICAgICAgICAgICBtZXNzYWdlPXtlcnJvck1lc3NhZ2Uuc3BsaXQoJyAnKS5sZW5ndGggPiAxID8gZXJyb3JNZXNzYWdlIDogdHJhbnNsYXRlTWVzc2FnZShlcnJvck1lc3NhZ2UpfVxuICAgICAgICAgICAgdmFyaWFudD1cImRhbmdlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgPEJveCBhcz1cImZvcm1cIiBhY3Rpb249e2FjdGlvbn0gbWV0aG9kPVwiUE9TVFwiIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxuICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICA8TGFiZWwgcmVxdWlyZWQ+RW1haWwgb3IgdXNlcm5hbWU8L0xhYmVsPlxuICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgZW1haWwgb3IgdXNlcm5hbWVcIlxuICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJ1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17aWRlbnRpZmllcn1cbiAgICAgICAgICAgICAga2V5PXtpZGVudGlmaWVyIHx8ICdsb2dpbi1lbWFpbCd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5QYXNzd29yZDwvTGFiZWw+XG4gICAgICAgICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiB3aWR0aD1cIjEwMCVcIj5cbiAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgdHlwZT17c2hvd1Bhc3N3b3JkID8gJ3RleHQnIDogJ3Bhc3N3b3JkJ31cbiAgICAgICAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgcGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cImN1cnJlbnQtcGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmdSaWdodDogNDIgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3Nob3dQYXNzd29yZCA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93UGFzc3dvcmQoKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzA0Nzg1NycsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNixcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjYsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7c2hvd1Bhc3N3b3JkID8gKFxuICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDNsMTggMThcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwLjYgMTAuNkEyIDIgMCAwIDAgMTMuNCAxMy40XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk05LjkgNC4yQTEwLjcgMTAuNyAwIDAgMSAxMiA0YzUgMCA5IDQuNSAxMCA4YTEyLjggMTIuOCAwIDAgMS0yLjEgMy42XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk02LjYgNi42QzQuMyA4IDIuNyAxMC4yIDIgMTJjMSAzLjUgNSA4IDEwIDggMS41IDAgMi45LS40IDQuMS0xXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3UzIgMTIgMiAxMnpcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGlkPVwicmVtZW1iZXItbG9naW5cIlxuICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICBjaGVja2VkPXtyZW1lbWJlckxvZ2lufVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRSZW1lbWJlckxvZ2luKGV2ZW50LnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luUmlnaHQ6IDggfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInJlbWVtYmVyLWxvZ2luXCIgc3R5bGU9e3sgY29sb3I6ICcjNDc1NTY5JywgZm9udFNpemU6IDE0IH19PlxuICAgICAgICAgICAgICBSZW1lbWJlciBteSBlbWFpbCBvciB1c2VybmFtZSBvbiB0aGlzIGRldmljZVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIHZhcmlhbnQ9XCJjb250YWluZWRcIiB3aWR0aD1cIjEwMCVcIiBtdD1cImxnXCI+XG4gICAgICAgICAgICBTaWduIGluXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIDxUZXh0IG10PVwieGxcIiB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8YSBocmVmPXtmb3Jnb3RQYXNzd29yZFVybH0gc3R5bGU9e3sgY29sb3I6ICcjMDQ3ODU3JywgZm9udFdlaWdodDogNzAwIH19PlxuICAgICAgICAgICAgRm9yZ290IHBhc3N3b3JkP1xuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9naW5cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbkdyb3VwLCBNZXNzYWdlQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZUZpbHRlckRyYXdlciwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJ1xuXG5mdW5jdGlvbiBhZG1pblJvb3RQYXRoKCkge1xuICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaCgvXiguKilcXC9yZXNvdXJjZXNcXC8vKVxuICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8kLywgJycpXG59XG5cbmZ1bmN0aW9uIGNhdGFsb2dDb25maWcocmVzb3VyY2VJZCkge1xuICBpZiAocmVzb3VyY2VJZCA9PT0gJ0NhdGVnb3J5Jykge1xuICAgIHJldHVybiB7IGV4cG9ydFVybDogJ2NhdGVnb3JpZXMvZXhwb3J0JywgaW1wb3J0VXJsOiAnY2F0ZWdvcmllcy9pbXBvcnQnIH1cbiAgfVxuICBpZiAocmVzb3VyY2VJZCA9PT0gJ1Byb2R1Y3QnKSB7XG4gICAgcmV0dXJuIHsgZXhwb3J0VXJsOiAncHJvZHVjdHMvZXhwb3J0JywgaW1wb3J0VXJsOiAncHJvZHVjdHMvaW1wb3J0JyB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zKHsgcmVzb3VyY2UsIG9uSW1wb3J0ZWQgfSkge1xuICBjb25zdCB7IHRyYW5zbGF0ZUJ1dHRvbiwgdHJhbnNsYXRlQWN0aW9uIH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdG9nZ2xlRmlsdGVyLCBmaWx0ZXJzQ291bnQgfSA9IHVzZUZpbHRlckRyYXdlcigpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZShudWxsKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG5cbiAgY29uc3QgcmVzb3VyY2VJZCA9IHJlc291cmNlLmlkXG4gIGNvbnN0IGNvbmZpZyA9IGNhdGFsb2dDb25maWcocmVzb3VyY2VJZClcbiAgY29uc3Qgcm9vdCA9IGFkbWluUm9vdFBhdGgoKVxuXG4gIGNvbnN0IGhhbmRsZUltcG9ydCA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnXG4gICAgaWYgKCFmaWxlIHx8ICFjb25maWcpIHJldHVyblxuXG4gICAgc2V0TG9hZGluZyh0cnVlKVxuICAgIHNldE1lc3NhZ2UobnVsbClcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3Jvb3R9L2NhdGFsb2cvJHtjb25maWcuaW1wb3J0VXJsfWAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8ICdJbXBvcnQgZmFpbGVkLicpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVycm9yQ291bnQgPSBkYXRhLmVycm9ycz8ubGVuZ3RoIHx8IDBcbiAgICAgIHNldE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBlcnJvckNvdW50ID8gJ2luZm8nIDogJ3N1Y2Nlc3MnLFxuICAgICAgICB0ZXh0OlxuICAgICAgICAgIGVycm9yQ291bnQgPiAwXG4gICAgICAgICAgICA/IGBJbXBvcnQgZmluaXNoZWQuICR7ZGF0YS5jcmVhdGVkfSBhZGRlZCwgJHtkYXRhLnVwZGF0ZWR9IHVwZGF0ZWQuICR7ZXJyb3JDb3VudH0gcm93KHMpIGNvdWxkIG5vdCBiZSBpbXBvcnRlZC5gXG4gICAgICAgICAgICA6IGBJbXBvcnQgZmluaXNoZWQuICR7ZGF0YS5jcmVhdGVkfSBhZGRlZCwgJHtkYXRhLnVwZGF0ZWR9IHVwZGF0ZWQuYCxcbiAgICAgIH0pXG4gICAgICBvbkltcG9ydGVkPy4oKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogJ2RhbmdlcicsIHRleHQ6IGVycm9yLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1dHRvbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWNvbmZpZykgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L2NhdGFsb2cvJHtjb25maWcuZXhwb3J0VXJsfWAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogbG9hZGluZyA/ICdJbXBvcnRpbmcuLi4nIDogJ0ltcG9ydCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgb25DbGljazogbG9hZGluZyA/IHVuZGVmaW5lZCA6ICgpID0+IGZpbGVSZWYuY3VycmVudD8uY2xpY2soKSxcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3QgbmV3QWN0aW9uID0gcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zPy5maW5kKChhY3Rpb24pID0+IGFjdGlvbi5uYW1lID09PSAnbmV3JylcbiAgICBpZiAobmV3QWN0aW9uKSB7XG4gICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgaWNvbjogbmV3QWN0aW9uLmljb24sXG4gICAgICAgIGxhYmVsOiB0cmFuc2xhdGVBY3Rpb24obmV3QWN0aW9uLmxhYmVsLCByZXNvdXJjZUlkKSxcbiAgICAgICAgdmFyaWFudDogbmV3QWN0aW9uLnZhcmlhbnQsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L3Jlc291cmNlcy8ke3Jlc291cmNlSWR9L2FjdGlvbnMvbmV3YCxcbiAgICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tbmV3LWJ1dHRvbmAsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlcktleSA9IGZpbHRlcnNDb3VudCA+IDAgPyAnZmlsdGVyQWN0aXZlJyA6ICdmaWx0ZXInXG4gICAgaXRlbXMucHVzaCh7XG4gICAgICBsYWJlbDogdHJhbnNsYXRlQnV0dG9uKGZpbHRlcktleSwgcmVzb3VyY2VJZCwgeyBjb3VudDogZmlsdGVyc0NvdW50IH0pLFxuICAgICAgb25DbGljazogdG9nZ2xlRmlsdGVyLFxuICAgICAgaWNvbjogJ0ZpbHRlcicsXG4gICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1maWx0ZXItYnV0dG9uYCxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGl0ZW1zXG4gIH0sIFtcbiAgICBjb25maWcsXG4gICAgcm9vdCxcbiAgICBsb2FkaW5nLFxuICAgIHJlc291cmNlLnJlc291cmNlQWN0aW9ucyxcbiAgICByZXNvdXJjZUlkLFxuICAgIHRyYW5zbGF0ZUFjdGlvbixcbiAgICB0cmFuc2xhdGVCdXR0b24sXG4gICAgZmlsdGVyc0NvdW50LFxuICAgIHRvZ2dsZUZpbHRlcixcbiAgXSlcblxuICBpZiAoIWNvbmZpZykgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Qm94XG4gICAgICAgIG10PVwieGxcIlxuICAgICAgICBtYj1cImRlZmF1bHRcIlxuICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIlxuICAgICAgICBmbGV4U2hyaW5rPXswfVxuICAgICAgICBweD17WydkZWZhdWx0JywgMF19XG4gICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogJy01MnB4JyB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uR3JvdXAgYnV0dG9ucz17YnV0dG9uc30gLz5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBhY2NlcHQ9XCIuY3N2LHRleHQvY3N2XCJcbiAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlSW1wb3J0fVxuICAgICAgICAvPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHttZXNzYWdlICYmIChcbiAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIiBweD17WydkZWZhdWx0JywgMF19PlxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICB2YXJpYW50PXttZXNzYWdlLnR5cGV9XG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlLnRleHR9XG4gICAgICAgICAgICBvbkNsb3NlQ2xpY2s9eygpID0+IHNldE1lc3NhZ2UobnVsbCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgT3JpZ2luYWxBY3Rpb25IZWFkZXIgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyBmcm9tICcuL2NhdGFsb2ctbGlzdC1oZWFkZXItYWN0aW9ucy5qc3gnXG5cbmNvbnN0IENBVEFMT0dfUkVTT1VSQ0VTID0gbmV3IFNldChbJ1Byb2R1Y3QnLCAnQ2F0ZWdvcnknXSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWN0aW9uSGVhZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQsIGFjdGlvbiwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IEJhc2VIZWFkZXIgPSBPcmlnaW5hbENvbXBvbmVudCB8fCBPcmlnaW5hbEFjdGlvbkhlYWRlclxuICBjb25zdCBpc0NhdGFsb2dMaXN0ID0gYWN0aW9uPy5uYW1lID09PSAnbGlzdCcgJiYgQ0FUQUxPR19SRVNPVVJDRVMuaGFzKHJlc291cmNlPy5pZClcblxuICBpZiAoIWlzQ2F0YWxvZ0xpc3QpIHtcbiAgICByZXR1cm4gPEJhc2VIZWFkZXIgey4uLnByb3BzfSAvPlxuICB9XG5cbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudDogX2lnbm9yZWQsIC4uLmhlYWRlclByb3BzIH0gPSBwcm9wc1xuXG4gIHJldHVybiAoXG4gICAgPEJveD5cbiAgICAgIDxCYXNlSGVhZGVyIHsuLi5oZWFkZXJQcm9wc30gb21pdEFjdGlvbnMgLz5cbiAgICAgIDxDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnNcbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICBvbkltcG9ydGVkPXtwcm9wcy5hY3Rpb25QZXJmb3JtZWR9XG4gICAgICAvPlxuICAgIDwvQm94PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgbWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIExhYmVsLCBUaW55TUNFIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbHVnaW5zOiBbXG4gICAgJ2NvZGUnLFxuICAgICdsaW5rJyxcbiAgICAnbGlzdHMnLFxuICAgICdpbWFnZScsXG4gICAgJ3RhYmxlJyxcbiAgICAnYXV0b2xpbmsnLFxuICAgICdwcmV2aWV3JyxcbiAgICAnc2VhcmNocmVwbGFjZScsXG4gICAgJ3dvcmRjb3VudCcsXG4gICAgJ21lZGlhJyxcbiAgICAnY29kZXNhbXBsZScsXG4gIF0sXG4gIHRvb2xiYXI6XG4gICAgJ3VuZG8gcmVkbyB8IGJsb2NrcyB8IGJvbGQgaXRhbGljIHVuZGVybGluZSBzdHJpa2V0aHJvdWdoIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgYWxpZ25qdXN0aWZ5IHwgYnVsbGlzdCBudW1saXN0IG91dGRlbnQgaW5kZW50IHwgbGluayBpbWFnZSB0YWJsZSBjb2Rlc2FtcGxlIHwgY29kZSB8IHJlbW92ZWZvcm1hdCcsXG4gIGhlaWdodDogNDAwLFxufVxuXG5jb25zdCBSaWNodGV4dEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9ID0gcHJvcHNcbiAgY29uc3QgdmFsdWUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkucGF0aF0gPz8gJydcbiAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF1cblxuICBjb25zdCBoYW5kbGVVcGRhdGUgPSB1c2VDYWxsYmFjayhcbiAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5ld1ZhbHVlKVxuICAgIH0sXG4gICAgW29uQ2hhbmdlLCBwcm9wZXJ0eS5wYXRoXSxcbiAgKVxuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLihwcm9wZXJ0eS5wcm9wcyB8fCB7fSksXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXAgZXJyb3I9e0Jvb2xlYW4oZXJyb3IpfT5cbiAgICAgIDxMYWJlbCByZXF1aXJlZD17cHJvcGVydHkuaXNSZXF1aXJlZH0+e3Byb3BlcnR5LmxhYmVsfTwvTGFiZWw+XG4gICAgICA8VGlueU1DRSB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtoYW5kbGVVcGRhdGV9IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gICAgICA8Rm9ybU1lc3NhZ2U+e2Vycm9yPy5tZXNzYWdlfTwvRm9ybU1lc3NhZ2U+XG4gICAgPC9Gb3JtR3JvdXA+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSaWNodGV4dEVkaXQpXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBQcm9kdWN0RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RFZGl0ID0gUHJvZHVjdEVkaXRcbmltcG9ydCBDYXRlZ29yeUVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2F0ZWdvcnlFZGl0ID0gQ2F0ZWdvcnlFZGl0XG5pbXBvcnQgQ21zTGlzdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ21zTGlzdCA9IENtc0xpc3RcbmltcG9ydCBSZXZpZXdFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Jldmlldy1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZXZpZXdFZGl0ID0gUmV2aWV3RWRpdFxuaW1wb3J0IFNldHRpbmdzRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TZXR0aW5nc0VkaXQgPSBTZXR0aW5nc0VkaXRcbmltcG9ydCBDb3Vwb25FZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Db3Vwb25FZGl0ID0gQ291cG9uRWRpdFxuaW1wb3J0IE9yZGVyRGV0YWlsIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJEZXRhaWwgPSBPcmRlckRldGFpbFxuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NoYW5nZS1wYXNzd29yZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2hhbmdlUGFzc3dvcmQgPSBDaGFuZ2VQYXNzd29yZFxuaW1wb3J0IExvZ2luIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgQWN0aW9uSGVhZGVyIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkFjdGlvbkhlYWRlciA9IEFjdGlvbkhlYWRlclxuaW1wb3J0IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yaWNodGV4dC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgPSBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibmFtZXMiOlsiYXBpIiwiQXBpQ2xpZW50Iiwic3RhdENhcmRzIiwia2V5IiwibGFiZWwiLCJpY29uIiwicmVzb3VyY2UiLCJhZG1pblJvb3QiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic3BsaXQiLCJEYXNoYm9hcmQiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZ2V0RGFzaGJvYXJkIiwidGhlbiIsInJlcyIsImNhdGNoIiwic3RhdHMiLCJyb290IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94IiwidmFyaWFudCIsImNsYXNzTmFtZSIsInAiLCJtYiIsIkgyIiwiVGV4dCIsIm9wYWNpdHkiLCJkaXNwbGF5IiwibWFwIiwiY2FyZCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsIkg1IiwiSWNvbiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsIkJ1dHRvbiIsIm10Iiwic2l6ZSIsImFzIiwiaHJlZiIsImZsZXhXcmFwIiwicmVjZW50T3JkZXJzIiwibGVuZ3RoIiwib3JkZXIiLCJvcmRlck5vIiwic3RhdHVzIiwiZ3JhbmRUb3RhbCIsInVzZUFuY2hvcmVkTWVudSIsIm9wZW4iLCJ3cmFwUmVmIiwidXNlUmVmIiwiY29vcmRzIiwic2V0Q29vcmRzIiwidW5kZWZpbmVkIiwidXBkYXRlIiwibm9kZSIsImN1cnJlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3BhY2VCZWxvdyIsImlubmVySGVpZ2h0IiwiYm90dG9tIiwib3BlblVwIiwidG9wIiwibGVmdCIsIk1hdGgiLCJtYXgiLCJ3aWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiU2VhcmNoYWJsZU11bHRpU2VsZWN0Iiwib3B0aW9ucyIsInNlbGVjdGVkIiwib25DaGFuZ2UiLCJwbGFjZWhvbGRlciIsInNlYXJjaFBsYWNlaG9sZGVyIiwic2V0T3BlbiIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJvbkRvY0NsaWNrIiwiZXZlbnQiLCJjb250YWlucyIsInRhcmdldCIsImRvY3VtZW50Iiwic2VsZWN0ZWRTZXQiLCJ1c2VNZW1vIiwiU2V0Iiwic2VsZWN0ZWRPcHRpb25zIiwiZmlsdGVyIiwiaXRlbSIsImhhcyIsInZhbHVlIiwiZmlsdGVyZWQiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwidHJpbSIsInRvZ2dsZSIsInJlZiIsInR5cGUiLCJvbkNsaWNrIiwicm9sZSIsInRhYkluZGV4Iiwic3RvcFByb3BhZ2F0aW9uIiwic3R5bGUiLCJwb3NpdGlvbiIsInpJbmRleCIsImF1dG9Gb2N1cyIsImNoZWNrZWQiLCJGbGFnQ2FyZCIsInRpdGxlIiwiaGludCIsIm5vcm1hbGl6ZVNsdWdJbnB1dCIsIlN0cmluZyIsInJlcGxhY2UiLCJ3aXRob3V0VHJhaWxpbmdTbGFzaCIsInBhcnNlU2x1Z3MiLCJyYXciLCJBcnJheSIsImlzQXJyYXkiLCJCb29sZWFuIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwiUHJvZHVjdEVkaXQiLCJwcm9wcyIsInJlY29yZCIsImluaXRpYWxSZWNvcmQiLCJoYW5kbGVDaGFuZ2UiLCJzdWJtaXQiLCJoYW5kbGVTdWJtaXQiLCJsb2FkaW5nIiwidXNlUmVjb3JkIiwiaWQiLCJhZGROb3RpY2UiLCJ1c2VOb3RpY2UiLCJmaWxlUmVmIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwic2x1Z0VkaXRlZCIsInNldFNsdWdFZGl0ZWQiLCJwYXJhbXMiLCJzbHVnIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJjYXRlZ29yaWVzIiwic2V0Q2F0ZWdvcmllcyIsImN1c3RvbSIsImFwaUJhc2VVcmwiLCJwcm9kdWN0VXJsQmFzZSIsIm9yaWdpbiIsInNsdWdJbnB1dCIsInByZXZpZXdTbHVnIiwibmFtZSIsInByb2R1Y3RVcmwiLCJzZWxlY3RlZENhdGVnb3J5U2x1Z3MiLCJjYXRlZ29yeUlkcyIsImltYWdlVXJsIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiaWdub3JlIiwiZmV0Y2giLCJyZXNwb25zZSIsImpzb24iLCJzZXRGaWVsZCIsIm9uUHJvcGVydHlDaGFuZ2UiLCJwcm9wZXJ0eVBhdGgiLCJyZXN0Iiwic2V0U2VsZWN0ZWRDYXRlZ29yaWVzIiwic2x1Z3MiLCJzdHJpbmdpZnkiLCJ1cGxvYWRJbWFnZSIsImZpbGUiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJsb2NhbFByZXZpZXdVcmwiLCJjcmVhdGVPYmplY3RVUkwiLCJtZXRob2QiLCJib2R5Iiwib2siLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsInByZXZlbnREZWZhdWx0Iiwibm90aWNlIiwiZGVzY3JpcHRpb25Qcm9wZXJ0eSIsImVkaXRQcm9wZXJ0aWVzIiwiZmluZCIsInByb3BlcnR5Iiwib25TdWJtaXQiLCJIMyIsImNvbG9yIiwicmVxdWlyZWQiLCJyZWwiLCJtaW4iLCJzdGVwIiwicHJpY2VWYWx1ZSIsIm9sZFByaWNlVmFsdWUiLCJ3ZWlnaHQiLCJiYWRnZSIsInN0b2NrIiwic29ydE9yZGVyIiwic3JjIiwiYWx0IiwiYWNjZXB0IiwiaXNCZXN0U2VsbGVyIiwiaXNJbXBvcnRlZCIsImlzRmVhdHVyZWQiLCJpc0FjdGl2ZSIsIm1pbkhlaWdodCIsIkJhc2VQcm9wZXJ0eUNvbXBvbmVudCIsIndoZXJlIiwiZGlzYWJsZWQiLCJzcGluIiwiQ2F0ZWdvcnlFZGl0IiwiYmFubmVyRmlsZVJlZiIsImJhbm5lclVwbG9hZGluZyIsInNldEJhbm5lclVwbG9hZGluZyIsImJhbm5lclByZXZpZXdVcmwiLCJzZXRCYW5uZXJQcmV2aWV3VXJsIiwiY2F0ZWdvcnlVcmxCYXNlIiwiY2F0ZWdvcnlVcmwiLCJiYW5uZXJJbWFnZVVybCIsImJhbm5lckltYWdlIiwiZGlzcGxheWVkQmFubmVyVXJsIiwidXBsb2FkVG8iLCJmaWVsZCIsInNldExvY2FsUHJldmlldyIsInNldEJ1c3kiLCJzdWNjZXNzTWVzc2FnZSIsInN1YnRpdGxlIiwibWFyZ2luVG9wIiwiQ21zTGlzdCIsInNldFRhZyIsInRpdGxlUHJvcCIsInRpdGxlUHJvcGVydHkiLCJzdG9yZVBhcmFtcyIsImZpbHRlcnMiLCJ1c2VRdWVyeVBhcmFtcyIsInJlY29yZHMiLCJkaXJlY3Rpb24iLCJzb3J0QnkiLCJwYWdlIiwidG90YWwiLCJmZXRjaERhdGEiLCJwZXJQYWdlIiwidXNlUmVjb3JkcyIsInNlbGVjdGVkUmVjb3JkcyIsImhhbmRsZVNlbGVjdCIsImhhbmRsZVNlbGVjdEFsbCIsInNldFNlbGVjdGVkUmVjb3JkcyIsInVzZVNlbGVjdGVkUmVjb3JkcyIsImRlYm91bmNlUmVmIiwic3RvcmVQYXJhbXNSZWYiLCJ0b1N0cmluZyIsImhhbmRsZVF1ZXJ5Q2hhbmdlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInRyaW1tZWQiLCJoYW5kbGVBY3Rpb25QZXJmb3JtZWQiLCJoYW5kbGVQYWdpbmF0aW9uQ2hhbmdlIiwicGFnZU51bWJlciIsIm1heFdpZHRoIiwidHJhbnNmb3JtIiwicG9pbnRlckV2ZW50cyIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwidGV4dEFsaWduIiwiUGFnaW5hdGlvbiIsIlJldmlld0VkaXQiLCJwcm9wZXJ0eUJ5UGF0aCIsIk9iamVjdCIsImZyb21FbnRyaWVzIiwicmVuZGVyUHJvcGVydHkiLCJyZW1haW5pbmdQcm9wZXJ0aWVzIiwiSDQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiZyIsImhlaWdodCIsIm9iamVjdEZpdCIsIlRBQlMiLCJmaWVsZHMiLCJyZXNvbHZlSW1hZ2VVcmwiLCJJbWFnZVVwbG9hZGVyIiwib25VcGxvYWQiLCJ3aWRlIiwiZGlzcGxheWVkIiwiU2V0dGluZ3NFZGl0IiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwiaGlnaGxpZ2h0RmlsZVJlZiIsImJhbm5lclByZXZpZXciLCJzZXRCYW5uZXJQcmV2aWV3IiwiaGlnaGxpZ2h0UHJldmlldyIsInNldEhpZ2hsaWdodFByZXZpZXciLCJoaWdobGlnaHRVcGxvYWRpbmciLCJzZXRIaWdobGlnaHRVcGxvYWRpbmciLCJob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzIiwiaG9tZUJhbm5lckltYWdlIiwiaGlnaGxpZ2h0SW1hZ2VVcmwiLCJob21lSGlnaGxpZ2h0SW1hZ2UiLCJoYXNoIiwic29tZSIsInRhYiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJzZXRQcmV2aWV3IiwiZmxleCIsImZsZXhEaXJlY3Rpb24iLCJEcmF3ZXJDb250ZW50IiwicHJvcGVydGllcyIsInNoaXBwaW5nRmVlIiwiaGFuZGxpbmdGZWUiLCJEcmF3ZXJGb290ZXIiLCJwYWQiLCJudW0iLCJwYWRTdGFydCIsInRvRGF0ZXRpbWVWYWx1ZSIsImRhdGUiLCJEYXRlIiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRUaW1lIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJmb3JtYXREYXRldGltZUxhYmVsIiwidG9Mb2NhbGVTdHJpbmciLCJkYXkiLCJtb250aCIsInllYXIiLCJob3VyIiwibWludXRlIiwiQ2hvaWNlQ2FyZCIsIkFuY2hvcmVkU2VsZWN0IiwiRGF0ZVRpbWVQaWNrZXIiLCJ2YWxpZCIsIm1vbnRoRGF0ZSIsInNldE1vbnRoRGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsImZpcnN0RGF5IiwiZ2V0RGF5IiwidG90YWxEYXlzIiwiY2VsbHMiLCJpIiwicHVzaCIsImFwcGx5IiwibmV4dEhvdXJzIiwibmV4dE1pbnV0ZXMiLCJuZXh0Iiwic2VsZWN0ZWREYXkiLCJpbmRleCIsIkNvdXBvbkVkaXQiLCJwcm9kdWN0cyIsInNldFByb2R1Y3RzIiwic2VsZWN0ZWRTbHVncyIsInRhcmdldFNsdWdzIiwidGFyZ2V0VHlwZSIsImFwcGx5T24iLCJ1c2FnZVR5cGUiLCJjb3Vwb25UeXBlIiwibG9hZENhdGFsb2ciLCJjYXRlZ29yeURhdGEiLCJhbGxQcm9kdWN0cyIsImhhc01vcmUiLCJwcm9kdWN0RGF0YSIsInNldFNlbGVjdGVkU2x1Z3MiLCJwcm9kdWN0T3B0aW9ucyIsImNhdGVnb3J5T3B0aW9ucyIsImNvZGUiLCJ0b1VwcGVyQ2FzZSIsIm1pbkNhcnQiLCJtYXhEaXNjb3VudCIsInVzYWdlTGltaXQiLCJ1c2VkQ291bnQiLCJzdGFydHNBdCIsImV4cGlyZXNBdCIsImZvcm1hdE1vbmV5IiwiYW1vdW50IiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZm9ybWF0RGF0ZVRpbWUiLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJyZXNvbHZlSW1hZ2UiLCJPcmRlckRldGFpbCIsImFjdGlvbiIsImlzRWRpdCIsInNhdmluZyIsInNldFNhdmluZyIsIml0ZW1zIiwiaXRlbXNKc29uIiwiaGFuZGxlU2F2ZSIsInN0YXR1c09wdGlvbnMiLCJwYXltZW50T3B0aW9ucyIsInBheW1lbnRNZXRob2QiLCJyYXpvcnBheVBheW1lbnRJZCIsIkxhYmVsIiwiY3JlYXRlZEF0IiwiY3VzdG9tZXJOYW1lIiwiY3VzdG9tZXJQaG9uZSIsImN1c3RvbWVyRW1haWwiLCJTZWxlY3QiLCJvcHRpb24iLCJwYXltZW50U3RhdHVzIiwiRnJhZ21lbnQiLCJ0ZXh0VHJhbnNmb3JtIiwiYWRkcmVzc0Zvcm1hdHRlZCIsImFkZHJlc3NMYWJlbCIsImxpbmVIZWlnaHQiLCJnYXAiLCJxdWFudGl0eSIsImxpbmVUb3RhbCIsImNvbFNwYW4iLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlDaGFyZ2UiLCJoYW5kbGluZ0NoYXJnZSIsInNtYWxsQ2FydENoYXJnZSIsImRpc2NvdW50IiwiRXllSWNvbiIsImhpZGRlbiIsInZpZXdCb3giLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJkIiwiY3giLCJjeSIsInIiLCJQYXNzd29yZEZpZWxkIiwidmlzaWJsZSIsIm9uVG9nZ2xlIiwiaHRtbEZvciIsImF1dG9Db21wbGV0ZSIsInBhZGRpbmdSaWdodCIsInJpZ2h0IiwiYmFja2dyb3VuZCIsImN1cnNvciIsInBhZGRpbmciLCJDaGFuZ2VQYXNzd29yZCIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJjb25maXJtUGFzc3dvcmQiLCJzZXRDb25maXJtUGFzc3dvcmQiLCJzaG93UGFzc3dvcmQiLCJzZXRTaG93UGFzc3dvcmQiLCJzaG93Q29uZmlybSIsInNldFNob3dDb25maXJtIiwic2V0RXJyb3IiLCJjbG9zZSIsImJhY2siLCJzYXZlIiwicmVjb3JkQWN0aW9uIiwicmVzb3VyY2VJZCIsInJlY29yZElkIiwiYWN0aW9uTmFtZSIsInJlZGlyZWN0VXJsIiwiZXJyIiwiaW5zZXQiLCJib3hTaGFkb3ciLCJlbWFpbCIsIlJFTUVNQkVSRURfTE9HSU5fS0VZIiwiTG9naW4iLCJlcnJvck1lc3NhZ2UiLCJfX0FQUF9TVEFURV9fIiwidHJhbnNsYXRlTWVzc2FnZSIsInVzZVRyYW5zbGF0aW9uIiwiZm9yZ290UGFzc3dvcmRVcmwiLCJpZGVudGlmaWVyIiwic2V0SWRlbnRpZmllciIsInJlbWVtYmVyTG9naW4iLCJzZXRSZW1lbWJlckxvZ2luIiwicmVtZW1iZXJlZExvZ2luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImZvcm0iLCJjdXJyZW50VGFyZ2V0IiwiZW1haWxJbnB1dCIsImVsZW1lbnRzIiwibmFtZWRJdGVtIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJNZXNzYWdlQm94IiwiRm9ybUdyb3VwIiwiZGVmYXVsdFZhbHVlIiwibWFyZ2luUmlnaHQiLCJhZG1pblJvb3RQYXRoIiwibWF0Y2giLCJjYXRhbG9nQ29uZmlnIiwiZXhwb3J0VXJsIiwiaW1wb3J0VXJsIiwiQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIiwib25JbXBvcnRlZCIsInRyYW5zbGF0ZUJ1dHRvbiIsInRyYW5zbGF0ZUFjdGlvbiIsInRvZ2dsZUZpbHRlciIsImZpbHRlcnNDb3VudCIsInVzZUZpbHRlckRyYXdlciIsInNldExvYWRpbmciLCJzZXRNZXNzYWdlIiwiY29uZmlnIiwiaGFuZGxlSW1wb3J0IiwiY3JlZGVudGlhbHMiLCJlcnJvckNvdW50IiwiZXJyb3JzIiwidGV4dCIsImNyZWF0ZWQiLCJ1cGRhdGVkIiwiYnV0dG9ucyIsImNsaWNrIiwibmV3QWN0aW9uIiwicmVzb3VyY2VBY3Rpb25zIiwiZmlsdGVyS2V5IiwiY291bnQiLCJmbGV4U2hyaW5rIiwicHgiLCJCdXR0b25Hcm91cCIsIm9uQ2xvc2VDbGljayIsIkNBVEFMT0dfUkVTT1VSQ0VTIiwiQWN0aW9uSGVhZGVyIiwiT3JpZ2luYWxDb21wb25lbnQiLCJCYXNlSGVhZGVyIiwiT3JpZ2luYWxBY3Rpb25IZWFkZXIiLCJpc0NhdGFsb2dMaXN0IiwiX2lnbm9yZWQiLCJoZWFkZXJQcm9wcyIsIl9leHRlbmRzIiwib21pdEFjdGlvbnMiLCJERUZBVUxUX09QVElPTlMiLCJwbHVnaW5zIiwidG9vbGJhciIsIlJpY2h0ZXh0RWRpdCIsImhhbmRsZVVwZGF0ZSIsInVzZUNhbGxiYWNrIiwibmV3VmFsdWUiLCJpc1JlcXVpcmVkIiwiVGlueU1DRSIsIkZvcm1NZXNzYWdlIiwibWVtbyIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50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
