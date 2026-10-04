(function (React, adminjs, designSystem, reactRouter) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  function useAnchoredMenu$1(open) {
    const wrapRef = React.useRef(null);
    const [openUp, setOpenUp] = React.useState(false);
    React.useEffect(() => {
      if (!open) return undefined;
      const update = () => {
        const node = wrapRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUp(spaceBelow < 240 && rect.top > spaceBelow);
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
      openUp
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
      openUp
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
    }, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-multiselect-menu${openUp ? ' is-up' : ''}`
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
  function isFlagOn(value) {
    return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
  }
  function StatusSwitch({
    checked,
    onChange,
    disabled,
    title,
    hint,
    compact = false
  }) {
    return /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: `tokri-switch${checked ? ' is-on' : ''}${compact ? ' is-compact' : ''}`,
      disabled: disabled,
      "aria-pressed": checked,
      onClick: event => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled) onChange(!checked);
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-switch-track",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-switch-thumb"
    })), title || hint ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-switch-copy"
    }, title ? /*#__PURE__*/React__default.default.createElement("strong", null, title) : null, hint ? /*#__PURE__*/React__default.default.createElement("span", null, hint) : null) : /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-status-pill${checked ? ' is-on' : ''}`
    }, checked ? 'Active' : 'Inactive'));
  }
  function SearchableSelect({
    value,
    options,
    onChange,
    placeholder,
    searchPlaceholder,
    disabled
  }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const {
      wrapRef,
      openUp
    } = useAnchoredMenu$1(open);
    const selected = options.find(item => item.value === value);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    const filtered = options.filter(item => `${item.label} ${item.value}`.toLowerCase().includes(query.trim().toLowerCase()));
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-multiselect-control",
      disabled: disabled,
      onClick: () => {
        if (!disabled) setOpen(current => !current);
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: selected ? '' : 'tokri-multiselect-placeholder'
    }, selected?.label || placeholder), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-caret"
    }, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-multiselect-menu${openUp ? ' is-up' : ''}`
    }, /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: query,
      onChange: event => setQuery(event.target.value),
      placeholder: searchPlaceholder,
      autoFocus: true
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-list"
    }, filtered.length ? filtered.map(item => {
      const active = item.value === value;
      return /*#__PURE__*/React__default.default.createElement("button", {
        type: "button",
        key: item.value || 'empty',
        className: `tokri-multiselect-option${active ? ' is-selected' : ''}`,
        onClick: () => {
          onChange(item.value);
          setOpen(false);
          setQuery('');
        }
      }, item.label);
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-multiselect-empty"
    }, "No matches"))) : null);
  }
  function LocalSelect({
    value,
    options,
    onChange,
    disabled
  }) {
    const [open, setOpen] = React.useState(false);
    const {
      wrapRef,
      openUp
    } = useAnchoredMenu$1(open);
    const selected = options.find(item => String(item.value) === String(value));
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-local-select",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-local-select-control",
      disabled: disabled,
      onClick: () => {
        if (!disabled) setOpen(current => !current);
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, selected?.label || value), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-multiselect-caret"
    }, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-local-select-menu${openUp ? ' is-up' : ''}`
    }, options.map(item => /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      key: item.value,
      className: `tokri-multiselect-option${String(item.value) === String(value) ? ' is-selected' : ''}`,
      onClick: () => {
        onChange(item.value);
        setOpen(false);
      }
    }, item.label))) : null);
  }

  const api$4 = new adminjs.ApiClient();
  const RANGES = [{
    value: '7d',
    label: '7 days'
  }, {
    value: 'thisMonth',
    label: 'This month'
  }, {
    value: 'lastMonth',
    label: 'Last month'
  }, {
    value: '90d',
    label: '3 months'
  }];
  const WIDGETS = ['orderValue', 'orders', 'customers', 'products'];
  const inr = value => `₹${Number(value || 0).toLocaleString('en-IN', {
  maximumFractionDigits: 0
})}`;
  function RangeSelect({
    value,
    onChange
  }) {
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-range-select"
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: value,
      options: RANGES,
      onChange: onChange
    }));
  }
  function axisMax(value) {
    if (value <= 0) return 1000;
    const padded = value * 1.1;
    const magnitude = 10 ** Math.floor(Math.log10(padded));
    const normalized = padded / magnitude;
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return nice * magnitude;
  }
  function LineChart({
    series
  }) {
    const [hover, setHover] = React.useState(null);
    const width = 1200;
    const height = 320;
    const padLeft = 86;
    const padRight = 18;
    const padTop = 18;
    const padBottom = 36;
    const max = axisMax(Math.max(...series.map(point => point.orderValue), 0));
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;
    const baseline = padTop + plotHeight;
    const yFor = value => baseline - value / max * plotHeight;
    const step = series.length > 1 ? plotWidth / (series.length - 1) : plotWidth;
    const coords = series.map((point, index) => {
      const x = series.length === 1 ? padLeft + plotWidth / 2 : padLeft + index * step;
      return {
        x,
        y: yFor(point.orderValue),
        point
      };
    });
    const line = coords.map((item, index) => `${index ? 'L' : 'M'}${item.x},${item.y}`).join(' ');
    const area = coords.length ? `${line} L${coords[coords.length - 1].x},${baseline} L${coords[0].x},${baseline} Z` : '';
    const labelEvery = series.length > 20 ? Math.ceil(series.length / 8) : series.length > 10 ? 4 : 1;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
      value: Math.round(max * ratio),
      y: yFor(max * ratio)
    }));
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-chart-plot",
      onMouseLeave: () => setHover(null)
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: `0 0 ${width} ${height}`,
      className: "tokri-chart",
      role: "img"
    }, ticks.map(tick => /*#__PURE__*/React__default.default.createElement("g", {
      key: tick.value
    }, /*#__PURE__*/React__default.default.createElement("line", {
      x1: padLeft,
      x2: width - padRight,
      y1: tick.y,
      y2: tick.y,
      className: "tokri-chart-gridline"
    }), /*#__PURE__*/React__default.default.createElement("text", {
      x: padLeft - 10,
      y: tick.y + 4,
      textAnchor: "end",
      className: "tokri-chart-axis"
    }, inr(tick.value)))), /*#__PURE__*/React__default.default.createElement("path", {
      d: area,
      fill: "#047857",
      opacity: "0.16"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: line,
      fill: "none",
      stroke: "#047857",
      strokeWidth: "3",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), coords.map(item => /*#__PURE__*/React__default.default.createElement("g", {
      key: item.point.date
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: item.x,
      cy: item.y,
      r: "14",
      fill: "transparent",
      onMouseEnter: () => setHover(item)
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: item.x,
      cy: item.y,
      r: "4.5",
      fill: "#fff",
      stroke: "#047857",
      strokeWidth: "2",
      pointerEvents: "none"
    }))), coords.map((item, index) => index % labelEvery === 0 ? /*#__PURE__*/React__default.default.createElement("text", {
      key: `${item.point.date}-label`,
      x: item.x,
      y: height - 8,
      textAnchor: "middle",
      className: "tokri-chart-label"
    }, item.point.label) : null)), hover ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-chart-tip${hover.y < 90 ? ' is-below' : ''}`,
      style: {
        left: `${hover.x / width * 100}%`,
        top: `${hover.y / height * 100}%`
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, hover.point.label), /*#__PURE__*/React__default.default.createElement("strong", null, inr(hover.point.orderValue))) : null);
  }
  function Pager({
    page,
    pageSize,
    total,
    onChange
  }) {
    const pages = Math.max(1, Math.ceil((total || 0) / pageSize));
    if (pages <= 1) return null;
    const numbers = [];
    for (let number = 1; number <= pages; number += 1) numbers.push(number);
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-widget-pages"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-list-pagination-pages"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: page <= 1,
      onClick: () => onChange(page - 1)
    }, "Prev"), numbers.map(number => /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      key: number,
      className: number === page ? 'is-current' : '',
      onClick: () => onChange(number)
    }, number)), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: page >= pages,
      onClick: () => onChange(page + 1)
    }, "Next")));
  }
  const Dashboard = () => {
    const requests = React.useRef({});
    const [ranges, setRanges] = React.useState({
      orderValue: '7d',
      orders: '7d',
      customers: '7d',
      products: '7d'
    });
    const [data, setData] = React.useState({});
    const [pages, setPages] = React.useState({
      orders: 1,
      customers: 1
    });
    const [busy, setBusy] = React.useState({
      orderValue: true,
      orders: true,
      customers: true,
      products: true
    });
    const loadWidget = (widget, range, page = 1) => {
      const ticket = (requests.current[widget] || 0) + 1;
      requests.current[widget] = ticket;
      setBusy(current => ({
        ...current,
        [widget]: true
      }));
      api$4.getDashboard({
        params: {
          widget,
          range,
          page
        }
      }).then(response => {
        if (requests.current[widget] !== ticket) return;
        setData(current => ({
          ...current,
          ...response.data
        }));
      }).finally(() => {
        if (requests.current[widget] !== ticket) return;
        setBusy(current => ({
          ...current,
          [widget]: false
        }));
      });
    };
    React.useEffect(() => {
      WIDGETS.forEach(widget => loadWidget(widget, '7d'));
    }, []);
    const changeRange = (widget, range) => {
      setRanges(current => ({
        ...current,
        [widget]: range
      }));
      if (widget === 'orders' || widget === 'customers') {
        setPages(current => ({
          ...current,
          [widget]: 1
        }));
      }
      loadWidget(widget, range, 1);
    };
    const changePage = (widget, page) => {
      setPages(current => ({
        ...current,
        [widget]: page
      }));
      loadWidget(widget, ranges[widget], page);
    };
    const orderValue = data.orderValue;
    const orders = data.orders;
    const customers = data.customers;
    const products = data.products;
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "transparent",
      className: "tokri-analytics"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-analytics-head"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      mb: "sm"
    }, "Dashboard")), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-chart-card tokri-chart-card-wide"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-widget-head"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "sm"
    }, "Order Value"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.orderValue && !orderValue ? 'Loading…' : `${inr(orderValue?.total)} from ${orderValue?.orderCount || 0} orders`)), /*#__PURE__*/React__default.default.createElement(RangeSelect, {
      value: ranges.orderValue,
      onChange: value => changeRange('orderValue', value)
    })), orderValue?.series?.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-chart-frame"
    }, /*#__PURE__*/React__default.default.createElement(LineChart, {
      series: orderValue.series
    })) : null), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-split"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-chart-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-widget-head"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "sm"
    }, "Order Amount"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.orders && !orders ? 'Loading…' : `${orders?.total || 0} orders`)), /*#__PURE__*/React__default.default.createElement(RangeSelect, {
      value: ranges.orders,
      onChange: value => changeRange('orders', value)
    })), orders?.rows?.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-table-wrap"
    }, /*#__PURE__*/React__default.default.createElement("table", {
      className: "tokri-data-table"
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Order number"), /*#__PURE__*/React__default.default.createElement("th", null, "Name"), /*#__PURE__*/React__default.default.createElement("th", null, "Amount"), /*#__PURE__*/React__default.default.createElement("th", null, "Placed"))), /*#__PURE__*/React__default.default.createElement("tbody", null, orders.rows.map(row => /*#__PURE__*/React__default.default.createElement("tr", {
      key: row.id
    }, /*#__PURE__*/React__default.default.createElement("td", null, row.orderNo), /*#__PURE__*/React__default.default.createElement("td", null, row.name), /*#__PURE__*/React__default.default.createElement("td", null, inr(row.amount)), /*#__PURE__*/React__default.default.createElement("td", null, row.placedAt)))))) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.orders ? 'Loading…' : 'No orders in this period.'), /*#__PURE__*/React__default.default.createElement(Pager, {
      page: orders?.page || pages.orders,
      pageSize: orders?.pageSize || 10,
      total: orders?.total || 0,
      onChange: page => changePage('orders', page)
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-chart-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-widget-head"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "sm"
    }, "New Customers"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.customers && !customers ? 'Loading…' : `${customers?.total || 0} people registered`)), /*#__PURE__*/React__default.default.createElement(RangeSelect, {
      value: ranges.customers,
      onChange: value => changeRange('customers', value)
    })), customers?.rows?.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-table-wrap"
    }, /*#__PURE__*/React__default.default.createElement("table", {
      className: "tokri-data-table"
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Name"), /*#__PURE__*/React__default.default.createElement("th", null, "Phone"), /*#__PURE__*/React__default.default.createElement("th", null, "Date of birth"), /*#__PURE__*/React__default.default.createElement("th", null, "Created"))), /*#__PURE__*/React__default.default.createElement("tbody", null, customers.rows.map(row => /*#__PURE__*/React__default.default.createElement("tr", {
      key: row.id
    }, /*#__PURE__*/React__default.default.createElement("td", null, row.name), /*#__PURE__*/React__default.default.createElement("td", null, "+91 ", row.phone), /*#__PURE__*/React__default.default.createElement("td", null, row.dateOfBirth), /*#__PURE__*/React__default.default.createElement("td", null, row.registeredAt)))))) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.customers ? 'Loading…' : 'No new customers in this period.'), /*#__PURE__*/React__default.default.createElement(Pager, {
      page: customers?.page || pages.customers,
      pageSize: customers?.pageSize || 10,
      total: customers?.total || 0,
      onChange: page => changePage('customers', page)
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-split"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-chart-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-widget-head"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "sm"
    }, "Best Selling Products"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.products && !products ? 'Loading…' : 'Top 5 by number of orders')), /*#__PURE__*/React__default.default.createElement(RangeSelect, {
      value: ranges.products,
      onChange: value => changeRange('products', value)
    })), products?.rows?.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-table-wrap"
    }, /*#__PURE__*/React__default.default.createElement("table", {
      className: "tokri-data-table"
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Product"), /*#__PURE__*/React__default.default.createElement("th", null, "Orders"), /*#__PURE__*/React__default.default.createElement("th", null, "Amount"))), /*#__PURE__*/React__default.default.createElement("tbody", null, products.rows.map(row => /*#__PURE__*/React__default.default.createElement("tr", {
      key: row.name
    }, /*#__PURE__*/React__default.default.createElement("td", null, row.name), /*#__PURE__*/React__default.default.createElement("td", null, row.orders), /*#__PURE__*/React__default.default.createElement("td", null, inr(row.amount))))))) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, busy.products ? 'Loading…' : 'No products sold in this period.'))));
  };

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

  const PER_PAGE_OPTIONS = [10, 25, 50];
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
    const currentPage = Number(page) || 1;
    const rowsPerPage = Number(perPage) || 10;
    const totalRows = Number(total) || 0;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage) || 1);
    const from = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const to = Math.min(currentPage * rowsPerPage, totalRows);
    const goToPage = nextPage => {
      const safe = Math.min(Math.max(1, nextPage), totalPages);
      storeParams({
        page: String(safe)
      });
    };
    const changePerPage = next => {
      storeParams({
        page: '1',
        perPage: String(next)
      });
    };
    const pageNumbers = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let number = start; number <= end; number += 1) pageNumbers.push(number);
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
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-list-pagination"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      className: "tokri-list-pagination-summary"
    }, totalRows === 0 ? 'No records' : `Showing ${from}–${to} of ${totalRows}`), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-list-pagination-size"
    }, /*#__PURE__*/React__default.default.createElement("span", null, "Rows"), /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: String(rowsPerPage),
      options: PER_PAGE_OPTIONS.map(option => ({
        value: String(option),
        label: String(option)
      })),
      onChange: next => changePerPage(Number(next))
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-list-pagination-pages"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: currentPage <= 1,
      onClick: () => goToPage(currentPage - 1)
    }, "Prev"), pageNumbers.map(number => /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      key: number,
      className: number === currentPage ? 'is-current' : '',
      onClick: () => goToPage(number)
    }, number)), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: currentPage >= totalPages,
      onClick: () => goToPage(currentPage + 1)
    }, "Next")))));
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
    fields: ['homeBannerImage', 'homeMobileBannerImage', 'homeHighlightImage', 'homeFeaturedCategorySlugs']
  }, {
    id: 'payments',
    label: 'Payments',
    fields: ['razorpayEnabled', 'razorpayKeyId', 'razorpayKeySecret', 'codEnabled']
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
    const mobileBannerFileRef = React.useRef(null);
    const highlightFileRef = React.useRef(null);
    const [bannerPreview, setBannerPreview] = React.useState('');
    const [mobileBannerPreview, setMobileBannerPreview] = React.useState('');
    const [highlightPreview, setHighlightPreview] = React.useState('');
    const [bannerUploading, setBannerUploading] = React.useState(false);
    const [mobileBannerUploading, setMobileBannerUploading] = React.useState(false);
    const [highlightUploading, setHighlightUploading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const params = record?.params || {};
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$1(custom.apiBaseUrl || '/api/v1');
    const appUrl = custom.appUrl || window.location.origin;
    const selectedCategorySlugs = parseSlugs$1(params.homeFeaturedCategorySlugs);
    const bannerImageUrl = React.useMemo(() => resolveImageUrl(params.homeBannerImage, appUrl), [appUrl, params.homeBannerImage]);
    const mobileBannerImageUrl = React.useMemo(() => resolveImageUrl(params.homeMobileBannerImage, appUrl), [appUrl, params.homeMobileBannerImage]);
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
        if (mobileBannerPreview?.startsWith('blob:')) URL.revokeObjectURL(mobileBannerPreview);
      };
    }, [mobileBannerPreview]);
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
        hint: "Desktop / large-screen hero banner. JPG, PNG, GIF, or WebP up to 5MB.",
        value: bannerImageUrl,
        previewUrl: bannerPreview,
        uploading: bannerUploading,
        fileRef: bannerFileRef,
        wide: true,
        onUpload: event => uploadImage(event, 'homeBannerImage', setBannerPreview, setBannerUploading, bannerFileRef, 'Banner image uploaded')
      }), /*#__PURE__*/React__default.default.createElement(ImageUploader, {
        label: "Home mobile banner image",
        hint: "Shown on phones. If empty, the desktop banner is used instead.",
        value: mobileBannerImageUrl,
        previewUrl: mobileBannerPreview,
        uploading: mobileBannerUploading,
        fileRef: mobileBannerFileRef,
        onUpload: event => uploadImage(event, 'homeMobileBannerImage', setMobileBannerPreview, setMobileBannerUploading, mobileBannerFileRef, 'Mobile banner image uploaded')
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
  function pad$1(num) {
    return String(num).padStart(2, '0');
  }
  function toDatetimeValue(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad$1(date.getMonth() + 1)}-${pad$1(date.getDate())}T${pad$1(date.getHours())}:${pad$1(date.getMinutes())}`;
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
    const [openUp, setOpenUp] = React.useState(false);
    React.useEffect(() => {
      if (!open) return undefined;
      const update = () => {
        const node = wrapRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUp(spaceBelow < 240 && rect.top > spaceBelow);
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
      openUp
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
      openUp
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
    }, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-multiselect-menu${openUp ? ' is-up' : ''}`
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
      openUp
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
    }, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-multiselect-menu${openUp ? ' is-up' : ''}`
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
    const [hours, setHours] = React.useState(valid ? pad$1(valid.getHours()) : '00');
    const [minutes, setMinutes] = React.useState(valid ? pad$1(valid.getMinutes()) : '00');
    const {
      wrapRef,
      openUp
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
      setHours(pad$1(valid.getHours()));
      setMinutes(pad$1(valid.getMinutes()));
    }, [value]);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let day = 1; day <= totalDays; day += 1) cells.push(day);
    const apply = (day, nextHours = hours, nextMinutes = minutes) => {
      const next = `${year}-${pad$1(month + 1)}-${pad$1(day)}T${pad$1(Number(nextHours) || 0)}:${pad$1(Number(nextMinutes) || 0)}`;
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
    }, /*#__PURE__*/React__default.default.createElement("span", null, valid ? formatDatetimeLabel(valid) : placeholder), /*#__PURE__*/React__default.default.createElement("span", null, "\uD83D\uDCC5")), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-datepicker-pop${openUp ? ' is-up' : ''}`
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
        const next = pad$1(Math.min(23, Math.max(0, Number(event.target.value) || 0)));
        setHours(next);
        if (selectedDay) apply(selectedDay, next, minutes);
      }
    })), /*#__PURE__*/React__default.default.createElement("label", null, "Minute", /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      min: "0",
      max: "59",
      value: minutes,
      onChange: event => {
        const next = pad$1(Math.min(59, Math.max(0, Number(event.target.value) || 0)));
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

  const api$3 = new adminjs.ApiClient();
  const FULFILLMENT = [{
    value: 'pending',
    label: 'Waiting for fulfillment'
  }, {
    value: 'paid',
    label: 'Processing'
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
  const PAYMENT_OPTIONS = [{
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
  function MoreMenu({
    unpaid,
    busy,
    onCash,
    onQr
  }) {
    const [open, setOpen] = React.useState(false);
    const {
      wrapRef,
      openUp
    } = useAnchoredMenu$1(open);
    React.useEffect(() => {
      const onDocClick = event => {
        if (!wrapRef.current?.contains(event.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [wrapRef]);
    if (!unpaid) return null;
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-more",
      ref: wrapRef
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => setOpen(value => !value)
    }, "More actions", /*#__PURE__*/React__default.default.createElement("span", null, open ? '▴' : '▾')), open ? /*#__PURE__*/React__default.default.createElement("div", {
      className: `tokri-order-more-menu${openUp ? ' is-up' : ''}`
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: Boolean(busy),
      onClick: () => {
        setOpen(false);
        onCash();
      }
    }, busy === 'collectCash' ? 'Saving…' : 'Mark cash collected'), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: Boolean(busy),
      onClick: () => {
        setOpen(false);
        onQr();
      }
    }, busy === 'generateQr' ? 'Creating…' : 'Generate payment QR')) : null);
  }
  function snapshot(params = {}) {
    return {
      status: params.status || '',
      paymentStatus: params.paymentStatus || '',
      deliveryPartnerId: params.deliveryPartnerId || '',
      contactName: params.contactName || '',
      contactPhone: params.contactPhone || '',
      addressLine1: params.addressLine1 || '',
      addressLine2: params.addressLine2 || '',
      addressCity: params.addressCity || '',
      addressState: params.addressState || '',
      addressPincode: params.addressPincode || '',
      addressLandmark: params.addressLandmark || ''
    };
  }
  const OrderDetail = props => {
    const {
      record: initialRecord,
      resource,
      action
    } = props;
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit,
      loading,
      setRecord
    } = adminjs.useRecord(initialRecord, resource.id);
    const params = record?.params || {};
    const [saving, setSaving] = React.useState(false);
    const [actionBusy, setActionBusy] = React.useState('');
    const [partners, setPartners] = React.useState([{
      value: '',
      label: 'Unassigned'
    }]);
    const [baseline, setBaseline] = React.useState(() => snapshot(initialRecord?.params));
    const [editContact, setEditContact] = React.useState(false);
    const [editAddress, setEditAddress] = React.useState(false);
    React.useEffect(() => {
      if (action?.name !== 'show') return undefined;
      const next = window.location.pathname.replace(/\/show\/?$/, '/edit');
      if (next !== window.location.pathname) window.location.replace(next);
      return undefined;
    }, [action?.name]);
    React.useEffect(() => {
      let ignore = false;
      api$3.resourceAction({
        resourceId: 'DeliveryPartner',
        actionName: 'list',
        params: {
          perPage: 200
        }
      }).then(response => {
        if (ignore) return;
        const records = response.data?.records || [];
        setPartners([{
          value: '',
          label: 'Unassigned'
        }, ...records.map(item => ({
          value: item.id || item.params?.id,
          label: item.params?.isActive === false ? `${item.params?.name || 'Partner'} (inactive)` : item.params?.name || 'Partner'
        }))]);
      }).catch(() => {
        if (!ignore) setPartners([{
          value: '',
          label: 'Unassigned'
        }]);
      });
      return () => {
        ignore = true;
      };
    }, []);
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
    const current = snapshot(params);
    const dirty = Object.keys(current).some(key => current[key] !== baseline[key]);
    const listUrl = window.location.pathname.replace(/\/records\/.*$/, '');
    const unpaid = params.paymentStatus !== 'paid';
    const handleSave = async event => {
      event.preventDefault();
      const phone = String(params.contactPhone || '').replace(/\D/g, '');
      const pin = String(params.addressPincode || '').replace(/\D/g, '');
      if (!String(params.contactName || '').trim() || phone.length < 10) {
        addNotice({
          message: 'Enter the customer name and a 10-digit contact number.',
          type: 'error'
        });
        return;
      }
      if (!String(params.addressLine1 || '').trim() || !String(params.addressCity || '').trim() || !String(params.addressState || '').trim() || pin.length !== 6) {
        addNotice({
          message: 'Enter the house, city, state, and a 6-digit pincode.',
          type: 'error'
        });
        return;
      }
      setSaving(true);
      try {
        const response = await submit();
        const next = response?.data?.record?.params;
        if (next) {
          setBaseline(snapshot(next));
          setEditContact(false);
          setEditAddress(false);
        }
      } finally {
        setSaving(false);
      }
    };
    const runPaymentAction = async actionName => {
      if (actionName === 'collectCash' && !window.confirm('Mark this order as paid in cash?')) return;
      setActionBusy(actionName);
      try {
        const response = await api$3.recordAction({
          resourceId: resource.id,
          recordId: record.id,
          actionName
        });
        if (response.data?.record) {
          setRecord(response.data.record);
          setBaseline(snapshot(response.data.record.params));
        }
        addNotice(response.data?.notice || {
          message: 'Updated.',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not update payment.',
          type: 'error'
        });
      } finally {
        setActionBusy('');
      }
    };
    if (action?.name === 'show') return null;
    const statusLabel = FULFILLMENT.find(item => item.value === params.status)?.label || 'Waiting for fulfillment';
    const restoreFields = (keys, close) => {
      keys.forEach(key => handleChange(key, baseline[key] || ''));
      close(false);
    };
    const addressText = [params.addressLine1, params.addressLine2, [params.addressCity, params.addressState, params.addressPincode].filter(Boolean).join(', '), params.addressLandmark ? `Landmark: ${params.addressLandmark}` : ''].filter(Boolean);
    const paymentLabel = PAYMENT_OPTIONS.find(item => item.value === params.paymentStatus)?.label || 'Pending';
    const partnerName = params.deliveryPartnerName ? `${params.deliveryPartnerName}${params.deliveryPartnerPhone ? ` · ${params.deliveryPartnerPhone}` : ''}` : 'No delivery partner yet';
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    return /*#__PURE__*/React__default.default.createElement("form", {
      className: "tokri-order",
      onSubmit: handleSave
    }, /*#__PURE__*/React__default.default.createElement("header", {
      className: "tokri-order-top"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-title"
    }, /*#__PURE__*/React__default.default.createElement("a", {
      className: "tokri-order-back",
      href: listUrl,
      "aria-label": "Back to orders"
    }, "\u2190"), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-title-row"
    }, /*#__PURE__*/React__default.default.createElement("h2", null, "#", params.orderNo), /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-pill is-${params.paymentStatus || 'pending'}`
    }, paymentLabel), /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-pill is-${params.status || 'pending'}`
    }, statusLabel)), /*#__PURE__*/React__default.default.createElement("p", null, formatDateTime(params.createdAt)))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-actions"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      className: "tokri-order-save",
      type: "submit",
      disabled: !dirty || loading || saving
    }, saving ? 'Saving…' : 'Save'), /*#__PURE__*/React__default.default.createElement(MoreMenu, {
      unpaid: unpaid,
      busy: actionBusy,
      onCash: () => runPaymentAction('collectCash'),
      onQr: () => runPaymentAction('generateQr')
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-layout"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-main"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-order-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-card-head"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-mark is-${params.status || 'pending'}`
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("strong", null, statusLabel), /*#__PURE__*/React__default.default.createElement("span", null, itemCount, " ", itemCount === 1 ? 'item' : 'items', " \xB7 ", partnerName)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-select"
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: params.status || 'pending',
      options: FULFILLMENT,
      onChange: value => handleChange('status', value)
    }))), items.length === 0 ? /*#__PURE__*/React__default.default.createElement("p", {
      className: "tokri-order-empty"
    }, "No items on this order.") : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-items"
    }, items.map(item => /*#__PURE__*/React__default.default.createElement("article", {
      key: item.id
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-thumb-wrap"
    }, item.image ? /*#__PURE__*/React__default.default.createElement("img", {
      src: item.image,
      alt: ""
    }) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-order-thumb"
    }), /*#__PURE__*/React__default.default.createElement("em", null, item.quantity)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("strong", null, item.name), item.weight ? /*#__PURE__*/React__default.default.createElement("span", null, item.weight) : null), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-order-qty"
    }, formatMoney(item.priceValue), " \xD7 ", item.quantity), /*#__PURE__*/React__default.default.createElement("b", null, formatMoney(item.lineTotal)))))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-order-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-card-head"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-mark is-${params.paymentStatus || 'pending'}`
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("strong", null, paymentLabel), /*#__PURE__*/React__default.default.createElement("span", null, params.paymentMethod || 'Cash on delivery')), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-select"
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: params.paymentStatus || 'pending',
      options: PAYMENT_OPTIONS,
      onChange: value => handleChange('paymentStatus', value)
    }))), /*#__PURE__*/React__default.default.createElement("dl", {
      className: "tokri-order-totals"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Subtotal"), /*#__PURE__*/React__default.default.createElement("dd", null, itemCount, " ", itemCount === 1 ? 'item' : 'items'), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.itemsTotal))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Delivery"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.deliveryCharge))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Handling"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.handlingCharge))), Number(params.smallCartCharge) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Small cart"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.smallCartCharge))) : null, Number(params.discount) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Discount", params.couponCode ? ` · ${params.couponCode}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, "-", formatMoney(params.discount))) : null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "is-total"
    }, /*#__PURE__*/React__default.default.createElement("dt", null, "Total"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.grandTotal)))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-collected"
    }, /*#__PURE__*/React__default.default.createElement("span", null, params.paymentStatus === 'paid' ? 'Paid by customer' : 'Still to collect'), /*#__PURE__*/React__default.default.createElement("b", null, formatMoney(params.grandTotal))), params.paymentCollectedAs ? /*#__PURE__*/React__default.default.createElement("p", {
      className: "tokri-order-meta"
    }, "Collected as ", params.paymentCollectedAs) : null, params.razorpayPaymentId ? /*#__PURE__*/React__default.default.createElement("p", {
      className: "tokri-order-meta"
    }, "Payment ID ", params.razorpayPaymentId) : null, params.razorpayQrUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      className: "tokri-order-qr",
      src: params.razorpayQrUrl,
      alt: "Doorstep payment QR"
    }) : null)), /*#__PURE__*/React__default.default.createElement("aside", {
      className: "tokri-order-side"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-order-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-section-head"
    }, /*#__PURE__*/React__default.default.createElement("h3", null, "Customer")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-section-head"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Contact"), editContact ? /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-order-edit",
      onClick: () => restoreFields(['contactName', 'contactPhone'], setEditContact)
    }, "Cancel") : /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-order-edit",
      onClick: () => setEditContact(true)
    }, "Edit")), editContact ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-edit-fields"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "Name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.contactName || '',
      onChange: event => handleChange('contactName', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "Phone number", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      inputMode: "numeric",
      value: params.contactPhone || '',
      onChange: event => handleChange('contactPhone', event.target.value)
    }))) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-read"
    }, /*#__PURE__*/React__default.default.createElement("strong", null, params.contactName || '—'), /*#__PURE__*/React__default.default.createElement("p", null, params.contactPhone ? `+91 ${params.contactPhone}` : '—')), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-section-head"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Shipping address"), editAddress ? /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-order-edit",
      onClick: () => restoreFields(['addressLine1', 'addressLine2', 'addressCity', 'addressState', 'addressPincode', 'addressLandmark'], setEditAddress)
    }, "Cancel") : /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-order-edit",
      onClick: () => setEditAddress(true)
    }, "Edit")), editAddress ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-edit-fields"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "House / flat", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.addressLine1 || '',
      onChange: event => handleChange('addressLine1', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "Street / area", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.addressLine2 || '',
      onChange: event => handleChange('addressLine2', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-address-grid"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "City", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.addressCity || '',
      onChange: event => handleChange('addressCity', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "State", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.addressState || '',
      onChange: event => handleChange('addressState', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "Pincode", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      inputMode: "numeric",
      value: params.addressPincode || '',
      onChange: event => handleChange('addressPincode', event.target.value)
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-order-field"
    }, "Landmark", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-order-input",
      value: params.addressLandmark || '',
      onChange: event => handleChange('addressLandmark', event.target.value)
    })))) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-read"
    }, addressText.length ? addressText.map(line => /*#__PURE__*/React__default.default.createElement("p", {
      key: line
    }, line)) : /*#__PURE__*/React__default.default.createElement("p", null, "\u2014")), /*#__PURE__*/React__default.default.createElement("h4", null, "Delivery partner"), /*#__PURE__*/React__default.default.createElement(SearchableSelect, {
      value: params.deliveryPartnerId || '',
      options: partners,
      onChange: value => handleChange('deliveryPartnerId', value),
      placeholder: "Unassigned",
      searchPlaceholder: "Search partners"
    })))));
  };

  const api$2 = new adminjs.ApiClient();
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
        const response = await api$2.recordAction({
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

  /** ISO 3166-2:IN codes. Kept next to the AdminJS form so the dropdown always has every state. */
  const INDIA_STATES = [{
    code: 'AN',
    name: 'Andaman and Nicobar Islands'
  }, {
    code: 'AP',
    name: 'Andhra Pradesh'
  }, {
    code: 'AR',
    name: 'Arunachal Pradesh'
  }, {
    code: 'AS',
    name: 'Assam'
  }, {
    code: 'BR',
    name: 'Bihar'
  }, {
    code: 'CH',
    name: 'Chandigarh'
  }, {
    code: 'CT',
    name: 'Chhattisgarh'
  }, {
    code: 'DH',
    name: 'Dadra and Nagar Haveli and Daman and Diu'
  }, {
    code: 'DL',
    name: 'Delhi'
  }, {
    code: 'GA',
    name: 'Goa'
  }, {
    code: 'GJ',
    name: 'Gujarat'
  }, {
    code: 'HR',
    name: 'Haryana'
  }, {
    code: 'HP',
    name: 'Himachal Pradesh'
  }, {
    code: 'JK',
    name: 'Jammu and Kashmir'
  }, {
    code: 'JH',
    name: 'Jharkhand'
  }, {
    code: 'KA',
    name: 'Karnataka'
  }, {
    code: 'KL',
    name: 'Kerala'
  }, {
    code: 'LA',
    name: 'Ladakh'
  }, {
    code: 'LD',
    name: 'Lakshadweep'
  }, {
    code: 'MP',
    name: 'Madhya Pradesh'
  }, {
    code: 'MH',
    name: 'Maharashtra'
  }, {
    code: 'MN',
    name: 'Manipur'
  }, {
    code: 'ML',
    name: 'Meghalaya'
  }, {
    code: 'MZ',
    name: 'Mizoram'
  }, {
    code: 'NL',
    name: 'Nagaland'
  }, {
    code: 'OR',
    name: 'Odisha'
  }, {
    code: 'PY',
    name: 'Puducherry'
  }, {
    code: 'PB',
    name: 'Punjab'
  }, {
    code: 'RJ',
    name: 'Rajasthan'
  }, {
    code: 'SK',
    name: 'Sikkim'
  }, {
    code: 'TN',
    name: 'Tamil Nadu'
  }, {
    code: 'TG',
    name: 'Telangana'
  }, {
    code: 'TR',
    name: 'Tripura'
  }, {
    code: 'UP',
    name: 'Uttar Pradesh'
  }, {
    code: 'UT',
    name: 'Uttarakhand'
  }, {
    code: 'WB',
    name: 'West Bengal'
  }];

  const VEHICLE_TYPES = [{
    value: 'Bike',
    label: 'Bike'
  }, {
    value: 'Scooter',
    label: 'Scooter'
  }, {
    value: 'Electric bike',
    label: 'Electric bike'
  }, {
    value: 'Cycle',
    label: 'Cycle'
  }, {
    value: 'Van',
    label: 'Van'
  }, {
    value: 'Other',
    label: 'Other'
  }];
  const STATE_OPTIONS$1 = INDIA_STATES.map(item => ({
    value: item.name,
    label: item.name
  }));
  function FieldError({
    error
  }) {
    if (!error?.message) return null;
    return /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, error.message);
  }
  const PartnerEdit = props => {
    const {
      record: initialRecord,
      resource,
      action
    } = props;
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const params = record?.params || {};
    const isNew = action?.name === 'new' || !record?.id;
    const readOnly = action?.name === 'show';
    const hasPassword = Boolean(params.hasPassword);
    const isActive = isNew && (params.isActive === undefined || params.isActive === '') ? true : isFlagOn(params.isActive);
    React.useEffect(() => {
      if (isNew && (params.isActive === undefined || params.isActive === '')) {
        handleChange('isActive', true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew]);
    const errors = React.useMemo(() => record?.errors || {}, [record?.errors]);
    const setField = (key, value) => handleChange(key, value);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save partner',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: isNew ? 'Partner saved. A password email will be sent if they do not have a password yet.' : 'Partner updated',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save partner. Please try again.',
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
    }, isNew ? 'Add delivery partner' : params.name || 'Delivery partner'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Collect full KYC and contact details. They log in to the Tokriii Partner app with this email after setting a password from the invite mail.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Account status"), /*#__PURE__*/React__default.default.createElement("p", null, "Inactive partners cannot log in, even if they already set a password."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isActive,
      disabled: readOnly,
      title: isActive ? 'Active' : 'Inactive',
      hint: isActive ? 'Can sign in to the partner app' : 'Login is blocked until you turn this on',
      onChange: next => setField('isActive', next)
    }), !isNew ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "lg",
      opacity: 0.7
    }, hasPassword ? 'Password is already set.' : 'No password yet — send the invite email after saving.') : null), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Login details"), /*#__PURE__*/React__default.default.createElement("p", null, "Email is used to create and reset the partner password. No SMS is sent."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Email", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "email",
      required: true,
      readOnly: readOnly,
      value: params.email || '',
      onChange: event => setField('email', event.target.value),
      placeholder: "partner@example.com"
    }), errors.email ? /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.email
    }) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "Password link is sent to this inbox")), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Mobile number", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      inputMode: "numeric",
      maxLength: 10,
      required: true,
      readOnly: readOnly,
      value: params.phone || '',
      onChange: event => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10)),
      placeholder: "10-digit number"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.phone
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Personal details"), /*#__PURE__*/React__default.default.createElement("p", null, "Name is shown on orders. Father's name and DOB help with KYC records."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Full name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      value: params.name || '',
      onChange: event => setField('name', event.target.value),
      placeholder: "Partner full name"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.name
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Father's / guardian name ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.fatherName || '',
      onChange: event => setField('fatherName', event.target.value),
      placeholder: "As on Aadhaar / documents"
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Date of birth ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "date",
      readOnly: readOnly,
      value: params.dateOfBirth || '',
      onChange: event => setField('dateOfBirth', event.target.value)
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "KYC documents"), /*#__PURE__*/React__default.default.createElement("p", null, "PAN and Aadhaar are required for partner onboarding."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "PAN number", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      maxLength: 10,
      value: params.panNumber || '',
      onChange: event => setField('panNumber', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)),
      placeholder: "ABCDE1234F"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.panNumber
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Aadhaar number", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      inputMode: "numeric",
      maxLength: 12,
      value: params.aadhaarNumber || '',
      onChange: event => setField('aadhaarNumber', event.target.value.replace(/\D/g, '').slice(0, 12)),
      placeholder: "12-digit Aadhaar"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.aadhaarNumber
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Current address"), /*#__PURE__*/React__default.default.createElement("p", null, "Where the partner currently lives / operates from."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Address line 1", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      value: params.addressLine1 || '',
      onChange: event => setField('addressLine1', event.target.value),
      placeholder: "House / street / area"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.addressLine1
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Address line 2 ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.addressLine2 || '',
      onChange: event => setField('addressLine2', event.target.value),
      placeholder: "Landmark, colony"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "City", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      value: params.city || '',
      onChange: event => setField('city', event.target.value),
      placeholder: "City"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.city
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Pincode", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      inputMode: "numeric",
      maxLength: 6,
      value: params.pincode || '',
      onChange: event => setField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6)),
      placeholder: "6-digit pincode"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.pincode
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "State", /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: params.state || '',
      options: [{
        value: '',
        label: 'Select state'
      }, ...STATE_OPTIONS$1],
      onChange: next => setField('state', next),
      disabled: readOnly
    })), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.state
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Permanent address ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("textarea", {
      className: "tokri-coupon-input tokri-textarea",
      rows: 3,
      readOnly: readOnly,
      value: params.permanentAddress || '',
      onChange: event => setField('permanentAddress', event.target.value),
      placeholder: "If different from current address"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Emergency contact"), /*#__PURE__*/React__default.default.createElement("p", null, "Someone we can call if the partner is unreachable."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Contact name ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.emergencyName || '',
      onChange: event => setField('emergencyName', event.target.value),
      placeholder: "Relative / friend name"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Contact mobile ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      inputMode: "numeric",
      maxLength: 10,
      readOnly: readOnly,
      value: params.emergencyPhone || '',
      onChange: event => setField('emergencyPhone', event.target.value.replace(/\D/g, '').slice(0, 10)),
      placeholder: "10-digit number"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.emergencyPhone
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Vehicle details"), /*#__PURE__*/React__default.default.createElement("p", null, "Used for delivery assignment and support."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Vehicle type ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: params.vehicleType || '',
      options: [{
        value: '',
        label: 'Select vehicle'
      }, ...VEHICLE_TYPES],
      onChange: next => setField('vehicleType', next),
      disabled: readOnly
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Vehicle number ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.vehicleNumber || '',
      onChange: event => setField('vehicleNumber', event.target.value.toUpperCase().slice(0, 20)),
      placeholder: "e.g. MH12AB1234"
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Bank details"), /*#__PURE__*/React__default.default.createElement("p", null, "For payouts and reimbursements. Optional for now, but recommended."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Account holder name ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.accountHolderName || '',
      onChange: event => setField('accountHolderName', event.target.value),
      placeholder: "As per bank account"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Account number ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.accountNumber || '',
      onChange: event => setField('accountNumber', event.target.value.replace(/\s+/g, '')),
      placeholder: "Bank account number"
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "IFSC code ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      maxLength: 11,
      value: params.ifscCode || '',
      onChange: event => setField('ifscCode', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)),
      placeholder: "SBIN0001234"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.ifscCode
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Internal notes"), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Notes ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("textarea", {
      className: "tokri-coupon-input tokri-textarea",
      rows: 4,
      readOnly: readOnly,
      value: params.notes || '',
      onChange: event => setField('notes', event.target.value),
      placeholder: "Shift timing, hub, or anything your team should remember"
    }))), readOnly ? null : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, isNew ? 'Create partner' : 'Save partner')));
  };

  const api$1 = new adminjs.ApiClient();
  const STATE_OPTIONS = INDIA_STATES.map(item => ({
    value: item.code,
    label: `${item.name} (${item.code})`
  }));
  const PincodeEdit = props => {
    const {
      record: initialRecord,
      resource,
      action
    } = props;
    const addNotice = adminjs.useNotice();
    const {
      record,
      handleChange,
      submit: handleSubmit,
      loading
    } = adminjs.useRecord(initialRecord, resource.id);
    const params = record?.params || {};
    const isNew = action?.name === 'new' || !record?.id;
    const readOnly = action?.name === 'show';
    const isActive = isNew && (params.isActive === undefined || params.isActive === '') ? true : isFlagOn(params.isActive);
    const [partners, setPartners] = React.useState([]);
    React.useEffect(() => {
      if (isNew && (params.isActive === undefined || params.isActive === '')) {
        handleChange('isActive', true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew]);
    React.useEffect(() => {
      let ignore = false;
      api$1.resourceAction({
        resourceId: 'DeliveryPartner',
        actionName: 'list',
        params: {
          perPage: 200
        }
      }).then(response => {
        if (ignore) return;
        const records = response.data?.records || [];
        setPartners(records.map(item => ({
          value: item.id || item.params?.id,
          label: isFlagOn(item.params?.isActive) ? item.params?.name || 'Partner' : `${item.params?.name || 'Partner'} (inactive)`
        })));
      }).catch(() => {
        if (!ignore) setPartners([]);
      });
      return () => {
        ignore = true;
      };
    }, []);
    const errors = React.useMemo(() => record?.errors || {}, [record?.errors]);
    const partnerId = params.partnerId || params.partner || '';
    const setField = (key, value) => handleChange(key, value);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save pincode',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: isNew ? 'Pincode added' : 'Pincode updated',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save pincode. Please try again.',
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
    }, isNew ? 'Add serviceable pincode' : `PIN ${params.pincode || ''}`), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        color: '#fff',
        opacity: 0.9
      }
    }, "Customers can save an address and check out only when this pincode is active.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Delivery coverage"), /*#__PURE__*/React__default.default.createElement("p", null, "Turn this off to stop taking orders for this PIN without deleting it."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isActive,
      disabled: readOnly,
      title: isActive ? 'We deliver here' : 'Not delivering',
      hint: isActive ? 'Address save and checkout are allowed' : 'Customers will see that this PIN is not serviceable',
      onChange: next => setField('isActive', next)
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Assigned partner"), /*#__PURE__*/React__default.default.createElement("p", null, "New orders in this PIN are auto-assigned to this partner. You can reassign later on the order."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Delivery partner ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement(SearchableSelect, {
      value: partnerId,
      options: [{
        value: '',
        label: 'No partner assigned'
      }, ...partners],
      disabled: readOnly,
      onChange: next => {
        setField('partnerId', next);
        setField('partner', next);
      },
      placeholder: "Select a partner",
      searchPlaceholder: "Search partners"
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Location"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Pincode", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      inputMode: "numeric",
      maxLength: 6,
      required: true,
      readOnly: readOnly || !isNew,
      value: params.pincode || '',
      onChange: event => setField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6)),
      placeholder: "6-digit PIN"
    }), errors.pincode ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.pincode.message) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "India PIN code, 6 digits")), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Area name ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.areaLabel || '',
      onChange: event => setField('areaLabel', event.target.value),
      placeholder: "Andheri West, Bandra, \u2026"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "City", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      value: params.city || '',
      onChange: event => setField('city', event.target.value),
      placeholder: "Mumbai"
    }), errors.city ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.city.message) : null), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "State", /*#__PURE__*/React__default.default.createElement(SearchableSelect, {
      value: params.stateCode || params.state || '',
      options: [{
        value: '',
        label: 'Select state'
      }, ...STATE_OPTIONS],
      disabled: readOnly,
      onChange: next => {
        setField('stateCode', next);
        setField('state', next);
      },
      placeholder: "Select state",
      searchPlaceholder: "Search states"
    }), errors.state || errors.stateCode ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, (errors.state || errors.stateCode).message) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "All Indian states and union territories")))), readOnly ? null : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, isNew ? 'Add pincode' : 'Save pincode')));
  };

  const api = new adminjs.ApiClient();
  const StatusToggle = props => {
    const {
      record,
      resource,
      property,
      where,
      onChange
    } = props;
    const addNotice = adminjs.useNotice();
    const raw = record?.params?.[property?.path] ?? record?.params?.isActive;
    const [checked, setChecked] = React.useState(isFlagOn(raw));
    const [busy, setBusy] = React.useState(false);
    React.useEffect(() => {
      setChecked(isFlagOn(raw));
    }, [raw, record?.id]);
    const persist = async next => {
      if (!record?.id) return;
      setBusy(true);
      try {
        const response = await api.recordAction({
          resourceId: resource.id,
          recordId: record.id,
          actionName: 'toggleActive',
          method: 'post',
          data: {
            isActive: next
          }
        });
        const saved = response.data?.record?.params?.isActive;
        setChecked(saved === undefined ? next : isFlagOn(saved));
        const notice = response.data?.notice;
        addNotice({
          message: notice?.message || (next ? 'Marked active' : 'Marked inactive'),
          type: notice?.type || 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Could not update status.',
          type: 'error'
        });
      } finally {
        setBusy(false);
      }
    };
    const handleChange = next => {
      if (where === 'edit' && typeof onChange === 'function') {
        setChecked(next);
        onChange(property.path, next);
        return;
      }
      persist(next);
    };
    return /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      compact: where !== 'edit',
      checked: checked,
      disabled: busy,
      title: where === 'edit' ? checked ? 'Active' : 'Inactive' : undefined,
      hint: where === 'edit' ? property?.description : undefined,
      onChange: handleChange
    });
  };

  function pad(value) {
    return String(value).padStart(2, '0');
  }
  function toDateInput(value) {
    if (!value) return '';
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  function formatWhen(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }
  function parseAddresses(params) {
    const raw = params.addresses;
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (raw && typeof raw === 'object') return [raw];
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        if (parsed && typeof parsed === 'object') return [parsed];
      } catch {
        // flattened AdminJS params below
      }
    }
    const grouped = {};
    Object.entries(params).forEach(([key, value]) => {
      const match = key.match(/^addresses\.(\d+)\.(.+)$/);
      if (!match || value === undefined || value === null || value === '') return;
      const [, index, field] = match;
      grouped[index] = grouped[index] || {};
      grouped[index][field] = value;
    });
    return Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(key => grouped[key]);
  }
  function addressLines(address) {
    return [address.line1, address.line2, [address.city, address.state, address.pincode].filter(Boolean).join(', '), address.landmark ? `Landmark: ${address.landmark}` : ''].filter(Boolean);
  }
  const CustomerEdit = props => {
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
    const isActive = params.isActive === undefined || params.isActive === '' ? true : isFlagOn(params.isActive);
    const addresses = React.useMemo(() => parseAddresses(params), [params]);
    const errors = React.useMemo(() => record?.errors || {}, [record?.errors]);
    const setField = (key, value) => handleChange(key, value);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save customer',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: 'Customer updated',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save customer. Please try again.',
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
    }, params.name || 'Customer'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "+91 ", params.phone || '—', " \xB7 joined ", formatWhen(params.createdAt))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Account status"), /*#__PURE__*/React__default.default.createElement("p", null, "Inactive customers cannot sign in with this mobile number."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isActive,
      title: isActive ? 'Active' : 'Inactive',
      hint: isActive ? 'Can log in on the website and app' : 'Login is blocked until you turn this on',
      onChange: next => setField('isActive', next)
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Profile"), /*#__PURE__*/React__default.default.createElement("p", null, "Phone comes from OTP login and stays as the customer\u2019s login id."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.name || '',
      onChange: event => setField('name', event.target.value),
      placeholder: "Customer name"
    }), errors.name ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.name.message) : null), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Mobile", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.phone || '',
      readOnly: true
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Date of birth", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "date",
      value: toDateInput(params.dateOfBirth),
      onChange: event => setField('dateOfBirth', event.target.value)
    }), errors.dateOfBirth ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.dateOfBirth.message) : null)))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Saved addresses"), /*#__PURE__*/React__default.default.createElement("p", null, addresses.length ? `${addresses.length} address${addresses.length === 1 ? '' : 'es'} saved in the customer account.` : 'This customer has not saved a delivery address yet.'), addresses.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-address-grid"
    }, addresses.map((address, index) => /*#__PURE__*/React__default.default.createElement("article", {
      key: address.id || `${address.pincode}-${index}`,
      className: "tokri-address-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-address-top"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-address-label"
    }, address.label || 'Address'), address.pincode ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-address-pin"
    }, address.pincode) : null), /*#__PURE__*/React__default.default.createElement("strong", null, address.name || params.name || 'Customer'), address.phone ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-address-phone"
    }, "+91 ", address.phone) : null, addressLines(address).map(line => /*#__PURE__*/React__default.default.createElement("p", {
      key: line
    }, line))))) : null), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save customer")));
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

      // #region agent log
      fetch('http://127.0.0.1:7316/ingest/db52256f-3cb2-454c-a236-a9264b383672', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'da77dc'
        },
        body: JSON.stringify({
          sessionId: 'da77dc',
          runId: 'pre-fix',
          hypothesisId: 'A',
          location: 'login.jsx:handleSubmit',
          message: 'admin login form submit',
          data: {
            action: action || null,
            reduxRoot: window.REDUX_STATE?.paths?.rootPath || null,
            hasIdentifier: !!value,
            href: window.location.href
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

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

  function adminRoot(pathname) {
    const cut = pathname.search(/\/(resources|pages)(\/|$)/);
    const root = cut === -1 ? pathname : pathname.slice(0, cut);
    return root.replace(/\/$/, '') || '/';
  }
  function SidebarResourceSection(props) {
    const Original = props.OriginalComponent;
    const location = reactRouter.useLocation();
    const navigate = reactRouter.useNavigate();
    const href = adminRoot(location.pathname);
    const selected = location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '') || location.pathname === `${href}/`;
    return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("a", {
      className: `tokri-sidebar-dashboard${selected ? ' is-active' : ''}`,
      href: href,
      onClick: event => {
        event.preventDefault();
        navigate(href);
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Home"
    }), /*#__PURE__*/React__default.default.createElement("span", null, "Dashboard")), Original ? /*#__PURE__*/React__default.default.createElement(Original, {
      resources: props.resources
    }) : null);
  }

  const getResourceElementCss$1 = (resourceId, suffix) => `${resourceId}-${suffix}`;

  /**
   * AdminJS marks the header checkbox checked when ANY row is selected.
   * Override so: none = unchecked, some = indeterminate, all = checked.
   */
  function RecordsTable(props) {
    const {
      resource,
      records,
      actionPerformed,
      sortBy,
      direction,
      isLoading,
      onSelect,
      selectedRecords,
      onSelectAll
    } = props;
    if (!records.length) {
      if (isLoading) return /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null);
      return /*#__PURE__*/React__default.default.createElement(adminjs.NoRecords, {
        resource: resource
      });
    }
    const selectedCount = selectedRecords ? records.filter(record => selectedRecords.some(selected => selected.id === record.id)).length : 0;
    const selectedAll = selectedCount > 0 && selectedCount === records.length;
    const indeterminate = selectedCount > 0 && selectedCount < records.length;
    const recordsHaveBulkAction = !!records.find(record => record.bulkActions.length);
    const contentTag = getResourceElementCss$1(resource.id, 'table');
    const selectedTag = getResourceElementCss$1(resource.id, 'table-selected-records');
    const bodyTag = getResourceElementCss$1(resource.id, 'table-body');
    return /*#__PURE__*/React__default.default.createElement(designSystem.Table, {
      "data-css": contentTag
    }, /*#__PURE__*/React__default.default.createElement(adminjs.SelectedRecords, {
      resource: resource,
      selectedRecords: selectedRecords,
      "data-css": selectedTag
    }), /*#__PURE__*/React__default.default.createElement(adminjs.RecordsTableHeader, {
      properties: resource.listProperties,
      titleProperty: resource.titleProperty,
      direction: direction,
      sortBy: sortBy,
      onSelectAll: recordsHaveBulkAction ? onSelectAll : undefined,
      selectedAll: selectedAll,
      indeterminate: indeterminate
    }), /*#__PURE__*/React__default.default.createElement(designSystem.TableBody, {
      "data-css": bodyTag
    }, records.map(record => /*#__PURE__*/React__default.default.createElement(adminjs.RecordInList, {
      record: record,
      resource: resource,
      key: record.id,
      actionPerformed: actionPerformed,
      isLoading: isLoading,
      onSelect: onSelect,
      isSelected: selectedRecords && !!selectedRecords.find(selected => selected.id === record.id)
    }))));
  }

  const getResourceElementCss = (resourceId, suffix) => `${resourceId}-${suffix}`;
  const display = isTitle => [isTitle ? 'table-cell' : 'none', isTitle ? 'table-cell' : 'none', 'table-cell', 'table-cell'];
  function SelectAllCheckBox({
    checked,
    indeterminate,
    onChange
  }) {
    const inputRef = React.useRef(null);
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate, checked]);
    return /*#__PURE__*/React__default.default.createElement("label", {
      className: `tokri-select-all${indeterminate ? ' is-indeterminate' : ''}${checked ? ' is-checked' : ''}`,
      style: {
        marginLeft: 5
      }
    }, /*#__PURE__*/React__default.default.createElement("input", {
      ref: inputRef,
      type: "checkbox",
      checked: Boolean(checked),
      onChange: onChange,
      "aria-checked": indeterminate ? 'mixed' : checked ? 'true' : 'false'
    }), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-select-all-box",
      "aria-hidden": "true"
    }, indeterminate ? /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24",
      className: "tokri-select-all-icon"
    }, /*#__PURE__*/React__default.default.createElement("line", {
      x1: "6",
      y1: "12",
      x2: "18",
      y2: "12"
    })) : checked ? /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24",
      className: "tokri-select-all-icon"
    }, /*#__PURE__*/React__default.default.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })) : null));
  }
  function RecordsTableHeader(props) {
    const {
      titleProperty,
      properties,
      sortBy,
      direction,
      onSelectAll,
      selectedAll,
      indeterminate
    } = props;
    const contentTag = getResourceElementCss(titleProperty.resourceId, 'table-head');
    const rowTag = `${titleProperty.resourceId}-table-head-row`;
    const checkboxCss = `${titleProperty.resourceId}-checkbox-table-cell`;
    return /*#__PURE__*/React__default.default.createElement(designSystem.TableHead, {
      "data-css": contentTag
    }, /*#__PURE__*/React__default.default.createElement(designSystem.TableRow, {
      "data-css": rowTag
    }, /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, {
      "data-css": checkboxCss
    }, onSelectAll ? /*#__PURE__*/React__default.default.createElement(SelectAllCheckBox, {
      onChange: () => onSelectAll(),
      checked: Boolean(selectedAll),
      indeterminate: Boolean(indeterminate)
    }) : null), properties.map(property => /*#__PURE__*/React__default.default.createElement(adminjs.PropertyHeader, {
      display: display(property.isTitle),
      key: property.propertyPath,
      titleProperty: titleProperty,
      property: property,
      sortBy: sortBy,
      direction: direction
    })), /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, {
      key: "actions",
      style: {
        width: 80
      }
    })));
  }

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
  AdminJS.UserComponents.PartnerEdit = PartnerEdit;
  AdminJS.UserComponents.PincodeEdit = PincodeEdit;
  AdminJS.UserComponents.StatusToggle = StatusToggle;
  AdminJS.UserComponents.CustomerEdit = CustomerEdit;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;
  AdminJS.UserComponents.SidebarResourceSection = SidebarResourceSection;
  AdminJS.UserComponents.RecordsTable = RecordsTable;
  AdminJS.UserComponents.RecordsTableHeader = RecordsTableHeader;

})(React, AdminJS, AdminJSDesignSystem, ReactRouter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3JtLWNvbnRyb2xzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvaW5kaWEtc3RhdGVzLmpzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZWNvcmRzLXRhYmxlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUtaGVhZGVyLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW29wZW5VcCwgc2V0T3BlblVwXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgc2V0T3BlblVwKHNwYWNlQmVsb3cgPCAyNDAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBvcGVuVXAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGbGFnQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsYWdPbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJ29uJyB8fCB2YWx1ZSA9PT0gMSB8fCB2YWx1ZSA9PT0gJzEnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGF0dXNTd2l0Y2goe1xuICBjaGVja2VkLFxuICBvbkNoYW5nZSxcbiAgZGlzYWJsZWQsXG4gIHRpdGxlLFxuICBoaW50LFxuICBjb21wYWN0ID0gZmFsc2UsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1zd2l0Y2gke2NoZWNrZWQgPyAnIGlzLW9uJyA6ICcnfSR7Y29tcGFjdCA/ICcgaXMtY29tcGFjdCcgOiAnJ31gfVxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgYXJpYS1wcmVzc2VkPXtjaGVja2VkfVxuICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgaWYgKCFkaXNhYmxlZCkgb25DaGFuZ2UoIWNoZWNrZWQpXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXN3aXRjaC10cmFja1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtdGh1bWJcIiAvPlxuICAgICAgPC9zcGFuPlxuICAgICAge3RpdGxlIHx8IGhpbnQgPyAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXN3aXRjaC1jb3B5XCI+XG4gICAgICAgICAge3RpdGxlID8gPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+IDogbnVsbH1cbiAgICAgICAgICB7aGludCA/IDxzcGFuPntoaW50fTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApIDogKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1zdGF0dXMtcGlsbCR7Y2hlY2tlZCA/ICcgaXMtb24nIDogJyd9YH0+e2NoZWNrZWQgPyAnQWN0aXZlJyA6ICdJbmFjdGl2ZSd9PC9zcGFuPlxuICAgICAgKX1cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2VhcmNoYWJsZVNlbGVjdCh7IHZhbHVlLCBvcHRpb25zLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHNlYXJjaFBsYWNlaG9sZGVyLCBkaXNhYmxlZCB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgY29uc3QgZmlsdGVyZWQgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT5cbiAgICBgJHtpdGVtLmxhYmVsfSAke2l0ZW0udmFsdWV9YC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCJcbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgaWYgKCFkaXNhYmxlZCkgc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT17c2VsZWN0ZWQgPyAnJyA6ICd0b2tyaS1tdWx0aXNlbGVjdC1wbGFjZWhvbGRlcid9PlxuICAgICAgICAgIHtzZWxlY3RlZD8ubGFiZWwgfHwgcGxhY2Vob2xkZXJ9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFF1ZXJ5KGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VhcmNoUGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gaXRlbS52YWx1ZSA9PT0gdmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLnZhbHVlIHx8ICdlbXB0eSd9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7YWN0aXZlID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgIHNldFF1ZXJ5KCcnKVxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2NhbFNlbGVjdCh7IHZhbHVlLCBvcHRpb25zLCBvbkNoYW5nZSwgZGlzYWJsZWQgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuICBjb25zdCBzZWxlY3RlZCA9IG9wdGlvbnMuZmluZCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0udmFsdWUpID09PSBTdHJpbmcodmFsdWUpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbG9jYWwtc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWxvY2FsLXNlbGVjdC1jb250cm9sXCJcbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgaWYgKCFkaXNhYmxlZCkgc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxzcGFuPntzZWxlY3RlZD8ubGFiZWwgfHwgdmFsdWV9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLWxvY2FsLXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIHtvcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAga2V5PXtpdGVtLnZhbHVlfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke1N0cmluZyhpdGVtLnZhbHVlKSA9PT0gU3RyaW5nKHZhbHVlKSA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEJveCwgSDIsIEg1LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IExvY2FsU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcbmNvbnN0IFJBTkdFUyA9IFtcbiAgeyB2YWx1ZTogJzdkJywgbGFiZWw6ICc3IGRheXMnIH0sXG4gIHsgdmFsdWU6ICd0aGlzTW9udGgnLCBsYWJlbDogJ1RoaXMgbW9udGgnIH0sXG4gIHsgdmFsdWU6ICdsYXN0TW9udGgnLCBsYWJlbDogJ0xhc3QgbW9udGgnIH0sXG4gIHsgdmFsdWU6ICc5MGQnLCBsYWJlbDogJzMgbW9udGhzJyB9LFxuXVxuY29uc3QgV0lER0VUUyA9IFsnb3JkZXJWYWx1ZScsICdvcmRlcnMnLCAnY3VzdG9tZXJzJywgJ3Byb2R1Y3RzJ11cblxuY29uc3QgaW5yID0gKHZhbHVlKSA9PlxuICBg4oK5JHtOdW1iZXIodmFsdWUgfHwgMCkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDAgfSl9YFxuXG5mdW5jdGlvbiBSYW5nZVNlbGVjdCh7IHZhbHVlLCBvbkNoYW5nZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1yYW5nZS1zZWxlY3RcIj5cbiAgICAgIDxMb2NhbFNlbGVjdCB2YWx1ZT17dmFsdWV9IG9wdGlvbnM9e1JBTkdFU30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIGF4aXNNYXgodmFsdWUpIHtcbiAgaWYgKHZhbHVlIDw9IDApIHJldHVybiAxMDAwXG4gIGNvbnN0IHBhZGRlZCA9IHZhbHVlICogMS4xXG4gIGNvbnN0IG1hZ25pdHVkZSA9IDEwICoqIE1hdGguZmxvb3IoTWF0aC5sb2cxMChwYWRkZWQpKVxuICBjb25zdCBub3JtYWxpemVkID0gcGFkZGVkIC8gbWFnbml0dWRlXG4gIGNvbnN0IG5pY2UgPSBub3JtYWxpemVkIDw9IDEgPyAxIDogbm9ybWFsaXplZCA8PSAyID8gMiA6IG5vcm1hbGl6ZWQgPD0gNSA/IDUgOiAxMFxuICByZXR1cm4gbmljZSAqIG1hZ25pdHVkZVxufVxuXG5mdW5jdGlvbiBMaW5lQ2hhcnQoeyBzZXJpZXMgfSkge1xuICBjb25zdCBbaG92ZXIsIHNldEhvdmVyXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IHdpZHRoID0gMTIwMFxuICBjb25zdCBoZWlnaHQgPSAzMjBcbiAgY29uc3QgcGFkTGVmdCA9IDg2XG4gIGNvbnN0IHBhZFJpZ2h0ID0gMThcbiAgY29uc3QgcGFkVG9wID0gMThcbiAgY29uc3QgcGFkQm90dG9tID0gMzZcbiAgY29uc3QgbWF4ID0gYXhpc01heChNYXRoLm1heCguLi5zZXJpZXMubWFwKChwb2ludCkgPT4gcG9pbnQub3JkZXJWYWx1ZSksIDApKVxuICBjb25zdCBwbG90V2lkdGggPSB3aWR0aCAtIHBhZExlZnQgLSBwYWRSaWdodFxuICBjb25zdCBwbG90SGVpZ2h0ID0gaGVpZ2h0IC0gcGFkVG9wIC0gcGFkQm90dG9tXG4gIGNvbnN0IGJhc2VsaW5lID0gcGFkVG9wICsgcGxvdEhlaWdodFxuICBjb25zdCB5Rm9yID0gKHZhbHVlKSA9PiBiYXNlbGluZSAtICh2YWx1ZSAvIG1heCkgKiBwbG90SGVpZ2h0XG4gIGNvbnN0IHN0ZXAgPSBzZXJpZXMubGVuZ3RoID4gMSA/IHBsb3RXaWR0aCAvIChzZXJpZXMubGVuZ3RoIC0gMSkgOiBwbG90V2lkdGhcbiAgY29uc3QgY29vcmRzID0gc2VyaWVzLm1hcCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgeCA9IHNlcmllcy5sZW5ndGggPT09IDEgPyBwYWRMZWZ0ICsgcGxvdFdpZHRoIC8gMiA6IHBhZExlZnQgKyBpbmRleCAqIHN0ZXBcbiAgICByZXR1cm4geyB4LCB5OiB5Rm9yKHBvaW50Lm9yZGVyVmFsdWUpLCBwb2ludCB9XG4gIH0pXG4gIGNvbnN0IGxpbmUgPSBjb29yZHMubWFwKChpdGVtLCBpbmRleCkgPT4gYCR7aW5kZXggPyAnTCcgOiAnTSd9JHtpdGVtLnh9LCR7aXRlbS55fWApLmpvaW4oJyAnKVxuICBjb25zdCBhcmVhID0gY29vcmRzLmxlbmd0aFxuICAgID8gYCR7bGluZX0gTCR7Y29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAxXS54fSwke2Jhc2VsaW5lfSBMJHtjb29yZHNbMF0ueH0sJHtiYXNlbGluZX0gWmBcbiAgICA6ICcnXG4gIGNvbnN0IGxhYmVsRXZlcnkgPSBzZXJpZXMubGVuZ3RoID4gMjAgPyBNYXRoLmNlaWwoc2VyaWVzLmxlbmd0aCAvIDgpIDogc2VyaWVzLmxlbmd0aCA+IDEwID8gNCA6IDFcbiAgY29uc3QgdGlja3MgPSBbMCwgMC4yNSwgMC41LCAwLjc1LCAxXS5tYXAoKHJhdGlvKSA9PiAoe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKG1heCAqIHJhdGlvKSxcbiAgICB5OiB5Rm9yKG1heCAqIHJhdGlvKSxcbiAgfSkpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LXBsb3RcIiBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVyKG51bGwpfT5cbiAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke3dpZHRofSAke2hlaWdodH1gfSBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydFwiIHJvbGU9XCJpbWdcIj5cbiAgICAgICAge3RpY2tzLm1hcCgodGljaykgPT4gKFxuICAgICAgICAgIDxnIGtleT17dGljay52YWx1ZX0+XG4gICAgICAgICAgICA8bGluZSB4MT17cGFkTGVmdH0geDI9e3dpZHRoIC0gcGFkUmlnaHR9IHkxPXt0aWNrLnl9IHkyPXt0aWNrLnl9IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWdyaWRsaW5lXCIgLz5cbiAgICAgICAgICAgIDx0ZXh0IHg9e3BhZExlZnQgLSAxMH0geT17dGljay55ICsgNH0gdGV4dEFuY2hvcj1cImVuZFwiIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWF4aXNcIj5cbiAgICAgICAgICAgICAge2lucih0aWNrLnZhbHVlKX1cbiAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICkpfVxuICAgICAgICA8cGF0aCBkPXthcmVhfSBmaWxsPVwiIzA0Nzg1N1wiIG9wYWNpdHk9XCIwLjE2XCIgLz5cbiAgICAgICAgPHBhdGggZD17bGluZX0gZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIzXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICAgIHtjb29yZHMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgPGcga2V5PXtpdGVtLnBvaW50LmRhdGV9PlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBjeD17aXRlbS54fVxuICAgICAgICAgICAgICBjeT17aXRlbS55fVxuICAgICAgICAgICAgICByPVwiMTRcIlxuICAgICAgICAgICAgICBmaWxsPVwidHJhbnNwYXJlbnRcIlxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyKGl0ZW0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxjaXJjbGUgY3g9e2l0ZW0ueH0gY3k9e2l0ZW0ueX0gcj1cIjQuNVwiIGZpbGw9XCIjZmZmXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMlwiIHBvaW50ZXJFdmVudHM9XCJub25lXCIgLz5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICkpfVxuICAgICAgICB7Y29vcmRzLm1hcCgoaXRlbSwgaW5kZXgpID0+XG4gICAgICAgICAgaW5kZXggJSBsYWJlbEV2ZXJ5ID09PSAwID8gKFxuICAgICAgICAgICAgPHRleHQga2V5PXtgJHtpdGVtLnBvaW50LmRhdGV9LWxhYmVsYH0geD17aXRlbS54fSB5PXtoZWlnaHQgLSA4fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtbGFiZWxcIj5cbiAgICAgICAgICAgICAge2l0ZW0ucG9pbnQubGFiZWx9XG4gICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgKSA6IG51bGwsXG4gICAgICAgICl9XG4gICAgICA8L3N2Zz5cbiAgICAgIHtob3ZlciA/IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNoYXJ0LXRpcCR7aG92ZXIueSA8IDkwID8gJyBpcy1iZWxvdycgOiAnJ31gfVxuICAgICAgICAgIHN0eWxlPXt7IGxlZnQ6IGAkeyhob3Zlci54IC8gd2lkdGgpICogMTAwfSVgLCB0b3A6IGAkeyhob3Zlci55IC8gaGVpZ2h0KSAqIDEwMH0lYCB9fVxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+e2hvdmVyLnBvaW50LmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICA8c3Ryb25nPntpbnIoaG92ZXIucG9pbnQub3JkZXJWYWx1ZSl9PC9zdHJvbmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gUGFnZXIoeyBwYWdlLCBwYWdlU2l6ZSwgdG90YWwsIG9uQ2hhbmdlIH0pIHtcbiAgY29uc3QgcGFnZXMgPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwoKHRvdGFsIHx8IDApIC8gcGFnZVNpemUpKVxuICBpZiAocGFnZXMgPD0gMSkgcmV0dXJuIG51bGxcbiAgY29uc3QgbnVtYmVycyA9IFtdXG4gIGZvciAobGV0IG51bWJlciA9IDE7IG51bWJlciA8PSBwYWdlczsgbnVtYmVyICs9IDEpIG51bWJlcnMucHVzaChudW1iZXIpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtcGFnZXNcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXBhZ2VzXCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtwYWdlIDw9IDF9IG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHBhZ2UgLSAxKX0+XG4gICAgICAgICAgUHJldlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAge251bWJlcnMubWFwKChudW1iZXIpID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGtleT17bnVtYmVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtudW1iZXIgPT09IHBhZ2UgPyAnaXMtY3VycmVudCcgOiAnJ31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKG51bWJlcil9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge251bWJlcn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtwYWdlID49IHBhZ2VzfSBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShwYWdlICsgMSl9PlxuICAgICAgICAgIE5leHRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IHJlcXVlc3RzID0gdXNlUmVmKHt9KVxuICBjb25zdCBbcmFuZ2VzLCBzZXRSYW5nZXNdID0gdXNlU3RhdGUoe1xuICAgIG9yZGVyVmFsdWU6ICc3ZCcsXG4gICAgb3JkZXJzOiAnN2QnLFxuICAgIGN1c3RvbWVyczogJzdkJyxcbiAgICBwcm9kdWN0czogJzdkJyxcbiAgfSlcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUoe30pXG4gIGNvbnN0IFtwYWdlcywgc2V0UGFnZXNdID0gdXNlU3RhdGUoeyBvcmRlcnM6IDEsIGN1c3RvbWVyczogMSB9KVxuICBjb25zdCBbYnVzeSwgc2V0QnVzeV0gPSB1c2VTdGF0ZSh7XG4gICAgb3JkZXJWYWx1ZTogdHJ1ZSxcbiAgICBvcmRlcnM6IHRydWUsXG4gICAgY3VzdG9tZXJzOiB0cnVlLFxuICAgIHByb2R1Y3RzOiB0cnVlLFxuICB9KVxuXG4gIGNvbnN0IGxvYWRXaWRnZXQgPSAod2lkZ2V0LCByYW5nZSwgcGFnZSA9IDEpID0+IHtcbiAgICBjb25zdCB0aWNrZXQgPSAocmVxdWVzdHMuY3VycmVudFt3aWRnZXRdIHx8IDApICsgMVxuICAgIHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSA9IHRpY2tldFxuICAgIHNldEJ1c3koKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiB0cnVlIH0pKVxuICAgIGFwaVxuICAgICAgLmdldERhc2hib2FyZCh7IHBhcmFtczogeyB3aWRnZXQsIHJhbmdlLCBwYWdlIH0gfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdHMuY3VycmVudFt3aWRnZXRdICE9PSB0aWNrZXQpIHJldHVyblxuICAgICAgICBzZXREYXRhKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCAuLi5yZXNwb25zZS5kYXRhIH0pKVxuICAgICAgfSlcbiAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgaWYgKHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSAhPT0gdGlja2V0KSByZXR1cm5cbiAgICAgICAgc2V0QnVzeSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IGZhbHNlIH0pKVxuICAgICAgfSlcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgV0lER0VUUy5mb3JFYWNoKCh3aWRnZXQpID0+IGxvYWRXaWRnZXQod2lkZ2V0LCAnN2QnKSlcbiAgfSwgW10pXG5cbiAgY29uc3QgY2hhbmdlUmFuZ2UgPSAod2lkZ2V0LCByYW5nZSkgPT4ge1xuICAgIHNldFJhbmdlcygoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IHJhbmdlIH0pKVxuICAgIGlmICh3aWRnZXQgPT09ICdvcmRlcnMnIHx8IHdpZGdldCA9PT0gJ2N1c3RvbWVycycpIHtcbiAgICAgIHNldFBhZ2VzKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogMSB9KSlcbiAgICB9XG4gICAgbG9hZFdpZGdldCh3aWRnZXQsIHJhbmdlLCAxKVxuICB9XG5cbiAgY29uc3QgY2hhbmdlUGFnZSA9ICh3aWRnZXQsIHBhZ2UpID0+IHtcbiAgICBzZXRQYWdlcygoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IHBhZ2UgfSkpXG4gICAgbG9hZFdpZGdldCh3aWRnZXQsIHJhbmdlc1t3aWRnZXRdLCBwYWdlKVxuICB9XG5cbiAgY29uc3Qgb3JkZXJWYWx1ZSA9IGRhdGEub3JkZXJWYWx1ZVxuICBjb25zdCBvcmRlcnMgPSBkYXRhLm9yZGVyc1xuICBjb25zdCBjdXN0b21lcnMgPSBkYXRhLmN1c3RvbWVyc1xuICBjb25zdCBwcm9kdWN0cyA9IGRhdGEucHJvZHVjdHNcblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cInRyYW5zcGFyZW50XCIgY2xhc3NOYW1lPVwidG9rcmktYW5hbHl0aWNzXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWFuYWx5dGljcy1oZWFkXCI+XG4gICAgICAgIDxIMiBtYj1cInNtXCI+RGFzaGJvYXJkPC9IMj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkIHRva3JpLWNoYXJ0LWNhcmQtd2lkZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxINSBtYj1cInNtXCI+T3JkZXIgVmFsdWU8L0g1PlxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAge2J1c3kub3JkZXJWYWx1ZSAmJiAhb3JkZXJWYWx1ZVxuICAgICAgICAgICAgICAgID8gJ0xvYWRpbmfigKYnXG4gICAgICAgICAgICAgICAgOiBgJHtpbnIob3JkZXJWYWx1ZT8udG90YWwpfSBmcm9tICR7b3JkZXJWYWx1ZT8ub3JkZXJDb3VudCB8fCAwfSBvcmRlcnNgfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLm9yZGVyVmFsdWV9IG9uQ2hhbmdlPXsodmFsdWUpID0+IGNoYW5nZVJhbmdlKCdvcmRlclZhbHVlJywgdmFsdWUpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge29yZGVyVmFsdWU/LnNlcmllcz8ubGVuZ3RoID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtZnJhbWVcIj5cbiAgICAgICAgICAgIDxMaW5lQ2hhcnQgc2VyaWVzPXtvcmRlclZhbHVlLnNlcmllc30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktc3BsaXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxINSBtYj1cInNtXCI+T3JkZXIgQW1vdW50PC9INT5cbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAgICB7YnVzeS5vcmRlcnMgJiYgIW9yZGVycyA/ICdMb2FkaW5n4oCmJyA6IGAke29yZGVycz8udG90YWwgfHwgMH0gb3JkZXJzYH1cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5vcmRlcnN9IG9uQ2hhbmdlPXsodmFsdWUpID0+IGNoYW5nZVJhbmdlKCdvcmRlcnMnLCB2YWx1ZSl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge29yZGVycz8ucm93cz8ubGVuZ3RoID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS10YWJsZS13cmFwXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0b2tyaS1kYXRhLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+T3JkZXIgbnVtYmVyPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+QW1vdW50PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPlBsYWNlZDwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAge29yZGVycy5yb3dzLm1hcCgocm93KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3Jvdy5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cub3JkZXJOb308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2lucihyb3cuYW1vdW50KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93LnBsYWNlZEF0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+e2J1c3kub3JkZXJzID8gJ0xvYWRpbmfigKYnIDogJ05vIG9yZGVycyBpbiB0aGlzIHBlcmlvZC4nfTwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxQYWdlclxuICAgICAgICAgICAgcGFnZT17b3JkZXJzPy5wYWdlIHx8IHBhZ2VzLm9yZGVyc31cbiAgICAgICAgICAgIHBhZ2VTaXplPXtvcmRlcnM/LnBhZ2VTaXplIHx8IDEwfVxuICAgICAgICAgICAgdG90YWw9e29yZGVycz8udG90YWwgfHwgMH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsocGFnZSkgPT4gY2hhbmdlUGFnZSgnb3JkZXJzJywgcGFnZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SDUgbWI9XCJzbVwiPk5ldyBDdXN0b21lcnM8L0g1PlxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICAgIHtidXN5LmN1c3RvbWVycyAmJiAhY3VzdG9tZXJzID8gJ0xvYWRpbmfigKYnIDogYCR7Y3VzdG9tZXJzPy50b3RhbCB8fCAwfSBwZW9wbGUgcmVnaXN0ZXJlZGB9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMuY3VzdG9tZXJzfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgnY3VzdG9tZXJzJywgdmFsdWUpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtjdXN0b21lcnM/LnJvd3M/Lmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktdGFibGUtd3JhcFwiPlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidG9rcmktZGF0YS10YWJsZVwiPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+UGhvbmU8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+RGF0ZSBvZiBiaXJ0aDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJzLnJvd3MubWFwKChyb3cpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17cm93LmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPis5MSB7cm93LnBob25lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cuZGF0ZU9mQmlydGh9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5yZWdpc3RlcmVkQXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT57YnVzeS5jdXN0b21lcnMgPyAnTG9hZGluZ+KApicgOiAnTm8gbmV3IGN1c3RvbWVycyBpbiB0aGlzIHBlcmlvZC4nfTwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxQYWdlclxuICAgICAgICAgICAgcGFnZT17Y3VzdG9tZXJzPy5wYWdlIHx8IHBhZ2VzLmN1c3RvbWVyc31cbiAgICAgICAgICAgIHBhZ2VTaXplPXtjdXN0b21lcnM/LnBhZ2VTaXplIHx8IDEwfVxuICAgICAgICAgICAgdG90YWw9e2N1c3RvbWVycz8udG90YWwgfHwgMH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsocGFnZSkgPT4gY2hhbmdlUGFnZSgnY3VzdG9tZXJzJywgcGFnZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktc3BsaXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxINSBtYj1cInNtXCI+QmVzdCBTZWxsaW5nIFByb2R1Y3RzPC9INT5cbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAgICB7YnVzeS5wcm9kdWN0cyAmJiAhcHJvZHVjdHMgPyAnTG9hZGluZ+KApicgOiAnVG9wIDUgYnkgbnVtYmVyIG9mIG9yZGVycyd9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMucHJvZHVjdHN9IG9uQ2hhbmdlPXsodmFsdWUpID0+IGNoYW5nZVJhbmdlKCdwcm9kdWN0cycsIHZhbHVlKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7cHJvZHVjdHM/LnJvd3M/Lmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktdGFibGUtd3JhcFwiPlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidG9rcmktZGF0YS10YWJsZVwiPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPlByb2R1Y3Q8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+T3JkZXJzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkFtb3VudDwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAge3Byb2R1Y3RzLnJvd3MubWFwKChyb3cpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17cm93Lm5hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5vcmRlcnN9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2lucihyb3cuYW1vdW50KX08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PntidXN5LnByb2R1Y3RzID8gJ0xvYWRpbmfigKYnIDogJ05vIHByb2R1Y3RzIHNvbGQgaW4gdGhpcyBwZXJpb2QuJ308L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBGbGFnQ2FyZCwgU2VhcmNoYWJsZU11bHRpU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PlxuICBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmNvbnN0IFByb2R1Y3RFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IHByb2R1Y3RVcmxCYXNlID0gd2l0aG91dFRyYWlsaW5nU2xhc2goXG4gICAgY3VzdG9tLnByb2R1Y3RVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3Byb2R1Y3RgLFxuICApXG4gIGNvbnN0IHNsdWdJbnB1dCA9IHBhcmFtcy5zbHVnID8/ICcnXG4gIGNvbnN0IHByZXZpZXdTbHVnID0gbm9ybWFsaXplU2x1Z0lucHV0KHNsdWdJbnB1dCkgfHwgbm9ybWFsaXplU2x1Z0lucHV0KHBhcmFtcy5uYW1lKVxuICBjb25zdCBwcm9kdWN0VXJsID0gcHJldmlld1NsdWcgPyBgJHtwcm9kdWN0VXJsQmFzZX0vJHtwcmV2aWV3U2x1Z31gIDogbnVsbFxuICBjb25zdCBzZWxlY3RlZENhdGVnb3J5U2x1Z3MgPSBwYXJzZVNsdWdzKHBhcmFtcy5jYXRlZ29yeUlkcylcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBpZ25vcmUgPSBmYWxzZVxuICAgIGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFtdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW2FwaUJhc2VVcmxdKVxuXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IG9uUHJvcGVydHlDaGFuZ2UgPSAocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdCkgPT4ge1xuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdzbHVnJykge1xuICAgICAgc2V0U2x1Z0VkaXRlZCh0cnVlKVxuICAgICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSwgLi4ucmVzdClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdClcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnbmFtZScgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2V0U2VsZWN0ZWRDYXRlZ29yaWVzID0gKHNsdWdzKSA9PiBzZXRGaWVsZCgnY2F0ZWdvcnlJZHMnLCBKU09OLnN0cmluZ2lmeShzbHVncykpXG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ3Byb2R1Y3RzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdtZWRpYUlkJywgbWVkaWEuaWQpXG4gICAgICBzZXRQcmV2aWV3VXJsKFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcHJvZHVjdCcsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnUHJvZHVjdCBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0aW9uUHJvcGVydHkgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maW5kKFxuICAgIChwcm9wZXJ0eSkgPT4gcHJvcGVydHkucHJvcGVydHlQYXRoID09PSAnZGVzY3JpcHRpb24nLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e3BhcmFtcy5uYW1lIHx8ICdOZXcgcHJvZHVjdCd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPkFkZCBwaG90b3MsIHByaWNlcywgYW5kIG9uZSBvciBtb3JlIGNhdGVnb3JpZXMgZm9yIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UHJvZHVjdCBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCduYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBbHBob25zbyBNYW5nb1wiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU2x1Z1xuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtzbHVnSW5wdXR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ3NsdWcnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImF1dG8tZ2VuZXJhdGVkIGZyb20gbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgICB7cHJvZHVjdFVybCA/IChcbiAgICAgICAgICAgICAgPGEgaHJlZj17cHJvZHVjdFVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICAgIHtwcm9kdWN0VXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gcHJvZHVjdCBuYW1lIHdoZW4gc2F2ZWQnXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgUHJpY2UgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wcmljZVZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwcmljZVZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgT2xkIHByaWNlICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMub2xkUHJpY2VWYWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnb2xkUHJpY2VWYWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJPcHRpb25hbFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBXZWlnaHRcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLndlaWdodCB8fCAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnd2VpZ2h0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjEga2dcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgQmFkZ2VcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmJhZGdlIHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdiYWRnZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGcmVzaFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTdG9ja1xuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc3RvY2sgPz8gMTAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzdG9jaycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTb3J0IG9yZGVyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zb3J0T3JkZXIgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc29ydE9yZGVyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9kdWN0IGltYWdlPC9oND5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3BcIj5cbiAgICAgICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfSBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdQcm9kdWN0IHByZXZpZXcnfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGEgc3F1YXJlIHByb2R1Y3QgcGhvdG88L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e3VwbG9hZEltYWdlfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBKUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQi5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+Q2F0ZWdvcmllczwvaDQ+XG4gICAgICAgIDxwPkEgcHJvZHVjdCBjYW4gYXBwZWFyIGluIG1vcmUgdGhhbiBvbmUgY2F0ZWdvcnkgb24gdGhlIHdlYnNpdGUgYW5kIGFwcC48L3A+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBTZWxlY3QgY2F0ZWdvcmllc1xuICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgIG9wdGlvbnM9e2NhdGVnb3JpZXMubWFwKChpdGVtKSA9PiAoeyB2YWx1ZTogaXRlbS5zbHVnLCBsYWJlbDogaXRlbS5sYWJlbCB9KSl9XG4gICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRDYXRlZ29yeVNsdWdzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkQ2F0ZWdvcmllc31cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGFuZCBzZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+U3RvcmUgcGxhY2VtZW50PC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNCZXN0U2VsbGVyID09PSAndHJ1ZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkJlc3RzZWxsZXJcIlxuICAgICAgICAgICAgaGludD1cIlNob3cgaW4gYmVzdHNlbGxlcnNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzQmVzdFNlbGxlcicsICEocGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNCZXN0U2VsbGVyID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0ltcG9ydGVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ltcG9ydGVkID09PSAndHJ1ZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkltcG9ydGVkXCJcbiAgICAgICAgICAgIGhpbnQ9XCJTaG93IGluIGltcG9ydGVkIGZydWl0c1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNJbXBvcnRlZCcsICEocGFyYW1zLmlzSW1wb3J0ZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzSW1wb3J0ZWQgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzRmVhdHVyZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzRmVhdHVyZWQgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiRmVhdHVyZWRcIlxuICAgICAgICAgICAgaGludD1cIkhpZ2hsaWdodCB0aGlzIGZydWl0XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0ZlYXR1cmVkJywgIShwYXJhbXMuaXNGZWF0dXJlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNGZWF0dXJlZCA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiQWN0aXZlXCJcbiAgICAgICAgICAgIGhpbnQ9XCJWaXNpYmxlIHRvIGN1c3RvbWVyc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICBzZXRGaWVsZCgnaXNBY3RpdmUnLCAhKHBhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkRlc2NyaXB0aW9uPC9oND5cbiAgICAgICAge2Rlc2NyaXB0aW9uUHJvcGVydHkgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT5cbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtkZXNjcmlwdGlvblByb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgcHJvZHVjdFxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBGbGFnQ2FyZCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IG5vcm1hbGl6ZVNsdWdJbnB1dCA9ICh2YWx1ZSkgPT5cbiAgU3RyaW5nKHZhbHVlIHx8ICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bJ1wiXS9nLCAnJylcbiAgICAucmVwbGFjZSgvW15hLXowLTldKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmNvbnN0IENhdGVnb3J5RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IGJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYmFubmVyVXBsb2FkaW5nLCBzZXRCYW5uZXJVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtiYW5uZXJQcmV2aWV3VXJsLCBzZXRCYW5uZXJQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgY2F0ZWdvcnlVcmxCYXNlID0gd2l0aG91dFRyYWlsaW5nU2xhc2goXG4gICAgY3VzdG9tLmNhdGVnb3J5VXJsQmFzZSB8fCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9jYXRlZ29yeWAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLmxhYmVsKVxuICBjb25zdCBjYXRlZ29yeVVybCA9IHByZXZpZXdTbHVnID8gYCR7Y2F0ZWdvcnlVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuYmFubmVySW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuYmFubmVySW1hZ2UpKSByZXR1cm4gcGFyYW1zLmJhbm5lckltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuYmFubmVySW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmJhbm5lckltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRCYW5uZXJVcmwgPSBiYW5uZXJQcmV2aWV3VXJsIHx8IGJhbm5lckltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXdVcmxdKVxuXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IG9uUHJvcGVydHlDaGFuZ2UgPSAocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdCkgPT4ge1xuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdzbHVnJykge1xuICAgICAgc2V0U2x1Z0VkaXRlZCh0cnVlKVxuICAgICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSwgLi4ucmVzdClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCB2YWx1ZSwgLi4ucmVzdClcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnbGFiZWwnICYmICFzbHVnRWRpdGVkKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ3NsdWcnLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVwbG9hZFRvID0gYXN5bmMgKGZpbGUsIGZpZWxkLCBzZXRMb2NhbFByZXZpZXcsIHNldEJ1c3ksIHN1Y2Nlc3NNZXNzYWdlKSA9PiB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ2NhdGVnb3JpZXMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgc2V0TG9jYWxQcmV2aWV3KFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gICAgc2V0QnVzeSh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIG9uUHJvcGVydHlDaGFuZ2UoZmllbGQsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRMb2NhbFByZXZpZXcoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogc3VjY2Vzc01lc3NhZ2UsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ2F0ZWdvcnkgc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY2F0ZWdvcnknLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRpb25Qcm9wZXJ0eSA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbmQoXG4gICAgKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS5wcm9wZXJ0eVBhdGggPT09ICdkZXNjcmlwdGlvbicsXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLmxhYmVsIHx8ICdOZXcgY2F0ZWdvcnknfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5DcmVhdGUgYSBzaG9wIHNlY3Rpb24gd2l0aCBhIHRodW1ibmFpbCwgYmFubmVyLCBhbmQgcGFnZSBjb3B5LjwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNhdGVnb3J5IGRldGFpbHM8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIExhYmVsXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5sYWJlbCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnbGFiZWwnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNoIEZydWl0c1wiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGFnZSBoZWFkaW5nXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy50aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3RpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTYW1lIGFzIGxhYmVsIGlmIGVtcHR5XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTdWJ0aXRsZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc3VidGl0bGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzdWJ0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2hvcnQgbGluZSB1bmRlciB0aGUgaGVhZGluZ1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU2x1Z1xuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtzbHVnSW5wdXR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ3NsdWcnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImF1dG8tZ2VuZXJhdGVkIGZyb20gbGFiZWxcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgUHJldmlldzp7JyAnfVxuICAgICAgICAgICAge2NhdGVnb3J5VXJsID8gKFxuICAgICAgICAgICAgICA8YSBocmVmPXtjYXRlZ29yeVVybH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICAgIHtjYXRlZ29yeVVybH1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgJ0dlbmVyYXRlZCBmcm9tIGNhdGVnb3J5IGxhYmVsIHdoZW4gc2F2ZWQnXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU29ydCBvcmRlclxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc29ydE9yZGVyID8/IDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3NvcnRPcmRlcicsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTdGF0dXNcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCIgc3R5bGU9e3sgbWFyZ2luVG9wOiA2IH19PlxuICAgICAgICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJBY3RpdmVcIlxuICAgICAgICAgICAgICAgICAgaGludD1cIlNob3duIG9uIHdlYnNpdGUgYW5kIGFwcFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgICBzZXRGaWVsZCgnaXNBY3RpdmUnLCAhKHBhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnKSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5DYXRlZ29yeSBpbWFnZTwvaDQ+XG4gICAgICAgICAgPHA+U3F1YXJlIHRodW1ibmFpbCB1c2VkIGluIHRoZSBob21lIGNhdGVnb3J5IGdyaWQuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLmxhYmVsIHx8ICdDYXRlZ29yeSBwcmV2aWV3J30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuPkNsaWNrIHRvIHVwbG9hZCBjYXRlZ29yeSBpbWFnZTwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgIHVwbG9hZFRvKGZpbGUsICdpbWFnZScsIHNldFByZXZpZXdVcmwsIHNldFVwbG9hZGluZywgJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+Q2F0ZWdvcnkgYmFubmVyPC9oND5cbiAgICAgICAgPHA+V2lkZSBpbWFnZSBzaG93biBhdCB0aGUgdG9wIG9mIHRoZSBjYXRlZ29yeSBwYWdlLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wIHRva3JpLXVwbG9hZC1kcm9wLXdpZGVcIj5cbiAgICAgICAgICB7ZGlzcGxheWVkQmFubmVyVXJsID8gKFxuICAgICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZEJhbm5lclVybH0gYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IGJhbm5lcid9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxzcGFuPkNsaWNrIHRvIHVwbG9hZCBhIHdpZGUgYmFubmVyICgxNjAww5c0MDAgcmVjb21tZW5kZWQpPC9zcGFuPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICByZWY9e2Jhbm5lckZpbGVSZWZ9XG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkVG8oXG4gICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgJ2Jhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgIHNldEJhbm5lclByZXZpZXdVcmwsXG4gICAgICAgICAgICAgICAgICBzZXRCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAnQmFubmVyIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5EZXNjcmlwdGlvbjwvaDQ+XG4gICAgICAgIHtkZXNjcmlwdGlvblByb3BlcnR5ID8gKFxuICAgICAgICAgIDxCb3ggc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAgfX0+XG4gICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17ZGVzY3JpcHRpb25Qcm9wZXJ0eX1cbiAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAge3Jlc291cmNlLmVkaXRQcm9wZXJ0aWVzXG4gICAgICAgICAgLmZpbHRlcigocHJvcGVydHkpID0+IFsnaW1hZ2UnLCAnYmFubmVySW1hZ2UnXS5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpKVxuICAgICAgICAgIC5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmcgfHwgYmFubmVyVXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgfHwgYmFubmVyVXBsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY2F0ZWdvcnlcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXRlZ29yeUVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgSWNvbiwgSW5wdXQsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHtcbiAgUmVjb3Jkc1RhYmxlLFxuICB1c2VRdWVyeVBhcmFtcyxcbiAgdXNlUmVjb3JkcyxcbiAgdXNlU2VsZWN0ZWRSZWNvcmRzLFxufSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBQRVJfUEFHRV9PUFRJT05TID0gWzEwLCAyNSwgNTBdXG5cbmNvbnN0IENtc0xpc3QgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZXNvdXJjZSwgc2V0VGFnIH0gPSBwcm9wc1xuICBjb25zdCB0aXRsZVByb3AgPSByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5uYW1lIHx8IHJlc291cmNlLnRpdGxlUHJvcGVydHk/LnByb3BlcnR5UGF0aCB8fCAnaWQnXG5cbiAgY29uc3QgeyBzdG9yZVBhcmFtcywgZmlsdGVycyB9ID0gdXNlUXVlcnlQYXJhbXMoKVxuICBjb25zdCB7XG4gICAgcmVjb3JkcyxcbiAgICBsb2FkaW5nLFxuICAgIGRpcmVjdGlvbixcbiAgICBzb3J0QnksXG4gICAgcGFnZSxcbiAgICB0b3RhbCxcbiAgICBmZXRjaERhdGEsXG4gICAgcGVyUGFnZSxcbiAgfSA9IHVzZVJlY29yZHMocmVzb3VyY2UuaWQpXG4gIGNvbnN0IHtcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgaGFuZGxlU2VsZWN0LFxuICAgIGhhbmRsZVNlbGVjdEFsbCxcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMsXG4gIH0gPSB1c2VTZWxlY3RlZFJlY29yZHMocmVjb3JkcylcblxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCgpID0+IFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gIGNvbnN0IGRlYm91bmNlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IHN0b3JlUGFyYW1zUmVmID0gdXNlUmVmKHN0b3JlUGFyYW1zKVxuICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50ID0gc3RvcmVQYXJhbXNcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFF1ZXJ5KFN0cmluZyhmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzKFtdKVxuICB9LCBbcmVzb3VyY2UuaWQsIHRpdGxlUHJvcCwgc2V0U2VsZWN0ZWRSZWNvcmRzXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZXRUYWcpIHNldFRhZyh0b3RhbC50b1N0cmluZygpKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgY29uc3QgaGFuZGxlUXVlcnlDaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIHNldFF1ZXJ5KHZhbHVlKVxuXG4gICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIGRlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKClcbiAgICAgIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQoe1xuICAgICAgICBwYWdlOiAnMScsXG4gICAgICAgIGZpbHRlcnM6IHRyaW1tZWQgPyB7IFt0aXRsZVByb3BdOiB0cmltbWVkIH0gOiB7fSxcbiAgICAgIH0pXG4gICAgfSwgMzAwKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQWN0aW9uUGVyZm9ybWVkID0gKCkgPT4gZmV0Y2hEYXRhKClcblxuICBjb25zdCBjdXJyZW50UGFnZSA9IE51bWJlcihwYWdlKSB8fCAxXG4gIGNvbnN0IHJvd3NQZXJQYWdlID0gTnVtYmVyKHBlclBhZ2UpIHx8IDEwXG4gIGNvbnN0IHRvdGFsUm93cyA9IE51bWJlcih0b3RhbCkgfHwgMFxuICBjb25zdCB0b3RhbFBhZ2VzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKHRvdGFsUm93cyAvIHJvd3NQZXJQYWdlKSB8fCAxKVxuICBjb25zdCBmcm9tID0gdG90YWxSb3dzID09PSAwID8gMCA6IChjdXJyZW50UGFnZSAtIDEpICogcm93c1BlclBhZ2UgKyAxXG4gIGNvbnN0IHRvID0gTWF0aC5taW4oY3VycmVudFBhZ2UgKiByb3dzUGVyUGFnZSwgdG90YWxSb3dzKVxuXG4gIGNvbnN0IGdvVG9QYWdlID0gKG5leHRQYWdlKSA9PiB7XG4gICAgY29uc3Qgc2FmZSA9IE1hdGgubWluKE1hdGgubWF4KDEsIG5leHRQYWdlKSwgdG90YWxQYWdlcylcbiAgICBzdG9yZVBhcmFtcyh7IHBhZ2U6IFN0cmluZyhzYWZlKSB9KVxuICB9XG5cbiAgY29uc3QgY2hhbmdlUGVyUGFnZSA9IChuZXh0KSA9PiB7XG4gICAgc3RvcmVQYXJhbXMoeyBwYWdlOiAnMScsIHBlclBhZ2U6IFN0cmluZyhuZXh0KSB9KVxuICB9XG5cbiAgY29uc3QgcGFnZU51bWJlcnMgPSBbXVxuICBjb25zdCB3aW5kb3dTaXplID0gNVxuICBsZXQgc3RhcnQgPSBNYXRoLm1heCgxLCBjdXJyZW50UGFnZSAtIE1hdGguZmxvb3Iod2luZG93U2l6ZSAvIDIpKVxuICBsZXQgZW5kID0gTWF0aC5taW4odG90YWxQYWdlcywgc3RhcnQgKyB3aW5kb3dTaXplIC0gMSlcbiAgc3RhcnQgPSBNYXRoLm1heCgxLCBlbmQgLSB3aW5kb3dTaXplICsgMSlcbiAgZm9yIChsZXQgbnVtYmVyID0gc3RhcnQ7IG51bWJlciA8PSBlbmQ7IG51bWJlciArPSAxKSBwYWdlTnVtYmVycy5wdXNoKG51bWJlcilcblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIj5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtYXhXaWR0aDogNDIwIH19PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIGxlZnQ6IDEyLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJY29uIGljb249XCJTZWFyY2hcIiAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVRdWVyeUNoYW5nZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17YFNlYXJjaCAke3Jlc291cmNlLm5hbWV9Li4uYH1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nTGVmdDogMzYgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IHZhcmlhbnQ9XCJjb250YWluZXJcIj5cbiAgICAgICAgPFJlY29yZHNUYWJsZVxuICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICByZWNvcmRzPXtyZWNvcmRzfVxuICAgICAgICAgIGFjdGlvblBlcmZvcm1lZD17aGFuZGxlQWN0aW9uUGVyZm9ybWVkfVxuICAgICAgICAgIG9uU2VsZWN0PXtoYW5kbGVTZWxlY3R9XG4gICAgICAgICAgb25TZWxlY3RBbGw9e2hhbmRsZVNlbGVjdEFsbH1cbiAgICAgICAgICBzZWxlY3RlZFJlY29yZHM9e3NlbGVjdGVkUmVjb3Jkc31cbiAgICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgICBzb3J0Qnk9e3NvcnRCeX1cbiAgICAgICAgICBpc0xvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIC8+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8VGV4dCBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tc3VtbWFyeVwiPlxuICAgICAgICAgICAge3RvdGFsUm93cyA9PT0gMCA/ICdObyByZWNvcmRzJyA6IGBTaG93aW5nICR7ZnJvbX3igJMke3RvfSBvZiAke3RvdGFsUm93c31gfVxuICAgICAgICAgIDwvVGV4dD5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXNpemVcIj5cbiAgICAgICAgICAgIDxzcGFuPlJvd3M8L3NwYW4+XG4gICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e1N0cmluZyhyb3dzUGVyUGFnZSl9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e1BFUl9QQUdFX09QVElPTlMubWFwKChvcHRpb24pID0+ICh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IFN0cmluZyhvcHRpb24pLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBTdHJpbmcob3B0aW9uKSxcbiAgICAgICAgICAgICAgfSkpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IGNoYW5nZVBlclBhZ2UoTnVtYmVyKG5leHQpKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1wYWdlc1wiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e2N1cnJlbnRQYWdlIDw9IDF9IG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKGN1cnJlbnRQYWdlIC0gMSl9PlxuICAgICAgICAgICAgICBQcmV2XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIHtwYWdlTnVtYmVycy5tYXAoKG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAga2V5PXtudW1iZXJ9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtudW1iZXIgPT09IGN1cnJlbnRQYWdlID8gJ2lzLWN1cnJlbnQnIDogJyd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ29Ub1BhZ2UobnVtYmVyKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtudW1iZXJ9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17Y3VycmVudFBhZ2UgPj0gdG90YWxQYWdlc30gb25DbGljaz17KCkgPT4gZ29Ub1BhZ2UoY3VycmVudFBhZ2UgKyAxKX0+XG4gICAgICAgICAgICAgIE5leHRcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENtc0xpc3RcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBINCwgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgUmV2aWV3RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdyZXZpZXdzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZSgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpLmNhdGNoKCgpID0+IHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSByZXZpZXcnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHByb3BlcnR5QnlQYXRoID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgIHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IFtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgsIHByb3BlcnR5XSksXG4gIClcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSAocHJvcGVydHlQYXRoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydHkgPSBwcm9wZXJ0eUJ5UGF0aFtwcm9wZXJ0eVBhdGhdXG4gICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZ1Byb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoXG4gICAgKHByb3BlcnR5KSA9PiAhWyd0aXRsZScsICduYW1lJywgJ2NvbnRlbnQnLCAnaW1hZ2UnXS5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IHA9XCJ4bFwiPlxuICAgICAgPEJveCBtYj1cInhsXCI+XG4gICAgICAgIDxINCBtYj1cInNtXCI+UmV2aWV3PC9IND5cbiAgICAgICAgPFRleHQgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgQWRkIHRoZSByZXZpZXcgdGl0bGUsIHJldmlld2VyIG5hbWUsIGNvbnRlbnQsIGFuZCBhbiBvcHRpb25hbCByZXZpZXdlciBpbWFnZS5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgndGl0bGUnKX08L0JveD5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnbmFtZScpfTwvQm94PlxuICAgICAgPEJveCBtYj1cImxnXCI+e3JlbmRlclByb3BlcnR5KCdjb250ZW50Jyl9PC9Cb3g+XG5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiIHA9XCJ4bFwiIGJvcmRlcj1cIjFweCBzb2xpZCAjZGJlM2VhXCIgYm9yZGVyUmFkaXVzPVwiMTZweFwiIGJnPVwiI2ZmZmZmZlwiPlxuICAgICAgICA8SDQgbWI9XCJtZFwiPlJldmlld2VyIEltYWdlPC9IND5cblxuICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9XG4gICAgICAgICAgICAgIGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Jldmlld2VyJ31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTQwLFxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvdmVyJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGJlM2VhJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBObyBpbWFnZSBzZWxlY3RlZCB5ZXQuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICApfVxuXG4gICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7cmVtYWluaW5nUHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgIDxCb3gga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9IG1iPVwibGdcIj5cbiAgICAgICAgICB7cmVuZGVyUHJvcGVydHkocHJvcGVydHkucHJvcGVydHlQYXRoKX1cbiAgICAgICAgPC9Cb3g+XG4gICAgICApKX1cblxuICAgICAgPEJveCBtdD1cInhsXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHJldmlld1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJldmlld0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBEcmF3ZXJDb250ZW50LFxuICBEcmF3ZXJGb290ZXIsXG4gIEg0LFxuICBJY29uLFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VSZWNvcmQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBUQUJTID0gW1xuICB7XG4gICAgaWQ6ICdnZW5lcmFsJyxcbiAgICBsYWJlbDogJ0dlbmVyYWwnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3N0b3JlTmFtZScsXG4gICAgICAnc3RvcmVUYWdsaW5lJyxcbiAgICAgICdzdG9yZUVtYWlsJyxcbiAgICAgICdzdG9yZVBob25lMScsXG4gICAgICAnc3RvcmVQaG9uZTInLFxuICAgICAgJ3N0b3JlQWRkcmVzcycsXG4gICAgICAncHJvbW9CYW5uZXInLFxuICAgICAgJ2Vhcmx5RGVsaXZlcnknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2NoYXJnZXMnLFxuICAgIGxhYmVsOiAnQ2hhcmdlcycsXG4gICAgZmllbGRzOiBbJ3NoaXBwaW5nRmVlJywgJ2hhbmRsaW5nRmVlJ10sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvbWVwYWdlJyxcbiAgICBsYWJlbDogJ0hvbWVwYWdlJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdob21lQmFubmVySW1hZ2UnLFxuICAgICAgJ2hvbWVNb2JpbGVCYW5uZXJJbWFnZScsXG4gICAgICAnaG9tZUhpZ2hsaWdodEltYWdlJyxcbiAgICAgICdob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzJyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYXltZW50cycsXG4gICAgbGFiZWw6ICdQYXltZW50cycsXG4gICAgZmllbGRzOiBbJ3Jhem9ycGF5RW5hYmxlZCcsICdyYXpvcnBheUtleUlkJywgJ3Jhem9ycGF5S2V5U2VjcmV0JywgJ2NvZEVuYWJsZWQnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnbm90aWZpY2F0aW9ucycsXG4gICAgbGFiZWw6ICdOb3RpZmljYXRpb25zJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdtc2c5MUVuYWJsZWQnLFxuICAgICAgJ21zZzkxQXV0aEtleScsXG4gICAgICAnbXNnOTFTZW5kZXJJZCcsXG4gICAgICAnbXNnOTFPdHBUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MU9yZGVyVGVtcGxhdGVJZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcEVuYWJsZWQnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBOdW1iZXInLFxuICAgICAgJ21zZzkxV2hhdHNhcHBPdHBUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE9yZGVyVGVtcGxhdGUnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBMYW5ndWFnZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE5hbWVzcGFjZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cEJ1dHRvbicsXG4gICAgXSxcbiAgfSxcbl1cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVJbWFnZVVybChwYXRoLCBhcHBVcmwpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhdGgpKSByZXR1cm4gcGF0aFxuICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGF0aH1gXG59XG5cbmZ1bmN0aW9uIEltYWdlVXBsb2FkZXIoe1xuICBsYWJlbCxcbiAgaGludCxcbiAgdmFsdWUsXG4gIHByZXZpZXdVcmwsXG4gIHVwbG9hZGluZyxcbiAgZmlsZVJlZixcbiAgb25VcGxvYWQsXG4gIHdpZGUsXG59KSB7XG4gIGNvbnN0IGRpc3BsYXllZCA9IHByZXZpZXdVcmwgfHwgdmFsdWVcblxuICByZXR1cm4gKFxuICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgIHtsYWJlbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLXVwbG9hZC1kcm9wJHt3aWRlID8gJyB0b2tyaS11cGxvYWQtZHJvcC13aWRlJyA6ICcnfWB9PlxuICAgICAgICB7ZGlzcGxheWVkID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWR9IGFsdD17YCR7bGFiZWx9IHByZXZpZXdgfSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayB0byB1cGxvYWQgYW4gaW1hZ2UnfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e29uVXBsb2FkfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPntoaW50fTwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmNvbnN0IFNldHRpbmdzRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgnZ2VuZXJhbCcpXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IG1vYmlsZUJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgaGlnaGxpZ2h0RmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbYmFubmVyUHJldmlldywgc2V0QmFubmVyUHJldmlld10gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW21vYmlsZUJhbm5lclByZXZpZXcsIHNldE1vYmlsZUJhbm5lclByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtoaWdobGlnaHRQcmV2aWV3LCBzZXRIaWdobGlnaHRQcmV2aWV3XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyVXBsb2FkaW5nLCBzZXRCYW5uZXJVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttb2JpbGVCYW5uZXJVcGxvYWRpbmcsIHNldE1vYmlsZUJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2hpZ2hsaWdodFVwbG9hZGluZywgc2V0SGlnaGxpZ2h0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCBzZWxlY3RlZENhdGVnb3J5U2x1Z3MgPSBwYXJzZVNsdWdzKHBhcmFtcy5ob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzKVxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmhvbWVCYW5uZXJJbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaG9tZUJhbm5lckltYWdlXSxcbiAgKVxuICBjb25zdCBtb2JpbGVCYW5uZXJJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lTW9iaWxlQmFubmVySW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVNb2JpbGVCYW5uZXJJbWFnZV0sXG4gIClcbiAgY29uc3QgaGlnaGxpZ2h0SW1hZ2VVcmwgPSB1c2VNZW1vKFxuICAgICgpID0+IHJlc29sdmVJbWFnZVVybChwYXJhbXMuaG9tZUhpZ2hsaWdodEltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2VdLFxuICApXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKVxuICAgIGlmIChoYXNoID09PSAnYXBwZWFyYW5jZScpIHtcbiAgICAgIHNldEFjdGl2ZVRhYignY2hhcmdlcycpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGhhc2ggJiYgVEFCUy5zb21lKCh0YWIpID0+IHRhYi5pZCA9PT0gaGFzaCkpIHtcbiAgICAgIHNldEFjdGl2ZVRhYihoYXNoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIGAjJHthY3RpdmVUYWJ9YClcbiAgfSwgW2FjdGl2ZVRhYl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGJhbm5lclByZXZpZXc/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoYmFubmVyUHJldmlldylcbiAgICB9XG4gIH0sIFtiYW5uZXJQcmV2aWV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAobW9iaWxlQmFubmVyUHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChtb2JpbGVCYW5uZXJQcmV2aWV3KVxuICAgIH1cbiAgfSwgW21vYmlsZUJhbm5lclByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChoaWdobGlnaHRQcmV2aWV3Py5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGhpZ2hsaWdodFByZXZpZXcpXG4gICAgfVxuICB9LCBbaGlnaGxpZ2h0UHJldmlld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCwgZmllbGQsIHNldFByZXZpZXcsIHNldEJ1c3ksIGZpbGVSZWYsIHN1Y2Nlc3NNZXNzYWdlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdnZW5lcmFsJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3KGxvY2FsUHJldmlld1VybClcbiAgICBzZXRCdXN5KHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoZmllbGQsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3KHJlc29sdmVJbWFnZVVybChtZWRpYS5wYXRoLCBhcHBVcmwpKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogc3VjY2Vzc01lc3NhZ2UsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ3N1Y2Nlc3MnIHx8IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogJ1NldHRpbmdzIHNhdmVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzLiBQbGVhc2UgdHJ5IGFnYWluLicsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBmbGV4IGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIiBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXRhYnNcIiBtYj1cInhsXCI+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNldHRpbmdzLXRhYiR7YWN0aXZlVGFiID09PSB0YWIuaWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKHRhYi5pZCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RhYi5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPERyYXdlckNvbnRlbnQ+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcigocHJvcGVydHkpID0+XG4gICAgICAgICAgICB0YWIuZmllbGRzLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXBhbmVsXCJcbiAgICAgICAgICAgICAgcD1cInhsXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogYWN0aXZlVGFiID09PSB0YWIuaWQgPyAnYmxvY2snIDogJ25vbmUnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxINCBtYj1cInNtXCI+e3RhYi5sYWJlbH08L0g0PlxuICAgICAgICAgICAgICA8VGV4dCBtYj1cInhsXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnXG4gICAgICAgICAgICAgICAgICA/ICdTaGlwcGluZyBmZWUgYW5kIGhhbmRsaW5nIGNoYXJnZSBhcmUgYWRkZWQgdG8gZXZlcnkgb3JkZXIgb24gdGhlIHdlYnNpdGUgYW5kIHRoZSBhcHAuJ1xuICAgICAgICAgICAgICAgICAgOiB0YWIuaWQgPT09ICdob21lcGFnZSdcbiAgICAgICAgICAgICAgICAgICAgPyAnVGhlc2UgaW1hZ2VzIGFuZCBjYXRlZ29yaWVzIGFwcGVhciBvbiB0aGUgd2Vic2l0ZSBob21lcGFnZS4gQ2xpY2sgU2F2ZSBjaGFuZ2VzIGFmdGVyIHVwbG9hZGluZy4nXG4gICAgICAgICAgICAgICAgICAgIDogJ1VwZGF0ZSB5b3VyIHN0b3JlIHNldHRpbmdzIGFuZCBjbGljayBTYXZlIGNoYW5nZXMgYmVsb3cuJ31cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICB7dGFiLmlkID09PSAnY2hhcmdlcycgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFyZ2VzLWZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBTaGlwcGluZyBmZWUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5zaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ3NoaXBwaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkRlbGl2ZXJ5IGNoYXJnZSBhZGRlZCB0byBldmVyeSBvcmRlcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIEhhbmRsaW5nIGNoYXJnZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmhhbmRsaW5nRmVlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnaGFuZGxpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+Q2FydCBoYW5kbGluZyBmZWUgYWRkZWQgdG8gZXZlcnkgb3JkZXI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktaG9tZXBhZ2UtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkhvbWUgYmFubmVyIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIkRlc2t0b3AgLyBsYXJnZS1zY3JlZW4gaGVybyBiYW5uZXIuIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtiYW5uZXJJbWFnZVVybH1cbiAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17YmFubmVyUHJldmlld31cbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nPXtiYW5uZXJVcGxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWY9e2Jhbm5lckZpbGVSZWZ9XG4gICAgICAgICAgICAgICAgICAgIHdpZGVcbiAgICAgICAgICAgICAgICAgICAgb25VcGxvYWQ9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hvbWVCYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCYW5uZXJQcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVyRmlsZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICdCYW5uZXIgaW1hZ2UgdXBsb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiSG9tZSBtb2JpbGUgYmFubmVyIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIlNob3duIG9uIHBob25lcy4gSWYgZW1wdHksIHRoZSBkZXNrdG9wIGJhbm5lciBpcyB1c2VkIGluc3RlYWQuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e21vYmlsZUJhbm5lckltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXttb2JpbGVCYW5uZXJQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e21vYmlsZUJhbm5lclVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17bW9iaWxlQmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgb25VcGxvYWQ9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hvbWVNb2JpbGVCYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2JpbGVCYW5uZXJQcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0TW9iaWxlQmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlQmFubmVyRmlsZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICdNb2JpbGUgYmFubmVyIGltYWdlIHVwbG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkZydWl0IGhpZ2hsaWdodCBpbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGhpbnQ9XCJSZXBsYWNlcyB0aGUga2l3aSBpbWFnZSBpbiDigJxUaGUgU21hbGwgRnJ1aXQgd2l0aCBhIEJpZyBQdW5jaOKAnSBvbiB0aGUgd2Vic2l0ZS5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aGlnaGxpZ2h0SW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e2hpZ2hsaWdodFByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17aGlnaGxpZ2h0VXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXtoaWdobGlnaHRGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUhpZ2hsaWdodEltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhpZ2hsaWdodFByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIaWdobGlnaHRVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0hpZ2hsaWdodCBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBIb21lcGFnZSBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnNsdWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCB8fCBpdGVtLnRpdGxlIHx8IGl0ZW0uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2F0ZWdvcnlTbHVnc31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHNsdWdzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKCdob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzJywgSlNPTi5zdHJpbmdpZnkoc2x1Z3MpKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbmQgc2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgVGhlc2UgY2F0ZWdvcmllcyBsb2FkIG9uIHRoZSB3ZWJzaXRlIGFmdGVyIHRoZSBmcnVpdCBoaWdobGlnaHQgc2VjdGlvbiwgb25lIGF0XG4gICAgICAgICAgICAgICAgICAgICAgYSB0aW1lIGFzIHRoZSB2aXNpdG9yIHNjcm9sbHMuXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9EcmF3ZXJDb250ZW50PlxuXG4gICAgICA8RHJhd2VyRm9vdGVyPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY2hhbmdlc1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRHJhd2VyRm9vdGVyPlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHBhZChudW0pIHtcbiAgcmV0dXJuIFN0cmluZyhudW0pLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRldGltZVZhbHVlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtwYWQoZGF0ZS5nZXRNb250aCgpICsgMSl9LSR7cGFkKGRhdGUuZ2V0RGF0ZSgpKX1UJHtwYWQoZGF0ZS5nZXRIb3VycygpKX06JHtwYWQoZGF0ZS5nZXRNaW51dGVzKCkpfWBcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXk6ICcyLWRpZ2l0JyxcbiAgICBtb250aDogJ3Nob3J0JyxcbiAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgaG91cjogJzItZGlnaXQnLFxuICAgIG1pbnV0ZTogJzItZGlnaXQnLFxuICB9KVxufVxuXG5mdW5jdGlvbiB1c2VBbmNob3JlZE1lbnUob3Blbikge1xuICBjb25zdCB3cmFwUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtvcGVuVXAsIHNldE9wZW5VcF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdyYXBSZWYuY3VycmVudFxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBzcGFjZUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b21cbiAgICAgIHNldE9wZW5VcChzcGFjZUJlbG93IDwgMjQwICYmIHJlY3QudG9wID4gc3BhY2VCZWxvdylcbiAgICB9XG5cbiAgICB1cGRhdGUoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgfVxuICB9LCBbb3Blbl0pXG5cbiAgcmV0dXJuIHsgd3JhcFJlZiwgb3BlblVwIH1cbn1cblxuZnVuY3Rpb24gQ2hvaWNlQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIEFuY2hvcmVkU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudCl9PlxuICAgICAgICA8c3Bhbj57c2VsZWN0ZWQ/LmxhYmVsIHx8IHBsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIHtvcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWV9XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2l0ZW0udmFsdWUgPT09IHZhbHVlID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFNlYXJjaGFibGVNdWx0aVNlbGVjdCh7IG9wdGlvbnMsIHNlbGVjdGVkLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHNlYXJjaFBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTZXQgPSB1c2VNZW1vKCgpID0+IG5ldyBTZXQoc2VsZWN0ZWQpLCBbc2VsZWN0ZWRdKVxuICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT4gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpKVxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgY29uc3QgdG9nZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkU2V0Lmhhcyh2YWx1ZSkpIG9uQ2hhbmdlKHNlbGVjdGVkLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gdmFsdWUpKVxuICAgIGVsc2Ugb25DaGFuZ2UoWy4uLnNlbGVjdGVkLCB2YWx1ZV0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHZhbHVlKSA9PiAhdmFsdWUpfT5cbiAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcHNcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcFwiPlxuICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDDl1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyXCI+e3BsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFF1ZXJ5KGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VhcmNoUGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2NoZWNrZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9eygpID0+IHRvZ2dsZShpdGVtLnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBEYXRlVGltZVBpY2tlcih7IHZhbHVlLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBwYXJzZWQgPSB2YWx1ZSA/IG5ldyBEYXRlKHZhbHVlKSA6IG51bGxcbiAgY29uc3QgdmFsaWQgPSBwYXJzZWQgJiYgIU51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSA/IHBhcnNlZCA6IG51bGxcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttb250aERhdGUsIHNldE1vbnRoRGF0ZV0gPSB1c2VTdGF0ZSh2YWxpZCB8fCBuZXcgRGF0ZSgpKVxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKHZhbGlkID8gcGFkKHZhbGlkLmdldEhvdXJzKCkpIDogJzAwJylcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0TWludXRlcygpKSA6ICcwMCcpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXZhbGlkKSByZXR1cm5cbiAgICBzZXRNb250aERhdGUodmFsaWQpXG4gICAgc2V0SG91cnMocGFkKHZhbGlkLmdldEhvdXJzKCkpKVxuICAgIHNldE1pbnV0ZXMocGFkKHZhbGlkLmdldE1pbnV0ZXMoKSkpXG4gIH0sIFt2YWx1ZV0pXG5cbiAgY29uc3QgeWVhciA9IG1vbnRoRGF0ZS5nZXRGdWxsWWVhcigpXG4gIGNvbnN0IG1vbnRoID0gbW9udGhEYXRlLmdldE1vbnRoKClcbiAgY29uc3QgZmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSkuZ2V0RGF5KClcbiAgY29uc3QgdG90YWxEYXlzID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKS5nZXREYXRlKClcbiAgY29uc3QgY2VsbHMgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0RGF5OyBpICs9IDEpIGNlbGxzLnB1c2gobnVsbClcbiAgZm9yIChsZXQgZGF5ID0gMTsgZGF5IDw9IHRvdGFsRGF5czsgZGF5ICs9IDEpIGNlbGxzLnB1c2goZGF5KVxuXG4gIGNvbnN0IGFwcGx5ID0gKGRheSwgbmV4dEhvdXJzID0gaG91cnMsIG5leHRNaW51dGVzID0gbWludXRlcykgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBgJHt5ZWFyfS0ke3BhZChtb250aCArIDEpfS0ke3BhZChkYXkpfVQke3BhZChOdW1iZXIobmV4dEhvdXJzKSB8fCAwKX06JHtwYWQoTnVtYmVyKG5leHRNaW51dGVzKSB8fCAwKX1gXG4gICAgb25DaGFuZ2UobmV4dClcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkRGF5ID1cbiAgICB2YWxpZCAmJiB2YWxpZC5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmIHZhbGlkLmdldE1vbnRoKCkgPT09IG1vbnRoID8gdmFsaWQuZ2V0RGF0ZSgpIDogbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyXCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPnt2YWxpZCA/IGZvcm1hdERhdGV0aW1lTGFiZWwodmFsaWQpIDogcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3Bhbj7wn5OFPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1kYXRlcGlja2VyLXBvcCR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItbmF2XCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHN0cm9uZz5cbiAgICAgICAgICAgICAge21vbnRoRGF0ZS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1vbnRoOiAnbG9uZycsIHllYXI6ICdudW1lcmljJyB9KX1cbiAgICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0TW9udGhEYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSkpfT5cbiAgICAgICAgICAgICAg4oC6XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItd2Vla1wiPlxuICAgICAgICAgICAge1snU3UnLCAnTW8nLCAnVHUnLCAnV2UnLCAnVGgnLCAnRnInLCAnU2EnXS5tYXAoKGxhYmVsKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17bGFiZWx9PntsYWJlbH08L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItZ3JpZFwiPlxuICAgICAgICAgICAge2NlbGxzLm1hcCgoZGF5LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgZGF5ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGtleT17YCR7eWVhcn0tJHttb250aH0tJHtkYXl9YH1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzZWxlY3RlZERheSA9PT0gZGF5ID8gJ2lzLXNlbGVjdGVkJyA6ICcnfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gYXBwbHkoZGF5KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7ZGF5fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT17YGVtcHR5LSR7aW5kZXh9YH0gLz5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLXRpbWVcIj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgSG91clxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCIyM1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2hvdXJzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oMjMsIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldEhvdXJzKG5leHQpXG4gICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXkpIGFwcGx5KHNlbGVjdGVkRGF5LCBuZXh0LCBtaW51dGVzKVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBNaW51dGVcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiNTlcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXttaW51dGVzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oNTksIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldE1pbnV0ZXMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIGhvdXJzLCBuZXh0KVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jbGVhclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSgnJylcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDbGVhclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgQ291cG9uRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG5cbiAgY29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSlcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLnRhcmdldFNsdWdzKVxuICBjb25zdCB0YXJnZXRUeXBlID0gcGFyYW1zLnRhcmdldFR5cGUgfHwgJ2FsbCdcbiAgY29uc3QgYXBwbHlPbiA9IHBhcmFtcy5hcHBseU9uIHx8ICdjYXJ0J1xuICBjb25zdCB1c2FnZVR5cGUgPSBwYXJhbXMudXNhZ2VUeXBlIHx8ICd1bmxpbWl0ZWQnXG4gIGNvbnN0IGNvdXBvblR5cGUgPSBwYXJhbXMudHlwZSB8fCAncGVyY2VudCdcbiAgY29uc3QgaXNBY3RpdmUgPSBwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG5cbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkQ2F0YWxvZygpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5RGF0YSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICBjb25zdCBhbGxQcm9kdWN0cyA9IFtdXG4gICAgICAgIGxldCBwYWdlID0gMVxuICAgICAgICBsZXQgaGFzTW9yZSA9IHRydWVcbiAgICAgICAgd2hpbGUgKGhhc01vcmUgJiYgcGFnZSA8PSAyMCkge1xuICAgICAgICAgIGNvbnN0IHByb2R1Y3REYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vcHJvZHVjdHM/cGFnZT0ke3BhZ2V9JmxpbWl0PTEwMGApLnRoZW4oKHJlc3BvbnNlKSA9PlxuICAgICAgICAgICAgcmVzcG9uc2UuanNvbigpLFxuICAgICAgICAgIClcbiAgICAgICAgICBhbGxQcm9kdWN0cy5wdXNoKC4uLihwcm9kdWN0RGF0YS5wcm9kdWN0cyB8fCBbXSkpXG4gICAgICAgICAgaGFzTW9yZSA9IEJvb2xlYW4ocHJvZHVjdERhdGEuaGFzTW9yZSlcbiAgICAgICAgICBwYWdlICs9IDFcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgc2V0UHJvZHVjdHMoYWxsUHJvZHVjdHMpXG4gICAgICAgIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShjYXRlZ29yeURhdGEpID8gY2F0ZWdvcnlEYXRhIDogW10pXG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHtcbiAgICAgICAgICBzZXRQcm9kdWN0cyhbXSlcbiAgICAgICAgICBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9hZENhdGFsb2coKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgc2V0U2VsZWN0ZWRTbHVncyA9IChuZXh0KSA9PiBzZXRGaWVsZCgndGFyZ2V0U2x1Z3MnLCBKU09OLnN0cmluZ2lmeShuZXh0KSlcblxuICBjb25zdCBwcm9kdWN0T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcHJvZHVjdHMubWFwKChpdGVtKSA9PiAoeyB2YWx1ZTogaXRlbS5zbHVnLCBsYWJlbDogaXRlbS5uYW1lIH0pKSxcbiAgICBbcHJvZHVjdHNdLFxuICApXG4gIGNvbnN0IGNhdGVnb3J5T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gY2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKSxcbiAgICBbY2F0ZWdvcmllc10sXG4gIClcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY291cG9uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3Vwb24gc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY291cG9uLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj5DcmVhdGUgYSBzdG9yZSBjb3Vwb248L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgU2V0IHdobyBnZXRzIHRoZSBkaXNjb3VudCwgd2hlcmUgaXQgYXBwbGllcywgYW5kIGhvdyBtYW55IHRpbWVzIGl0IGNhbiBiZSB1c2VkLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Db3Vwb24gY29kZTwvaDQ+XG4gICAgICAgICAgPHA+Q3VzdG9tZXJzIHdpbGwgdHlwZSB0aGlzIGF0IGNoZWNrb3V0IG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9wPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLWNvdXBvbi1jb2RlXCJcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXRUxDT01FMTBcIlxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdG9nZ2xlXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIGV2ZW50LnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICBDb3Vwb24gaXMgYWN0aXZlXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkRpc2NvdW50PC9oND5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAncGVyY2VudCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiUGVyY2VudCBvZmZcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiAxMCUgb2ZmXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3R5cGUnLCAncGVyY2VudCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAnZmxhdCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiRmxhdCBhbW91bnRcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiDigrk1MCBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdmbGF0Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIHtjb3Vwb25UeXBlID09PSAncGVyY2VudCcgPyAnUGVyY2VudCB2YWx1ZScgOiAnQW1vdW50ICjigrkpJ31cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy52YWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWluIGNhcnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5taW5DYXJ0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdtaW5DYXJ0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWF4IGRpc2NvdW50ICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubWF4RGlzY291bnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21heERpc2NvdW50JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk5vIGNhcFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkFwcGx5IGRpc2NvdW50IG9uPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnY2FydCd9XG4gICAgICAgICAgICB0aXRsZT1cIkNhcnQgdG90YWxcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSB0aGUgaXRlbXMgc3VidG90YWxcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnY2FydCcpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnc2hpcHBpbmcnfVxuICAgICAgICAgICAgdGl0bGU9XCJTaGlwcGluZyBmZWVcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSBkZWxpdmVyeSBjaGFyZ2VzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdhcHBseU9uJywgJ3NoaXBwaW5nJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5XaG8gY2FuIGdldCB0aGlzIGRpc2NvdW50PC9oND5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIEFwcGx5IHRvXG4gICAgICAgICAgPEFuY2hvcmVkU2VsZWN0XG4gICAgICAgICAgICB2YWx1ZT17dGFyZ2V0VHlwZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIHdobyB0aGlzIGNvdXBvbiBhcHBsaWVzIHRvXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICBzZXRGaWVsZCgndGFyZ2V0VHlwZScsIG5leHQpXG4gICAgICAgICAgICAgIHNldFNlbGVjdGVkU2x1Z3MoW10pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICB7IHZhbHVlOiAnYWxsJywgbGFiZWw6ICdBbGwgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdwcm9kdWN0cycsIGxhYmVsOiAnU2VsZWN0ZWQgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdjYXRlZ29yaWVzJywgbGFiZWw6ICdTZWxlY3RlZCBjYXRlZ29yaWVzJyB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAncHJvZHVjdHMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFByb2R1Y3RzXG4gICAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3Byb2R1Y3RPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHByb2R1Y3RzXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcHJvZHVjdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7dGFyZ2V0VHlwZSA9PT0gJ2NhdGVnb3JpZXMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENhdGVnb3JpZXNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcnlPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+VXNhZ2U8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3VubGltaXRlZCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiVW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgaGludD1cIkN1c3RvbWVycyBjYW4gcmV1c2UgaXRcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3VubGltaXRlZCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXt1c2FnZVR5cGUgPT09ICdzaW5nbGUnfVxuICAgICAgICAgICAgICB0aXRsZT1cIlNpbmdsZSB1c2VcIlxuICAgICAgICAgICAgICBoaW50PVwiT25lIHVzZSBwZXIgY3VzdG9tZXJcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3NpbmdsZScpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJyA/IChcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgT3B0aW9uYWwgZ2xvYmFsIGNhcFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudXNhZ2VMaW1pdCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndXNhZ2VMaW1pdCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJMZWF2ZSBibGFuayBmb3IgdW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0PkVhY2ggbG9nZ2VkLWluIGN1c3RvbWVyIGNhbiB1c2UgdGhpcyBjb3Vwb24gb25jZS48L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7cGFyYW1zLnVzZWRDb3VudCA/IDxUZXh0IG10PVwiZGVmYXVsdFwiPlVzZWQge3BhcmFtcy51c2VkQ291bnR9IHRpbWUocykgc28gZmFyLjwvVGV4dD4gOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+U2NoZWR1bGU8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXJ0cyBhdFxuICAgICAgICAgICAgPERhdGVUaW1lUGlja2VyXG4gICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGV0aW1lVmFsdWUocGFyYW1zLnN0YXJ0c0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnc3RhcnRzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBzdGFydCBkYXRlIGFuZCB0aW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBFeHBpcmVzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuZXhwaXJlc0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnZXhwaXJlc0F0JywgbmV4dCB8fCBudWxsKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgZXhwaXJ5IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY291cG9uXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ291cG9uRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFNlYXJjaGFibGVTZWxlY3QsIHVzZUFuY2hvcmVkTWVudSB9IGZyb20gJy4vZm9ybS1jb250cm9scydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IEZVTEZJTExNRU5UID0gW1xuICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnV2FpdGluZyBmb3IgZnVsZmlsbG1lbnQnIH0sXG4gIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQcm9jZXNzaW5nJyB9LFxuICB7IHZhbHVlOiAncGFja2VkJywgbGFiZWw6ICdQYWNrZWQnIH0sXG4gIHsgdmFsdWU6ICdzaGlwcGVkJywgbGFiZWw6ICdTaGlwcGVkJyB9LFxuICB7IHZhbHVlOiAnZGVsaXZlcmVkJywgbGFiZWw6ICdEZWxpdmVyZWQnIH0sXG4gIHsgdmFsdWU6ICdjYW5jZWxsZWQnLCBsYWJlbDogJ0NhbmNlbGxlZCcgfSxcbl1cblxuY29uc3QgUEFZTUVOVF9PUFRJT05TID0gW1xuICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycgfSxcbiAgeyB2YWx1ZTogJ3BhaWQnLCBsYWJlbDogJ1BhaWQnIH0sXG4gIHsgdmFsdWU6ICdmYWlsZWQnLCBsYWJlbDogJ0ZhaWxlZCcgfSxcbiAgeyB2YWx1ZTogJ3JlZnVuZGVkJywgbGFiZWw6ICdSZWZ1bmRlZCcgfSxcbl1cblxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGFtb3VudCkpIHJldHVybiAn4oK5MCdcbiAgcmV0dXJuIGDigrkke2Ftb3VudC50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KX1gXG59XG5cbmNvbnN0IGZvcm1hdERhdGVUaW1lID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICByZXR1cm4gbmV3IERhdGUodmFsdWUpLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXRlU3R5bGU6ICdtZWRpdW0nLFxuICAgIHRpbWVTdHlsZTogJ3Nob3J0JyxcbiAgfSlcbn1cblxuY29uc3QgcmVzb2x2ZUltYWdlID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QodmFsdWUpKSByZXR1cm4gdmFsdWVcbiAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJy8nKSkgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHt2YWx1ZX1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBNb3JlTWVudSh7IHVucGFpZCwgYnVzeSwgb25DYXNoLCBvblFyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgaWYgKCF1bnBhaWQpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1vcmVcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICBNb3JlIGFjdGlvbnNcbiAgICAgICAgPHNwYW4+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItbW9yZS1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4oYnVzeSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIG9uQ2FzaCgpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtidXN5ID09PSAnY29sbGVjdENhc2gnID8gJ1NhdmluZ+KApicgOiAnTWFyayBjYXNoIGNvbGxlY3RlZCd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihidXN5KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgb25RcigpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtidXN5ID09PSAnZ2VuZXJhdGVRcicgPyAnQ3JlYXRpbmfigKYnIDogJ0dlbmVyYXRlIHBheW1lbnQgUVInfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIHNuYXBzaG90KHBhcmFtcyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzIHx8ICcnLFxuICAgIHBheW1lbnRTdGF0dXM6IHBhcmFtcy5wYXltZW50U3RhdHVzIHx8ICcnLFxuICAgIGRlbGl2ZXJ5UGFydG5lcklkOiBwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJycsXG4gICAgY29udGFjdE5hbWU6IHBhcmFtcy5jb250YWN0TmFtZSB8fCAnJyxcbiAgICBjb250YWN0UGhvbmU6IHBhcmFtcy5jb250YWN0UGhvbmUgfHwgJycsXG4gICAgYWRkcmVzc0xpbmUxOiBwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnLFxuICAgIGFkZHJlc3NMaW5lMjogcGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJyxcbiAgICBhZGRyZXNzQ2l0eTogcGFyYW1zLmFkZHJlc3NDaXR5IHx8ICcnLFxuICAgIGFkZHJlc3NTdGF0ZTogcGFyYW1zLmFkZHJlc3NTdGF0ZSB8fCAnJyxcbiAgICBhZGRyZXNzUGluY29kZTogcGFyYW1zLmFkZHJlc3NQaW5jb2RlIHx8ICcnLFxuICAgIGFkZHJlc3NMYW5kbWFyazogcGFyYW1zLmFkZHJlc3NMYW5kbWFyayB8fCAnJyxcbiAgfVxufVxuXG5jb25zdCBPcmRlckRldGFpbCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0LCBsb2FkaW5nLCBzZXRSZWNvcmQgfSA9IHVzZVJlY29yZChpbml0aWFsUmVjb3JkLCByZXNvdXJjZS5pZClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYWN0aW9uQnVzeSwgc2V0QWN0aW9uQnVzeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfV0pXG4gIGNvbnN0IFtiYXNlbGluZSwgc2V0QmFzZWxpbmVdID0gdXNlU3RhdGUoKCkgPT4gc25hcHNob3QoaW5pdGlhbFJlY29yZD8ucGFyYW1zKSlcbiAgY29uc3QgW2VkaXRDb250YWN0LCBzZXRFZGl0Q29udGFjdF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2VkaXRBZGRyZXNzLCBzZXRFZGl0QWRkcmVzc10gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhY3Rpb24/Lm5hbWUgIT09ICdzaG93JykgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGNvbnN0IG5leHQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvc2hvd1xcLz8kLywgJy9lZGl0JylcbiAgICBpZiAobmV4dCAhPT0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShuZXh0KVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSwgW2FjdGlvbj8ubmFtZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhbXG4gICAgICAgICAgeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfSxcbiAgICAgICAgICAuLi5yZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLnBhcmFtcz8uaXNBY3RpdmUgPT09IGZhbHNlXG4gICAgICAgICAgICAgID8gYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYFxuICAgICAgICAgICAgICA6IGl0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJyxcbiAgICAgICAgICB9KSksXG4gICAgICAgIF0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldFBhcnRuZXJzKFt7IHZhbHVlOiAnJywgbGFiZWw6ICdVbmFzc2lnbmVkJyB9XSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGl0ZW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocGFyYW1zLml0ZW1zSnNvbiB8fCAnW10nKVxuICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+ICh7IC4uLml0ZW0sIGltYWdlOiByZXNvbHZlSW1hZ2UoaXRlbS5pbWFnZSkgfSkpXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH0sIFtwYXJhbXMuaXRlbXNKc29uXSlcblxuICBjb25zdCBjdXJyZW50ID0gc25hcHNob3QocGFyYW1zKVxuICBjb25zdCBkaXJ0eSA9IE9iamVjdC5rZXlzKGN1cnJlbnQpLnNvbWUoKGtleSkgPT4gY3VycmVudFtrZXldICE9PSBiYXNlbGluZVtrZXldKVxuICBjb25zdCBsaXN0VXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL3JlY29yZHNcXC8uKiQvLCAnJylcbiAgY29uc3QgdW5wYWlkID0gcGFyYW1zLnBheW1lbnRTdGF0dXMgIT09ICdwYWlkJ1xuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgcGhvbmUgPSBTdHJpbmcocGFyYW1zLmNvbnRhY3RQaG9uZSB8fCAnJykucmVwbGFjZSgvXFxEL2csICcnKVxuICAgIGNvbnN0IHBpbiA9IFN0cmluZyhwYXJhbXMuYWRkcmVzc1BpbmNvZGUgfHwgJycpLnJlcGxhY2UoL1xcRC9nLCAnJylcbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuY29udGFjdE5hbWUgfHwgJycpLnRyaW0oKSB8fCBwaG9uZS5sZW5ndGggPCAxMCkge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0VudGVyIHRoZSBjdXN0b21lciBuYW1lIGFuZCBhIDEwLWRpZ2l0IGNvbnRhY3QgbnVtYmVyLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnKS50cmltKCkgfHwgIVN0cmluZyhwYXJhbXMuYWRkcmVzc0NpdHkgfHwgJycpLnRyaW0oKSB8fCAhU3RyaW5nKHBhcmFtcy5hZGRyZXNzU3RhdGUgfHwgJycpLnRyaW0oKSB8fCBwaW4ubGVuZ3RoICE9PSA2KSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnRW50ZXIgdGhlIGhvdXNlLCBjaXR5LCBzdGF0ZSwgYW5kIGEgNi1kaWdpdCBwaW5jb2RlLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzdWJtaXQoKVxuICAgICAgY29uc3QgbmV4dCA9IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQ/LnBhcmFtc1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QobmV4dCkpXG4gICAgICAgIHNldEVkaXRDb250YWN0KGZhbHNlKVxuICAgICAgICBzZXRFZGl0QWRkcmVzcyhmYWxzZSlcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJ1blBheW1lbnRBY3Rpb24gPSBhc3luYyAoYWN0aW9uTmFtZSkgPT4ge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnY29sbGVjdENhc2gnICYmICF3aW5kb3cuY29uZmlybSgnTWFyayB0aGlzIG9yZGVyIGFzIHBhaWQgaW4gY2FzaD8nKSkgcmV0dXJuXG4gICAgc2V0QWN0aW9uQnVzeShhY3Rpb25OYW1lKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZSxcbiAgICAgIH0pXG4gICAgICBpZiAocmVzcG9uc2UuZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgIHNldFJlY29yZChyZXNwb25zZS5kYXRhLnJlY29yZClcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QocmVzcG9uc2UuZGF0YS5yZWNvcmQucGFyYW1zKSlcbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZShyZXNwb25zZS5kYXRhPy5ub3RpY2UgfHwgeyBtZXNzYWdlOiAnVXBkYXRlZC4nLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwZGF0ZSBwYXltZW50LicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QWN0aW9uQnVzeSgnJylcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uPy5uYW1lID09PSAnc2hvdycpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc3RhdHVzTGFiZWwgPSBGVUxGSUxMTUVOVC5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSBwYXJhbXMuc3RhdHVzKT8ubGFiZWwgfHwgJ1dhaXRpbmcgZm9yIGZ1bGZpbGxtZW50J1xuICBjb25zdCByZXN0b3JlRmllbGRzID0gKGtleXMsIGNsb3NlKSA9PiB7XG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IGhhbmRsZUNoYW5nZShrZXksIGJhc2VsaW5lW2tleV0gfHwgJycpKVxuICAgIGNsb3NlKGZhbHNlKVxuICB9XG4gIGNvbnN0IGFkZHJlc3NUZXh0ID0gW1xuICAgIHBhcmFtcy5hZGRyZXNzTGluZTEsXG4gICAgcGFyYW1zLmFkZHJlc3NMaW5lMixcbiAgICBbcGFyYW1zLmFkZHJlc3NDaXR5LCBwYXJhbXMuYWRkcmVzc1N0YXRlLCBwYXJhbXMuYWRkcmVzc1BpbmNvZGVdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpLFxuICAgIHBhcmFtcy5hZGRyZXNzTGFuZG1hcmsgPyBgTGFuZG1hcms6ICR7cGFyYW1zLmFkZHJlc3NMYW5kbWFya31gIDogJycsXG4gIF0uZmlsdGVyKEJvb2xlYW4pXG4gIGNvbnN0IHBheW1lbnRMYWJlbCA9IFBBWU1FTlRfT1BUSU9OUy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSBwYXJhbXMucGF5bWVudFN0YXR1cyk/LmxhYmVsIHx8ICdQZW5kaW5nJ1xuICBjb25zdCBwYXJ0bmVyTmFtZSA9IHBhcmFtcy5kZWxpdmVyeVBhcnRuZXJOYW1lXG4gICAgPyBgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyTmFtZX0ke3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJQaG9uZSA/IGAgwrcgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyUGhvbmV9YCA6ICcnfWBcbiAgICA6ICdObyBkZWxpdmVyeSBwYXJ0bmVyIHlldCdcbiAgY29uc3QgaXRlbUNvdW50ID0gaXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIE51bWJlcihpdGVtLnF1YW50aXR5IHx8IDApLCAwKVxuXG4gIHJldHVybiAoXG4gICAgPGZvcm0gY2xhc3NOYW1lPVwidG9rcmktb3JkZXJcIiBvblN1Ym1pdD17aGFuZGxlU2F2ZX0+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRpdGxlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYmFja1wiIGhyZWY9e2xpc3RVcmx9IGFyaWEtbGFiZWw9XCJCYWNrIHRvIG9yZGVyc1wiPuKGkDwvYT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aXRsZS1yb3dcIj5cbiAgICAgICAgICAgICAgPGgyPiN7cGFyYW1zLm9yZGVyTm99PC9oMj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31gfT57cGF5bWVudExhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfWB9PntzdGF0dXNMYWJlbH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwPntmb3JtYXREYXRlVGltZShwYXJhbXMuY3JlYXRlZEF0KX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWFjdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNhdmVcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9eyFkaXJ0eSB8fCBsb2FkaW5nIHx8IHNhdmluZ30+XG4gICAgICAgICAgICB7c2F2aW5nID8gJ1NhdmluZ+KApicgOiAnU2F2ZSd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPE1vcmVNZW51XG4gICAgICAgICAgICB1bnBhaWQ9e3VucGFpZH1cbiAgICAgICAgICAgIGJ1c3k9e2FjdGlvbkJ1c3l9XG4gICAgICAgICAgICBvbkNhc2g9eygpID0+IHJ1blBheW1lbnRBY3Rpb24oJ2NvbGxlY3RDYXNoJyl9XG4gICAgICAgICAgICBvblFyPXsoKSA9PiBydW5QYXltZW50QWN0aW9uKCdnZW5lcmF0ZVFyJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1sYXlvdXRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tYWluXCI+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkLWhlYWRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItbWFyayBpcy0ke3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfWB9IC8+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57c3RhdHVzTGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW1Db3VudH0ge2l0ZW1Db3VudCA9PT0gMSA/ICdpdGVtJyA6ICdpdGVtcyd9IMK3IHtwYXJ0bmVyTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17RlVMRklMTE1FTlR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ3N0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2l0ZW1zLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZW1wdHlcIj5ObyBpdGVtcyBvbiB0aGlzIG9yZGVyLjwvcD5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iLXdyYXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pbWFnZSA/IDxpbWcgc3JjPXtpdGVtLmltYWdlfSBhbHQ9XCJcIiAvPiA6IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iXCIgLz59XG4gICAgICAgICAgICAgICAgICAgICAgPGVtPntpdGVtLnF1YW50aXR5fTwvZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2l0ZW0ubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS53ZWlnaHQgPyA8c3Bhbj57aXRlbS53ZWlnaHR9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xdHlcIj57Zm9ybWF0TW9uZXkoaXRlbS5wcmljZVZhbHVlKX0gw5cge2l0ZW0ucXVhbnRpdHl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8Yj57Zm9ybWF0TW9uZXkoaXRlbS5saW5lVG90YWwpfTwvYj5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZC1oZWFkXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1hcmsgaXMtJHtwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAncGVuZGluZyd9YH0gLz5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXltZW50TGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e3BhcmFtcy5wYXltZW50TWV0aG9kIHx8ICdDYXNoIG9uIGRlbGl2ZXJ5J308L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1BBWU1FTlRfT1BUSU9OU31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGhhbmRsZUNoYW5nZSgncGF5bWVudFN0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvdGFsc1wiPlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5TdWJ0b3RhbDwvZHQ+PGRkPntpdGVtQ291bnR9IHtpdGVtQ291bnQgPT09IDEgPyAnaXRlbScgOiAnaXRlbXMnfTwvZGQ+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaXRlbXNUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48ZHQ+RGVsaXZlcnk8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLmRlbGl2ZXJ5Q2hhcmdlKX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5IYW5kbGluZzwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaGFuZGxpbmdDaGFyZ2UpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLnNtYWxsQ2FydENoYXJnZSkgPiAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXY+PGR0PlNtYWxsIGNhcnQ8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLnNtYWxsQ2FydENoYXJnZSl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLmRpc2NvdW50KSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj48ZHQ+RGlzY291bnR7cGFyYW1zLmNvdXBvbkNvZGUgPyBgIMK3ICR7cGFyYW1zLmNvdXBvbkNvZGV9YCA6ICcnfTwvZHQ+PGRkIC8+PGRkPi17Zm9ybWF0TW9uZXkocGFyYW1zLmRpc2NvdW50KX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpcy10b3RhbFwiPjxkdD5Ub3RhbDwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNvbGxlY3RlZFwiPlxuICAgICAgICAgICAgICA8c3Bhbj57cGFyYW1zLnBheW1lbnRTdGF0dXMgPT09ICdwYWlkJyA/ICdQYWlkIGJ5IGN1c3RvbWVyJyA6ICdTdGlsbCB0byBjb2xsZWN0J308L3NwYW4+XG4gICAgICAgICAgICAgIDxiPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7cGFyYW1zLnBheW1lbnRDb2xsZWN0ZWRBcyA/IDxwIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1ldGFcIj5Db2xsZWN0ZWQgYXMge3BhcmFtcy5wYXltZW50Q29sbGVjdGVkQXN9PC9wPiA6IG51bGx9XG4gICAgICAgICAgICB7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkID8gPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbWV0YVwiPlBheW1lbnQgSUQge3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZH08L3A+IDogbnVsbH1cbiAgICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlRclVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xclwiIHNyYz17cGFyYW1zLnJhem9ycGF5UXJVcmx9IGFsdD1cIkRvb3JzdGVwIHBheW1lbnQgUVJcIiAvPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8YXNpZGUgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2lkZVwiPlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoMz5DdXN0b21lcjwvaDM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5Db250YWN0PC9oND5cbiAgICAgICAgICAgICAge2VkaXRDb250YWN0ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFsnY29udGFjdE5hbWUnLCAnY29udGFjdFBob25lJ10sIHNldEVkaXRDb250YWN0KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCIgb25DbGljaz17KCkgPT4gc2V0RWRpdENvbnRhY3QodHJ1ZSl9PlxuICAgICAgICAgICAgICAgICAgRWRpdFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ZWRpdENvbnRhY3QgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdC1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGFjdE5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdE5hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgUGhvbmUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb250YWN0UGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdFBob25lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXJlYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXJhbXMuY29udGFjdE5hbWUgfHwgJ+KAlCd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHA+e3BhcmFtcy5jb250YWN0UGhvbmUgPyBgKzkxICR7cGFyYW1zLmNvbnRhY3RQaG9uZX1gIDogJ+KAlCd9PC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5TaGlwcGluZyBhZGRyZXNzPC9oND5cbiAgICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFxuICAgICAgICAgICAgICAgICAgICBbJ2FkZHJlc3NMaW5lMScsICdhZGRyZXNzTGluZTInLCAnYWRkcmVzc0NpdHknLCAnYWRkcmVzc1N0YXRlJywgJ2FkZHJlc3NQaW5jb2RlJywgJ2FkZHJlc3NMYW5kbWFyayddLFxuICAgICAgICAgICAgICAgICAgICBzZXRFZGl0QWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiIG9uQ2xpY2s9eygpID0+IHNldEVkaXRBZGRyZXNzKHRydWUpfT5cbiAgICAgICAgICAgICAgICAgIEVkaXRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXQtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBIb3VzZSAvIGZsYXRcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NMaW5lMScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBTdHJlZXQgLyBhcmVhXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYWRkcmVzcy1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzQ2l0eSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NDaXR5JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgU3RhdGVcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc1N0YXRlIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc1N0YXRlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzUGluY29kZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NQaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgTGFuZG1hcmtcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xhbmRtYXJrIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0xhbmRtYXJrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yZWFkXCI+XG4gICAgICAgICAgICAgICAge2FkZHJlc3NUZXh0Lmxlbmd0aCA/IGFkZHJlc3NUZXh0Lm1hcCgobGluZSkgPT4gPHAga2V5PXtsaW5lfT57bGluZX08L3A+KSA6IDxwPuKAlDwvcD59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxoND5EZWxpdmVyeSBwYXJ0bmVyPC9oND5cbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJyd9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3BhcnRuZXJzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ2RlbGl2ZXJ5UGFydG5lcklkJywgdmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlVuYXNzaWduZWRcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwYXJ0bmVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9hc2lkZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBPcmRlckRldGFpbFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIElucHV0LCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBFeWVJY29uID0gKHsgaGlkZGVuIH0pID0+XG4gIGhpZGRlbiA/IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgPHBhdGggZD1cIk05LjkgNC4yQTEwLjcgMTAuNyAwIDAgMSAxMiA0YzUgMCA5IDQuNSAxMCA4YTEyLjggMTIuOCAwIDAgMS0yLjEgMy42XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgPC9zdmc+XG4gICkgOiAoXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3UzIgMTIgMiAxMnpcIiAvPlxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICA8L3N2Zz5cbiAgKVxuXG5mdW5jdGlvbiBQYXNzd29yZEZpZWxkKHsgaWQsIGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIHZpc2libGUsIG9uVG9nZ2xlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgIDxMYWJlbCBodG1sRm9yPXtpZH0gcmVxdWlyZWQ+e2xhYmVsfTwvTGFiZWw+XG4gICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiB3aWR0aD1cIjEwMCVcIj5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgIHR5cGU9e3Zpc2libGUgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEV5ZUljb24gaGlkZGVuPXt2aXNpYmxlfSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NvbmZpcm1QYXNzd29yZCwgc2V0Q29uZmlybVBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93Q29uZmlybSwgc2V0U2hvd0NvbmZpcm1dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0RXJyb3IoJycpXG4gICAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCA2KSB7XG4gICAgICBzZXRFcnJvcignUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgc2V0RXJyb3IoJ05ldyBwYXNzd29yZCBhbmQgY29uZmlybSBwYXNzd29yZCBtdXN0IGJlIHRoZSBzYW1lLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICdjaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IHBhc3N3b3JkLCBjb25maXJtUGFzc3dvcmQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZS5kYXRhPy5ub3RpY2VcbiAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgc2V0RXJyb3Iobm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKG5vdGljZSkgYWRkTm90aWNlKG5vdGljZSlcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gcmVzcG9uc2UuZGF0YT8ucmVkaXJlY3RVcmxcbiAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2xvc2UoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICBpbnNldDogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMiwgMTIsIDgsIDAuNjIpJyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB6SW5kZXg6IDgwLFxuICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBhcz1cImZvcm1cIlxuICAgICAgICBvblN1Ym1pdD17c2F2ZX1cbiAgICAgICAgYmc9XCJ3aGl0ZVwiXG4gICAgICAgIHdpZHRoPXtbJzEwMCUnLCAnNDIwcHgnXX1cbiAgICAgICAgcD1cInhsXCJcbiAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxNiwgYm94U2hhZG93OiAnMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMjgpJyB9fVxuICAgICAgPlxuICAgICAgICA8SDMgbWI9XCJzbVwiPkNoYW5nZSBwYXNzd29yZDwvSDM+XG4gICAgICAgIDxUZXh0IG1iPVwieGxcIiBjb2xvcj1cIiM2NDc0OGJcIj5cbiAgICAgICAgICBTZXQgYSBuZXcgcGFzc3dvcmQgZm9yIHtyZWNvcmQ/LnBhcmFtcz8ubmFtZSB8fCByZWNvcmQ/LnBhcmFtcz8uZW1haWwgfHwgJ3RoaXMgdXNlcid9LlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICBpZD1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJOZXcgcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0UGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd1Bhc3N3b3JkfVxuICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRTaG93UGFzc3dvcmQoKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwiY29uZmlybS1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICB2YWx1ZT17Y29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd0NvbmZpcm19XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dDb25maXJtKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7ZXJyb3IgPyAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIGNvbG9yPVwiI2RjMjYyNlwiPntlcnJvcn08L1RleHQ+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCIgc3R5bGU9e3sgZ2FwOiAxMCB9fT5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9e2Nsb3NlfSBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIHZhcmlhbnQ9XCJjb250YWluZWRcIiBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlIHBhc3N3b3JkJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VQYXNzd29yZFxuIiwiLyoqIElTTyAzMTY2LTI6SU4gY29kZXMuIEtlcHQgbmV4dCB0byB0aGUgQWRtaW5KUyBmb3JtIHNvIHRoZSBkcm9wZG93biBhbHdheXMgaGFzIGV2ZXJ5IHN0YXRlLiAqL1xuZXhwb3J0IGNvbnN0IElORElBX1NUQVRFUyA9IFtcbiAgeyBjb2RlOiAnQU4nLCBuYW1lOiAnQW5kYW1hbiBhbmQgTmljb2JhciBJc2xhbmRzJyB9LFxuICB7IGNvZGU6ICdBUCcsIG5hbWU6ICdBbmRocmEgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnQVInLCBuYW1lOiAnQXJ1bmFjaGFsIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ0FTJywgbmFtZTogJ0Fzc2FtJyB9LFxuICB7IGNvZGU6ICdCUicsIG5hbWU6ICdCaWhhcicgfSxcbiAgeyBjb2RlOiAnQ0gnLCBuYW1lOiAnQ2hhbmRpZ2FyaCcgfSxcbiAgeyBjb2RlOiAnQ1QnLCBuYW1lOiAnQ2hoYXR0aXNnYXJoJyB9LFxuICB7IGNvZGU6ICdESCcsIG5hbWU6ICdEYWRyYSBhbmQgTmFnYXIgSGF2ZWxpIGFuZCBEYW1hbiBhbmQgRGl1JyB9LFxuICB7IGNvZGU6ICdETCcsIG5hbWU6ICdEZWxoaScgfSxcbiAgeyBjb2RlOiAnR0EnLCBuYW1lOiAnR29hJyB9LFxuICB7IGNvZGU6ICdHSicsIG5hbWU6ICdHdWphcmF0JyB9LFxuICB7IGNvZGU6ICdIUicsIG5hbWU6ICdIYXJ5YW5hJyB9LFxuICB7IGNvZGU6ICdIUCcsIG5hbWU6ICdIaW1hY2hhbCBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdKSycsIG5hbWU6ICdKYW1tdSBhbmQgS2FzaG1pcicgfSxcbiAgeyBjb2RlOiAnSkgnLCBuYW1lOiAnSmhhcmtoYW5kJyB9LFxuICB7IGNvZGU6ICdLQScsIG5hbWU6ICdLYXJuYXRha2EnIH0sXG4gIHsgY29kZTogJ0tMJywgbmFtZTogJ0tlcmFsYScgfSxcbiAgeyBjb2RlOiAnTEEnLCBuYW1lOiAnTGFkYWtoJyB9LFxuICB7IGNvZGU6ICdMRCcsIG5hbWU6ICdMYWtzaGFkd2VlcCcgfSxcbiAgeyBjb2RlOiAnTVAnLCBuYW1lOiAnTWFkaHlhIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ01IJywgbmFtZTogJ01haGFyYXNodHJhJyB9LFxuICB7IGNvZGU6ICdNTicsIG5hbWU6ICdNYW5pcHVyJyB9LFxuICB7IGNvZGU6ICdNTCcsIG5hbWU6ICdNZWdoYWxheWEnIH0sXG4gIHsgY29kZTogJ01aJywgbmFtZTogJ01pem9yYW0nIH0sXG4gIHsgY29kZTogJ05MJywgbmFtZTogJ05hZ2FsYW5kJyB9LFxuICB7IGNvZGU6ICdPUicsIG5hbWU6ICdPZGlzaGEnIH0sXG4gIHsgY29kZTogJ1BZJywgbmFtZTogJ1B1ZHVjaGVycnknIH0sXG4gIHsgY29kZTogJ1BCJywgbmFtZTogJ1B1bmphYicgfSxcbiAgeyBjb2RlOiAnUkonLCBuYW1lOiAnUmFqYXN0aGFuJyB9LFxuICB7IGNvZGU6ICdTSycsIG5hbWU6ICdTaWtraW0nIH0sXG4gIHsgY29kZTogJ1ROJywgbmFtZTogJ1RhbWlsIE5hZHUnIH0sXG4gIHsgY29kZTogJ1RHJywgbmFtZTogJ1RlbGFuZ2FuYScgfSxcbiAgeyBjb2RlOiAnVFInLCBuYW1lOiAnVHJpcHVyYScgfSxcbiAgeyBjb2RlOiAnVVAnLCBuYW1lOiAnVXR0YXIgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnVVQnLCBuYW1lOiAnVXR0YXJha2hhbmQnIH0sXG4gIHsgY29kZTogJ1dCJywgbmFtZTogJ1dlc3QgQmVuZ2FsJyB9LFxuXVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0LCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcbmltcG9ydCB7IElORElBX1NUQVRFUyB9IGZyb20gJy4vaW5kaWEtc3RhdGVzLmpzJ1xuXG5jb25zdCBWRUhJQ0xFX1RZUEVTID0gW1xuICB7IHZhbHVlOiAnQmlrZScsIGxhYmVsOiAnQmlrZScgfSxcbiAgeyB2YWx1ZTogJ1Njb290ZXInLCBsYWJlbDogJ1Njb290ZXInIH0sXG4gIHsgdmFsdWU6ICdFbGVjdHJpYyBiaWtlJywgbGFiZWw6ICdFbGVjdHJpYyBiaWtlJyB9LFxuICB7IHZhbHVlOiAnQ3ljbGUnLCBsYWJlbDogJ0N5Y2xlJyB9LFxuICB7IHZhbHVlOiAnVmFuJywgbGFiZWw6ICdWYW4nIH0sXG4gIHsgdmFsdWU6ICdPdGhlcicsIGxhYmVsOiAnT3RoZXInIH0sXG5dXG5cbmNvbnN0IFNUQVRFX09QVElPTlMgPSBJTkRJQV9TVEFURVMubWFwKChpdGVtKSA9PiAoe1xuICB2YWx1ZTogaXRlbS5uYW1lLFxuICBsYWJlbDogaXRlbS5uYW1lLFxufSkpXG5cbmZ1bmN0aW9uIEZpZWxkRXJyb3IoeyBlcnJvciB9KSB7XG4gIGlmICghZXJyb3I/Lm1lc3NhZ2UpIHJldHVybiBudWxsXG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvci5tZXNzYWdlfTwvc3Bhbj5cbn1cblxuY29uc3QgUGFydG5lckVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc05ldyA9IGFjdGlvbj8ubmFtZSA9PT0gJ25ldycgfHwgIXJlY29yZD8uaWRcbiAgY29uc3QgcmVhZE9ubHkgPSBhY3Rpb24/Lm5hbWUgPT09ICdzaG93J1xuICBjb25zdCBoYXNQYXNzd29yZCA9IEJvb2xlYW4ocGFyYW1zLmhhc1Bhc3N3b3JkKVxuICBjb25zdCBpc0FjdGl2ZSA9IGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFydG5lcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3XG4gICAgICAgICAgICA/ICdQYXJ0bmVyIHNhdmVkLiBBIHBhc3N3b3JkIGVtYWlsIHdpbGwgYmUgc2VudCBpZiB0aGV5IGRvIG5vdCBoYXZlIGEgcGFzc3dvcmQgeWV0LidcbiAgICAgICAgICAgIDogJ1BhcnRuZXIgdXBkYXRlZCcsXG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwYXJ0bmVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGRlbGl2ZXJ5IHBhcnRuZXInIDogcGFyYW1zLm5hbWUgfHwgJ0RlbGl2ZXJ5IHBhcnRuZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBDb2xsZWN0IGZ1bGwgS1lDIGFuZCBjb250YWN0IGRldGFpbHMuIFRoZXkgbG9nIGluIHRvIHRoZSBUb2tyaWlpIFBhcnRuZXIgYXBwIHdpdGggdGhpcyBlbWFpbFxuICAgICAgICAgIGFmdGVyIHNldHRpbmcgYSBwYXNzd29yZCBmcm9tIHRoZSBpbnZpdGUgbWFpbC5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPkluYWN0aXZlIHBhcnRuZXJzIGNhbm5vdCBsb2cgaW4sIGV2ZW4gaWYgdGhleSBhbHJlYWR5IHNldCBhIHBhc3N3b3JkLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBzaWduIGluIHRvIHRoZSBwYXJ0bmVyIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7IWlzTmV3ID8gKFxuICAgICAgICAgICAgPFRleHQgbXQ9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgIHtoYXNQYXNzd29yZCA/ICdQYXNzd29yZCBpcyBhbHJlYWR5IHNldC4nIDogJ05vIHBhc3N3b3JkIHlldCDigJQgc2VuZCB0aGUgaW52aXRlIGVtYWlsIGFmdGVyIHNhdmluZy4nfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+TG9naW4gZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+RW1haWwgaXMgdXNlZCB0byBjcmVhdGUgYW5kIHJlc2V0IHRoZSBwYXJ0bmVyIHBhc3N3b3JkLiBObyBTTVMgaXMgc2VudC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRW1haWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZW1haWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWFpbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwicGFydG5lckBleGFtcGxlLmNvbVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5lbWFpbCA/IDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1haWx9IC8+IDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+UGFzc3dvcmQgbGluayBpcyBzZW50IHRvIHRoaXMgaW5ib3g8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTW9iaWxlIG51bWJlclxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEwfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaG9uZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDEwKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMTAtZGlnaXQgbnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnBob25lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UGVyc29uYWwgZGV0YWlsczwvaDQ+XG4gICAgICAgIDxwPk5hbWUgaXMgc2hvd24gb24gb3JkZXJzLiBGYXRoZXImYXBvcztzIG5hbWUgYW5kIERPQiBoZWxwIHdpdGggS1lDIHJlY29yZHMuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGdWxsIG5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBhcnRuZXIgZnVsbCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLm5hbWV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGYXRoZXImYXBvcztzIC8gZ3VhcmRpYW4gbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmZhdGhlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdmYXRoZXJOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBcyBvbiBBYWRoYWFyIC8gZG9jdW1lbnRzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBEYXRlIG9mIGJpcnRoIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmRhdGVPZkJpcnRoIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2RhdGVPZkJpcnRoJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+S1lDIGRvY3VtZW50czwvaDQ+XG4gICAgICAgIDxwPlBBTiBhbmQgQWFkaGFhciBhcmUgcmVxdWlyZWQgZm9yIHBhcnRuZXIgb25ib2FyZGluZy48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBBTiBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGFuTnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYW5OdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bXkEtWjAtOV0vZywgJycpLnNsaWNlKDAsIDEwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFCQ0RFMTIzNEZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGFuTnVtYmVyfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWFkaGFhciBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEyfVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFhZGhhYXJOdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ2FhZGhhYXJOdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMikpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMi1kaWdpdCBBYWRoYWFyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmFhZGhhYXJOdW1iZXJ9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DdXJyZW50IGFkZHJlc3M8L2g0PlxuICAgICAgICA8cD5XaGVyZSB0aGUgcGFydG5lciBjdXJyZW50bHkgbGl2ZXMgLyBvcGVyYXRlcyBmcm9tLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDFcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWRkcmVzc0xpbmUxJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSAvIHN0cmVldCAvIGFyZWFcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuYWRkcmVzc0xpbmUxfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxhbmRtYXJrLCBjb2xvbnlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jaXR5IHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2l0eVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5jaXR5fSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17Nn1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5waW5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGluY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDYpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI2LWRpZ2l0IHBpbmNvZGVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGluY29kZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCBzdGF0ZScgfSwgLi4uU1RBVEVfT1BUSU9OU119XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ3N0YXRlJywgbmV4dCl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5zdGF0ZX0gLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFBlcm1hbmVudCBhZGRyZXNzIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dCB0b2tyaS10ZXh0YXJlYVwiXG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wZXJtYW5lbnRBZGRyZXNzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3Blcm1hbmVudEFkZHJlc3MnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJJZiBkaWZmZXJlbnQgZnJvbSBjdXJyZW50IGFkZHJlc3NcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RW1lcmdlbmN5IGNvbnRhY3Q8L2g0PlxuICAgICAgICAgIDxwPlNvbWVvbmUgd2UgY2FuIGNhbGwgaWYgdGhlIHBhcnRuZXIgaXMgdW5yZWFjaGFibGUuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENvbnRhY3QgbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtZXJnZW5jeU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWVyZ2VuY3lOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJSZWxhdGl2ZSAvIGZyaWVuZCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDb250YWN0IG1vYmlsZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5lbWVyZ2VuY3lQaG9uZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnZW1lcmdlbmN5UGhvbmUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMC1kaWdpdCBudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1lcmdlbmN5UGhvbmV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlZlaGljbGUgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+VXNlZCBmb3IgZGVsaXZlcnkgYXNzaWdubWVudCBhbmQgc3VwcG9ydC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgVmVoaWNsZSB0eXBlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiA2IH19PlxuICAgICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZlaGljbGVUeXBlIHx8ICcnfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdTZWxlY3QgdmVoaWNsZScgfSwgLi4uVkVISUNMRV9UWVBFU119XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgndmVoaWNsZVR5cGUnLCBuZXh0KX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFZlaGljbGUgbnVtYmVyIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudmVoaWNsZU51bWJlciB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgndmVoaWNsZU51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnNsaWNlKDAsIDIwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gTUgxMkFCMTIzNFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QmFuayBkZXRhaWxzPC9oND5cbiAgICAgICAgPHA+Rm9yIHBheW91dHMgYW5kIHJlaW1idXJzZW1lbnRzLiBPcHRpb25hbCBmb3Igbm93LCBidXQgcmVjb21tZW5kZWQuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBY2NvdW50IGhvbGRlciBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWNjb3VudEhvbGRlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhY2NvdW50SG9sZGVyTmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXMgcGVyIGJhbmsgYWNjb3VudFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWNjb3VudCBudW1iZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hY2NvdW50TnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWNjb3VudE51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQmFuayBhY2NvdW50IG51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgSUZTQyBjb2RlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICBtYXhMZW5ndGg9ezExfVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5pZnNjQ29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpZnNjQ29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1teQS1aMC05XS9nLCAnJykuc2xpY2UoMCwgMTEpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTQklOMDAwMTIzNFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmlmc2NDb2RlfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+SW50ZXJuYWwgbm90ZXM8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgTm90ZXMgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLXRleHRhcmVhXCJcbiAgICAgICAgICAgIHJvd3M9ezR9XG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5vdGVzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25vdGVzJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2hpZnQgdGltaW5nLCBodWIsIG9yIGFueXRoaW5nIHlvdXIgdGVhbSBzaG91bGQgcmVtZW1iZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHBhcnRuZXInIDogJ1NhdmUgcGFydG5lcid9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0bmVyRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFNlYXJjaGFibGVTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuaW1wb3J0IHsgSU5ESUFfU1RBVEVTIH0gZnJvbSAnLi9pbmRpYS1zdGF0ZXMuanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTVEFURV9PUFRJT05TID0gSU5ESUFfU1RBVEVTLm1hcCgoaXRlbSkgPT4gKHtcbiAgdmFsdWU6IGl0ZW0uY29kZSxcbiAgbGFiZWw6IGAke2l0ZW0ubmFtZX0gKCR7aXRlbS5jb2RlfSlgLFxufSkpXG5cbmNvbnN0IFBpbmNvZGVFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IHJlYWRPbmx5ID0gYWN0aW9uPy5uYW1lID09PSAnc2hvdydcbiAgY29uc3QgaXNBY3RpdmUgPSBpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnaXNBY3RpdmUnLCB0cnVlKVxuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc05ld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhcbiAgICAgICAgICByZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpc0ZsYWdPbihpdGVtLnBhcmFtcz8uaXNBY3RpdmUpXG4gICAgICAgICAgICAgID8gaXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInXG4gICAgICAgICAgICAgIDogYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYCxcbiAgICAgICAgICB9KSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0UGFydG5lcnMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBwYXJ0bmVySWQgPSBwYXJhbXMucGFydG5lcklkIHx8IHBhcmFtcy5wYXJ0bmVyIHx8ICcnXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGlzTmV3ID8gJ1BpbmNvZGUgYWRkZWQnIDogJ1BpbmNvZGUgdXBkYXRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIHNlcnZpY2VhYmxlIHBpbmNvZGUnIDogYFBJTiAke3BhcmFtcy5waW5jb2RlIHx8ICcnfWB9PC9IMz5cbiAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBjb2xvcjogJyNmZmYnLCBvcGFjaXR5OiAwLjkgfX0+XG4gICAgICAgICAgQ3VzdG9tZXJzIGNhbiBzYXZlIGFuIGFkZHJlc3MgYW5kIGNoZWNrIG91dCBvbmx5IHdoZW4gdGhpcyBwaW5jb2RlIGlzIGFjdGl2ZS5cbiAgICAgICAgPC9wPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGVsaXZlcnkgY292ZXJhZ2U8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gc3RvcCB0YWtpbmcgb3JkZXJzIGZvciB0aGlzIFBJTiB3aXRob3V0IGRlbGV0aW5nIGl0LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdXZSBkZWxpdmVyIGhlcmUnIDogJ05vdCBkZWxpdmVyaW5nJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0FkZHJlc3Mgc2F2ZSBhbmQgY2hlY2tvdXQgYXJlIGFsbG93ZWQnIDogJ0N1c3RvbWVycyB3aWxsIHNlZSB0aGF0IHRoaXMgUElOIGlzIG5vdCBzZXJ2aWNlYWJsZSd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Bc3NpZ25lZCBwYXJ0bmVyPC9oND5cbiAgICAgICAgICA8cD5OZXcgb3JkZXJzIGluIHRoaXMgUElOIGFyZSBhdXRvLWFzc2lnbmVkIHRvIHRoaXMgcGFydG5lci4gWW91IGNhbiByZWFzc2lnbiBsYXRlciBvbiB0aGUgb3JkZXIuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIERlbGl2ZXJ5IHBhcnRuZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcnRuZXJJZH1cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ05vIHBhcnRuZXIgYXNzaWduZWQnIH0sIC4uLnBhcnRuZXJzXX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgncGFydG5lcklkJywgbmV4dClcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgncGFydG5lcicsIG5leHQpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGEgcGFydG5lclwiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIHBhcnRuZXJzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5Mb2NhdGlvbjwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBpbmNvZGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXs2fVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHkgfHwgIWlzTmV3fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBpbmNvZGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJykuc2xpY2UoMCwgNikpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjYtZGlnaXQgUElOXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLnBpbmNvZGUgPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMucGluY29kZS5tZXNzYWdlfTwvc3Bhbj4gOiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5JbmRpYSBQSU4gY29kZSwgNiBkaWdpdHM8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQXJlYSBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYXJlYUxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYXJlYUxhYmVsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBbmRoZXJpIFdlc3QsIEJhbmRyYSwg4oCmXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENpdHlcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY2l0eSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2NpdHknLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk11bWJhaVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5jaXR5ID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLmNpdHkubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0YXRlQ29kZSB8fCBwYXJhbXMuc3RhdGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdTZWxlY3Qgc3RhdGUnIH0sIC4uLlNUQVRFX09QVElPTlNdfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdzdGF0ZUNvZGUnLCBuZXh0KVxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdzdGF0ZScsIG5leHQpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHN0YXRlXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggc3RhdGVzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLnN0YXRlIHx8IGVycm9ycy5zdGF0ZUNvZGUgPyAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+XG4gICAgICAgICAgICAgICAgeyhlcnJvcnMuc3RhdGUgfHwgZXJyb3JzLnN0YXRlQ29kZSkubWVzc2FnZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkFsbCBJbmRpYW4gc3RhdGVzIGFuZCB1bmlvbiB0ZXJyaXRvcmllczwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQWRkIHBpbmNvZGUnIDogJ1NhdmUgcGluY29kZSd9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaW5jb2RlRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3QgU3RhdHVzVG9nZ2xlID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSwgcHJvcGVydHksIHdoZXJlLCBvbkNoYW5nZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgcmF3ID0gcmVjb3JkPy5wYXJhbXM/Lltwcm9wZXJ0eT8ucGF0aF0gPz8gcmVjb3JkPy5wYXJhbXM/LmlzQWN0aXZlXG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlKGlzRmxhZ09uKHJhdykpXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q2hlY2tlZChpc0ZsYWdPbihyYXcpKVxuICB9LCBbcmF3LCByZWNvcmQ/LmlkXSlcblxuICBjb25zdCBwZXJzaXN0ID0gYXN5bmMgKG5leHQpID0+IHtcbiAgICBpZiAoIXJlY29yZD8uaWQpIHJldHVyblxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICd0b2dnbGVBY3RpdmUnLFxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgZGF0YTogeyBpc0FjdGl2ZTogbmV4dCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNhdmVkID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkPy5wYXJhbXM/LmlzQWN0aXZlXG4gICAgICBzZXRDaGVja2VkKHNhdmVkID09PSB1bmRlZmluZWQgPyBuZXh0IDogaXNGbGFnT24oc2F2ZWQpKVxuICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBub3RpY2U/Lm1lc3NhZ2UgfHwgKG5leHQgPyAnTWFya2VkIGFjdGl2ZScgOiAnTWFya2VkIGluYWN0aXZlJyksXG4gICAgICAgIHR5cGU6IG5vdGljZT8udHlwZSB8fCAnc3VjY2VzcycsXG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBkYXRlIHN0YXR1cy4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKG5leHQpID0+IHtcbiAgICBpZiAod2hlcmUgPT09ICdlZGl0JyAmJiB0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNldENoZWNrZWQobmV4dClcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5leHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGVyc2lzdChuZXh0KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhdHVzU3dpdGNoXG4gICAgICBjb21wYWN0PXt3aGVyZSAhPT0gJ2VkaXQnfVxuICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgIGRpc2FibGVkPXtidXN5fVxuICAgICAgdGl0bGU9e3doZXJlID09PSAnZWRpdCcgPyAoY2hlY2tlZCA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJykgOiB1bmRlZmluZWR9XG4gICAgICBoaW50PXt3aGVyZSA9PT0gJ2VkaXQnID8gcHJvcGVydHk/LmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkfVxuICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1RvZ2dsZVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuZnVuY3Rpb24gcGFkKHZhbHVlKSB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRlSW5wdXQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IHRleHQgPSBTdHJpbmcodmFsdWUpXG4gIGlmICgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9Ly50ZXN0KHRleHQpKSByZXR1cm4gdGV4dC5zbGljZSgwLCAxMClcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7cGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpfS0ke3BhZChkYXRlLmdldERhdGUoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXRXaGVuKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJ+KAlCdcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBkYXRlU3R5bGU6ICdtZWRpdW0nLCB0aW1lU3R5bGU6ICdzaG9ydCcgfSlcbn1cblxuZnVuY3Rpb24gcGFyc2VBZGRyZXNzZXMocGFyYW1zKSB7XG4gIGNvbnN0IHJhdyA9IHBhcmFtcy5hZGRyZXNzZXNcbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0JykgcmV0dXJuIFtyYXddXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJyAmJiByYXcudHJpbSgpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlZC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIGlmIChwYXJzZWQgJiYgdHlwZW9mIHBhcnNlZCA9PT0gJ29iamVjdCcpIHJldHVybiBbcGFyc2VkXVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gZmxhdHRlbmVkIEFkbWluSlMgcGFyYW1zIGJlbG93XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ3JvdXBlZCA9IHt9XG4gIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSBrZXkubWF0Y2goL15hZGRyZXNzZXNcXC4oXFxkKylcXC4oLispJC8pXG4gICAgaWYgKCFtYXRjaCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykgcmV0dXJuXG4gICAgY29uc3QgWywgaW5kZXgsIGZpZWxkXSA9IG1hdGNoXG4gICAgZ3JvdXBlZFtpbmRleF0gPSBncm91cGVkW2luZGV4XSB8fCB7fVxuICAgIGdyb3VwZWRbaW5kZXhdW2ZpZWxkXSA9IHZhbHVlXG4gIH0pXG4gIHJldHVybiBPYmplY3Qua2V5cyhncm91cGVkKVxuICAgIC5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYSkgLSBOdW1iZXIoYikpXG4gICAgLm1hcCgoa2V5KSA9PiBncm91cGVkW2tleV0pXG59XG5cbmZ1bmN0aW9uIGFkZHJlc3NMaW5lcyhhZGRyZXNzKSB7XG4gIHJldHVybiBbXG4gICAgYWRkcmVzcy5saW5lMSxcbiAgICBhZGRyZXNzLmxpbmUyLFxuICAgIFthZGRyZXNzLmNpdHksIGFkZHJlc3Muc3RhdGUsIGFkZHJlc3MucGluY29kZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJyksXG4gICAgYWRkcmVzcy5sYW5kbWFyayA/IGBMYW5kbWFyazogJHthZGRyZXNzLmxhbmRtYXJrfWAgOiAnJyxcbiAgXS5maWx0ZXIoQm9vbGVhbilcbn1cblxuY29uc3QgQ3VzdG9tZXJFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzQWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJ1xuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuICBjb25zdCBhZGRyZXNzZXMgPSB1c2VNZW1vKCgpID0+IHBhcnNlQWRkcmVzc2VzKHBhcmFtcyksIFtwYXJhbXNdKVxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXInLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0N1c3RvbWVyIHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICArOTEge3BhcmFtcy5waG9uZSB8fCAn4oCUJ30gwrcgam9pbmVkIHtmb3JtYXRXaGVuKHBhcmFtcy5jcmVhdGVkQXQpfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5BY2NvdW50IHN0YXR1czwvaDQ+XG4gICAgICAgICAgPHA+SW5hY3RpdmUgY3VzdG9tZXJzIGNhbm5vdCBzaWduIGluIHdpdGggdGhpcyBtb2JpbGUgbnVtYmVyLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBsb2cgaW4gb24gdGhlIHdlYnNpdGUgYW5kIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2ZpbGU8L2g0PlxuICAgICAgICAgIDxwPlBob25lIGNvbWVzIGZyb20gT1RQIGxvZ2luIGFuZCBzdGF5cyBhcyB0aGUgY3VzdG9tZXLigJlzIGxvZ2luIGlkLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ3VzdG9tZXIgbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5uYW1lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLm5hbWUubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNb2JpbGVcbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9IHJlYWRPbmx5IC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBEYXRlIG9mIGJpcnRoXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGVJbnB1dChwYXJhbXMuZGF0ZU9mQmlydGgpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdkYXRlT2ZCaXJ0aCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHtlcnJvcnMuZGF0ZU9mQmlydGggPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMuZGF0ZU9mQmlydGgubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+U2F2ZWQgYWRkcmVzc2VzPC9oND5cbiAgICAgICAgPHA+XG4gICAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGhcbiAgICAgICAgICAgID8gYCR7YWRkcmVzc2VzLmxlbmd0aH0gYWRkcmVzcyR7YWRkcmVzc2VzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ2VzJ30gc2F2ZWQgaW4gdGhlIGN1c3RvbWVyIGFjY291bnQuYFxuICAgICAgICAgICAgOiAnVGhpcyBjdXN0b21lciBoYXMgbm90IHNhdmVkIGEgZGVsaXZlcnkgYWRkcmVzcyB5ZXQuJ31cbiAgICAgICAgPC9wPlxuICAgICAgICB7YWRkcmVzc2VzLmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtZ3JpZFwiPlxuICAgICAgICAgICAge2FkZHJlc3Nlcy5tYXAoKGFkZHJlc3MsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17YWRkcmVzcy5pZCB8fCBgJHthZGRyZXNzLnBpbmNvZGV9LSR7aW5kZXh9YH0gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1jYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hZGRyZXNzLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1sYWJlbFwiPnthZGRyZXNzLmxhYmVsIHx8ICdBZGRyZXNzJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICB7YWRkcmVzcy5waW5jb2RlID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waW5cIj57YWRkcmVzcy5waW5jb2RlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2FkZHJlc3MubmFtZSB8fCBwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIHthZGRyZXNzLnBob25lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waG9uZVwiPis5MSB7YWRkcmVzcy5waG9uZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICB7YWRkcmVzc0xpbmVzKGFkZHJlc3MpLm1hcCgobGluZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPHAga2V5PXtsaW5lfT57bGluZX08L3A+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY3VzdG9tZXJcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lckVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRm9ybUdyb3VwLFxuICBIMixcbiAgSW5wdXQsXG4gIExhYmVsLFxuICBNZXNzYWdlQm94LFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBSRU1FTUJFUkVEX0xPR0lOX0tFWSA9ICd0b2tyaV9hZG1pbl9sb2dpbidcblxuY29uc3QgTG9naW4gPSAoKSA9PiB7XG4gIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHdpbmRvdy5fX0FQUF9TVEFURV9fIHx8IHt9XG4gIGNvbnN0IHsgdHJhbnNsYXRlTWVzc2FnZSB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBhZG1pblJvb3QgPSBhY3Rpb24/LnJlcGxhY2UoL1xcL2xvZ2luJC8sICcnKSB8fCAnJ1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZFVybCA9IGAke2FkbWluUm9vdH0vZm9yZ290LXBhc3N3b3JkYFxuICBjb25zdCBbaWRlbnRpZmllciwgc2V0SWRlbnRpZmllcl0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3JlbWVtYmVyTG9naW4sIHNldFJlbWVtYmVyTG9naW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlbWVtYmVyZWRMb2dpbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSlcbiAgICBpZiAocmVtZW1iZXJlZExvZ2luKSB7XG4gICAgICBzZXRJZGVudGlmaWVyKHJlbWVtYmVyZWRMb2dpbilcbiAgICAgIHNldFJlbWVtYmVyTG9naW4odHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZvcm0gPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZW1haWxJbnB1dCA9IGZvcm0uZWxlbWVudHMubmFtZWRJdGVtKCdlbWFpbCcpXG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0ID8gU3RyaW5nKGVtYWlsSW5wdXQudmFsdWUpIDogaWRlbnRpZmllcikudHJpbSgpXG5cbiAgICBpZiAoZW1haWxJbnB1dCAmJiAndmFsdWUnIGluIGVtYWlsSW5wdXQpIHtcbiAgICAgIGVtYWlsSW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgIH1cblxuICAgIC8vICNyZWdpb24gYWdlbnQgbG9nXG4gICAgZmV0Y2goJ2h0dHA6Ly8xMjcuMC4wLjE6NzMxNi9pbmdlc3QvZGI1MjI1NmYtM2NiMi00NTRjLWEyMzYtYTkyNjRiMzgzNjcyJyx7bWV0aG9kOidQT1NUJyxoZWFkZXJzOnsnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicsJ1gtRGVidWctU2Vzc2lvbi1JZCc6J2RhNzdkYyd9LGJvZHk6SlNPTi5zdHJpbmdpZnkoe3Nlc3Npb25JZDonZGE3N2RjJyxydW5JZDoncHJlLWZpeCcsaHlwb3RoZXNpc0lkOidBJyxsb2NhdGlvbjonbG9naW4uanN4OmhhbmRsZVN1Ym1pdCcsbWVzc2FnZTonYWRtaW4gbG9naW4gZm9ybSBzdWJtaXQnLGRhdGE6e2FjdGlvbjphY3Rpb258fG51bGwscmVkdXhSb290OndpbmRvdy5SRURVWF9TVEFURT8ucGF0aHM/LnJvb3RQYXRofHxudWxsLGhhc0lkZW50aWZpZXI6ISF2YWx1ZSxocmVmOndpbmRvdy5sb2NhdGlvbi5ocmVmfSx0aW1lc3RhbXA6RGF0ZS5ub3coKX0pfSkuY2F0Y2goKCk9Pnt9KVxuICAgIC8vICNlbmRyZWdpb25cblxuICAgIGlmIChyZW1lbWJlckxvZ2luICYmIHZhbHVlKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVksIHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBmbGV4XG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgIG1pbkhlaWdodD1cIjEwMHZoXCJcbiAgICAgIGJnPVwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzAyMmMyMiwgIzA0Nzg1NylcIlxuICAgICAgcD1cInhsXCJcbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGJnPVwid2hpdGVcIlxuICAgICAgICB3aWR0aD17WycxMDAlJywgJzQ0MHB4J119XG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjE4cHhcIlxuICAgICAgICBib3hTaGFkb3c9XCIwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4zNSlcIlxuICAgICAgICBwPVwieDNcIlxuICAgICAgPlxuICAgICAgICA8SDIgY29sb3I9XCIjMDIyYzIyXCIgbWI9XCJzbVwiPlRva3JpaWkgQ01TPC9IMj5cbiAgICAgICAgPFRleHQgY29sb3I9XCIjNjQ3NDhiXCIgbWI9XCJ4bFwiPlxuICAgICAgICAgIFNpZ24gaW4gd2l0aCB5b3VyIGFkbWluIGVtYWlsIG9yIHVzZXJuYW1lIHRvIG1hbmFnZSBwcm9kdWN0cywgb3JkZXJzLCBhbmQgY29udGVudC5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIHtlcnJvck1lc3NhZ2UgPyAoXG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIG1iPVwibGdcIlxuICAgICAgICAgICAgbWVzc2FnZT17ZXJyb3JNZXNzYWdlLnNwbGl0KCcgJykubGVuZ3RoID4gMSA/IGVycm9yTWVzc2FnZSA6IHRyYW5zbGF0ZU1lc3NhZ2UoZXJyb3JNZXNzYWdlKX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJkYW5nZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggYXM9XCJmb3JtXCIgYWN0aW9uPXthY3Rpb259IG1ldGhvZD1cIlBPU1RcIiBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPkVtYWlsIG9yIHVzZXJuYW1lPC9MYWJlbD5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwidXNlcm5hbWVcIlxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2lkZW50aWZpZXJ9XG4gICAgICAgICAgICAgIGtleT17aWRlbnRpZmllciB8fCAnbG9naW4tZW1haWwnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICA8TGFiZWwgcmVxdWlyZWQ+UGFzc3dvcmQ8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9e3Nob3dQYXNzd29yZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtzaG93UGFzc3dvcmQgPyAnSGlkZSBwYXNzd29yZCcgOiAnU2hvdyBwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1Bhc3N3b3JkKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3Nob3dQYXNzd29yZCA/IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOS45IDQuMkExMC43IDEwLjcgMCAwIDEgMTIgNGM1IDAgOSA0LjUgMTAgOGExMi44IDEyLjggMCAwIDEtMi4xIDMuNlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgN1MyIDEyIDIgMTJ6XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZD1cInJlbWVtYmVyLWxvZ2luXCJcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17cmVtZW1iZXJMb2dpbn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UmVtZW1iZXJMb2dpbihldmVudC50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiA4IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1lbWJlci1sb2dpblwiIHN0eWxlPXt7IGNvbG9yOiAnIzQ3NTU2OScsIGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICAgICAgUmVtZW1iZXIgbXkgZW1haWwgb3IgdXNlcm5hbWUgb24gdGhpcyBkZXZpY2VcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgd2lkdGg9XCIxMDAlXCIgbXQ9XCJsZ1wiPlxuICAgICAgICAgICAgU2lnbiBpblxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj17Zm9yZ290UGFzc3dvcmRVcmx9IHN0eWxlPXt7IGNvbG9yOiAnIzA0Nzg1NycsIGZvbnRXZWlnaHQ6IDcwMCB9fT5cbiAgICAgICAgICAgIEZvcmdvdCBwYXNzd29yZD9cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2luXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b25Hcm91cCwgTWVzc2FnZUJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VGaWx0ZXJEcmF3ZXIsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuZnVuY3Rpb24gYWRtaW5Sb290UGF0aCgpIHtcbiAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL14oLiopXFwvcmVzb3VyY2VzXFwvLylcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKVxufVxuXG5mdW5jdGlvbiBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpIHtcbiAgaWYgKHJlc291cmNlSWQgPT09ICdDYXRlZ29yeScpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdjYXRlZ29yaWVzL2V4cG9ydCcsIGltcG9ydFVybDogJ2NhdGVnb3JpZXMvaW1wb3J0JyB9XG4gIH1cbiAgaWYgKHJlc291cmNlSWQgPT09ICdQcm9kdWN0Jykge1xuICAgIHJldHVybiB7IGV4cG9ydFVybDogJ3Byb2R1Y3RzL2V4cG9ydCcsIGltcG9ydFVybDogJ3Byb2R1Y3RzL2ltcG9ydCcgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyh7IHJlc291cmNlLCBvbkltcG9ydGVkIH0pIHtcbiAgY29uc3QgeyB0cmFuc2xhdGVCdXR0b24sIHRyYW5zbGF0ZUFjdGlvbiB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IHRvZ2dsZUZpbHRlciwgZmlsdGVyc0NvdW50IH0gPSB1c2VGaWx0ZXJEcmF3ZXIoKVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuXG4gIGNvbnN0IHJlc291cmNlSWQgPSByZXNvdXJjZS5pZFxuICBjb25zdCBjb25maWcgPSBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpXG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3RQYXRoKClcblxuICBjb25zdCBoYW5kbGVJbXBvcnQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgIGlmICghZmlsZSB8fCAhY29uZmlnKSByZXR1cm5cblxuICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICBzZXRNZXNzYWdlKG51bGwpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmltcG9ydFVybH1gLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvckNvdW50ID0gZGF0YS5lcnJvcnM/Lmxlbmd0aCB8fCAwXG4gICAgICBzZXRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogZXJyb3JDb3VudCA/ICdpbmZvJyA6ICdzdWNjZXNzJyxcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICBlcnJvckNvdW50ID4gMFxuICAgICAgICAgICAgPyBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiAke2Vycm9yQ291bnR9IHJvdyhzKSBjb3VsZCBub3QgYmUgaW1wb3J0ZWQuYFxuICAgICAgICAgICAgOiBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLmAsXG4gICAgICB9KVxuICAgICAgb25JbXBvcnRlZD8uKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6ICdkYW5nZXInLCB0ZXh0OiBlcnJvci5tZXNzYWdlIHx8ICdJbXBvcnQgZmFpbGVkLicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBidXR0b25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFjb25maWcpIHJldHVybiBbXVxuXG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRXhwb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBocmVmOiBgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmV4cG9ydFVybH1gLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGxvYWRpbmcgPyAnSW1wb3J0aW5nLi4uJyA6ICdJbXBvcnQnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIG9uQ2xpY2s6IGxvYWRpbmcgPyB1bmRlZmluZWQgOiAoKSA9PiBmaWxlUmVmLmN1cnJlbnQ/LmNsaWNrKCksXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IG5ld0FjdGlvbiA9IHJlc291cmNlLnJlc291cmNlQWN0aW9ucz8uZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24ubmFtZSA9PT0gJ25ldycpXG4gICAgaWYgKG5ld0FjdGlvbikge1xuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIGljb246IG5ld0FjdGlvbi5pY29uLFxuICAgICAgICBsYWJlbDogdHJhbnNsYXRlQWN0aW9uKG5ld0FjdGlvbi5sYWJlbCwgcmVzb3VyY2VJZCksXG4gICAgICAgIHZhcmlhbnQ6IG5ld0FjdGlvbi52YXJpYW50LFxuICAgICAgICBocmVmOiBgJHtyb290fS9yZXNvdXJjZXMvJHtyZXNvdXJjZUlkfS9hY3Rpb25zL25ld2AsXG4gICAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LW5ldy1idXR0b25gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJLZXkgPSBmaWx0ZXJzQ291bnQgPiAwID8gJ2ZpbHRlckFjdGl2ZScgOiAnZmlsdGVyJ1xuICAgIGl0ZW1zLnB1c2goe1xuICAgICAgbGFiZWw6IHRyYW5zbGF0ZUJ1dHRvbihmaWx0ZXJLZXksIHJlc291cmNlSWQsIHsgY291bnQ6IGZpbHRlcnNDb3VudCB9KSxcbiAgICAgIG9uQ2xpY2s6IHRvZ2dsZUZpbHRlcixcbiAgICAgIGljb246ICdGaWx0ZXInLFxuICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tZmlsdGVyLWJ1dHRvbmAsXG4gICAgfSlcblxuICAgIHJldHVybiBpdGVtc1xuICB9LCBbXG4gICAgY29uZmlnLFxuICAgIHJvb3QsXG4gICAgbG9hZGluZyxcbiAgICByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnMsXG4gICAgcmVzb3VyY2VJZCxcbiAgICB0cmFuc2xhdGVBY3Rpb24sXG4gICAgdHJhbnNsYXRlQnV0dG9uLFxuICAgIGZpbHRlcnNDb3VudCxcbiAgICB0b2dnbGVGaWx0ZXIsXG4gIF0pXG5cbiAgaWYgKCFjb25maWcpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEJveFxuICAgICAgICBtdD1cInhsXCJcbiAgICAgICAgbWI9XCJkZWZhdWx0XCJcbiAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCJcbiAgICAgICAgZmxleFNocmluaz17MH1cbiAgICAgICAgcHg9e1snZGVmYXVsdCcsIDBdfVxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Ub3A6ICctNTJweCcgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvbkdyb3VwIGJ1dHRvbnM9e2J1dHRvbnN9IC8+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17ZmlsZVJlZn1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgYWNjZXB0PVwiLmNzdix0ZXh0L2NzdlwiXG4gICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUltcG9ydH1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCIgcHg9e1snZGVmYXVsdCcsIDBdfT5cbiAgICAgICAgICA8TWVzc2FnZUJveFxuICAgICAgICAgICAgdmFyaWFudD17bWVzc2FnZS50eXBlfVxuICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZS50ZXh0fVxuICAgICAgICAgICAgb25DbG9zZUNsaWNrPXsoKSA9PiBzZXRNZXNzYWdlKG51bGwpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IE9yaWdpbmFsQWN0aW9uSGVhZGVyIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMgZnJvbSAnLi9jYXRhbG9nLWxpc3QtaGVhZGVyLWFjdGlvbnMuanN4J1xuXG5jb25zdCBDQVRBTE9HX1JFU09VUkNFUyA9IG5ldyBTZXQoWydQcm9kdWN0JywgJ0NhdGVnb3J5J10pXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFjdGlvbkhlYWRlcihwcm9wcykge1xuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50LCBhY3Rpb24sIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBCYXNlSGVhZGVyID0gT3JpZ2luYWxDb21wb25lbnQgfHwgT3JpZ2luYWxBY3Rpb25IZWFkZXJcbiAgY29uc3QgaXNDYXRhbG9nTGlzdCA9IGFjdGlvbj8ubmFtZSA9PT0gJ2xpc3QnICYmIENBVEFMT0dfUkVTT1VSQ0VTLmhhcyhyZXNvdXJjZT8uaWQpXG5cbiAgaWYgKCFpc0NhdGFsb2dMaXN0KSB7XG4gICAgcmV0dXJuIDxCYXNlSGVhZGVyIHsuLi5wcm9wc30gLz5cbiAgfVxuXG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQ6IF9pZ25vcmVkLCAuLi5oZWFkZXJQcm9wcyB9ID0gcHJvcHNcblxuICByZXR1cm4gKFxuICAgIDxCb3g+XG4gICAgICA8QmFzZUhlYWRlciB7Li4uaGVhZGVyUHJvcHN9IG9taXRBY3Rpb25zIC8+XG4gICAgICA8Q2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zXG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgb25JbXBvcnRlZD17cHJvcHMuYWN0aW9uUGVyZm9ybWVkfVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IG1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBMYWJlbCwgVGlueU1DRSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGx1Z2luczogW1xuICAgICdjb2RlJyxcbiAgICAnbGluaycsXG4gICAgJ2xpc3RzJyxcbiAgICAnaW1hZ2UnLFxuICAgICd0YWJsZScsXG4gICAgJ2F1dG9saW5rJyxcbiAgICAncHJldmlldycsXG4gICAgJ3NlYXJjaHJlcGxhY2UnLFxuICAgICd3b3JkY291bnQnLFxuICAgICdtZWRpYScsXG4gICAgJ2NvZGVzYW1wbGUnLFxuICBdLFxuICB0b29sYmFyOlxuICAgICd1bmRvIHJlZG8gfCBibG9ja3MgfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgc3RyaWtldGhyb3VnaCB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCBvdXRkZW50IGluZGVudCB8IGxpbmsgaW1hZ2UgdGFibGUgY29kZXNhbXBsZSB8IGNvZGUgfCByZW1vdmVmb3JtYXQnLFxuICBoZWlnaHQ6IDQwMCxcbn1cblxuY29uc3QgUmljaHRleHRFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IHZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/ICcnXG4gIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBuZXdWYWx1ZSlcbiAgICB9LFxuICAgIFtvbkNoYW5nZSwgcHJvcGVydHkucGF0aF0sXG4gIClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLkRFRkFVTFRfT1BUSU9OUyxcbiAgICAuLi4ocHJvcGVydHkucHJvcHMgfHwge30pLFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybUdyb3VwIGVycm9yPXtCb29sZWFuKGVycm9yKX0+XG4gICAgICA8TGFiZWwgcmVxdWlyZWQ9e3Byb3BlcnR5LmlzUmVxdWlyZWR9Pntwcm9wZXJ0eS5sYWJlbH08L0xhYmVsPlxuICAgICAgPFRpbnlNQ0UgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlVXBkYXRlfSBvcHRpb25zPXtvcHRpb25zfSAvPlxuICAgICAgPEZvcm1NZXNzYWdlPntlcnJvcj8ubWVzc2FnZX08L0Zvcm1NZXNzYWdlPlxuICAgIDwvRm9ybUdyb3VwPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oUmljaHRleHRFZGl0KVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VMb2NhdGlvbiwgdXNlTmF2aWdhdGUgfSBmcm9tICdyZWFjdC1yb3V0ZXInXG5cbmZ1bmN0aW9uIGFkbWluUm9vdChwYXRobmFtZSkge1xuICBjb25zdCBjdXQgPSBwYXRobmFtZS5zZWFyY2goL1xcLyhyZXNvdXJjZXN8cGFnZXMpKFxcL3wkKS8pXG4gIGNvbnN0IHJvb3QgPSBjdXQgPT09IC0xID8gcGF0aG5hbWUgOiBwYXRobmFtZS5zbGljZSgwLCBjdXQpXG4gIHJldHVybiByb290LnJlcGxhY2UoL1xcLyQvLCAnJykgfHwgJy8nXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZGViYXJSZXNvdXJjZVNlY3Rpb24ocHJvcHMpIHtcbiAgY29uc3QgT3JpZ2luYWwgPSBwcm9wcy5PcmlnaW5hbENvbXBvbmVudFxuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKClcbiAgY29uc3QgbmF2aWdhdGUgPSB1c2VOYXZpZ2F0ZSgpXG4gIGNvbnN0IGhyZWYgPSBhZG1pblJvb3QobG9jYXRpb24ucGF0aG5hbWUpXG4gIGNvbnN0IHNlbGVjdGVkID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKSA9PT0gaHJlZi5yZXBsYWNlKC9cXC8kLywgJycpIHx8IGxvY2F0aW9uLnBhdGhuYW1lID09PSBgJHtocmVmfS9gXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGFcbiAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2lkZWJhci1kYXNoYm9hcmQke3NlbGVjdGVkID8gJyBpcy1hY3RpdmUnIDogJyd9YH1cbiAgICAgICAgaHJlZj17aHJlZn1cbiAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIG5hdmlnYXRlKGhyZWYpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxJY29uIGljb249XCJIb21lXCIgLz5cbiAgICAgICAgPHNwYW4+RGFzaGJvYXJkPC9zcGFuPlxuICAgICAgPC9hPlxuICAgICAge09yaWdpbmFsID8gPE9yaWdpbmFsIHJlc291cmNlcz17cHJvcHMucmVzb3VyY2VzfSAvPiA6IG51bGx9XG4gICAgPC8+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IExvYWRlciwgVGFibGUsIFRhYmxlQm9keSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBOb1JlY29yZHMsXG4gIFJlY29yZEluTGlzdCxcbiAgUmVjb3Jkc1RhYmxlSGVhZGVyLFxuICBTZWxlY3RlZFJlY29yZHMsXG59IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGdldFJlc291cmNlRWxlbWVudENzcyA9IChyZXNvdXJjZUlkLCBzdWZmaXgpID0+IGAke3Jlc291cmNlSWR9LSR7c3VmZml4fWBcblxuLyoqXG4gKiBBZG1pbkpTIG1hcmtzIHRoZSBoZWFkZXIgY2hlY2tib3ggY2hlY2tlZCB3aGVuIEFOWSByb3cgaXMgc2VsZWN0ZWQuXG4gKiBPdmVycmlkZSBzbzogbm9uZSA9IHVuY2hlY2tlZCwgc29tZSA9IGluZGV0ZXJtaW5hdGUsIGFsbCA9IGNoZWNrZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlY29yZHNUYWJsZShwcm9wcykge1xuICBjb25zdCB7XG4gICAgcmVzb3VyY2UsXG4gICAgcmVjb3JkcyxcbiAgICBhY3Rpb25QZXJmb3JtZWQsXG4gICAgc29ydEJ5LFxuICAgIGRpcmVjdGlvbixcbiAgICBpc0xvYWRpbmcsXG4gICAgb25TZWxlY3QsXG4gICAgc2VsZWN0ZWRSZWNvcmRzLFxuICAgIG9uU2VsZWN0QWxsLFxuICB9ID0gcHJvcHNcblxuICBpZiAoIXJlY29yZHMubGVuZ3RoKSB7XG4gICAgaWYgKGlzTG9hZGluZykgcmV0dXJuIDxMb2FkZXIgLz5cbiAgICByZXR1cm4gPE5vUmVjb3JkcyByZXNvdXJjZT17cmVzb3VyY2V9IC8+XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENvdW50ID0gc2VsZWN0ZWRSZWNvcmRzXG4gICAgPyByZWNvcmRzLmZpbHRlcigocmVjb3JkKSA9PiBzZWxlY3RlZFJlY29yZHMuc29tZSgoc2VsZWN0ZWQpID0+IHNlbGVjdGVkLmlkID09PSByZWNvcmQuaWQpKS5sZW5ndGhcbiAgICA6IDBcbiAgY29uc3Qgc2VsZWN0ZWRBbGwgPSBzZWxlY3RlZENvdW50ID4gMCAmJiBzZWxlY3RlZENvdW50ID09PSByZWNvcmRzLmxlbmd0aFxuICBjb25zdCBpbmRldGVybWluYXRlID0gc2VsZWN0ZWRDb3VudCA+IDAgJiYgc2VsZWN0ZWRDb3VudCA8IHJlY29yZHMubGVuZ3RoXG4gIGNvbnN0IHJlY29yZHNIYXZlQnVsa0FjdGlvbiA9ICEhcmVjb3Jkcy5maW5kKChyZWNvcmQpID0+IHJlY29yZC5idWxrQWN0aW9ucy5sZW5ndGgpXG5cbiAgY29uc3QgY29udGVudFRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyhyZXNvdXJjZS5pZCwgJ3RhYmxlJylcbiAgY29uc3Qgc2VsZWN0ZWRUYWcgPSBnZXRSZXNvdXJjZUVsZW1lbnRDc3MocmVzb3VyY2UuaWQsICd0YWJsZS1zZWxlY3RlZC1yZWNvcmRzJylcbiAgY29uc3QgYm9keVRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyhyZXNvdXJjZS5pZCwgJ3RhYmxlLWJvZHknKVxuXG4gIHJldHVybiAoXG4gICAgPFRhYmxlIGRhdGEtY3NzPXtjb250ZW50VGFnfT5cbiAgICAgIDxTZWxlY3RlZFJlY29yZHNcbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICBzZWxlY3RlZFJlY29yZHM9e3NlbGVjdGVkUmVjb3Jkc31cbiAgICAgICAgZGF0YS1jc3M9e3NlbGVjdGVkVGFnfVxuICAgICAgLz5cbiAgICAgIDxSZWNvcmRzVGFibGVIZWFkZXJcbiAgICAgICAgcHJvcGVydGllcz17cmVzb3VyY2UubGlzdFByb3BlcnRpZXN9XG4gICAgICAgIHRpdGxlUHJvcGVydHk9e3Jlc291cmNlLnRpdGxlUHJvcGVydHl9XG4gICAgICAgIGRpcmVjdGlvbj17ZGlyZWN0aW9ufVxuICAgICAgICBzb3J0Qnk9e3NvcnRCeX1cbiAgICAgICAgb25TZWxlY3RBbGw9e3JlY29yZHNIYXZlQnVsa0FjdGlvbiA/IG9uU2VsZWN0QWxsIDogdW5kZWZpbmVkfVxuICAgICAgICBzZWxlY3RlZEFsbD17c2VsZWN0ZWRBbGx9XG4gICAgICAgIGluZGV0ZXJtaW5hdGU9e2luZGV0ZXJtaW5hdGV9XG4gICAgICAvPlxuICAgICAgPFRhYmxlQm9keSBkYXRhLWNzcz17Ym9keVRhZ30+XG4gICAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiAoXG4gICAgICAgICAgPFJlY29yZEluTGlzdFxuICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICBrZXk9e3JlY29yZC5pZH1cbiAgICAgICAgICAgIGFjdGlvblBlcmZvcm1lZD17YWN0aW9uUGVyZm9ybWVkfVxuICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAgICAgICBpc1NlbGVjdGVkPXtcbiAgICAgICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzICYmICEhc2VsZWN0ZWRSZWNvcmRzLmZpbmQoKHNlbGVjdGVkKSA9PiBzZWxlY3RlZC5pZCA9PT0gcmVjb3JkLmlkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9UYWJsZUJvZHk+XG4gICAgPC9UYWJsZT5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBUYWJsZUNlbGwsIFRhYmxlSGVhZCwgVGFibGVSb3cgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgUHJvcGVydHlIZWFkZXIgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBnZXRSZXNvdXJjZUVsZW1lbnRDc3MgPSAocmVzb3VyY2VJZCwgc3VmZml4KSA9PiBgJHtyZXNvdXJjZUlkfS0ke3N1ZmZpeH1gXG5cbmNvbnN0IGRpc3BsYXkgPSAoaXNUaXRsZSkgPT4gW1xuICBpc1RpdGxlID8gJ3RhYmxlLWNlbGwnIDogJ25vbmUnLFxuICBpc1RpdGxlID8gJ3RhYmxlLWNlbGwnIDogJ25vbmUnLFxuICAndGFibGUtY2VsbCcsXG4gICd0YWJsZS1jZWxsJyxcbl1cblxuZnVuY3Rpb24gU2VsZWN0QWxsQ2hlY2tCb3goeyBjaGVja2VkLCBpbmRldGVybWluYXRlLCBvbkNoYW5nZSB9KSB7XG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmKG51bGwpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgaW5wdXRSZWYuY3VycmVudC5pbmRldGVybWluYXRlID0gQm9vbGVhbihpbmRldGVybWluYXRlKVxuICAgIH1cbiAgfSwgW2luZGV0ZXJtaW5hdGUsIGNoZWNrZWRdKVxuXG4gIHJldHVybiAoXG4gICAgPGxhYmVsXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1zZWxlY3QtYWxsJHtpbmRldGVybWluYXRlID8gJyBpcy1pbmRldGVybWluYXRlJyA6ICcnfSR7Y2hlY2tlZCA/ICcgaXMtY2hlY2tlZCcgOiAnJ31gfVxuICAgICAgc3R5bGU9e3sgbWFyZ2luTGVmdDogNSB9fVxuICAgID5cbiAgICAgIDxpbnB1dFxuICAgICAgICByZWY9e2lucHV0UmVmfVxuICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICBjaGVja2VkPXtCb29sZWFuKGNoZWNrZWQpfVxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIGFyaWEtY2hlY2tlZD17aW5kZXRlcm1pbmF0ZSA/ICdtaXhlZCcgOiBjaGVja2VkID8gJ3RydWUnIDogJ2ZhbHNlJ31cbiAgICAgIC8+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zZWxlY3QtYWxsLWJveFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7aW5kZXRlcm1pbmF0ZSA/IChcbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBjbGFzc05hbWU9XCJ0b2tyaS1zZWxlY3QtYWxsLWljb25cIj5cbiAgICAgICAgICAgIDxsaW5lIHgxPVwiNlwiIHkxPVwiMTJcIiB4Mj1cIjE4XCIgeTI9XCIxMlwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgICkgOiBjaGVja2VkID8gKFxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzTmFtZT1cInRva3JpLXNlbGVjdC1hbGwtaWNvblwiPlxuICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NwYW4+XG4gICAgPC9sYWJlbD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWNvcmRzVGFibGVIZWFkZXIocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHRpdGxlUHJvcGVydHksXG4gICAgcHJvcGVydGllcyxcbiAgICBzb3J0QnksXG4gICAgZGlyZWN0aW9uLFxuICAgIG9uU2VsZWN0QWxsLFxuICAgIHNlbGVjdGVkQWxsLFxuICAgIGluZGV0ZXJtaW5hdGUsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IGNvbnRlbnRUYWcgPSBnZXRSZXNvdXJjZUVsZW1lbnRDc3ModGl0bGVQcm9wZXJ0eS5yZXNvdXJjZUlkLCAndGFibGUtaGVhZCcpXG4gIGNvbnN0IHJvd1RhZyA9IGAke3RpdGxlUHJvcGVydHkucmVzb3VyY2VJZH0tdGFibGUtaGVhZC1yb3dgXG4gIGNvbnN0IGNoZWNrYm94Q3NzID0gYCR7dGl0bGVQcm9wZXJ0eS5yZXNvdXJjZUlkfS1jaGVja2JveC10YWJsZS1jZWxsYFxuXG4gIHJldHVybiAoXG4gICAgPFRhYmxlSGVhZCBkYXRhLWNzcz17Y29udGVudFRhZ30+XG4gICAgICA8VGFibGVSb3cgZGF0YS1jc3M9e3Jvd1RhZ30+XG4gICAgICAgIDxUYWJsZUNlbGwgZGF0YS1jc3M9e2NoZWNrYm94Q3NzfT5cbiAgICAgICAgICB7b25TZWxlY3RBbGwgPyAoXG4gICAgICAgICAgICA8U2VsZWN0QWxsQ2hlY2tCb3hcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uU2VsZWN0QWxsKCl9XG4gICAgICAgICAgICAgIGNoZWNrZWQ9e0Jvb2xlYW4oc2VsZWN0ZWRBbGwpfVxuICAgICAgICAgICAgICBpbmRldGVybWluYXRlPXtCb29sZWFuKGluZGV0ZXJtaW5hdGUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgIHtwcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICA8UHJvcGVydHlIZWFkZXJcbiAgICAgICAgICAgIGRpc3BsYXk9e2Rpc3BsYXkocHJvcGVydHkuaXNUaXRsZSl9XG4gICAgICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgICAgIHRpdGxlUHJvcGVydHk9e3RpdGxlUHJvcGVydHl9XG4gICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICBzb3J0Qnk9e3NvcnRCeX1cbiAgICAgICAgICAgIGRpcmVjdGlvbj17ZGlyZWN0aW9ufVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgICA8VGFibGVDZWxsIGtleT1cImFjdGlvbnNcIiBzdHlsZT17eyB3aWR0aDogODAgfX0gLz5cbiAgICAgIDwvVGFibGVSb3c+XG4gICAgPC9UYWJsZUhlYWQ+XG4gIClcbn1cbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Byb2R1Y3QtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEVkaXQgPSBQcm9kdWN0RWRpdFxuaW1wb3J0IENhdGVnb3J5RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jYXRlZ29yeS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeUVkaXQgPSBDYXRlZ29yeUVkaXRcbmltcG9ydCBDbXNMaXN0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Ntcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DbXNMaXN0ID0gQ21zTGlzdFxuaW1wb3J0IFJldmlld0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJldmlld0VkaXQgPSBSZXZpZXdFZGl0XG5pbXBvcnQgU2V0dGluZ3NFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNldHRpbmdzRWRpdCA9IFNldHRpbmdzRWRpdFxuaW1wb3J0IENvdXBvbkVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY291cG9uLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNvdXBvbkVkaXQgPSBDb3Vwb25FZGl0XG5pbXBvcnQgT3JkZXJEZXRhaWwgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvb3JkZXItZGV0YWlsJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckRldGFpbCA9IE9yZGVyRGV0YWlsXG5pbXBvcnQgQ2hhbmdlUGFzc3dvcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2hhbmdlLXBhc3N3b3JkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DaGFuZ2VQYXNzd29yZCA9IENoYW5nZVBhc3N3b3JkXG5pbXBvcnQgUGFydG5lckVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5QYXJ0bmVyRWRpdCA9IFBhcnRuZXJFZGl0XG5pbXBvcnQgUGluY29kZUVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGluY29kZS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5QaW5jb2RlRWRpdCA9IFBpbmNvZGVFZGl0XG5pbXBvcnQgU3RhdHVzVG9nZ2xlIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3N0YXR1cy10b2dnbGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlN0YXR1c1RvZ2dsZSA9IFN0YXR1c1RvZ2dsZVxuaW1wb3J0IEN1c3RvbWVyRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jdXN0b21lci1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DdXN0b21lckVkaXQgPSBDdXN0b21lckVkaXRcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9sb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IEFjdGlvbkhlYWRlciBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9hY3Rpb24taGVhZGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5BY3Rpb25IZWFkZXIgPSBBY3Rpb25IZWFkZXJcbmltcG9ydCBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5ID0gRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5XG5pbXBvcnQgU2lkZWJhclJlc291cmNlU2VjdGlvbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2lkZWJhclJlc291cmNlU2VjdGlvbiA9IFNpZGViYXJSZXNvdXJjZVNlY3Rpb25cbmltcG9ydCBSZWNvcmRzVGFibGUgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmVjb3Jkcy10YWJsZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVjb3Jkc1RhYmxlID0gUmVjb3Jkc1RhYmxlXG5pbXBvcnQgUmVjb3Jkc1RhYmxlSGVhZGVyIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUtaGVhZGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWNvcmRzVGFibGVIZWFkZXIgPSBSZWNvcmRzVGFibGVIZWFkZXIiXSwibmFtZXMiOlsidXNlQW5jaG9yZWRNZW51Iiwib3BlbiIsIndyYXBSZWYiLCJ1c2VSZWYiLCJvcGVuVXAiLCJzZXRPcGVuVXAiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVuZGVmaW5lZCIsInVwZGF0ZSIsIm5vZGUiLCJjdXJyZW50IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwYWNlQmVsb3ciLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImJvdHRvbSIsInRvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiU2VhcmNoYWJsZU11bHRpU2VsZWN0Iiwib3B0aW9ucyIsInNlbGVjdGVkIiwib25DaGFuZ2UiLCJwbGFjZWhvbGRlciIsInNlYXJjaFBsYWNlaG9sZGVyIiwic2V0T3BlbiIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJvbkRvY0NsaWNrIiwiZXZlbnQiLCJjb250YWlucyIsInRhcmdldCIsImRvY3VtZW50Iiwic2VsZWN0ZWRTZXQiLCJ1c2VNZW1vIiwiU2V0Iiwic2VsZWN0ZWRPcHRpb25zIiwiZmlsdGVyIiwiaXRlbSIsImhhcyIsInZhbHVlIiwiZmlsdGVyZWQiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJ0cmltIiwidG9nZ2xlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVmIiwidHlwZSIsIm9uQ2xpY2siLCJsZW5ndGgiLCJtYXAiLCJrZXkiLCJyb2xlIiwidGFiSW5kZXgiLCJzdG9wUHJvcGFnYXRpb24iLCJhdXRvRm9jdXMiLCJjaGVja2VkIiwiRmxhZ0NhcmQiLCJ0aXRsZSIsImhpbnQiLCJpc0ZsYWdPbiIsIlN0YXR1c1N3aXRjaCIsImRpc2FibGVkIiwiY29tcGFjdCIsInByZXZlbnREZWZhdWx0IiwiU2VhcmNoYWJsZVNlbGVjdCIsImZpbmQiLCJhY3RpdmUiLCJMb2NhbFNlbGVjdCIsIlN0cmluZyIsImFwaSIsIkFwaUNsaWVudCIsIlJBTkdFUyIsIldJREdFVFMiLCJpbnIiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsIlJhbmdlU2VsZWN0IiwiYXhpc01heCIsInBhZGRlZCIsIm1hZ25pdHVkZSIsIk1hdGgiLCJmbG9vciIsImxvZzEwIiwibm9ybWFsaXplZCIsIm5pY2UiLCJMaW5lQ2hhcnQiLCJzZXJpZXMiLCJob3ZlciIsInNldEhvdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJwYWRMZWZ0IiwicGFkUmlnaHQiLCJwYWRUb3AiLCJwYWRCb3R0b20iLCJtYXgiLCJwb2ludCIsIm9yZGVyVmFsdWUiLCJwbG90V2lkdGgiLCJwbG90SGVpZ2h0IiwiYmFzZWxpbmUiLCJ5Rm9yIiwic3RlcCIsImNvb3JkcyIsImluZGV4IiwieCIsInkiLCJsaW5lIiwiam9pbiIsImFyZWEiLCJsYWJlbEV2ZXJ5IiwiY2VpbCIsInRpY2tzIiwicmF0aW8iLCJyb3VuZCIsIm9uTW91c2VMZWF2ZSIsInZpZXdCb3giLCJ0aWNrIiwieDEiLCJ4MiIsInkxIiwieTIiLCJ0ZXh0QW5jaG9yIiwiZCIsImZpbGwiLCJvcGFjaXR5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZUxpbmVjYXAiLCJkYXRlIiwiY3giLCJjeSIsInIiLCJvbk1vdXNlRW50ZXIiLCJwb2ludGVyRXZlbnRzIiwic3R5bGUiLCJsZWZ0IiwiUGFnZXIiLCJwYWdlIiwicGFnZVNpemUiLCJ0b3RhbCIsInBhZ2VzIiwibnVtYmVycyIsIm51bWJlciIsInB1c2giLCJEYXNoYm9hcmQiLCJyZXF1ZXN0cyIsInJhbmdlcyIsInNldFJhbmdlcyIsIm9yZGVycyIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiZGF0YSIsInNldERhdGEiLCJzZXRQYWdlcyIsImJ1c3kiLCJzZXRCdXN5IiwibG9hZFdpZGdldCIsIndpZGdldCIsInJhbmdlIiwidGlja2V0IiwiZ2V0RGFzaGJvYXJkIiwicGFyYW1zIiwidGhlbiIsInJlc3BvbnNlIiwiZmluYWxseSIsImZvckVhY2giLCJjaGFuZ2VSYW5nZSIsImNoYW5nZVBhZ2UiLCJCb3giLCJ2YXJpYW50IiwiSDIiLCJtYiIsIkg1IiwiVGV4dCIsIm9yZGVyQ291bnQiLCJyb3dzIiwicm93IiwiaWQiLCJvcmRlck5vIiwibmFtZSIsImFtb3VudCIsInBsYWNlZEF0IiwicGhvbmUiLCJkYXRlT2ZCaXJ0aCIsInJlZ2lzdGVyZWRBdCIsIm5vcm1hbGl6ZVNsdWdJbnB1dCIsInJlcGxhY2UiLCJ3aXRob3V0VHJhaWxpbmdTbGFzaCIsInBhcnNlU2x1Z3MiLCJyYXciLCJBcnJheSIsImlzQXJyYXkiLCJCb29sZWFuIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwic3BsaXQiLCJQcm9kdWN0RWRpdCIsInByb3BzIiwicmVjb3JkIiwiaW5pdGlhbFJlY29yZCIsInJlc291cmNlIiwiaGFuZGxlQ2hhbmdlIiwic3VibWl0IiwiaGFuZGxlU3VibWl0IiwibG9hZGluZyIsInVzZVJlY29yZCIsImFkZE5vdGljZSIsInVzZU5vdGljZSIsImZpbGVSZWYiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJzbHVnRWRpdGVkIiwic2V0U2x1Z0VkaXRlZCIsInNsdWciLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsImNhdGVnb3JpZXMiLCJzZXRDYXRlZ29yaWVzIiwiY3VzdG9tIiwiYXBpQmFzZVVybCIsInByb2R1Y3RVcmxCYXNlIiwibG9jYXRpb24iLCJvcmlnaW4iLCJzbHVnSW5wdXQiLCJwcmV2aWV3U2x1ZyIsInByb2R1Y3RVcmwiLCJzZWxlY3RlZENhdGVnb3J5U2x1Z3MiLCJjYXRlZ29yeUlkcyIsImltYWdlVXJsIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiaWdub3JlIiwiZmV0Y2giLCJqc29uIiwiY2F0Y2giLCJzZXRGaWVsZCIsIm9uUHJvcGVydHlDaGFuZ2UiLCJwcm9wZXJ0eVBhdGgiLCJyZXN0Iiwic2V0U2VsZWN0ZWRDYXRlZ29yaWVzIiwic2x1Z3MiLCJzdHJpbmdpZnkiLCJ1cGxvYWRJbWFnZSIsImZpbGUiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJsb2NhbFByZXZpZXdVcmwiLCJjcmVhdGVPYmplY3RVUkwiLCJtZXRob2QiLCJib2R5Iiwib2siLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsIm5vdGljZSIsImRlc2NyaXB0aW9uUHJvcGVydHkiLCJlZGl0UHJvcGVydGllcyIsInByb3BlcnR5IiwiYXMiLCJvblN1Ym1pdCIsIkgzIiwiY29sb3IiLCJyZXF1aXJlZCIsIm10IiwiaHJlZiIsInJlbCIsIm1pbiIsInByaWNlVmFsdWUiLCJvbGRQcmljZVZhbHVlIiwid2VpZ2h0IiwiYmFkZ2UiLCJzdG9jayIsInNvcnRPcmRlciIsInNyYyIsImFsdCIsImFjY2VwdCIsImlzQmVzdFNlbGxlciIsImlzSW1wb3J0ZWQiLCJpc0ZlYXR1cmVkIiwiaXNBY3RpdmUiLCJtaW5IZWlnaHQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJ3aGVyZSIsIkJ1dHRvbiIsIkljb24iLCJpY29uIiwic3BpbiIsIkNhdGVnb3J5RWRpdCIsImJhbm5lckZpbGVSZWYiLCJiYW5uZXJVcGxvYWRpbmciLCJzZXRCYW5uZXJVcGxvYWRpbmciLCJiYW5uZXJQcmV2aWV3VXJsIiwic2V0QmFubmVyUHJldmlld1VybCIsImNhdGVnb3J5VXJsQmFzZSIsImNhdGVnb3J5VXJsIiwiYmFubmVySW1hZ2VVcmwiLCJiYW5uZXJJbWFnZSIsImRpc3BsYXllZEJhbm5lclVybCIsInVwbG9hZFRvIiwiZmllbGQiLCJzZXRMb2NhbFByZXZpZXciLCJzdWNjZXNzTWVzc2FnZSIsInN1YnRpdGxlIiwibWFyZ2luVG9wIiwiZGlzcGxheSIsIlBFUl9QQUdFX09QVElPTlMiLCJDbXNMaXN0Iiwic2V0VGFnIiwidGl0bGVQcm9wIiwidGl0bGVQcm9wZXJ0eSIsInN0b3JlUGFyYW1zIiwiZmlsdGVycyIsInVzZVF1ZXJ5UGFyYW1zIiwicmVjb3JkcyIsImRpcmVjdGlvbiIsInNvcnRCeSIsImZldGNoRGF0YSIsInBlclBhZ2UiLCJ1c2VSZWNvcmRzIiwic2VsZWN0ZWRSZWNvcmRzIiwiaGFuZGxlU2VsZWN0IiwiaGFuZGxlU2VsZWN0QWxsIiwic2V0U2VsZWN0ZWRSZWNvcmRzIiwidXNlU2VsZWN0ZWRSZWNvcmRzIiwiZGVib3VuY2VSZWYiLCJzdG9yZVBhcmFtc1JlZiIsInRvU3RyaW5nIiwiaGFuZGxlUXVlcnlDaGFuZ2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidHJpbW1lZCIsImhhbmRsZUFjdGlvblBlcmZvcm1lZCIsImN1cnJlbnRQYWdlIiwicm93c1BlclBhZ2UiLCJ0b3RhbFJvd3MiLCJ0b3RhbFBhZ2VzIiwiZnJvbSIsInRvIiwiZ29Ub1BhZ2UiLCJuZXh0UGFnZSIsInNhZmUiLCJjaGFuZ2VQZXJQYWdlIiwibmV4dCIsInBhZ2VOdW1iZXJzIiwid2luZG93U2l6ZSIsInN0YXJ0IiwiZW5kIiwicG9zaXRpb24iLCJtYXhXaWR0aCIsInRyYW5zZm9ybSIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwib3B0aW9uIiwiUmV2aWV3RWRpdCIsInByb3BlcnR5QnlQYXRoIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJyZW5kZXJQcm9wZXJ0eSIsInJlbWFpbmluZ1Byb3BlcnRpZXMiLCJwIiwiSDQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiZyIsIm9iamVjdEZpdCIsIlRBQlMiLCJmaWVsZHMiLCJyZXNvbHZlSW1hZ2VVcmwiLCJJbWFnZVVwbG9hZGVyIiwib25VcGxvYWQiLCJ3aWRlIiwiZGlzcGxheWVkIiwiU2V0dGluZ3NFZGl0IiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwibW9iaWxlQmFubmVyRmlsZVJlZiIsImhpZ2hsaWdodEZpbGVSZWYiLCJiYW5uZXJQcmV2aWV3Iiwic2V0QmFubmVyUHJldmlldyIsIm1vYmlsZUJhbm5lclByZXZpZXciLCJzZXRNb2JpbGVCYW5uZXJQcmV2aWV3IiwiaGlnaGxpZ2h0UHJldmlldyIsInNldEhpZ2hsaWdodFByZXZpZXciLCJtb2JpbGVCYW5uZXJVcGxvYWRpbmciLCJzZXRNb2JpbGVCYW5uZXJVcGxvYWRpbmciLCJoaWdobGlnaHRVcGxvYWRpbmciLCJzZXRIaWdobGlnaHRVcGxvYWRpbmciLCJob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzIiwiaG9tZUJhbm5lckltYWdlIiwibW9iaWxlQmFubmVySW1hZ2VVcmwiLCJob21lTW9iaWxlQmFubmVySW1hZ2UiLCJoaWdobGlnaHRJbWFnZVVybCIsImhvbWVIaWdobGlnaHRJbWFnZSIsImhhc2giLCJzb21lIiwidGFiIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsInNldFByZXZpZXciLCJmbGV4IiwiZmxleERpcmVjdGlvbiIsIkRyYXdlckNvbnRlbnQiLCJwcm9wZXJ0aWVzIiwic2hpcHBpbmdGZWUiLCJoYW5kbGluZ0ZlZSIsIkRyYXdlckZvb3RlciIsInBhZCIsIm51bSIsInBhZFN0YXJ0IiwidG9EYXRldGltZVZhbHVlIiwiRGF0ZSIsImlzTmFOIiwiZ2V0VGltZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZm9ybWF0RGF0ZXRpbWVMYWJlbCIsImRheSIsIm1vbnRoIiwieWVhciIsImhvdXIiLCJtaW51dGUiLCJDaG9pY2VDYXJkIiwiQW5jaG9yZWRTZWxlY3QiLCJEYXRlVGltZVBpY2tlciIsInZhbGlkIiwibW9udGhEYXRlIiwic2V0TW9udGhEYXRlIiwiaG91cnMiLCJzZXRIb3VycyIsIm1pbnV0ZXMiLCJzZXRNaW51dGVzIiwiZmlyc3REYXkiLCJnZXREYXkiLCJ0b3RhbERheXMiLCJjZWxscyIsImkiLCJhcHBseSIsIm5leHRIb3VycyIsIm5leHRNaW51dGVzIiwic2VsZWN0ZWREYXkiLCJDb3Vwb25FZGl0Iiwic2V0UHJvZHVjdHMiLCJzZWxlY3RlZFNsdWdzIiwidGFyZ2V0U2x1Z3MiLCJ0YXJnZXRUeXBlIiwiYXBwbHlPbiIsInVzYWdlVHlwZSIsImNvdXBvblR5cGUiLCJsb2FkQ2F0YWxvZyIsImNhdGVnb3J5RGF0YSIsImFsbFByb2R1Y3RzIiwiaGFzTW9yZSIsInByb2R1Y3REYXRhIiwic2V0U2VsZWN0ZWRTbHVncyIsInByb2R1Y3RPcHRpb25zIiwiY2F0ZWdvcnlPcHRpb25zIiwiY29kZSIsInRvVXBwZXJDYXNlIiwibWluQ2FydCIsIm1heERpc2NvdW50IiwidXNhZ2VMaW1pdCIsInVzZWRDb3VudCIsInN0YXJ0c0F0IiwiZXhwaXJlc0F0IiwiRlVMRklMTE1FTlQiLCJQQVlNRU5UX09QVElPTlMiLCJmb3JtYXRNb25leSIsImZvcm1hdERhdGVUaW1lIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwicmVzb2x2ZUltYWdlIiwiTW9yZU1lbnUiLCJ1bnBhaWQiLCJvbkNhc2giLCJvblFyIiwic25hcHNob3QiLCJzdGF0dXMiLCJwYXltZW50U3RhdHVzIiwiZGVsaXZlcnlQYXJ0bmVySWQiLCJjb250YWN0TmFtZSIsImNvbnRhY3RQaG9uZSIsImFkZHJlc3NMaW5lMSIsImFkZHJlc3NMaW5lMiIsImFkZHJlc3NDaXR5IiwiYWRkcmVzc1N0YXRlIiwiYWRkcmVzc1BpbmNvZGUiLCJhZGRyZXNzTGFuZG1hcmsiLCJPcmRlckRldGFpbCIsImFjdGlvbiIsInNldFJlY29yZCIsInNhdmluZyIsInNldFNhdmluZyIsImFjdGlvbkJ1c3kiLCJzZXRBY3Rpb25CdXN5IiwicGFydG5lcnMiLCJzZXRQYXJ0bmVycyIsInNldEJhc2VsaW5lIiwiZWRpdENvbnRhY3QiLCJzZXRFZGl0Q29udGFjdCIsImVkaXRBZGRyZXNzIiwic2V0RWRpdEFkZHJlc3MiLCJwYXRobmFtZSIsInJlc291cmNlQWN0aW9uIiwicmVzb3VyY2VJZCIsImFjdGlvbk5hbWUiLCJpdGVtcyIsIml0ZW1zSnNvbiIsImRpcnR5Iiwia2V5cyIsImxpc3RVcmwiLCJoYW5kbGVTYXZlIiwicGluIiwicnVuUGF5bWVudEFjdGlvbiIsImNvbmZpcm0iLCJyZWNvcmRBY3Rpb24iLCJyZWNvcmRJZCIsInN0YXR1c0xhYmVsIiwicmVzdG9yZUZpZWxkcyIsImNsb3NlIiwiYWRkcmVzc1RleHQiLCJwYXltZW50TGFiZWwiLCJwYXJ0bmVyTmFtZSIsImRlbGl2ZXJ5UGFydG5lck5hbWUiLCJkZWxpdmVyeVBhcnRuZXJQaG9uZSIsIml0ZW1Db3VudCIsInJlZHVjZSIsInN1bSIsInF1YW50aXR5IiwiY3JlYXRlZEF0IiwibGluZVRvdGFsIiwicGF5bWVudE1ldGhvZCIsIml0ZW1zVG90YWwiLCJkZWxpdmVyeUNoYXJnZSIsImhhbmRsaW5nQ2hhcmdlIiwic21hbGxDYXJ0Q2hhcmdlIiwiZGlzY291bnQiLCJjb3Vwb25Db2RlIiwiZ3JhbmRUb3RhbCIsInBheW1lbnRDb2xsZWN0ZWRBcyIsInJhem9ycGF5UGF5bWVudElkIiwicmF6b3JwYXlRclVybCIsImlucHV0TW9kZSIsIkV5ZUljb24iLCJoaWRkZW4iLCJQYXNzd29yZEZpZWxkIiwidmlzaWJsZSIsIm9uVG9nZ2xlIiwiTGFiZWwiLCJodG1sRm9yIiwiYXV0b0NvbXBsZXRlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJiYWNrZ3JvdW5kIiwiY3Vyc29yIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsIkNoYW5nZVBhc3N3b3JkIiwicGFzc3dvcmQiLCJzZXRQYXNzd29yZCIsImNvbmZpcm1QYXNzd29yZCIsInNldENvbmZpcm1QYXNzd29yZCIsInNob3dQYXNzd29yZCIsInNldFNob3dQYXNzd29yZCIsInNob3dDb25maXJtIiwic2V0U2hvd0NvbmZpcm0iLCJzZXRFcnJvciIsImJhY2siLCJzYXZlIiwicmVkaXJlY3RVcmwiLCJlcnIiLCJpbnNldCIsInpJbmRleCIsImJveFNoYWRvdyIsImVtYWlsIiwiZ2FwIiwiSU5ESUFfU1RBVEVTIiwiVkVISUNMRV9UWVBFUyIsIlNUQVRFX09QVElPTlMiLCJGaWVsZEVycm9yIiwiUGFydG5lckVkaXQiLCJpc05ldyIsInJlYWRPbmx5IiwiaGFzUGFzc3dvcmQiLCJlcnJvcnMiLCJtYXhMZW5ndGgiLCJzbGljZSIsImZhdGhlck5hbWUiLCJwYW5OdW1iZXIiLCJhYWRoYWFyTnVtYmVyIiwiY2l0eSIsInBpbmNvZGUiLCJzdGF0ZSIsInBlcm1hbmVudEFkZHJlc3MiLCJlbWVyZ2VuY3lOYW1lIiwiZW1lcmdlbmN5UGhvbmUiLCJ2ZWhpY2xlVHlwZSIsInZlaGljbGVOdW1iZXIiLCJhY2NvdW50SG9sZGVyTmFtZSIsImFjY291bnROdW1iZXIiLCJpZnNjQ29kZSIsIm5vdGVzIiwiUGluY29kZUVkaXQiLCJwYXJ0bmVySWQiLCJwYXJ0bmVyIiwibWFyZ2luIiwiYXJlYUxhYmVsIiwic3RhdGVDb2RlIiwiU3RhdHVzVG9nZ2xlIiwic2V0Q2hlY2tlZCIsInBlcnNpc3QiLCJzYXZlZCIsImRlc2NyaXB0aW9uIiwidG9EYXRlSW5wdXQiLCJ0ZXh0IiwiZm9ybWF0V2hlbiIsInBhcnNlQWRkcmVzc2VzIiwiYWRkcmVzc2VzIiwiZ3JvdXBlZCIsImVudHJpZXMiLCJtYXRjaCIsInNvcnQiLCJhIiwiYiIsImFkZHJlc3NMaW5lcyIsImFkZHJlc3MiLCJsaW5lMSIsImxpbmUyIiwibGFuZG1hcmsiLCJDdXN0b21lckVkaXQiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImFkbWluUm9vdCIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsImhlYWRlcnMiLCJzZXNzaW9uSWQiLCJydW5JZCIsImh5cG90aGVzaXNJZCIsInJlZHV4Um9vdCIsIlJFRFVYX1NUQVRFIiwicGF0aHMiLCJyb290UGF0aCIsImhhc0lkZW50aWZpZXIiLCJ0aW1lc3RhbXAiLCJub3ciLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsIk1lc3NhZ2VCb3giLCJGb3JtR3JvdXAiLCJkZWZhdWx0VmFsdWUiLCJtYXJnaW5SaWdodCIsImZvbnRTaXplIiwidGV4dEFsaWduIiwiZm9udFdlaWdodCIsImFkbWluUm9vdFBhdGgiLCJjYXRhbG9nQ29uZmlnIiwiZXhwb3J0VXJsIiwiaW1wb3J0VXJsIiwiQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIiwib25JbXBvcnRlZCIsInRyYW5zbGF0ZUJ1dHRvbiIsInRyYW5zbGF0ZUFjdGlvbiIsInRvZ2dsZUZpbHRlciIsImZpbHRlcnNDb3VudCIsInVzZUZpbHRlckRyYXdlciIsInNldExvYWRpbmciLCJzZXRNZXNzYWdlIiwiY29uZmlnIiwicm9vdCIsImhhbmRsZUltcG9ydCIsImNyZWRlbnRpYWxzIiwiZXJyb3JDb3VudCIsImNyZWF0ZWQiLCJ1cGRhdGVkIiwiYnV0dG9ucyIsImNsaWNrIiwibmV3QWN0aW9uIiwicmVzb3VyY2VBY3Rpb25zIiwiZmlsdGVyS2V5IiwiY291bnQiLCJGcmFnbWVudCIsImZsZXhTaHJpbmsiLCJweCIsIkJ1dHRvbkdyb3VwIiwib25DbG9zZUNsaWNrIiwiQ0FUQUxPR19SRVNPVVJDRVMiLCJBY3Rpb25IZWFkZXIiLCJPcmlnaW5hbENvbXBvbmVudCIsIkJhc2VIZWFkZXIiLCJPcmlnaW5hbEFjdGlvbkhlYWRlciIsImlzQ2F0YWxvZ0xpc3QiLCJfaWdub3JlZCIsImhlYWRlclByb3BzIiwiX2V4dGVuZHMiLCJvbWl0QWN0aW9ucyIsIkRFRkFVTFRfT1BUSU9OUyIsInBsdWdpbnMiLCJ0b29sYmFyIiwiUmljaHRleHRFZGl0IiwiaGFuZGxlVXBkYXRlIiwidXNlQ2FsbGJhY2siLCJuZXdWYWx1ZSIsImlzUmVxdWlyZWQiLCJUaW55TUNFIiwiRm9ybU1lc3NhZ2UiLCJtZW1vIiwiY3V0Iiwic2VhcmNoIiwiU2lkZWJhclJlc291cmNlU2VjdGlvbiIsIk9yaWdpbmFsIiwidXNlTG9jYXRpb24iLCJuYXZpZ2F0ZSIsInVzZU5hdmlnYXRlIiwicmVzb3VyY2VzIiwiZ2V0UmVzb3VyY2VFbGVtZW50Q3NzIiwic3VmZml4IiwiTG9hZGVyIiwiTm9SZWNvcmRzIiwic2VsZWN0ZWRDb3VudCIsInNlbGVjdGVkQWxsIiwiaW5kZXRlcm1pbmF0ZSIsInJlY29yZHNIYXZlQnVsa0FjdGlvbiIsImJ1bGtBY3Rpb25zIiwiY29udGVudFRhZyIsInNlbGVjdGVkVGFnIiwiYm9keVRhZyIsIlRhYmxlIiwiU2VsZWN0ZWRSZWNvcmRzIiwiUmVjb3Jkc1RhYmxlSGVhZGVyIiwibGlzdFByb3BlcnRpZXMiLCJUYWJsZUJvZHkiLCJSZWNvcmRJbkxpc3QiLCJpc1NlbGVjdGVkIiwiaXNUaXRsZSIsIlNlbGVjdEFsbENoZWNrQm94IiwiaW5wdXRSZWYiLCJtYXJnaW5MZWZ0IiwicG9pbnRzIiwicm93VGFnIiwiY2hlY2tib3hDc3MiLCJUYWJsZUhlYWQiLCJUYWJsZVJvdyIsIlRhYmxlQ2VsbCIsIlByb3BlcnR5SGVhZGVyIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRU8sU0FBU0EsaUJBQWVBLENBQUNDLElBQUksRUFBRTtFQUNwQyxFQUFBLE1BQU1DLE9BQU8sR0FBR0MsWUFBTSxDQUFDLElBQUksQ0FBQztJQUM1QixNQUFNLENBQUNDLE1BQU0sRUFBRUMsU0FBUyxDQUFDLEdBQUdDLGNBQVEsQ0FBQyxLQUFLLENBQUM7RUFFM0NDLEVBQUFBLGVBQVMsQ0FBQyxNQUFNO0VBQ2QsSUFBQSxJQUFJLENBQUNOLElBQUksRUFBRSxPQUFPTyxTQUFTO01BRTNCLE1BQU1DLE1BQU0sR0FBR0EsTUFBTTtFQUNuQixNQUFBLE1BQU1DLElBQUksR0FBR1IsT0FBTyxDQUFDUyxPQUFPO1FBQzVCLElBQUksQ0FBQ0QsSUFBSSxFQUFFO0VBQ1gsTUFBQSxNQUFNRSxJQUFJLEdBQUdGLElBQUksQ0FBQ0cscUJBQXFCLEVBQUU7UUFDekMsTUFBTUMsVUFBVSxHQUFHQyxNQUFNLENBQUNDLFdBQVcsR0FBR0osSUFBSSxDQUFDSyxNQUFNO1FBQ25EWixTQUFTLENBQUNTLFVBQVUsR0FBRyxHQUFHLElBQUlGLElBQUksQ0FBQ00sR0FBRyxHQUFHSixVQUFVLENBQUM7TUFDdEQsQ0FBQztFQUVETCxJQUFBQSxNQUFNLEVBQUU7RUFDUk0sSUFBQUEsTUFBTSxDQUFDSSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUVWLE1BQU0sQ0FBQztNQUN6Q00sTUFBTSxDQUFDSSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUVWLE1BQU0sRUFBRSxJQUFJLENBQUM7RUFD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
