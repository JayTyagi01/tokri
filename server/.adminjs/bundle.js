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
    fields: ['homeBannerImage', 'homeHighlightImage', 'homeFeaturedCategorySlugs']
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
    }, "They log in to the Tokriii Partner app with this email after setting a password from the invite mail.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
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
    }), errors.email ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.email.message) : /*#__PURE__*/React__default.default.createElement("span", {
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
    }), errors.phone ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.phone.message) : null))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Profile"), /*#__PURE__*/React__default.default.createElement("p", null, "Name is shown on orders. Address is optional and only for your team."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Full name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      readOnly: readOnly,
      value: params.name || '',
      onChange: event => setField('name', event.target.value),
      placeholder: "Partner name"
    }), errors.name ? /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, errors.name.message) : null), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Address ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      readOnly: readOnly,
      value: params.address || '',
      onChange: event => setField('address', event.target.value),
      placeholder: "Area, city, or hub"
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Internal notes ", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-optional"
    }, "(optional)"), /*#__PURE__*/React__default.default.createElement("textarea", {
      className: "tokri-coupon-input tokri-textarea",
      rows: 4,
      readOnly: readOnly,
      value: params.notes || '',
      onChange: event => setField('notes', event.target.value),
      placeholder: "Shift timing, vehicle, or anything your team should remember"
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

})(React, AdminJS, AdminJSDesignSystem, ReactRouter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3JtLWNvbnRyb2xzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2luZGlhLXN0YXRlcy5qcyIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBbmNob3JlZE1lbnUob3Blbikge1xuICBjb25zdCB3cmFwUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtvcGVuVXAsIHNldE9wZW5VcF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdyYXBSZWYuY3VycmVudFxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBzcGFjZUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b21cbiAgICAgIHNldE9wZW5VcChzcGFjZUJlbG93IDwgMjQwICYmIHJlY3QudG9wID4gc3BhY2VCZWxvdylcbiAgICB9XG5cbiAgICB1cGRhdGUoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgfVxuICB9LCBbb3Blbl0pXG5cbiAgcmV0dXJuIHsgd3JhcFJlZiwgb3BlblVwIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNlYXJjaGFibGVNdWx0aVNlbGVjdCh7IG9wdGlvbnMsIHNlbGVjdGVkLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHNlYXJjaFBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTZXQgPSB1c2VNZW1vKCgpID0+IG5ldyBTZXQoc2VsZWN0ZWQpLCBbc2VsZWN0ZWRdKVxuICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT4gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpKVxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgY29uc3QgdG9nZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkU2V0Lmhhcyh2YWx1ZSkpIG9uQ2hhbmdlKHNlbGVjdGVkLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gdmFsdWUpKVxuICAgIGVsc2Ugb25DaGFuZ2UoWy4uLnNlbGVjdGVkLCB2YWx1ZV0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHZhbHVlKSA9PiAhdmFsdWUpfT5cbiAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcHNcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcFwiPlxuICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDDl1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyXCI+e3BsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFF1ZXJ5KGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VhcmNoUGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2NoZWNrZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9eygpID0+IHRvZ2dsZShpdGVtLnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRmxhZ0NhcmQoeyBzZWxlY3RlZCwgdGl0bGUsIGhpbnQsIG9uQ2xpY2sgfSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktY2hvaWNlLWNhcmQke3NlbGVjdGVkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cbiAgICAgIDxzcGFuPntoaW50fTwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGbGFnT24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSAndHJ1ZScgfHwgdmFsdWUgPT09ICdvbicgfHwgdmFsdWUgPT09IDEgfHwgdmFsdWUgPT09ICcxJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU3RhdHVzU3dpdGNoKHtcbiAgY2hlY2tlZCxcbiAgb25DaGFuZ2UsXG4gIGRpc2FibGVkLFxuICB0aXRsZSxcbiAgaGludCxcbiAgY29tcGFjdCA9IGZhbHNlLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc3dpdGNoJHtjaGVja2VkID8gJyBpcy1vbicgOiAnJ30ke2NvbXBhY3QgPyAnIGlzLWNvbXBhY3QnIDogJyd9YH1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgIGFyaWEtcHJlc3NlZD17Y2hlY2tlZH1cbiAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGlmICghZGlzYWJsZWQpIG9uQ2hhbmdlKCFjaGVja2VkKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtdHJhY2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktc3dpdGNoLXRodW1iXCIgLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIHt0aXRsZSB8fCBoaW50ID8gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtY29weVwiPlxuICAgICAgICAgIHt0aXRsZSA/IDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPiA6IG51bGx9XG4gICAgICAgICAge2hpbnQgPyA8c3Bhbj57aGludH08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKSA6IChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktc3RhdHVzLXBpbGwke2NoZWNrZWQgPyAnIGlzLW9uJyA6ICcnfWB9PntjaGVja2VkID8gJ0FjdGl2ZScgOiAnSW5hY3RpdmUnfTwvc3Bhbj5cbiAgICAgICl9XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNlYXJjaGFibGVTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciwgZGlzYWJsZWQgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuICBjb25zdCBzZWxlY3RlZCA9IG9wdGlvbnMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiXG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGlmICghZGlzYWJsZWQpIHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3NlbGVjdGVkID8gJycgOiAndG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXInfT5cbiAgICAgICAgICB7c2VsZWN0ZWQ/LmxhYmVsIHx8IHBsYWNlaG9sZGVyfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGl0ZW0udmFsdWUgPT09IHZhbHVlXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZSB8fCAnZW1wdHknfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2FjdGl2ZSA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICBzZXRRdWVyeSgnJylcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gTG9jYWxTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIGRpc2FibGVkIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IFN0cmluZyhpdGVtLnZhbHVlKSA9PT0gU3RyaW5nKHZhbHVlKSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxvY2FsLXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1sb2NhbC1zZWxlY3QtY29udHJvbFwiXG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGlmICghZGlzYWJsZWQpIHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8c3Bhbj57c2VsZWN0ZWQ/LmxhYmVsIHx8IHZhbHVlfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1sb2NhbC1zZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICB7b3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtTdHJpbmcoaXRlbS52YWx1ZSkgPT09IFN0cmluZyh2YWx1ZSkgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBMb2NhbFNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5jb25zdCBSQU5HRVMgPSBbXG4gIHsgdmFsdWU6ICc3ZCcsIGxhYmVsOiAnNyBkYXlzJyB9LFxuICB7IHZhbHVlOiAndGhpc01vbnRoJywgbGFiZWw6ICdUaGlzIG1vbnRoJyB9LFxuICB7IHZhbHVlOiAnbGFzdE1vbnRoJywgbGFiZWw6ICdMYXN0IG1vbnRoJyB9LFxuICB7IHZhbHVlOiAnOTBkJywgbGFiZWw6ICczIG1vbnRocycgfSxcbl1cbmNvbnN0IFdJREdFVFMgPSBbJ29yZGVyVmFsdWUnLCAnb3JkZXJzJywgJ2N1c3RvbWVycycsICdwcm9kdWN0cyddXG5cbmNvbnN0IGluciA9ICh2YWx1ZSkgPT5cbiAgYOKCuSR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwIH0pfWBcblxuZnVuY3Rpb24gUmFuZ2VTZWxlY3QoeyB2YWx1ZSwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktcmFuZ2Utc2VsZWN0XCI+XG4gICAgICA8TG9jYWxTZWxlY3QgdmFsdWU9e3ZhbHVlfSBvcHRpb25zPXtSQU5HRVN9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBheGlzTWF4KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA8PSAwKSByZXR1cm4gMTAwMFxuICBjb25zdCBwYWRkZWQgPSB2YWx1ZSAqIDEuMVxuICBjb25zdCBtYWduaXR1ZGUgPSAxMCAqKiBNYXRoLmZsb29yKE1hdGgubG9nMTAocGFkZGVkKSlcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHBhZGRlZCAvIG1hZ25pdHVkZVxuICBjb25zdCBuaWNlID0gbm9ybWFsaXplZCA8PSAxID8gMSA6IG5vcm1hbGl6ZWQgPD0gMiA/IDIgOiBub3JtYWxpemVkIDw9IDUgPyA1IDogMTBcbiAgcmV0dXJuIG5pY2UgKiBtYWduaXR1ZGVcbn1cblxuZnVuY3Rpb24gTGluZUNoYXJ0KHsgc2VyaWVzIH0pIHtcbiAgY29uc3QgW2hvdmVyLCBzZXRIb3Zlcl0gPSB1c2VTdGF0ZShudWxsKVxuICBjb25zdCB3aWR0aCA9IDEyMDBcbiAgY29uc3QgaGVpZ2h0ID0gMzIwXG4gIGNvbnN0IHBhZExlZnQgPSA4NlxuICBjb25zdCBwYWRSaWdodCA9IDE4XG4gIGNvbnN0IHBhZFRvcCA9IDE4XG4gIGNvbnN0IHBhZEJvdHRvbSA9IDM2XG4gIGNvbnN0IG1heCA9IGF4aXNNYXgoTWF0aC5tYXgoLi4uc2VyaWVzLm1hcCgocG9pbnQpID0+IHBvaW50Lm9yZGVyVmFsdWUpLCAwKSlcbiAgY29uc3QgcGxvdFdpZHRoID0gd2lkdGggLSBwYWRMZWZ0IC0gcGFkUmlnaHRcbiAgY29uc3QgcGxvdEhlaWdodCA9IGhlaWdodCAtIHBhZFRvcCAtIHBhZEJvdHRvbVxuICBjb25zdCBiYXNlbGluZSA9IHBhZFRvcCArIHBsb3RIZWlnaHRcbiAgY29uc3QgeUZvciA9ICh2YWx1ZSkgPT4gYmFzZWxpbmUgLSAodmFsdWUgLyBtYXgpICogcGxvdEhlaWdodFxuICBjb25zdCBzdGVwID0gc2VyaWVzLmxlbmd0aCA+IDEgPyBwbG90V2lkdGggLyAoc2VyaWVzLmxlbmd0aCAtIDEpIDogcGxvdFdpZHRoXG4gIGNvbnN0IGNvb3JkcyA9IHNlcmllcy5tYXAoKHBvaW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHggPSBzZXJpZXMubGVuZ3RoID09PSAxID8gcGFkTGVmdCArIHBsb3RXaWR0aCAvIDIgOiBwYWRMZWZ0ICsgaW5kZXggKiBzdGVwXG4gICAgcmV0dXJuIHsgeCwgeTogeUZvcihwb2ludC5vcmRlclZhbHVlKSwgcG9pbnQgfVxuICB9KVxuICBjb25zdCBsaW5lID0gY29vcmRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IGAke2luZGV4ID8gJ0wnIDogJ00nfSR7aXRlbS54fSwke2l0ZW0ueX1gKS5qb2luKCcgJylcbiAgY29uc3QgYXJlYSA9IGNvb3Jkcy5sZW5ndGhcbiAgICA/IGAke2xpbmV9IEwke2Nvb3Jkc1tjb29yZHMubGVuZ3RoIC0gMV0ueH0sJHtiYXNlbGluZX0gTCR7Y29vcmRzWzBdLnh9LCR7YmFzZWxpbmV9IFpgXG4gICAgOiAnJ1xuICBjb25zdCBsYWJlbEV2ZXJ5ID0gc2VyaWVzLmxlbmd0aCA+IDIwID8gTWF0aC5jZWlsKHNlcmllcy5sZW5ndGggLyA4KSA6IHNlcmllcy5sZW5ndGggPiAxMCA/IDQgOiAxXG4gIGNvbnN0IHRpY2tzID0gWzAsIDAuMjUsIDAuNSwgMC43NSwgMV0ubWFwKChyYXRpbykgPT4gKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChtYXggKiByYXRpbyksXG4gICAgeTogeUZvcihtYXggKiByYXRpbyksXG4gIH0pKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1wbG90XCIgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX0+XG4gICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YH0gY2xhc3NOYW1lPVwidG9rcmktY2hhcnRcIiByb2xlPVwiaW1nXCI+XG4gICAgICAgIHt0aWNrcy5tYXAoKHRpY2spID0+IChcbiAgICAgICAgICA8ZyBrZXk9e3RpY2sudmFsdWV9PlxuICAgICAgICAgICAgPGxpbmUgeDE9e3BhZExlZnR9IHgyPXt3aWR0aCAtIHBhZFJpZ2h0fSB5MT17dGljay55fSB5Mj17dGljay55fSBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1ncmlkbGluZVwiIC8+XG4gICAgICAgICAgICA8dGV4dCB4PXtwYWRMZWZ0IC0gMTB9IHk9e3RpY2sueSArIDR9IHRleHRBbmNob3I9XCJlbmRcIiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1heGlzXCI+XG4gICAgICAgICAgICAgIHtpbnIodGljay52YWx1ZSl9XG4gICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApKX1cbiAgICAgICAgPHBhdGggZD17YXJlYX0gZmlsbD1cIiMwNDc4NTdcIiBvcGFjaXR5PVwiMC4xNlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9e2xpbmV9IGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiM1wiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICB7Y29vcmRzLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgIDxnIGtleT17aXRlbS5wb2ludC5kYXRlfT5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgY3g9e2l0ZW0ueH1cbiAgICAgICAgICAgICAgY3k9e2l0ZW0ueX1cbiAgICAgICAgICAgICAgcj1cIjE0XCJcbiAgICAgICAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3ZlcihpdGVtKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Y2lyY2xlIGN4PXtpdGVtLnh9IGN5PXtpdGVtLnl9IHI9XCI0LjVcIiBmaWxsPVwiI2ZmZlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjJcIiBwb2ludGVyRXZlbnRzPVwibm9uZVwiIC8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApKX1cbiAgICAgICAge2Nvb3Jkcy5tYXAoKGl0ZW0sIGluZGV4KSA9PlxuICAgICAgICAgIGluZGV4ICUgbGFiZWxFdmVyeSA9PT0gMCA/IChcbiAgICAgICAgICAgIDx0ZXh0IGtleT17YCR7aXRlbS5wb2ludC5kYXRlfS1sYWJlbGB9IHg9e2l0ZW0ueH0geT17aGVpZ2h0IC0gOH0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWxhYmVsXCI+XG4gICAgICAgICAgICAgIHtpdGVtLnBvaW50LmxhYmVsfVxuICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICkgOiBudWxsLFxuICAgICAgICApfVxuICAgICAgPC9zdmc+XG4gICAgICB7aG92ZXIgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaGFydC10aXAke2hvdmVyLnkgPCA5MCA/ICcgaXMtYmVsb3cnIDogJyd9YH1cbiAgICAgICAgICBzdHlsZT17eyBsZWZ0OiBgJHsoaG92ZXIueCAvIHdpZHRoKSAqIDEwMH0lYCwgdG9wOiBgJHsoaG92ZXIueSAvIGhlaWdodCkgKiAxMDB9JWAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPntob3Zlci5wb2ludC5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgPHN0cm9uZz57aW5yKGhvdmVyLnBvaW50Lm9yZGVyVmFsdWUpfTwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFBhZ2VyKHsgcGFnZSwgcGFnZVNpemUsIHRvdGFsLCBvbkNoYW5nZSB9KSB7XG4gIGNvbnN0IHBhZ2VzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKCh0b3RhbCB8fCAwKSAvIHBhZ2VTaXplKSlcbiAgaWYgKHBhZ2VzIDw9IDEpIHJldHVybiBudWxsXG4gIGNvbnN0IG51bWJlcnMgPSBbXVxuICBmb3IgKGxldCBudW1iZXIgPSAxOyBudW1iZXIgPD0gcGFnZXM7IG51bWJlciArPSAxKSBudW1iZXJzLnB1c2gobnVtYmVyKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LXBhZ2VzXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1wYWdlc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17cGFnZSA8PSAxfSBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShwYWdlIC0gMSl9PlxuICAgICAgICAgIFByZXZcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIHtudW1iZXJzLm1hcCgobnVtYmVyKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBrZXk9e251bWJlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17bnVtYmVyID09PSBwYWdlID8gJ2lzLWN1cnJlbnQnIDogJyd9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShudW1iZXIpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtudW1iZXJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17cGFnZSA+PSBwYWdlc30gb25DbGljaz17KCkgPT4gb25DaGFuZ2UocGFnZSArIDEpfT5cbiAgICAgICAgICBOZXh0XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICBjb25zdCByZXF1ZXN0cyA9IHVzZVJlZih7fSlcbiAgY29uc3QgW3Jhbmdlcywgc2V0UmFuZ2VzXSA9IHVzZVN0YXRlKHtcbiAgICBvcmRlclZhbHVlOiAnN2QnLFxuICAgIG9yZGVyczogJzdkJyxcbiAgICBjdXN0b21lcnM6ICc3ZCcsXG4gICAgcHJvZHVjdHM6ICc3ZCcsXG4gIH0pXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHt9KVxuICBjb25zdCBbcGFnZXMsIHNldFBhZ2VzXSA9IHVzZVN0YXRlKHsgb3JkZXJzOiAxLCBjdXN0b21lcnM6IDEgfSlcbiAgY29uc3QgW2J1c3ksIHNldEJ1c3ldID0gdXNlU3RhdGUoe1xuICAgIG9yZGVyVmFsdWU6IHRydWUsXG4gICAgb3JkZXJzOiB0cnVlLFxuICAgIGN1c3RvbWVyczogdHJ1ZSxcbiAgICBwcm9kdWN0czogdHJ1ZSxcbiAgfSlcblxuICBjb25zdCBsb2FkV2lkZ2V0ID0gKHdpZGdldCwgcmFuZ2UsIHBhZ2UgPSAxKSA9PiB7XG4gICAgY29uc3QgdGlja2V0ID0gKHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSB8fCAwKSArIDFcbiAgICByZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gPSB0aWNrZXRcbiAgICBzZXRCdXN5KChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogdHJ1ZSB9KSlcbiAgICBhcGlcbiAgICAgIC5nZXREYXNoYm9hcmQoeyBwYXJhbXM6IHsgd2lkZ2V0LCByYW5nZSwgcGFnZSB9IH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSAhPT0gdGlja2V0KSByZXR1cm5cbiAgICAgICAgc2V0RGF0YSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgLi4ucmVzcG9uc2UuZGF0YSB9KSlcbiAgICAgIH0pXG4gICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gIT09IHRpY2tldCkgcmV0dXJuXG4gICAgICAgIHNldEJ1c3koKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiBmYWxzZSB9KSlcbiAgICAgIH0pXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIFdJREdFVFMuZm9yRWFjaCgod2lkZ2V0KSA9PiBsb2FkV2lkZ2V0KHdpZGdldCwgJzdkJykpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGNoYW5nZVJhbmdlID0gKHdpZGdldCwgcmFuZ2UpID0+IHtcbiAgICBzZXRSYW5nZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiByYW5nZSB9KSlcbiAgICBpZiAod2lkZ2V0ID09PSAnb3JkZXJzJyB8fCB3aWRnZXQgPT09ICdjdXN0b21lcnMnKSB7XG4gICAgICBzZXRQYWdlcygoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IDEgfSkpXG4gICAgfVxuICAgIGxvYWRXaWRnZXQod2lkZ2V0LCByYW5nZSwgMSlcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVBhZ2UgPSAod2lkZ2V0LCBwYWdlKSA9PiB7XG4gICAgc2V0UGFnZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiBwYWdlIH0pKVxuICAgIGxvYWRXaWRnZXQod2lkZ2V0LCByYW5nZXNbd2lkZ2V0XSwgcGFnZSlcbiAgfVxuXG4gIGNvbnN0IG9yZGVyVmFsdWUgPSBkYXRhLm9yZGVyVmFsdWVcbiAgY29uc3Qgb3JkZXJzID0gZGF0YS5vcmRlcnNcbiAgY29uc3QgY3VzdG9tZXJzID0gZGF0YS5jdXN0b21lcnNcbiAgY29uc3QgcHJvZHVjdHMgPSBkYXRhLnByb2R1Y3RzXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJ0cmFuc3BhcmVudFwiIGNsYXNzTmFtZT1cInRva3JpLWFuYWx5dGljc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hbmFseXRpY3MtaGVhZFwiPlxuICAgICAgICA8SDIgbWI9XCJzbVwiPkRhc2hib2FyZDwvSDI+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZCB0b2tyaS1jaGFydC1jYXJkLXdpZGVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8SDUgbWI9XCJzbVwiPk9yZGVyIFZhbHVlPC9INT5cbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgIHtidXN5Lm9yZGVyVmFsdWUgJiYgIW9yZGVyVmFsdWVcbiAgICAgICAgICAgICAgICA/ICdMb2FkaW5n4oCmJ1xuICAgICAgICAgICAgICAgIDogYCR7aW5yKG9yZGVyVmFsdWU/LnRvdGFsKX0gZnJvbSAke29yZGVyVmFsdWU/Lm9yZGVyQ291bnQgfHwgMH0gb3JkZXJzYH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5vcmRlclZhbHVlfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgnb3JkZXJWYWx1ZScsIHZhbHVlKX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtvcmRlclZhbHVlPy5zZXJpZXM/Lmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWZyYW1lXCI+XG4gICAgICAgICAgICA8TGluZUNoYXJ0IHNlcmllcz17b3JkZXJWYWx1ZS5zZXJpZXN9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXNwbGl0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SDUgbWI9XCJzbVwiPk9yZGVyIEFtb3VudDwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kub3JkZXJzICYmICFvcmRlcnMgPyAnTG9hZGluZ+KApicgOiBgJHtvcmRlcnM/LnRvdGFsIHx8IDB9IG9yZGVyc2B9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMub3JkZXJzfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgnb3JkZXJzJywgdmFsdWUpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtvcmRlcnM/LnJvd3M/Lmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktdGFibGUtd3JhcFwiPlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidG9rcmktZGF0YS10YWJsZVwiPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk9yZGVyIG51bWJlcjwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkFtb3VudDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5QbGFjZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtvcmRlcnMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm9yZGVyTm99PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntpbnIocm93LmFtb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5wbGFjZWRBdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PntidXN5Lm9yZGVycyA/ICdMb2FkaW5n4oCmJyA6ICdObyBvcmRlcnMgaW4gdGhpcyBwZXJpb2QuJ308L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8UGFnZXJcbiAgICAgICAgICAgIHBhZ2U9e29yZGVycz8ucGFnZSB8fCBwYWdlcy5vcmRlcnN9XG4gICAgICAgICAgICBwYWdlU2l6ZT17b3JkZXJzPy5wYWdlU2l6ZSB8fCAxMH1cbiAgICAgICAgICAgIHRvdGFsPXtvcmRlcnM/LnRvdGFsIHx8IDB9XG4gICAgICAgICAgICBvbkNoYW5nZT17KHBhZ2UpID0+IGNoYW5nZVBhZ2UoJ29yZGVycycsIHBhZ2UpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5OZXcgQ3VzdG9tZXJzPC9INT5cbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAgICB7YnVzeS5jdXN0b21lcnMgJiYgIWN1c3RvbWVycyA/ICdMb2FkaW5n4oCmJyA6IGAke2N1c3RvbWVycz8udG90YWwgfHwgMH0gcGVvcGxlIHJlZ2lzdGVyZWRgfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLmN1c3RvbWVyc30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ2N1c3RvbWVycycsIHZhbHVlKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7Y3VzdG9tZXJzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPlBob25lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkRhdGUgb2YgYmlydGg8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAge2N1c3RvbWVycy5yb3dzLm1hcCgocm93KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3Jvdy5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD4rOTEge3Jvdy5waG9uZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93LmRhdGVPZkJpcnRofTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cucmVnaXN0ZXJlZEF0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+e2J1c3kuY3VzdG9tZXJzID8gJ0xvYWRpbmfigKYnIDogJ05vIG5ldyBjdXN0b21lcnMgaW4gdGhpcyBwZXJpb2QuJ308L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8UGFnZXJcbiAgICAgICAgICAgIHBhZ2U9e2N1c3RvbWVycz8ucGFnZSB8fCBwYWdlcy5jdXN0b21lcnN9XG4gICAgICAgICAgICBwYWdlU2l6ZT17Y3VzdG9tZXJzPy5wYWdlU2l6ZSB8fCAxMH1cbiAgICAgICAgICAgIHRvdGFsPXtjdXN0b21lcnM/LnRvdGFsIHx8IDB9XG4gICAgICAgICAgICBvbkNoYW5nZT17KHBhZ2UpID0+IGNoYW5nZVBhZ2UoJ2N1c3RvbWVycycsIHBhZ2UpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXNwbGl0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SDUgbWI9XCJzbVwiPkJlc3QgU2VsbGluZyBQcm9kdWN0czwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kucHJvZHVjdHMgJiYgIXByb2R1Y3RzID8gJ0xvYWRpbmfigKYnIDogJ1RvcCA1IGJ5IG51bWJlciBvZiBvcmRlcnMnfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLnByb2R1Y3RzfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgncHJvZHVjdHMnLCB2YWx1ZSl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3Byb2R1Y3RzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWN0PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk9yZGVyczwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5BbW91bnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtwcm9kdWN0cy5yb3dzLm1hcCgocm93KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3Jvdy5uYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cub3JkZXJzfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntpbnIocm93LmFtb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT57YnVzeS5wcm9kdWN0cyA/ICdMb2FkaW5n4oCmJyA6ICdObyBwcm9kdWN0cyBzb2xkIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgRmxhZ0NhcmQsIFNlYXJjaGFibGVNdWx0aVNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IG5vcm1hbGl6ZVNsdWdJbnB1dCA9ICh2YWx1ZSkgPT5cbiAgU3RyaW5nKHZhbHVlIHx8ICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bJ1wiXS9nLCAnJylcbiAgICAucmVwbGFjZSgvW15hLXowLTldKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmZ1bmN0aW9uIHBhcnNlU2x1Z3MocmF3KSB7XG4gIGlmICghcmF3KSByZXR1cm4gW11cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5tYXAoKGl0ZW0pID0+IFN0cmluZyhpdGVtKS50cmltKCkpLmZpbHRlcihCb29sZWFuKVxuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpKSByZXR1cm4gcGFyc2VTbHVncyhwYXJzZWQpXG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIHJhd1xuICAgICAgLnNwbGl0KCcsJylcbiAgICAgIC5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICB9XG4gIHJldHVybiBbXVxufVxuXG5jb25zdCBQcm9kdWN0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBwcm9kdWN0VXJsQmFzZSA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKFxuICAgIGN1c3RvbS5wcm9kdWN0VXJsQmFzZSB8fCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9wcm9kdWN0YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubmFtZSlcbiAgY29uc3QgcHJvZHVjdFVybCA9IHByZXZpZXdTbHVnID8gYCR7cHJvZHVjdFVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcbiAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeVNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMuY2F0ZWdvcnlJZHMpXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ25hbWUnICYmICFzbHVnRWRpdGVkKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ3NsdWcnLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNldFNlbGVjdGVkQ2F0ZWdvcmllcyA9IChzbHVncykgPT4gc2V0RmllbGQoJ2NhdGVnb3J5SWRzJywgSlNPTi5zdHJpbmdpZnkoc2x1Z3MpKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdwcm9kdWN0cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIGhhbmRsZUNoYW5nZSgnbWVkaWFJZCcsIG1lZGlhLmlkKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ1Byb2R1Y3Qgc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcHJvZHVjdCcsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubmFtZSB8fCAnTmV3IHByb2R1Y3QnfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5BZGQgcGhvdG9zLCBwcmljZXMsIGFuZCBvbmUgb3IgbW9yZSBjYXRlZ29yaWVzIGZvciB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQWxwaG9uc28gTWFuZ29cIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFNsdWdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17c2x1Z0lucHV0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJhdXRvLWdlbmVyYXRlZCBmcm9tIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgUHJldmlldzp7JyAnfVxuICAgICAgICAgICAge3Byb2R1Y3RVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e3Byb2R1Y3RVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICB7cHJvZHVjdFVybH1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgJ0dlbmVyYXRlZCBmcm9tIHByb2R1Y3QgbmFtZSB3aGVuIHNhdmVkJ1xuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFByaWNlICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucHJpY2VWYWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncHJpY2VWYWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIE9sZCBwcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm9sZFByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ29sZFByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiT3B0aW9uYWxcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgV2VpZ2h0XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy53ZWlnaHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3dlaWdodCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxIGtnXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIEJhZGdlXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5iYWRnZSB8fCAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYmFkZ2UnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2hcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU3RvY2tcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0b2NrID8/IDEwMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc3RvY2snLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU29ydCBvcmRlclxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc29ydE9yZGVyID8/IDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3NvcnRPcmRlcicsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UHJvZHVjdCBpbWFnZTwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubmFtZSB8fCAnUHJvZHVjdCBwcmV2aWV3J30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuPkNsaWNrIHRvIHVwbG9hZCBhIHNxdWFyZSBwcm9kdWN0IHBob3RvPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkNhdGVnb3JpZXM8L2g0PlxuICAgICAgICA8cD5BIHByb2R1Y3QgY2FuIGFwcGVhciBpbiBtb3JlIHRoYW4gb25lIGNhdGVnb3J5IG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgU2VsZWN0IGNhdGVnb3JpZXNcbiAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubGFiZWwgfSkpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2F0ZWdvcnlTbHVnc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRTZWxlY3RlZENhdGVnb3JpZXN9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbmQgc2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY2F0ZWdvcmllc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlN0b3JlIHBsYWNlbWVudDwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0Jlc3RTZWxsZXIgPT09IHRydWUgfHwgcGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJCZXN0c2VsbGVyXCJcbiAgICAgICAgICAgIGhpbnQ9XCJTaG93IGluIGJlc3RzZWxsZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0Jlc3RTZWxsZXInLCAhKHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09IHRydWUgfHwgcGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJJbXBvcnRlZFwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBpbXBvcnRlZCBmcnVpdHNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzSW1wb3J0ZWQnLCAhKHBhcmFtcy5pc0ltcG9ydGVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ltcG9ydGVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkZlYXR1cmVkXCJcbiAgICAgICAgICAgIGhpbnQ9XCJIaWdobGlnaHQgdGhpcyBmcnVpdFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNGZWF0dXJlZCcsICEocGFyYW1zLmlzRmVhdHVyZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzRmVhdHVyZWQgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICBoaW50PVwiVmlzaWJsZSB0byBjdXN0b21lcnNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgc2V0RmllbGQoJ2lzQWN0aXZlJywgIShwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJykpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5EZXNjcmlwdGlvbjwvaDQ+XG4gICAgICAgIHtkZXNjcmlwdGlvblByb3BlcnR5ID8gKFxuICAgICAgICAgIDxCb3ggc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAgfX0+XG4gICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17ZGVzY3JpcHRpb25Qcm9wZXJ0eX1cbiAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHByb2R1Y3RcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgRmxhZ0NhcmQgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBDYXRlZ29yeUVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Jhbm5lclVwbG9hZGluZywgc2V0QmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyUHJldmlld1VybCwgc2V0QmFubmVyUHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGNhdGVnb3J5VXJsQmFzZSA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKFxuICAgIGN1c3RvbS5jYXRlZ29yeVVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vY2F0ZWdvcnlgLFxuICApXG4gIGNvbnN0IHNsdWdJbnB1dCA9IHBhcmFtcy5zbHVnID8/ICcnXG4gIGNvbnN0IHByZXZpZXdTbHVnID0gbm9ybWFsaXplU2x1Z0lucHV0KHNsdWdJbnB1dCkgfHwgbm9ybWFsaXplU2x1Z0lucHV0KHBhcmFtcy5sYWJlbClcbiAgY29uc3QgY2F0ZWdvcnlVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke2NhdGVnb3J5VXJsQmFzZX0vJHtwcmV2aWV3U2x1Z31gIDogbnVsbFxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICBjb25zdCBiYW5uZXJJbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmJhbm5lckltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmJhbm5lckltYWdlKSkgcmV0dXJuIHBhcmFtcy5iYW5uZXJJbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmJhbm5lckltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5iYW5uZXJJbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkQmFubmVyVXJsID0gYmFubmVyUHJldmlld1VybCB8fCBiYW5uZXJJbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGJhbm5lclByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoYmFubmVyUHJldmlld1VybClcbiAgICB9XG4gIH0sIFtiYW5uZXJQcmV2aWV3VXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ2xhYmVsJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCB1cGxvYWRUbyA9IGFzeW5jIChmaWxlLCBmaWVsZCwgc2V0TG9jYWxQcmV2aWV3LCBzZXRCdXN5LCBzdWNjZXNzTWVzc2FnZSkgPT4ge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdjYXRlZ29yaWVzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIHNldExvY2FsUHJldmlldyhVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpKVxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBvblByb3BlcnR5Q2hhbmdlKGZpZWxkLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0TG9jYWxQcmV2aWV3KFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IHN1Y2Nlc3NNZXNzYWdlLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY2F0ZWdvcnknLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NhdGVnb3J5IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0aW9uUHJvcGVydHkgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maW5kKFxuICAgIChwcm9wZXJ0eSkgPT4gcHJvcGVydHkucHJvcGVydHlQYXRoID09PSAnZGVzY3JpcHRpb24nLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e3BhcmFtcy5sYWJlbCB8fCAnTmV3IGNhdGVnb3J5J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+Q3JlYXRlIGEgc2hvcCBzZWN0aW9uIHdpdGggYSB0aHVtYm5haWwsIGJhbm5lciwgYW5kIHBhZ2UgY29weS48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5DYXRlZ29yeSBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBMYWJlbFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubGFiZWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ2xhYmVsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGcmVzaCBGcnVpdHNcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBhZ2UgaGVhZGluZ1xuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudGl0bGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2FtZSBhcyBsYWJlbCBpZiBlbXB0eVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3VidGl0bGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN1YnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc3VidGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNob3J0IGxpbmUgdW5kZXIgdGhlIGhlYWRpbmdcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFNsdWdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17c2x1Z0lucHV0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJhdXRvLWdlbmVyYXRlZCBmcm9tIGxhYmVsXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtjYXRlZ29yeVVybCA/IChcbiAgICAgICAgICAgICAgPGEgaHJlZj17Y2F0ZWdvcnlVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICB7Y2F0ZWdvcnlVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBjYXRlZ29yeSBsYWJlbCB3aGVuIHNhdmVkJ1xuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU3RhdHVzXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiIHN0eWxlPXt7IG1hcmdpblRvcDogNiB9fT5cbiAgICAgICAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ31cbiAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgIGhpbnQ9XCJTaG93biBvbiB3ZWJzaXRlIGFuZCBhcHBcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgICAgc2V0RmllbGQoJ2lzQWN0aXZlJywgIShwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJykpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxwPlNxdWFyZSB0aHVtYm5haWwgdXNlZCBpbiB0aGUgaG9tZSBjYXRlZ29yeSBncmlkLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3BcIj5cbiAgICAgICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgY2F0ZWdvcnkgaW1hZ2U8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHJlZj17ZmlsZVJlZn1cbiAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgICAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICB1cGxvYWRUbyhmaWxlLCAnaW1hZ2UnLCBzZXRQcmV2aWV3VXJsLCBzZXRVcGxvYWRpbmcsICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkNhdGVnb3J5IGJhbm5lcjwvaDQ+XG4gICAgICAgIDxwPldpZGUgaW1hZ2Ugc2hvd24gYXQgdGhlIHRvcCBvZiB0aGUgY2F0ZWdvcnkgcGFnZS48L3A+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcCB0b2tyaS11cGxvYWQtZHJvcC13aWRlXCI+XG4gICAgICAgICAge2Rpc3BsYXllZEJhbm5lclVybCA/IChcbiAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRCYW5uZXJVcmx9IGFsdD17cGFyYW1zLmxhYmVsIHx8ICdDYXRlZ29yeSBiYW5uZXInfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSB3aWRlIGJhbm5lciAoMTYwMMOXNDAwIHJlY29tbWVuZGVkKTwvc3Bhbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgcmVmPXtiYW5uZXJGaWxlUmVmfVxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgIHVwbG9hZFRvKFxuICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICdiYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICBzZXRCYW5uZXJQcmV2aWV3VXJsLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgJ0Jhbm5lciB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtyZXNvdXJjZS5lZGl0UHJvcGVydGllc1xuICAgICAgICAgIC5maWx0ZXIoKHByb3BlcnR5KSA9PiBbJ2ltYWdlJywgJ2Jhbm5lckltYWdlJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSlcbiAgICAgICAgICAubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNhdGVnb3J5XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEljb24sIElucHV0LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIFJlY29yZHNUYWJsZSxcbiAgdXNlUXVlcnlQYXJhbXMsXG4gIHVzZVJlY29yZHMsXG4gIHVzZVNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgUEVSX1BBR0VfT1BUSU9OUyA9IFsxMCwgMjUsIDUwXVxuXG5jb25zdCBDbXNMaXN0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVzb3VyY2UsIHNldFRhZyB9ID0gcHJvcHNcbiAgY29uc3QgdGl0bGVQcm9wID0gcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ubmFtZSB8fCByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5wcm9wZXJ0eVBhdGggfHwgJ2lkJ1xuXG4gIGNvbnN0IHsgc3RvcmVQYXJhbXMsIGZpbHRlcnMgfSA9IHVzZVF1ZXJ5UGFyYW1zKClcbiAgY29uc3Qge1xuICAgIHJlY29yZHMsXG4gICAgbG9hZGluZyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc29ydEJ5LFxuICAgIHBhZ2UsXG4gICAgdG90YWwsXG4gICAgZmV0Y2hEYXRhLFxuICAgIHBlclBhZ2UsXG4gIH0gPSB1c2VSZWNvcmRzKHJlc291cmNlLmlkKVxuICBjb25zdCB7XG4gICAgc2VsZWN0ZWRSZWNvcmRzLFxuICAgIGhhbmRsZVNlbGVjdCxcbiAgICBoYW5kbGVTZWxlY3RBbGwsXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzLFxuICB9ID0gdXNlU2VsZWN0ZWRSZWNvcmRzKHJlY29yZHMpXG5cbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgoKSA9PiBTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICBjb25zdCBkZWJvdW5jZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBzdG9yZVBhcmFtc1JlZiA9IHVzZVJlZihzdG9yZVBhcmFtcylcbiAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCA9IHN0b3JlUGFyYW1zXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRRdWVyeShTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyhbXSlcbiAgfSwgW3Jlc291cmNlLmlkLCB0aXRsZVByb3AsIHNldFNlbGVjdGVkUmVjb3Jkc10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2V0VGFnKSBzZXRUYWcodG90YWwudG9TdHJpbmcoKSlcbiAgfSwgW3RvdGFsLCBzZXRUYWddKVxuXG4gIGNvbnN0IGhhbmRsZVF1ZXJ5Q2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWVcbiAgICBzZXRRdWVyeSh2YWx1ZSlcblxuICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICBkZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpXG4gICAgICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50KHtcbiAgICAgICAgcGFnZTogJzEnLFxuICAgICAgICBmaWx0ZXJzOiB0cmltbWVkID8geyBbdGl0bGVQcm9wXTogdHJpbW1lZCB9IDoge30sXG4gICAgICB9KVxuICAgIH0sIDMwMClcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUFjdGlvblBlcmZvcm1lZCA9ICgpID0+IGZldGNoRGF0YSgpXG5cbiAgY29uc3QgY3VycmVudFBhZ2UgPSBOdW1iZXIocGFnZSkgfHwgMVxuICBjb25zdCByb3dzUGVyUGFnZSA9IE51bWJlcihwZXJQYWdlKSB8fCAxMFxuICBjb25zdCB0b3RhbFJvd3MgPSBOdW1iZXIodG90YWwpIHx8IDBcbiAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbCh0b3RhbFJvd3MgLyByb3dzUGVyUGFnZSkgfHwgMSlcbiAgY29uc3QgZnJvbSA9IHRvdGFsUm93cyA9PT0gMCA/IDAgOiAoY3VycmVudFBhZ2UgLSAxKSAqIHJvd3NQZXJQYWdlICsgMVxuICBjb25zdCB0byA9IE1hdGgubWluKGN1cnJlbnRQYWdlICogcm93c1BlclBhZ2UsIHRvdGFsUm93cylcblxuICBjb25zdCBnb1RvUGFnZSA9IChuZXh0UGFnZSkgPT4ge1xuICAgIGNvbnN0IHNhZmUgPSBNYXRoLm1pbihNYXRoLm1heCgxLCBuZXh0UGFnZSksIHRvdGFsUGFnZXMpXG4gICAgc3RvcmVQYXJhbXMoeyBwYWdlOiBTdHJpbmcoc2FmZSkgfSlcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVBlclBhZ2UgPSAobmV4dCkgPT4ge1xuICAgIHN0b3JlUGFyYW1zKHsgcGFnZTogJzEnLCBwZXJQYWdlOiBTdHJpbmcobmV4dCkgfSlcbiAgfVxuXG4gIGNvbnN0IHBhZ2VOdW1iZXJzID0gW11cbiAgY29uc3Qgd2luZG93U2l6ZSA9IDVcbiAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMSwgY3VycmVudFBhZ2UgLSBNYXRoLmZsb29yKHdpbmRvd1NpemUgLyAyKSlcbiAgbGV0IGVuZCA9IE1hdGgubWluKHRvdGFsUGFnZXMsIHN0YXJ0ICsgd2luZG93U2l6ZSAtIDEpXG4gIHN0YXJ0ID0gTWF0aC5tYXgoMSwgZW5kIC0gd2luZG93U2l6ZSArIDEpXG4gIGZvciAobGV0IG51bWJlciA9IHN0YXJ0OyBudW1iZXIgPD0gZW5kOyBudW1iZXIgKz0gMSkgcGFnZU51bWJlcnMucHVzaChudW1iZXIpXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCI+XG4gICAgICA8Qm94IG1iPVwibGdcIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbWF4V2lkdGg6IDQyMCB9fT5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICBsZWZ0OiAxMixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8SWNvbiBpY29uPVwiU2VhcmNoXCIgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUXVlcnlDaGFuZ2V9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2BTZWFyY2ggJHtyZXNvdXJjZS5uYW1lfS4uLmB9XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ0xlZnQ6IDM2IH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCB2YXJpYW50PVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxSZWNvcmRzVGFibGVcbiAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgcmVjb3Jkcz17cmVjb3Jkc31cbiAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2hhbmRsZUFjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgaXNMb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uXCI+XG4gICAgICAgICAgPFRleHQgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXN1bW1hcnlcIj5cbiAgICAgICAgICAgIHt0b3RhbFJvd3MgPT09IDAgPyAnTm8gcmVjb3JkcycgOiBgU2hvd2luZyAke2Zyb2194oCTJHt0b30gb2YgJHt0b3RhbFJvd3N9YH1cbiAgICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1zaXplXCI+XG4gICAgICAgICAgICA8c3Bhbj5Sb3dzPC9zcGFuPlxuICAgICAgICAgICAgPExvY2FsU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtTdHJpbmcocm93c1BlclBhZ2UpfVxuICAgICAgICAgICAgICBvcHRpb25zPXtQRVJfUEFHRV9PUFRJT05TLm1hcCgob3B0aW9uKSA9PiAoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBTdHJpbmcob3B0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogU3RyaW5nKG9wdGlvbiksXG4gICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBjaGFuZ2VQZXJQYWdlKE51bWJlcihuZXh0KSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tcGFnZXNcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtjdXJyZW50UGFnZSA8PSAxfSBvbkNsaWNrPXsoKSA9PiBnb1RvUGFnZShjdXJyZW50UGFnZSAtIDEpfT5cbiAgICAgICAgICAgICAgUHJldlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7cGFnZU51bWJlcnMubWFwKChudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGtleT17bnVtYmVyfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17bnVtYmVyID09PSBjdXJyZW50UGFnZSA/ICdpcy1jdXJyZW50JyA6ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKG51bWJlcil9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7bnVtYmVyfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e2N1cnJlbnRQYWdlID49IHRvdGFsUGFnZXN9IG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKGN1cnJlbnRQYWdlICsgMSl9PlxuICAgICAgICAgICAgICBOZXh0XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbXNMaXN0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDQsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmNvbnN0IFJldmlld0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncmV2aWV3cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcmV2aWV3JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBwcm9wZXJ0eUJ5UGF0aCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiBbcHJvcGVydHkucHJvcGVydHlQYXRoLCBwcm9wZXJ0eV0pLFxuICApXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gKHByb3BlcnR5UGF0aCkgPT4ge1xuICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydHlCeVBhdGhbcHJvcGVydHlQYXRoXVxuICAgIGlmICghcHJvcGVydHkpIHJldHVybiBudWxsXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgLz5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmdQcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKFxuICAgIChwcm9wZXJ0eSkgPT4gIVsndGl0bGUnLCAnbmFtZScsICdjb250ZW50JywgJ2ltYWdlJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBwPVwieGxcIj5cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8SDQgbWI9XCJzbVwiPlJldmlldzwvSDQ+XG4gICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgIEFkZCB0aGUgcmV2aWV3IHRpdGxlLCByZXZpZXdlciBuYW1lLCBjb250ZW50LCBhbmQgYW4gb3B0aW9uYWwgcmV2aWV3ZXIgaW1hZ2UuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ3RpdGxlJyl9PC9Cb3g+XG4gICAgICA8Qm94IG1iPVwibGdcIj57cmVuZGVyUHJvcGVydHkoJ25hbWUnKX08L0JveD5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiPntyZW5kZXJQcm9wZXJ0eSgnY29udGVudCcpfTwvQm94PlxuXG4gICAgICA8Qm94IG1iPVwieGxcIiBwPVwieGxcIiBib3JkZXI9XCIxcHggc29saWQgI2RiZTNlYVwiIGJvcmRlclJhZGl1cz1cIjE2cHhcIiBiZz1cIiNmZmZmZmZcIj5cbiAgICAgICAgPEg0IG1iPVwibWRcIj5SZXZpZXdlciBJbWFnZTwvSDQ+XG5cbiAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfVxuICAgICAgICAgICAgICBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdSZXZpZXdlcid9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE0MCxcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6ICdjb3ZlcicsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2RiZTNlYScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgTm8gaW1hZ2Ugc2VsZWN0ZWQgeWV0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgKX1cblxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAge3JlbWFpbmluZ1Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICA8Qm94IGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofSBtYj1cImxnXCI+XG4gICAgICAgICAge3JlbmRlclByb3BlcnR5KHByb3BlcnR5LnByb3BlcnR5UGF0aCl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKSl9XG5cbiAgICAgIDxCb3ggbXQ9XCJ4bFwiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSByZXZpZXdcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXZpZXdFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRHJhd2VyQ29udGVudCxcbiAgRHJhd2VyRm9vdGVyLFxuICBINCxcbiAgSWNvbixcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlUmVjb3JkLCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU2VhcmNoYWJsZU11bHRpU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgVEFCUyA9IFtcbiAge1xuICAgIGlkOiAnZ2VuZXJhbCcsXG4gICAgbGFiZWw6ICdHZW5lcmFsJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdzdG9yZU5hbWUnLFxuICAgICAgJ3N0b3JlVGFnbGluZScsXG4gICAgICAnc3RvcmVFbWFpbCcsXG4gICAgICAnc3RvcmVQaG9uZTEnLFxuICAgICAgJ3N0b3JlUGhvbmUyJyxcbiAgICAgICdzdG9yZUFkZHJlc3MnLFxuICAgICAgJ3Byb21vQmFubmVyJyxcbiAgICAgICdlYXJseURlbGl2ZXJ5JyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdjaGFyZ2VzJyxcbiAgICBsYWJlbDogJ0NoYXJnZXMnLFxuICAgIGZpZWxkczogWydzaGlwcGluZ0ZlZScsICdoYW5kbGluZ0ZlZSddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdob21lcGFnZScsXG4gICAgbGFiZWw6ICdIb21lcGFnZScsXG4gICAgZmllbGRzOiBbJ2hvbWVCYW5uZXJJbWFnZScsICdob21lSGlnaGxpZ2h0SW1hZ2UnLCAnaG9tZUZlYXR1cmVkQ2F0ZWdvcnlTbHVncyddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYXltZW50cycsXG4gICAgbGFiZWw6ICdQYXltZW50cycsXG4gICAgZmllbGRzOiBbJ3Jhem9ycGF5RW5hYmxlZCcsICdyYXpvcnBheUtleUlkJywgJ3Jhem9ycGF5S2V5U2VjcmV0JywgJ2NvZEVuYWJsZWQnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnbm90aWZpY2F0aW9ucycsXG4gICAgbGFiZWw6ICdOb3RpZmljYXRpb25zJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdtc2c5MUVuYWJsZWQnLFxuICAgICAgJ21zZzkxQXV0aEtleScsXG4gICAgICAnbXNnOTFTZW5kZXJJZCcsXG4gICAgICAnbXNnOTFPdHBUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MU9yZGVyVGVtcGxhdGVJZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcEVuYWJsZWQnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBOdW1iZXInLFxuICAgICAgJ21zZzkxV2hhdHNhcHBPdHBUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE9yZGVyVGVtcGxhdGUnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBMYW5ndWFnZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE5hbWVzcGFjZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cEJ1dHRvbicsXG4gICAgXSxcbiAgfSxcbl1cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVJbWFnZVVybChwYXRoLCBhcHBVcmwpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhdGgpKSByZXR1cm4gcGF0aFxuICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGF0aH1gXG59XG5cbmZ1bmN0aW9uIEltYWdlVXBsb2FkZXIoe1xuICBsYWJlbCxcbiAgaGludCxcbiAgdmFsdWUsXG4gIHByZXZpZXdVcmwsXG4gIHVwbG9hZGluZyxcbiAgZmlsZVJlZixcbiAgb25VcGxvYWQsXG4gIHdpZGUsXG59KSB7XG4gIGNvbnN0IGRpc3BsYXllZCA9IHByZXZpZXdVcmwgfHwgdmFsdWVcblxuICByZXR1cm4gKFxuICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgIHtsYWJlbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLXVwbG9hZC1kcm9wJHt3aWRlID8gJyB0b2tyaS11cGxvYWQtZHJvcC13aWRlJyA6ICcnfWB9PlxuICAgICAgICB7ZGlzcGxheWVkID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWR9IGFsdD17YCR7bGFiZWx9IHByZXZpZXdgfSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayB0byB1cGxvYWQgYW4gaW1hZ2UnfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e29uVXBsb2FkfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPntoaW50fTwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmNvbnN0IFNldHRpbmdzRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgnZ2VuZXJhbCcpXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IGhpZ2hsaWdodEZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW2Jhbm5lclByZXZpZXcsIHNldEJhbm5lclByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtoaWdobGlnaHRQcmV2aWV3LCBzZXRIaWdobGlnaHRQcmV2aWV3XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyVXBsb2FkaW5nLCBzZXRCYW5uZXJVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtoaWdobGlnaHRVcGxvYWRpbmcsIHNldEhpZ2hsaWdodFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBhcHBVcmwgPSBjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeVNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMuaG9tZUZlYXR1cmVkQ2F0ZWdvcnlTbHVncylcblxuICBjb25zdCBiYW5uZXJJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lQmFubmVySW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVCYW5uZXJJbWFnZV0sXG4gIClcbiAgY29uc3QgaGlnaGxpZ2h0SW1hZ2VVcmwgPSB1c2VNZW1vKFxuICAgICgpID0+IHJlc29sdmVJbWFnZVVybChwYXJhbXMuaG9tZUhpZ2hsaWdodEltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2VdLFxuICApXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKVxuICAgIGlmIChoYXNoID09PSAnYXBwZWFyYW5jZScpIHtcbiAgICAgIHNldEFjdGl2ZVRhYignY2hhcmdlcycpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGhhc2ggJiYgVEFCUy5zb21lKCh0YWIpID0+IHRhYi5pZCA9PT0gaGFzaCkpIHtcbiAgICAgIHNldEFjdGl2ZVRhYihoYXNoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIGAjJHthY3RpdmVUYWJ9YClcbiAgfSwgW2FjdGl2ZVRhYl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGJhbm5lclByZXZpZXc/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoYmFubmVyUHJldmlldylcbiAgICB9XG4gIH0sIFtiYW5uZXJQcmV2aWV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoaGlnaGxpZ2h0UHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChoaWdobGlnaHRQcmV2aWV3KVxuICAgIH1cbiAgfSwgW2hpZ2hsaWdodFByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3QgdXBsb2FkSW1hZ2UgPSBhc3luYyAoZXZlbnQsIGZpZWxkLCBzZXRQcmV2aWV3LCBzZXRCdXN5LCBmaWxlUmVmLCBzdWNjZXNzTWVzc2FnZSkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnZ2VuZXJhbCcpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlldyhsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0QnVzeSh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKGZpZWxkLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlldyhyZXNvbHZlSW1hZ2VVcmwobWVkaWEucGF0aCwgYXBwVXJsKSlcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IHN1Y2Nlc3NNZXNzYWdlLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdzdWNjZXNzJyB8fCByZXNwb25zZT8uZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTZXR0aW5ncyBzYXZlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncycsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBzZXR0aW5ncy4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gZmxleCBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCIgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy10YWJzXCIgbWI9XCJ4bFwiPlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1zZXR0aW5ncy10YWIke2FjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJyBpcy1hY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZVRhYih0YWIuaWQpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0YWIubGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxEcmF3ZXJDb250ZW50PlxuICAgICAgICB7VEFCUy5tYXAoKHRhYikgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maWx0ZXIoKHByb3BlcnR5KSA9PlxuICAgICAgICAgICAgdGFiLmZpZWxkcy5pbmNsdWRlcyhwcm9wZXJ0eS5wcm9wZXJ0eVBhdGgpLFxuICAgICAgICAgIClcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgIGtleT17dGFiLmlkfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1wYW5lbFwiXG4gICAgICAgICAgICAgIHA9XCJ4bFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6IGFjdGl2ZVRhYiA9PT0gdGFiLmlkID8gJ2Jsb2NrJyA6ICdub25lJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SDQgbWI9XCJzbVwiPnt0YWIubGFiZWx9PC9IND5cbiAgICAgICAgICAgICAgPFRleHQgbWI9XCJ4bFwiIG9wYWNpdHk9ezAuNzV9PlxuICAgICAgICAgICAgICAgIHt0YWIuaWQgPT09ICdjaGFyZ2VzJ1xuICAgICAgICAgICAgICAgICAgPyAnU2hpcHBpbmcgZmVlIGFuZCBoYW5kbGluZyBjaGFyZ2UgYXJlIGFkZGVkIHRvIGV2ZXJ5IG9yZGVyIG9uIHRoZSB3ZWJzaXRlIGFuZCB0aGUgYXBwLidcbiAgICAgICAgICAgICAgICAgIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnXG4gICAgICAgICAgICAgICAgICAgID8gJ1RoZXNlIGltYWdlcyBhbmQgY2F0ZWdvcmllcyBhcHBlYXIgb24gdGhlIHdlYnNpdGUgaG9tZXBhZ2UuIENsaWNrIFNhdmUgY2hhbmdlcyBhZnRlciB1cGxvYWRpbmcuJ1xuICAgICAgICAgICAgICAgICAgICA6ICdVcGRhdGUgeW91ciBzdG9yZSBzZXR0aW5ncyBhbmQgY2xpY2sgU2F2ZSBjaGFuZ2VzIGJlbG93Lid9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcmdlcy1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgU2hpcHBpbmcgZmVlICjigrkpXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uc2hpcHBpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdzaGlwcGluZ0ZlZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5EZWxpdmVyeSBjaGFyZ2UgYWRkZWQgdG8gZXZlcnkgb3JkZXI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBIYW5kbGluZyBjaGFyZ2UgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5oYW5kbGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2hhbmRsaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkNhcnQgaGFuZGxpbmcgZmVlIGFkZGVkIHRvIGV2ZXJ5IG9yZGVyPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IHRhYi5pZCA9PT0gJ2hvbWVwYWdlJyA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWhvbWVwYWdlLWZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw9XCJIb21lIGJhbm5lciBpbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGhpbnQ9XCJTaG93biBhcyB0aGUgd2Vic2l0ZSBoZXJvIGJhbm5lci4gSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Jhbm5lckltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXtiYW5uZXJQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e2Jhbm5lclVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgd2lkZVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUJhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJhbm5lclByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5uZXJGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0Jhbm5lciBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw9XCJGcnVpdCBoaWdobGlnaHQgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBoaW50PVwiUmVwbGFjZXMgdGhlIGtpd2kgaW1hZ2UgaW4g4oCcVGhlIFNtYWxsIEZydWl0IHdpdGggYSBCaWcgUHVuY2jigJ0gb24gdGhlIHdlYnNpdGUuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2hpZ2hsaWdodEltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXtoaWdobGlnaHRQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e2hpZ2hsaWdodFVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17aGlnaGxpZ2h0RmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgb25VcGxvYWQ9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hvbWVIaWdobGlnaHRJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIaWdobGlnaHRQcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGlnaGxpZ2h0VXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0RmlsZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICdIaWdobGlnaHQgaW1hZ2UgdXBsb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgSG9tZXBhZ2UgY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5zbHVnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwgfHwgaXRlbS50aXRsZSB8fCBpdGVtLnNsdWcsXG4gICAgICAgICAgICAgICAgICAgICAgfSkpfVxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENhdGVnb3J5U2x1Z3N9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhzbHVncykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZSgnaG9tZUZlYXR1cmVkQ2F0ZWdvcnlTbHVncycsIEpTT04uc3RyaW5naWZ5KHNsdWdzKSlcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggYW5kIHNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFRoZXNlIGNhdGVnb3JpZXMgbG9hZCBvbiB0aGUgd2Vic2l0ZSBhZnRlciB0aGUgZnJ1aXQgaGlnaGxpZ2h0IHNlY3Rpb24sIG9uZSBhdFxuICAgICAgICAgICAgICAgICAgICAgIGEgdGltZSBhcyB0aGUgdmlzaXRvciBzY3JvbGxzLlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvRHJhd2VyQ29udGVudD5cblxuICAgICAgPERyYXdlckZvb3Rlcj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNoYW5nZXNcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0RyYXdlckZvb3Rlcj5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmZ1bmN0aW9uIHBhcnNlU2x1Z3MocmF3KSB7XG4gIGlmICghcmF3KSByZXR1cm4gW11cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5tYXAoKGl0ZW0pID0+IFN0cmluZyhpdGVtKS50cmltKCkpLmZpbHRlcihCb29sZWFuKVxuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpKSByZXR1cm4gcGFyc2VTbHVncyhwYXJzZWQpXG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIHJhd1xuICAgICAgLnNwbGl0KCcsJylcbiAgICAgIC5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICB9XG4gIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBwYWQobnVtKSB7XG4gIHJldHVybiBTdHJpbmcobnVtKS5wYWRTdGFydCgyLCAnMCcpXG59XG5cbmZ1bmN0aW9uIHRvRGF0ZXRpbWVWYWx1ZSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7cGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpfS0ke3BhZChkYXRlLmdldERhdGUoKSl9VCR7cGFkKGRhdGUuZ2V0SG91cnMoKSl9OiR7cGFkKGRhdGUuZ2V0TWludXRlcygpKX1gXG59XG5cbmZ1bmN0aW9uIGZvcm1hdERhdGV0aW1lTGFiZWwodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7XG4gICAgZGF5OiAnMi1kaWdpdCcsXG4gICAgbW9udGg6ICdzaG9ydCcsXG4gICAgeWVhcjogJ251bWVyaWMnLFxuICAgIGhvdXI6ICcyLWRpZ2l0JyxcbiAgICBtaW51dGU6ICcyLWRpZ2l0JyxcbiAgfSlcbn1cblxuZnVuY3Rpb24gdXNlQW5jaG9yZWRNZW51KG9wZW4pIHtcbiAgY29uc3Qgd3JhcFJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbb3BlblVwLCBzZXRPcGVuVXBdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW9wZW4pIHJldHVybiB1bmRlZmluZWRcblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGUgPSB3cmFwUmVmLmN1cnJlbnRcbiAgICAgIGlmICghbm9kZSkgcmV0dXJuXG4gICAgICBjb25zdCByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgY29uc3Qgc3BhY2VCZWxvdyA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHJlY3QuYm90dG9tXG4gICAgICBzZXRPcGVuVXAoc3BhY2VCZWxvdyA8IDI0MCAmJiByZWN0LnRvcCA+IHNwYWNlQmVsb3cpXG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIH1cbiAgfSwgW29wZW5dKVxuXG4gIHJldHVybiB7IHdyYXBSZWYsIG9wZW5VcCB9XG59XG5cbmZ1bmN0aW9uIENob2ljZUNhcmQoeyBzZWxlY3RlZCwgdGl0bGUsIGhpbnQsIG9uQ2xpY2sgfSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktY2hvaWNlLWNhcmQke3NlbGVjdGVkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICA8c3Ryb25nPnt0aXRsZX08L3N0cm9uZz5cbiAgICAgIDxzcGFuPntoaW50fTwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5mdW5jdGlvbiBBbmNob3JlZFNlbGVjdCh7IHZhbHVlLCBvcHRpb25zLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuICBjb25zdCBzZWxlY3RlZCA9IG9wdGlvbnMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpfT5cbiAgICAgICAgPHNwYW4+e3NlbGVjdGVkPy5sYWJlbCB8fCBwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICB7b3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAga2V5PXtpdGVtLnZhbHVlfVxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtpdGVtLnZhbHVlID09PSB2YWx1ZSA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBTZWFyY2hhYmxlTXVsdGlTZWxlY3QoeyBvcHRpb25zLCBzZWxlY3RlZCwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IHNlbGVjdGVkU2V0ID0gdXNlTWVtbygoKSA9PiBuZXcgU2V0KHNlbGVjdGVkKSwgW3NlbGVjdGVkXSlcbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKSlcbiAgY29uc3QgZmlsdGVyZWQgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT5cbiAgICBgJHtpdGVtLmxhYmVsfSAke2l0ZW0udmFsdWV9YC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcbiAgKVxuXG4gIGNvbnN0IHRvZ2dsZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZWxlY3RlZFNldC5oYXModmFsdWUpKSBvbkNoYW5nZShzZWxlY3RlZC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHZhbHVlKSlcbiAgICBlbHNlIG9uQ2hhbmdlKFsuLi5zZWxlY3RlZCwgdmFsdWVdKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBzXCI+XG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBcIj5cbiAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGUoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgw5dcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1wbGFjZWhvbGRlclwiPntwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtjaGVja2VkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGUoaXRlbS52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gRGF0ZVRpbWVQaWNrZXIoeyB2YWx1ZSwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgcGFyc2VkID0gdmFsdWUgPyBuZXcgRGF0ZSh2YWx1ZSkgOiBudWxsXG4gIGNvbnN0IHZhbGlkID0gcGFyc2VkICYmICFOdW1iZXIuaXNOYU4ocGFyc2VkLmdldFRpbWUoKSkgPyBwYXJzZWQgOiBudWxsXG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbbW9udGhEYXRlLCBzZXRNb250aERhdGVdID0gdXNlU3RhdGUodmFsaWQgfHwgbmV3IERhdGUoKSlcbiAgY29uc3QgW2hvdXJzLCBzZXRIb3Vyc10gPSB1c2VTdGF0ZSh2YWxpZCA/IHBhZCh2YWxpZC5nZXRIb3VycygpKSA6ICcwMCcpXG4gIGNvbnN0IFttaW51dGVzLCBzZXRNaW51dGVzXSA9IHVzZVN0YXRlKHZhbGlkID8gcGFkKHZhbGlkLmdldE1pbnV0ZXMoKSkgOiAnMDAnKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF2YWxpZCkgcmV0dXJuXG4gICAgc2V0TW9udGhEYXRlKHZhbGlkKVxuICAgIHNldEhvdXJzKHBhZCh2YWxpZC5nZXRIb3VycygpKSlcbiAgICBzZXRNaW51dGVzKHBhZCh2YWxpZC5nZXRNaW51dGVzKCkpKVxuICB9LCBbdmFsdWVdKVxuXG4gIGNvbnN0IHllYXIgPSBtb250aERhdGUuZ2V0RnVsbFllYXIoKVxuICBjb25zdCBtb250aCA9IG1vbnRoRGF0ZS5nZXRNb250aCgpXG4gIGNvbnN0IGZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpLmdldERheSgpXG4gIGNvbnN0IHRvdGFsRGF5cyA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCkuZ2V0RGF0ZSgpXG4gIGNvbnN0IGNlbGxzID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaXJzdERheTsgaSArPSAxKSBjZWxscy5wdXNoKG51bGwpXG4gIGZvciAobGV0IGRheSA9IDE7IGRheSA8PSB0b3RhbERheXM7IGRheSArPSAxKSBjZWxscy5wdXNoKGRheSlcblxuICBjb25zdCBhcHBseSA9IChkYXksIG5leHRIb3VycyA9IGhvdXJzLCBuZXh0TWludXRlcyA9IG1pbnV0ZXMpID0+IHtcbiAgICBjb25zdCBuZXh0ID0gYCR7eWVhcn0tJHtwYWQobW9udGggKyAxKX0tJHtwYWQoZGF5KX1UJHtwYWQoTnVtYmVyKG5leHRIb3VycykgfHwgMCl9OiR7cGFkKE51bWJlcihuZXh0TWludXRlcykgfHwgMCl9YFxuICAgIG9uQ2hhbmdlKG5leHQpXG4gIH1cblxuICBjb25zdCBzZWxlY3RlZERheSA9XG4gICAgdmFsaWQgJiYgdmFsaWQuZ2V0RnVsbFllYXIoKSA9PT0geWVhciAmJiB2YWxpZC5nZXRNb250aCgpID09PSBtb250aCA/IHZhbGlkLmdldERhdGUoKSA6IG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlclwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudCl9PlxuICAgICAgICA8c3Bhbj57dmFsaWQgPyBmb3JtYXREYXRldGltZUxhYmVsKHZhbGlkKSA6IHBsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+8J+ThTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktZGF0ZXBpY2tlci1wb3Ake29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLW5hdlwiPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0TW9udGhEYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgMSkpfT5cbiAgICAgICAgICAgICAg4oC5XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxzdHJvbmc+XG4gICAgICAgICAgICAgIHttb250aERhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBtb250aDogJ2xvbmcnLCB5ZWFyOiAnbnVtZXJpYycgfSl9XG4gICAgICAgICAgICA8L3N0cm9uZz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldE1vbnRoRGF0ZShuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpKX0+XG4gICAgICAgICAgICAgIOKAulxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLXdlZWtcIj5cbiAgICAgICAgICAgIHtbJ1N1JywgJ01vJywgJ1R1JywgJ1dlJywgJ1RoJywgJ0ZyJywgJ1NhJ10ubWFwKChsYWJlbCkgPT4gKFxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2xhYmVsfT57bGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLWdyaWRcIj5cbiAgICAgICAgICAgIHtjZWxscy5tYXAoKGRheSwgaW5kZXgpID0+XG4gICAgICAgICAgICAgIGRheSA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBrZXk9e2Ake3llYXJ9LSR7bW9udGh9LSR7ZGF5fWB9XG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17c2VsZWN0ZWREYXkgPT09IGRheSA/ICdpcy1zZWxlY3RlZCcgOiAnJ31cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGFwcGx5KGRheSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2RheX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e2BlbXB0eS0ke2luZGV4fWB9IC8+XG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci10aW1lXCI+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIEhvdXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiMjNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtob3Vyc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gcGFkKE1hdGgubWluKDIzLCBNYXRoLm1heCgwLCBOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKSB8fCAwKSkpXG4gICAgICAgICAgICAgICAgICBzZXRIb3VycyhuZXh0KVxuICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF5KSBhcHBseShzZWxlY3RlZERheSwgbmV4dCwgbWludXRlcylcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgTWludXRlXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjU5XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17bWludXRlc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gcGFkKE1hdGgubWluKDU5LCBNYXRoLm1heCgwLCBOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKSB8fCAwKSkpXG4gICAgICAgICAgICAgICAgICBzZXRNaW51dGVzKG5leHQpXG4gICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXkpIGFwcGx5KHNlbGVjdGVkRGF5LCBob3VycywgbmV4dClcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItY2xlYXJcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoJycpXG4gICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQ2xlYXJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IENvdXBvbkVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuXG4gIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHNlbGVjdGVkU2x1Z3MgPSBwYXJzZVNsdWdzKHBhcmFtcy50YXJnZXRTbHVncylcbiAgY29uc3QgdGFyZ2V0VHlwZSA9IHBhcmFtcy50YXJnZXRUeXBlIHx8ICdhbGwnXG4gIGNvbnN0IGFwcGx5T24gPSBwYXJhbXMuYXBwbHlPbiB8fCAnY2FydCdcbiAgY29uc3QgdXNhZ2VUeXBlID0gcGFyYW1zLnVzYWdlVHlwZSB8fCAndW5saW1pdGVkJ1xuICBjb25zdCBjb3Vwb25UeXBlID0gcGFyYW1zLnR5cGUgfHwgJ3BlcmNlbnQnXG4gIGNvbnN0IGlzQWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSdcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBpZ25vcmUgPSBmYWxzZVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gbG9hZENhdGFsb2coKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjYXRlZ29yeURhdGEgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgY29uc3QgYWxsUHJvZHVjdHMgPSBbXVxuICAgICAgICBsZXQgcGFnZSA9IDFcbiAgICAgICAgbGV0IGhhc01vcmUgPSB0cnVlXG4gICAgICAgIHdoaWxlIChoYXNNb3JlICYmIHBhZ2UgPD0gMjApIHtcbiAgICAgICAgICBjb25zdCBwcm9kdWN0RGF0YSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L3Byb2R1Y3RzP3BhZ2U9JHtwYWdlfSZsaW1pdD0xMDBgKS50aGVuKChyZXNwb25zZSkgPT5cbiAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKSxcbiAgICAgICAgICApXG4gICAgICAgICAgYWxsUHJvZHVjdHMucHVzaCguLi4ocHJvZHVjdERhdGEucHJvZHVjdHMgfHwgW10pKVxuICAgICAgICAgIGhhc01vcmUgPSBCb29sZWFuKHByb2R1Y3REYXRhLmhhc01vcmUpXG4gICAgICAgICAgcGFnZSArPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlnbm9yZSkgcmV0dXJuXG4gICAgICAgIHNldFByb2R1Y3RzKGFsbFByb2R1Y3RzKVxuICAgICAgICBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoY2F0ZWdvcnlEYXRhKSA/IGNhdGVnb3J5RGF0YSA6IFtdKVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIGlmICghaWdub3JlKSB7XG4gICAgICAgICAgc2V0UHJvZHVjdHMoW10pXG4gICAgICAgICAgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRDYXRhbG9nKClcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW2FwaUJhc2VVcmxdKVxuXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHNldFNlbGVjdGVkU2x1Z3MgPSAobmV4dCkgPT4gc2V0RmllbGQoJ3RhcmdldFNsdWdzJywgSlNPTi5zdHJpbmdpZnkobmV4dCkpXG5cbiAgY29uc3QgcHJvZHVjdE9wdGlvbnMgPSB1c2VNZW1vKFxuICAgICgpID0+IHByb2R1Y3RzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubmFtZSB9KSksXG4gICAgW3Byb2R1Y3RzXSxcbiAgKVxuICBjb25zdCBjYXRlZ29yeU9wdGlvbnMgPSB1c2VNZW1vKFxuICAgICgpID0+IGNhdGVnb3JpZXMubWFwKChpdGVtKSA9PiAoeyB2YWx1ZTogaXRlbS5zbHVnLCBsYWJlbDogaXRlbS5sYWJlbCB9KSksXG4gICAgW2NhdGVnb3JpZXNdLFxuICApXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGNvdXBvbicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291cG9uIHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIGNvdXBvbi4gUGxlYXNlIHRyeSBhZ2Fpbi4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+Q3JlYXRlIGEgc3RvcmUgY291cG9uPC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPlxuICAgICAgICAgIFNldCB3aG8gZ2V0cyB0aGUgZGlzY291bnQsIHdoZXJlIGl0IGFwcGxpZXMsIGFuZCBob3cgbWFueSB0aW1lcyBpdCBjYW4gYmUgdXNlZC5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q291cG9uIGNvZGU8L2g0PlxuICAgICAgICAgIDxwPkN1c3RvbWVycyB3aWxsIHR5cGUgdGhpcyBhdCBjaGVja291dCBvbiB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvcD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dCB0b2tyaS1jb3Vwb24tY29kZVwiXG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNvZGUgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV0VMQ09NRTEwXCJcbiAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXRvZ2dsZVwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWN0aXZlfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBldmVudC50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgQ291cG9uIGlzIGFjdGl2ZVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5EaXNjb3VudDwvaDQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17Y291cG9uVHlwZSA9PT0gJ3BlcmNlbnQnfVxuICAgICAgICAgICAgICB0aXRsZT1cIlBlcmNlbnQgb2ZmXCJcbiAgICAgICAgICAgICAgaGludD1cImUuZy4gMTAlIG9mZlwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd0eXBlJywgJ3BlcmNlbnQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17Y291cG9uVHlwZSA9PT0gJ2ZsYXQnfVxuICAgICAgICAgICAgICB0aXRsZT1cIkZsYXQgYW1vdW50XCJcbiAgICAgICAgICAgICAgaGludD1cImUuZy4g4oK5NTAgb2ZmXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3R5cGUnLCAnZmxhdCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICB7Y291cG9uVHlwZSA9PT0gJ3BlcmNlbnQnID8gJ1BlcmNlbnQgdmFsdWUnIDogJ0Ftb3VudCAo4oK5KSd9XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd2YWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIE1pbiBjYXJ0ICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubWluQ2FydCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbWluQ2FydCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIE1heCBkaXNjb3VudCAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm1heERpc2NvdW50ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdtYXhEaXNjb3VudCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJObyBjYXBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5BcHBseSBkaXNjb3VudCBvbjwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17YXBwbHlPbiA9PT0gJ2NhcnQnfVxuICAgICAgICAgICAgdGl0bGU9XCJDYXJ0IHRvdGFsXCJcbiAgICAgICAgICAgIGhpbnQ9XCJSZWR1Y2UgdGhlIGl0ZW1zIHN1YnRvdGFsXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdhcHBseU9uJywgJ2NhcnQnKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17YXBwbHlPbiA9PT0gJ3NoaXBwaW5nJ31cbiAgICAgICAgICAgIHRpdGxlPVwiU2hpcHBpbmcgZmVlXCJcbiAgICAgICAgICAgIGhpbnQ9XCJSZWR1Y2UgZGVsaXZlcnkgY2hhcmdlc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnYXBwbHlPbicsICdzaGlwcGluZycpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+V2hvIGNhbiBnZXQgdGhpcyBkaXNjb3VudDwvaDQ+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBBcHBseSB0b1xuICAgICAgICAgIDxBbmNob3JlZFNlbGVjdFxuICAgICAgICAgICAgdmFsdWU9e3RhcmdldFR5cGV9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkNob29zZSB3aG8gdGhpcyBjb3Vwb24gYXBwbGllcyB0b1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHtcbiAgICAgICAgICAgICAgc2V0RmllbGQoJ3RhcmdldFR5cGUnLCBuZXh0KVxuICAgICAgICAgICAgICBzZXRTZWxlY3RlZFNsdWdzKFtdKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9wdGlvbnM9e1tcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ2FsbCcsIGxhYmVsOiAnQWxsIHByb2R1Y3RzJyB9LFxuICAgICAgICAgICAgICB7IHZhbHVlOiAncHJvZHVjdHMnLCBsYWJlbDogJ1NlbGVjdGVkIHByb2R1Y3RzJyB9LFxuICAgICAgICAgICAgICB7IHZhbHVlOiAnY2F0ZWdvcmllcycsIGxhYmVsOiAnU2VsZWN0ZWQgY2F0ZWdvcmllcycgfSxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICB7dGFyZ2V0VHlwZSA9PT0gJ3Byb2R1Y3RzJyA/IChcbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQcm9kdWN0c1xuICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICBvcHRpb25zPXtwcm9kdWN0T3B0aW9uc31cbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRTZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBwcm9kdWN0c1wiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIHByb2R1Y3RzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3RhcmdldFR5cGUgPT09ICdjYXRlZ29yaWVzJyA/IChcbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDYXRlZ29yaWVzXG4gICAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICAgIG9wdGlvbnM9e2NhdGVnb3J5T3B0aW9uc31cbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRTZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlVzYWdlPC9oND5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXt1c2FnZVR5cGUgPT09ICd1bmxpbWl0ZWQnfVxuICAgICAgICAgICAgICB0aXRsZT1cIlVubGltaXRlZFwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJDdXN0b21lcnMgY2FuIHJldXNlIGl0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3VzYWdlVHlwZScsICd1bmxpbWl0ZWQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17dXNhZ2VUeXBlID09PSAnc2luZ2xlJ31cbiAgICAgICAgICAgICAgdGl0bGU9XCJTaW5nbGUgdXNlXCJcbiAgICAgICAgICAgICAgaGludD1cIk9uZSB1c2UgcGVyIGN1c3RvbWVyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3VzYWdlVHlwZScsICdzaW5nbGUnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3VzYWdlVHlwZSA9PT0gJ3VubGltaXRlZCcgPyAoXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIE9wdGlvbmFsIGdsb2JhbCBjYXBcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnVzYWdlTGltaXQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3VzYWdlTGltaXQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTGVhdmUgYmxhbmsgZm9yIHVubGltaXRlZFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dD5FYWNoIGxvZ2dlZC1pbiBjdXN0b21lciBjYW4gdXNlIHRoaXMgY291cG9uIG9uY2UuPC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgICAge3BhcmFtcy51c2VkQ291bnQgPyA8VGV4dCBtdD1cImRlZmF1bHRcIj5Vc2VkIHtwYXJhbXMudXNlZENvdW50fSB0aW1lKHMpIHNvIGZhci48L1RleHQ+IDogbnVsbH1cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlNjaGVkdWxlPC9oND5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTdGFydHMgYXRcbiAgICAgICAgICAgIDxEYXRlVGltZVBpY2tlclxuICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRldGltZVZhbHVlKHBhcmFtcy5zdGFydHNBdCl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ3N0YXJ0c0F0JywgbmV4dCB8fCBudWxsKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3Qgc3RhcnQgZGF0ZSBhbmQgdGltZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRXhwaXJlcyBhdFxuICAgICAgICAgICAgPERhdGVUaW1lUGlja2VyXG4gICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGV0aW1lVmFsdWUocGFyYW1zLmV4cGlyZXNBdCl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2V4cGlyZXNBdCcsIG5leHQgfHwgbnVsbCl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGV4cGlyeSBkYXRlIGFuZCB0aW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNvdXBvblxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvdXBvbkVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0LCBTZWFyY2hhYmxlU2VsZWN0LCB1c2VBbmNob3JlZE1lbnUgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBGVUxGSUxMTUVOVCA9IFtcbiAgeyB2YWx1ZTogJ3BlbmRpbmcnLCBsYWJlbDogJ1dhaXRpbmcgZm9yIGZ1bGZpbGxtZW50JyB9LFxuICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUHJvY2Vzc2luZycgfSxcbiAgeyB2YWx1ZTogJ3BhY2tlZCcsIGxhYmVsOiAnUGFja2VkJyB9LFxuICB7IHZhbHVlOiAnc2hpcHBlZCcsIGxhYmVsOiAnU2hpcHBlZCcgfSxcbiAgeyB2YWx1ZTogJ2RlbGl2ZXJlZCcsIGxhYmVsOiAnRGVsaXZlcmVkJyB9LFxuICB7IHZhbHVlOiAnY2FuY2VsbGVkJywgbGFiZWw6ICdDYW5jZWxsZWQnIH0sXG5dXG5cbmNvbnN0IFBBWU1FTlRfT1BUSU9OUyA9IFtcbiAgeyB2YWx1ZTogJ3BlbmRpbmcnLCBsYWJlbDogJ1BlbmRpbmcnIH0sXG4gIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQYWlkJyB9LFxuICB7IHZhbHVlOiAnZmFpbGVkJywgbGFiZWw6ICdGYWlsZWQnIH0sXG4gIHsgdmFsdWU6ICdyZWZ1bmRlZCcsIGxhYmVsOiAnUmVmdW5kZWQnIH0sXG5dXG5cbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihhbW91bnQpKSByZXR1cm4gJ+KCuTAnXG4gIHJldHVybiBg4oK5JHthbW91bnQudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSl9YFxufVxuXG5jb25zdCBmb3JtYXREYXRlVGltZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJ+KAlCdcbiAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7XG4gICAgZGF0ZVN0eWxlOiAnbWVkaXVtJyxcbiAgICB0aW1lU3R5bGU6ICdzaG9ydCcsXG4gIH0pXG59XG5cbmNvbnN0IHJlc29sdmVJbWFnZSA9ICh2YWx1ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHZhbHVlKSkgcmV0dXJuIHZhbHVlXG4gIGlmICh2YWx1ZS5zdGFydHNXaXRoKCcvJykpIHJldHVybiBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7dmFsdWV9YFxuICByZXR1cm4gdmFsdWVcbn1cblxuZnVuY3Rpb24gTW9yZU1lbnUoeyB1bnBhaWQsIGJ1c3ksIG9uQ2FzaCwgb25RciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGlmICghdW5wYWlkKSByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tb3JlXCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHZhbHVlKSA9PiAhdmFsdWUpfT5cbiAgICAgICAgTW9yZSBhY3Rpb25zXG4gICAgICAgIDxzcGFuPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1vcmUtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGJ1c3kpfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICBvbkNhc2goKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7YnVzeSA9PT0gJ2NvbGxlY3RDYXNoJyA/ICdTYXZpbmfigKYnIDogJ01hcmsgY2FzaCBjb2xsZWN0ZWQnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4oYnVzeSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIG9uUXIoKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7YnVzeSA9PT0gJ2dlbmVyYXRlUXInID8gJ0NyZWF0aW5n4oCmJyA6ICdHZW5lcmF0ZSBwYXltZW50IFFSJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBzbmFwc2hvdChwYXJhbXMgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyB8fCAnJyxcbiAgICBwYXltZW50U3RhdHVzOiBwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAnJyxcbiAgICBkZWxpdmVyeVBhcnRuZXJJZDogcGFyYW1zLmRlbGl2ZXJ5UGFydG5lcklkIHx8ICcnLFxuICAgIGNvbnRhY3ROYW1lOiBwYXJhbXMuY29udGFjdE5hbWUgfHwgJycsXG4gICAgY29udGFjdFBob25lOiBwYXJhbXMuY29udGFjdFBob25lIHx8ICcnLFxuICAgIGFkZHJlc3NMaW5lMTogcGFyYW1zLmFkZHJlc3NMaW5lMSB8fCAnJyxcbiAgICBhZGRyZXNzTGluZTI6IHBhcmFtcy5hZGRyZXNzTGluZTIgfHwgJycsXG4gICAgYWRkcmVzc0NpdHk6IHBhcmFtcy5hZGRyZXNzQ2l0eSB8fCAnJyxcbiAgICBhZGRyZXNzU3RhdGU6IHBhcmFtcy5hZGRyZXNzU3RhdGUgfHwgJycsXG4gICAgYWRkcmVzc1BpbmNvZGU6IHBhcmFtcy5hZGRyZXNzUGluY29kZSB8fCAnJyxcbiAgICBhZGRyZXNzTGFuZG1hcms6IHBhcmFtcy5hZGRyZXNzTGFuZG1hcmsgfHwgJycsXG4gIH1cbn1cblxuY29uc3QgT3JkZXJEZXRhaWwgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdCwgbG9hZGluZywgc2V0UmVjb3JkIH0gPSB1c2VSZWNvcmQoaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UuaWQpXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2FjdGlvbkJ1c3ksIHNldEFjdGlvbkJ1c3ldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtwYXJ0bmVycywgc2V0UGFydG5lcnNdID0gdXNlU3RhdGUoW3sgdmFsdWU6ICcnLCBsYWJlbDogJ1VuYXNzaWduZWQnIH1dKVxuICBjb25zdCBbYmFzZWxpbmUsIHNldEJhc2VsaW5lXSA9IHVzZVN0YXRlKCgpID0+IHNuYXBzaG90KGluaXRpYWxSZWNvcmQ/LnBhcmFtcykpXG4gIGNvbnN0IFtlZGl0Q29udGFjdCwgc2V0RWRpdENvbnRhY3RdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtlZGl0QWRkcmVzcywgc2V0RWRpdEFkZHJlc3NdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYWN0aW9uPy5uYW1lICE9PSAnc2hvdycpIHJldHVybiB1bmRlZmluZWRcbiAgICBjb25zdCBuZXh0ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL3Nob3dcXC8/JC8sICcvZWRpdCcpXG4gICAgaWYgKG5leHQgIT09IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UobmV4dClcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH0sIFthY3Rpb24/Lm5hbWVdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgYXBpXG4gICAgICAucmVzb3VyY2VBY3Rpb24oeyByZXNvdXJjZUlkOiAnRGVsaXZlcnlQYXJ0bmVyJywgYWN0aW9uTmFtZTogJ2xpc3QnLCBwYXJhbXM6IHsgcGVyUGFnZTogMjAwIH0gfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IHJlc3BvbnNlLmRhdGE/LnJlY29yZHMgfHwgW11cbiAgICAgICAgc2V0UGFydG5lcnMoW1xuICAgICAgICAgIHsgdmFsdWU6ICcnLCBsYWJlbDogJ1VuYXNzaWduZWQnIH0sXG4gICAgICAgICAgLi4ucmVjb3Jkcy5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5pZCB8fCBpdGVtLnBhcmFtcz8uaWQsXG4gICAgICAgICAgICBsYWJlbDogaXRlbS5wYXJhbXM/LmlzQWN0aXZlID09PSBmYWxzZVxuICAgICAgICAgICAgICA/IGAke2l0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJ30gKGluYWN0aXZlKWBcbiAgICAgICAgICAgICAgOiBpdGVtLnBhcmFtcz8ubmFtZSB8fCAnUGFydG5lcicsXG4gICAgICAgICAgfSkpLFxuICAgICAgICBdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRQYXJ0bmVycyhbeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfV0pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBpdGVtcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHBhcmFtcy5pdGVtc0pzb24gfHwgJ1tdJylcbiAgICAgIHJldHVybiBwYXJzZWQubWFwKChpdGVtKSA9PiAoeyAuLi5pdGVtLCBpbWFnZTogcmVzb2x2ZUltYWdlKGl0ZW0uaW1hZ2UpIH0pKVxuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9LCBbcGFyYW1zLml0ZW1zSnNvbl0pXG5cbiAgY29uc3QgY3VycmVudCA9IHNuYXBzaG90KHBhcmFtcylcbiAgY29uc3QgZGlydHkgPSBPYmplY3Qua2V5cyhjdXJyZW50KS5zb21lKChrZXkpID0+IGN1cnJlbnRba2V5XSAhPT0gYmFzZWxpbmVba2V5XSlcbiAgY29uc3QgbGlzdFVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9yZWNvcmRzXFwvLiokLywgJycpXG4gIGNvbnN0IHVucGFpZCA9IHBhcmFtcy5wYXltZW50U3RhdHVzICE9PSAncGFpZCdcblxuICBjb25zdCBoYW5kbGVTYXZlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IHBob25lID0gU3RyaW5nKHBhcmFtcy5jb250YWN0UGhvbmUgfHwgJycpLnJlcGxhY2UoL1xcRC9nLCAnJylcbiAgICBjb25zdCBwaW4gPSBTdHJpbmcocGFyYW1zLmFkZHJlc3NQaW5jb2RlIHx8ICcnKS5yZXBsYWNlKC9cXEQvZywgJycpXG4gICAgaWYgKCFTdHJpbmcocGFyYW1zLmNvbnRhY3ROYW1lIHx8ICcnKS50cmltKCkgfHwgcGhvbmUubGVuZ3RoIDwgMTApIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdFbnRlciB0aGUgY3VzdG9tZXIgbmFtZSBhbmQgYSAxMC1kaWdpdCBjb250YWN0IG51bWJlci4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFTdHJpbmcocGFyYW1zLmFkZHJlc3NMaW5lMSB8fCAnJykudHJpbSgpIHx8ICFTdHJpbmcocGFyYW1zLmFkZHJlc3NDaXR5IHx8ICcnKS50cmltKCkgfHwgIVN0cmluZyhwYXJhbXMuYWRkcmVzc1N0YXRlIHx8ICcnKS50cmltKCkgfHwgcGluLmxlbmd0aCAhPT0gNikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0VudGVyIHRoZSBob3VzZSwgY2l0eSwgc3RhdGUsIGFuZCBhIDYtZGlnaXQgcGluY29kZS4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgc2V0U2F2aW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc3VibWl0KClcbiAgICAgIGNvbnN0IG5leHQgPSByZXNwb25zZT8uZGF0YT8ucmVjb3JkPy5wYXJhbXNcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNldEJhc2VsaW5lKHNuYXBzaG90KG5leHQpKVxuICAgICAgICBzZXRFZGl0Q29udGFjdChmYWxzZSlcbiAgICAgICAgc2V0RWRpdEFkZHJlc3MoZmFsc2UpXG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBydW5QYXltZW50QWN0aW9uID0gYXN5bmMgKGFjdGlvbk5hbWUpID0+IHtcbiAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ2NvbGxlY3RDYXNoJyAmJiAhd2luZG93LmNvbmZpcm0oJ01hcmsgdGhpcyBvcmRlciBhcyBwYWlkIGluIGNhc2g/JykpIHJldHVyblxuICAgIHNldEFjdGlvbkJ1c3koYWN0aW9uTmFtZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWUsXG4gICAgICB9KVxuICAgICAgaWYgKHJlc3BvbnNlLmRhdGE/LnJlY29yZCkge1xuICAgICAgICBzZXRSZWNvcmQocmVzcG9uc2UuZGF0YS5yZWNvcmQpXG4gICAgICAgIHNldEJhc2VsaW5lKHNuYXBzaG90KHJlc3BvbnNlLmRhdGEucmVjb3JkLnBhcmFtcykpXG4gICAgICB9XG4gICAgICBhZGROb3RpY2UocmVzcG9uc2UuZGF0YT8ubm90aWNlIHx8IHsgbWVzc2FnZTogJ1VwZGF0ZWQuJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGRhdGUgcGF5bWVudC4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEFjdGlvbkJ1c3koJycpXG4gICAgfVxuICB9XG5cbiAgaWYgKGFjdGlvbj8ubmFtZSA9PT0gJ3Nob3cnKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHN0YXR1c0xhYmVsID0gRlVMRklMTE1FTlQuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gcGFyYW1zLnN0YXR1cyk/LmxhYmVsIHx8ICdXYWl0aW5nIGZvciBmdWxmaWxsbWVudCdcbiAgY29uc3QgcmVzdG9yZUZpZWxkcyA9IChrZXlzLCBjbG9zZSkgPT4ge1xuICAgIGtleXMuZm9yRWFjaCgoa2V5KSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCBiYXNlbGluZVtrZXldIHx8ICcnKSlcbiAgICBjbG9zZShmYWxzZSlcbiAgfVxuICBjb25zdCBhZGRyZXNzVGV4dCA9IFtcbiAgICBwYXJhbXMuYWRkcmVzc0xpbmUxLFxuICAgIHBhcmFtcy5hZGRyZXNzTGluZTIsXG4gICAgW3BhcmFtcy5hZGRyZXNzQ2l0eSwgcGFyYW1zLmFkZHJlc3NTdGF0ZSwgcGFyYW1zLmFkZHJlc3NQaW5jb2RlXS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSxcbiAgICBwYXJhbXMuYWRkcmVzc0xhbmRtYXJrID8gYExhbmRtYXJrOiAke3BhcmFtcy5hZGRyZXNzTGFuZG1hcmt9YCA6ICcnLFxuICBdLmZpbHRlcihCb29sZWFuKVxuICBjb25zdCBwYXltZW50TGFiZWwgPSBQQVlNRU5UX09QVElPTlMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gcGFyYW1zLnBheW1lbnRTdGF0dXMpPy5sYWJlbCB8fCAnUGVuZGluZydcbiAgY29uc3QgcGFydG5lck5hbWUgPSBwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyTmFtZVxuICAgID8gYCR7cGFyYW1zLmRlbGl2ZXJ5UGFydG5lck5hbWV9JHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyUGhvbmUgPyBgIMK3ICR7cGFyYW1zLmRlbGl2ZXJ5UGFydG5lclBob25lfWAgOiAnJ31gXG4gICAgOiAnTm8gZGVsaXZlcnkgcGFydG5lciB5ZXQnXG4gIGNvbnN0IGl0ZW1Db3VudCA9IGl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyBOdW1iZXIoaXRlbS5xdWFudGl0eSB8fCAwKSwgMClcblxuICByZXR1cm4gKFxuICAgIDxmb3JtIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyXCIgb25TdWJtaXQ9e2hhbmRsZVNhdmV9PlxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10b3BcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aXRsZVwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWJhY2tcIiBocmVmPXtsaXN0VXJsfSBhcmlhLWxhYmVsPVwiQmFjayB0byBvcmRlcnNcIj7ihpA8L2E+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdGl0bGUtcm93XCI+XG4gICAgICAgICAgICAgIDxoMj4je3BhcmFtcy5vcmRlck5vfTwvaDI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLXBpbGwgaXMtJHtwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAncGVuZGluZyd9YH0+e3BheW1lbnRMYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLXBpbGwgaXMtJHtwYXJhbXMuc3RhdHVzIHx8ICdwZW5kaW5nJ31gfT57c3RhdHVzTGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cD57Zm9ybWF0RGF0ZVRpbWUocGFyYW1zLmNyZWF0ZWRBdCl9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1hY3Rpb25zXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zYXZlXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXshZGlydHkgfHwgbG9hZGluZyB8fCBzYXZpbmd9PlxuICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmfigKYnIDogJ1NhdmUnfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxNb3JlTWVudVxuICAgICAgICAgICAgdW5wYWlkPXt1bnBhaWR9XG4gICAgICAgICAgICBidXN5PXthY3Rpb25CdXN5fVxuICAgICAgICAgICAgb25DYXNoPXsoKSA9PiBydW5QYXltZW50QWN0aW9uKCdjb2xsZWN0Q2FzaCcpfVxuICAgICAgICAgICAgb25Rcj17KCkgPT4gcnVuUGF5bWVudEFjdGlvbignZ2VuZXJhdGVRcicpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbGF5b3V0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbWFpblwiPlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZC1oZWFkXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1hcmsgaXMtJHtwYXJhbXMuc3RhdHVzIHx8ICdwZW5kaW5nJ31gfSAvPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e3N0YXR1c0xhYmVsfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtQ291bnR9IHtpdGVtQ291bnQgPT09IDEgPyAnaXRlbScgOiAnaXRlbXMnfSDCtyB7cGFydG5lck5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zZWxlY3RcIj5cbiAgICAgICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc3RhdHVzIHx8ICdwZW5kaW5nJ31cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e0ZVTEZJTExNRU5UfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKCdzdGF0dXMnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtpdGVtcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVtcHR5XCI+Tm8gaXRlbXMgb24gdGhpcyBvcmRlci48L3A+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWl0ZW1zXCI+XG4gICAgICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aHVtYi13cmFwXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0uaW1hZ2UgPyA8aW1nIHNyYz17aXRlbS5pbWFnZX0gYWx0PVwiXCIgLz4gOiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aHVtYlwiIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIDxlbT57aXRlbS5xdWFudGl0eX08L2VtPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPntpdGVtLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0ud2VpZ2h0ID8gPHNwYW4+e2l0ZW0ud2VpZ2h0fTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItcXR5XCI+e2Zvcm1hdE1vbmV5KGl0ZW0ucHJpY2VWYWx1ZSl9IMOXIHtpdGVtLnF1YW50aXR5fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGI+e2Zvcm1hdE1vbmV5KGl0ZW0ubGluZVRvdGFsKX08L2I+XG4gICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmQtaGVhZFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1tYXJrIGlzLSR7cGFyYW1zLnBheW1lbnRTdGF0dXMgfHwgJ3BlbmRpbmcnfWB9IC8+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57cGF5bWVudExhYmVsfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIDxzcGFuPntwYXJhbXMucGF5bWVudE1ldGhvZCB8fCAnQ2FzaCBvbiBkZWxpdmVyeSd9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zZWxlY3RcIj5cbiAgICAgICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAncGVuZGluZyd9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtQQVlNRU5UX09QVElPTlN9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ3BheW1lbnRTdGF0dXMnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10b3RhbHNcIj5cbiAgICAgICAgICAgICAgPGRpdj48ZHQ+U3VidG90YWw8L2R0PjxkZD57aXRlbUNvdW50fSB7aXRlbUNvdW50ID09PSAxID8gJ2l0ZW0nIDogJ2l0ZW1zJ308L2RkPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLml0ZW1zVG90YWwpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+PGR0PkRlbGl2ZXJ5PC9kdD48ZGQgLz48ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5kZWxpdmVyeUNoYXJnZSl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48ZHQ+SGFuZGxpbmc8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLmhhbmRsaW5nQ2hhcmdlKX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICB7TnVtYmVyKHBhcmFtcy5zbWFsbENhcnRDaGFyZ2UpID4gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2PjxkdD5TbWFsbCBjYXJ0PC9kdD48ZGQgLz48ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5zbWFsbENhcnRDaGFyZ2UpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICB7TnVtYmVyKHBhcmFtcy5kaXNjb3VudCkgPiAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXY+PGR0PkRpc2NvdW50e3BhcmFtcy5jb3Vwb25Db2RlID8gYCDCtyAke3BhcmFtcy5jb3Vwb25Db2RlfWAgOiAnJ308L2R0PjxkZCAvPjxkZD4te2Zvcm1hdE1vbmV5KHBhcmFtcy5kaXNjb3VudCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXMtdG90YWxcIj48ZHQ+VG90YWw8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLmdyYW5kVG90YWwpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jb2xsZWN0ZWRcIj5cbiAgICAgICAgICAgICAgPHNwYW4+e3BhcmFtcy5wYXltZW50U3RhdHVzID09PSAncGFpZCcgPyAnUGFpZCBieSBjdXN0b21lcicgOiAnU3RpbGwgdG8gY29sbGVjdCd9PC9zcGFuPlxuICAgICAgICAgICAgICA8Yj57Zm9ybWF0TW9uZXkocGFyYW1zLmdyYW5kVG90YWwpfTwvYj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3BhcmFtcy5wYXltZW50Q29sbGVjdGVkQXMgPyA8cCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tZXRhXCI+Q29sbGVjdGVkIGFzIHtwYXJhbXMucGF5bWVudENvbGxlY3RlZEFzfTwvcD4gOiBudWxsfVxuICAgICAgICAgICAge3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZCA/IDxwIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1ldGFcIj5QYXltZW50IElEIHtwYXJhbXMucmF6b3JwYXlQYXltZW50SWR9PC9wPiA6IG51bGx9XG4gICAgICAgICAgICB7cGFyYW1zLnJhem9ycGF5UXJVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItcXJcIiBzcmM9e3BhcmFtcy5yYXpvcnBheVFyVXJsfSBhbHQ9XCJEb29yc3RlcCBwYXltZW50IFFSXCIgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGFzaWRlIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNpZGVcIj5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlY3Rpb24taGVhZFwiPlxuICAgICAgICAgICAgICA8aDM+Q3VzdG9tZXI8L2gzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlY3Rpb24taGVhZFwiPlxuICAgICAgICAgICAgICA8aDQ+Q29udGFjdDwvaDQ+XG4gICAgICAgICAgICAgIHtlZGl0Q29udGFjdCA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXRcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVzdG9yZUZpZWxkcyhbJ2NvbnRhY3ROYW1lJywgJ2NvbnRhY3RQaG9uZSddLCBzZXRFZGl0Q29udGFjdCl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiIG9uQ2xpY2s9eygpID0+IHNldEVkaXRDb250YWN0KHRydWUpfT5cbiAgICAgICAgICAgICAgICAgIEVkaXRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2VkaXRDb250YWN0ID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXQtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNvbnRhY3ROYW1lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2NvbnRhY3ROYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIFBob25lIG51bWJlclxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGFjdFBob25lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2NvbnRhY3RQaG9uZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yZWFkXCI+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57cGFyYW1zLmNvbnRhY3ROYW1lIHx8ICfigJQnfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIDxwPntwYXJhbXMuY29udGFjdFBob25lID8gYCs5MSAke3BhcmFtcy5jb250YWN0UGhvbmV9YCA6ICfigJQnfTwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlY3Rpb24taGVhZFwiPlxuICAgICAgICAgICAgICA8aDQ+U2hpcHBpbmcgYWRkcmVzczwvaDQ+XG4gICAgICAgICAgICAgIHtlZGl0QWRkcmVzcyA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXRcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVzdG9yZUZpZWxkcyhcbiAgICAgICAgICAgICAgICAgICAgWydhZGRyZXNzTGluZTEnLCAnYWRkcmVzc0xpbmUyJywgJ2FkZHJlc3NDaXR5JywgJ2FkZHJlc3NTdGF0ZScsICdhZGRyZXNzUGluY29kZScsICdhZGRyZXNzTGFuZG1hcmsnXSxcbiAgICAgICAgICAgICAgICAgICAgc2V0RWRpdEFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXRcIiBvbkNsaWNrPXsoKSA9PiBzZXRFZGl0QWRkcmVzcyh0cnVlKX0+XG4gICAgICAgICAgICAgICAgICBFZGl0XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtlZGl0QWRkcmVzcyA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0LWZpZWxkc1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgSG91c2UgLyBmbGF0XG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMaW5lMSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzTGluZTEnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgU3RyZWV0IC8gYXJlYVxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTIgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0xpbmUyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWFkZHJlc3MtZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIENpdHlcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0NpdHkgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzQ2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NTdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NTdGF0ZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIFBpbmNvZGVcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc1BpbmNvZGUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzUGluY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgIExhbmRtYXJrXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMYW5kbWFyayB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NMYW5kbWFyaycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItcmVhZFwiPlxuICAgICAgICAgICAgICAgIHthZGRyZXNzVGV4dC5sZW5ndGggPyBhZGRyZXNzVGV4dC5tYXAoKGxpbmUpID0+IDxwIGtleT17bGluZX0+e2xpbmV9PC9wPikgOiA8cD7igJQ8L3A+fVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aDQ+RGVsaXZlcnkgcGFydG5lcjwvaDQ+XG4gICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmRlbGl2ZXJ5UGFydG5lcklkIHx8ICcnfVxuICAgICAgICAgICAgICBvcHRpb25zPXtwYXJ0bmVyc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKCdkZWxpdmVyeVBhcnRuZXJJZCcsIHZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJVbmFzc2lnbmVkXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcGFydG5lcnNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvYXNpZGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Zvcm0+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgT3JkZXJEZXRhaWxcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJbnB1dCwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3QgRXllSWNvbiA9ICh7IGhpZGRlbiB9KSA9PlxuICBoaWRkZW4gPyAoXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTEwLjYgMTAuNkEyIDIgMCAwIDAgMTMuNCAxMy40XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNOS45IDQuMkExMC43IDEwLjcgMCAwIDEgMTIgNGM1IDAgOSA0LjUgMTAgOGExMi44IDEyLjggMCAwIDEtMi4xIDMuNlwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgIDwvc3ZnPlxuICApIDogKFxuICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgN1MyIDEyIDIgMTJ6XCIgLz5cbiAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgPC9zdmc+XG4gIClcblxuZnVuY3Rpb24gUGFzc3dvcmRGaWVsZCh7IGlkLCBsYWJlbCwgdmFsdWUsIG9uQ2hhbmdlLCB2aXNpYmxlLCBvblRvZ2dsZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPEJveCBtYj1cImxnXCI+XG4gICAgICA8TGFiZWwgaHRtbEZvcj17aWR9IHJlcXVpcmVkPntsYWJlbH08L0xhYmVsPlxuICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICB0eXBlPXt2aXNpYmxlID8gJ3RleHQnIDogJ3Bhc3N3b3JkJ31cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBhdXRvQ29tcGxldGU9XCJuZXctcGFzc3dvcmRcIlxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmdSaWdodDogNDIgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGFyaWEtbGFiZWw9e3Zpc2libGUgPyAnSGlkZSBwYXNzd29yZCcgOiAnU2hvdyBwYXNzd29yZCd9XG4gICAgICAgICAgb25DbGljaz17b25Ub2dnbGV9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxFeWVJY29uIGhpZGRlbj17dmlzaWJsZX0gLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5jb25zdCBDaGFuZ2VQYXNzd29yZCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtjb25maXJtUGFzc3dvcmQsIHNldENvbmZpcm1QYXNzd29yZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3Nob3dQYXNzd29yZCwgc2V0U2hvd1Bhc3N3b3JkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd0NvbmZpcm0sIHNldFNob3dDb25maXJtXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2F2aW5nLCBzZXRTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgd2luZG93Lmhpc3RvcnkuYmFjaygpXG4gIH1cblxuICBjb25zdCBzYXZlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHNldEVycm9yKCcnKVxuICAgIGlmICghcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoIDwgNikge1xuICAgICAgc2V0RXJyb3IoJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzLicpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtUGFzc3dvcmQpIHtcbiAgICAgIHNldEVycm9yKCdOZXcgcGFzc3dvcmQgYW5kIGNvbmZpcm0gcGFzc3dvcmQgbXVzdCBiZSB0aGUgc2FtZS4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0U2F2aW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLnJlY29yZEFjdGlvbih7XG4gICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLmlkLFxuICAgICAgICByZWNvcmRJZDogcmVjb3JkLmlkLFxuICAgICAgICBhY3Rpb25OYW1lOiAnY2hhbmdlUGFzc3dvcmQnLFxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgZGF0YTogeyBwYXNzd29yZCwgY29uZmlybVBhc3N3b3JkIH0sXG4gICAgICB9KVxuICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgIHNldEVycm9yKG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwYXNzd29yZC4nKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmIChub3RpY2UpIGFkZE5vdGljZShub3RpY2UpXG4gICAgICBjb25zdCByZWRpcmVjdFVybCA9IHJlc3BvbnNlLmRhdGE/LnJlZGlyZWN0VXJsXG4gICAgICBpZiAocmVkaXJlY3RVcmwpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZWRpcmVjdFVybFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNsb3NlKClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwYXNzd29yZC4nKVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgaW5zZXQ6IDAsXG4gICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDIsIDEyLCA4LCAwLjYyKScsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgekluZGV4OiA4MCxcbiAgICAgICAgcGFkZGluZzogMTYsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxCb3hcbiAgICAgICAgYXM9XCJmb3JtXCJcbiAgICAgICAgb25TdWJtaXQ9e3NhdmV9XG4gICAgICAgIGJnPVwid2hpdGVcIlxuICAgICAgICB3aWR0aD17WycxMDAlJywgJzQyMHB4J119XG4gICAgICAgIHA9XCJ4bFwiXG4gICAgICAgIHN0eWxlPXt7IGJvcmRlclJhZGl1czogMTYsIGJveFNoYWRvdzogJzAgMjRweCA3MHB4IHJnYmEoMiwgNDQsIDM0LCAwLjI4KScgfX1cbiAgICAgID5cbiAgICAgICAgPEgzIG1iPVwic21cIj5DaGFuZ2UgcGFzc3dvcmQ8L0gzPlxuICAgICAgICA8VGV4dCBtYj1cInhsXCIgY29sb3I9XCIjNjQ3NDhiXCI+XG4gICAgICAgICAgU2V0IGEgbmV3IHBhc3N3b3JkIGZvciB7cmVjb3JkPy5wYXJhbXM/Lm5hbWUgfHwgcmVjb3JkPy5wYXJhbXM/LmVtYWlsIHx8ICd0aGlzIHVzZXInfS5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIDxQYXNzd29yZEZpZWxkXG4gICAgICAgICAgaWQ9XCJuZXctcGFzc3dvcmRcIlxuICAgICAgICAgIGxhYmVsPVwiTmV3IHBhc3N3b3JkXCJcbiAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldFBhc3N3b3JkfVxuICAgICAgICAgIHZpc2libGU9e3Nob3dQYXNzd29yZH1cbiAgICAgICAgICBvblRvZ2dsZT17KCkgPT4gc2V0U2hvd1Bhc3N3b3JkKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICBpZD1cImNvbmZpcm0tcGFzc3dvcmRcIlxuICAgICAgICAgIGxhYmVsPVwiQ29uZmlybSBwYXNzd29yZFwiXG4gICAgICAgICAgdmFsdWU9e2NvbmZpcm1QYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0Q29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgIHZpc2libGU9e3Nob3dDb25maXJtfVxuICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRTaG93Q29uZmlybSgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgIC8+XG5cbiAgICAgICAge2Vycm9yID8gKFxuICAgICAgICAgIDxUZXh0IG1iPVwibGdcIiBjb2xvcj1cIiNkYzI2MjZcIj57ZXJyb3J9PC9UZXh0PlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJmbGV4LWVuZFwiIHN0eWxlPXt7IGdhcDogMTAgfX0+XG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXtjbG9zZX0gZGlzYWJsZWQ9e3NhdmluZ30+XG4gICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgZGlzYWJsZWQ9e3NhdmluZ30+XG4gICAgICAgICAgICB7c2F2aW5nID8gJ1NhdmluZ+KApicgOiAnU2F2ZSBwYXNzd29yZCd9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlUGFzc3dvcmRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgUGFydG5lckVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc05ldyA9IGFjdGlvbj8ubmFtZSA9PT0gJ25ldycgfHwgIXJlY29yZD8uaWRcbiAgY29uc3QgcmVhZE9ubHkgPSBhY3Rpb24/Lm5hbWUgPT09ICdzaG93J1xuICBjb25zdCBoYXNQYXNzd29yZCA9IEJvb2xlYW4ocGFyYW1zLmhhc1Bhc3N3b3JkKVxuICBjb25zdCBpc0FjdGl2ZSA9IGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFydG5lcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3XG4gICAgICAgICAgICA/ICdQYXJ0bmVyIHNhdmVkLiBBIHBhc3N3b3JkIGVtYWlsIHdpbGwgYmUgc2VudCBpZiB0aGV5IGRvIG5vdCBoYXZlIGEgcGFzc3dvcmQgeWV0LidcbiAgICAgICAgICAgIDogJ1BhcnRuZXIgdXBkYXRlZCcsXG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwYXJ0bmVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGRlbGl2ZXJ5IHBhcnRuZXInIDogcGFyYW1zLm5hbWUgfHwgJ0RlbGl2ZXJ5IHBhcnRuZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBUaGV5IGxvZyBpbiB0byB0aGUgVG9rcmlpaSBQYXJ0bmVyIGFwcCB3aXRoIHRoaXMgZW1haWwgYWZ0ZXIgc2V0dGluZyBhIHBhc3N3b3JkIGZyb20gdGhlIGludml0ZSBtYWlsLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5BY2NvdW50IHN0YXR1czwvaDQ+XG4gICAgICAgICAgPHA+SW5hY3RpdmUgcGFydG5lcnMgY2Fubm90IGxvZyBpbiwgZXZlbiBpZiB0aGV5IGFscmVhZHkgc2V0IGEgcGFzc3dvcmQuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWN0aXZlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgdGl0bGU9e2lzQWN0aXZlID8gJ0FjdGl2ZScgOiAnSW5hY3RpdmUnfVxuICAgICAgICAgICAgaGludD17aXNBY3RpdmUgPyAnQ2FuIHNpZ24gaW4gdG8gdGhlIHBhcnRuZXIgYXBwJyA6ICdMb2dpbiBpcyBibG9ja2VkIHVudGlsIHlvdSB0dXJuIHRoaXMgb24nfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHshaXNOZXcgPyAoXG4gICAgICAgICAgICA8VGV4dCBtdD1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAge2hhc1Bhc3N3b3JkID8gJ1Bhc3N3b3JkIGlzIGFscmVhZHkgc2V0LicgOiAnTm8gcGFzc3dvcmQgeWV0IOKAlCBzZW5kIHRoZSBpbnZpdGUgZW1haWwgYWZ0ZXIgc2F2aW5nLid9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Mb2dpbiBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8cD5FbWFpbCBpcyB1c2VkIHRvIGNyZWF0ZSBhbmQgcmVzZXQgdGhlIHBhcnRuZXIgcGFzc3dvcmQuIE5vIFNNUyBpcyBzZW50LjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBFbWFpbFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5lbWFpbCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2VtYWlsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJwYXJ0bmVyQGV4YW1wbGUuY29tXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLmVtYWlsID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLmVtYWlsLm1lc3NhZ2V9PC9zcGFuPiA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPlBhc3N3b3JkIGxpbmsgaXMgc2VudCB0byB0aGlzIGluYm94PC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIE1vYmlsZSBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXsxMH1cbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBob25lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGhvbmUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMCkpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjEwLWRpZ2l0IG51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5waG9uZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5waG9uZS5tZXNzYWdlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UHJvZmlsZTwvaDQ+XG4gICAgICAgIDxwPk5hbWUgaXMgc2hvd24gb24gb3JkZXJzLiBBZGRyZXNzIGlzIG9wdGlvbmFsIGFuZCBvbmx5IGZvciB5b3VyIHRlYW0uPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGdWxsIG5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBhcnRuZXIgbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5uYW1lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLm5hbWUubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEFkZHJlc3MgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWRkcmVzcycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXJlYSwgY2l0eSwgb3IgaHViXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBJbnRlcm5hbCBub3RlcyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXQgdG9rcmktdGV4dGFyZWFcIlxuICAgICAgICAgICAgcm93cz17NH1cbiAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubm90ZXMgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbm90ZXMnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaGlmdCB0aW1pbmcsIHZlaGljbGUsIG9yIGFueXRoaW5nIHlvdXIgdGVhbSBzaG91bGQgcmVtZW1iZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHBhcnRuZXInIDogJ1NhdmUgcGFydG5lcid9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0bmVyRWRpdFxuIiwiLyoqIElTTyAzMTY2LTI6SU4gY29kZXMuIEtlcHQgbmV4dCB0byB0aGUgQWRtaW5KUyBmb3JtIHNvIHRoZSBkcm9wZG93biBhbHdheXMgaGFzIGV2ZXJ5IHN0YXRlLiAqL1xuZXhwb3J0IGNvbnN0IElORElBX1NUQVRFUyA9IFtcbiAgeyBjb2RlOiAnQU4nLCBuYW1lOiAnQW5kYW1hbiBhbmQgTmljb2JhciBJc2xhbmRzJyB9LFxuICB7IGNvZGU6ICdBUCcsIG5hbWU6ICdBbmRocmEgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnQVInLCBuYW1lOiAnQXJ1bmFjaGFsIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ0FTJywgbmFtZTogJ0Fzc2FtJyB9LFxuICB7IGNvZGU6ICdCUicsIG5hbWU6ICdCaWhhcicgfSxcbiAgeyBjb2RlOiAnQ0gnLCBuYW1lOiAnQ2hhbmRpZ2FyaCcgfSxcbiAgeyBjb2RlOiAnQ1QnLCBuYW1lOiAnQ2hoYXR0aXNnYXJoJyB9LFxuICB7IGNvZGU6ICdESCcsIG5hbWU6ICdEYWRyYSBhbmQgTmFnYXIgSGF2ZWxpIGFuZCBEYW1hbiBhbmQgRGl1JyB9LFxuICB7IGNvZGU6ICdETCcsIG5hbWU6ICdEZWxoaScgfSxcbiAgeyBjb2RlOiAnR0EnLCBuYW1lOiAnR29hJyB9LFxuICB7IGNvZGU6ICdHSicsIG5hbWU6ICdHdWphcmF0JyB9LFxuICB7IGNvZGU6ICdIUicsIG5hbWU6ICdIYXJ5YW5hJyB9LFxuICB7IGNvZGU6ICdIUCcsIG5hbWU6ICdIaW1hY2hhbCBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdKSycsIG5hbWU6ICdKYW1tdSBhbmQgS2FzaG1pcicgfSxcbiAgeyBjb2RlOiAnSkgnLCBuYW1lOiAnSmhhcmtoYW5kJyB9LFxuICB7IGNvZGU6ICdLQScsIG5hbWU6ICdLYXJuYXRha2EnIH0sXG4gIHsgY29kZTogJ0tMJywgbmFtZTogJ0tlcmFsYScgfSxcbiAgeyBjb2RlOiAnTEEnLCBuYW1lOiAnTGFkYWtoJyB9LFxuICB7IGNvZGU6ICdMRCcsIG5hbWU6ICdMYWtzaGFkd2VlcCcgfSxcbiAgeyBjb2RlOiAnTVAnLCBuYW1lOiAnTWFkaHlhIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ01IJywgbmFtZTogJ01haGFyYXNodHJhJyB9LFxuICB7IGNvZGU6ICdNTicsIG5hbWU6ICdNYW5pcHVyJyB9LFxuICB7IGNvZGU6ICdNTCcsIG5hbWU6ICdNZWdoYWxheWEnIH0sXG4gIHsgY29kZTogJ01aJywgbmFtZTogJ01pem9yYW0nIH0sXG4gIHsgY29kZTogJ05MJywgbmFtZTogJ05hZ2FsYW5kJyB9LFxuICB7IGNvZGU6ICdPUicsIG5hbWU6ICdPZGlzaGEnIH0sXG4gIHsgY29kZTogJ1BZJywgbmFtZTogJ1B1ZHVjaGVycnknIH0sXG4gIHsgY29kZTogJ1BCJywgbmFtZTogJ1B1bmphYicgfSxcbiAgeyBjb2RlOiAnUkonLCBuYW1lOiAnUmFqYXN0aGFuJyB9LFxuICB7IGNvZGU6ICdTSycsIG5hbWU6ICdTaWtraW0nIH0sXG4gIHsgY29kZTogJ1ROJywgbmFtZTogJ1RhbWlsIE5hZHUnIH0sXG4gIHsgY29kZTogJ1RHJywgbmFtZTogJ1RlbGFuZ2FuYScgfSxcbiAgeyBjb2RlOiAnVFInLCBuYW1lOiAnVHJpcHVyYScgfSxcbiAgeyBjb2RlOiAnVVAnLCBuYW1lOiAnVXR0YXIgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnVVQnLCBuYW1lOiAnVXR0YXJha2hhbmQnIH0sXG4gIHsgY29kZTogJ1dCJywgbmFtZTogJ1dlc3QgQmVuZ2FsJyB9LFxuXVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFNlYXJjaGFibGVTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuaW1wb3J0IHsgSU5ESUFfU1RBVEVTIH0gZnJvbSAnLi9pbmRpYS1zdGF0ZXMuanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTVEFURV9PUFRJT05TID0gSU5ESUFfU1RBVEVTLm1hcCgoaXRlbSkgPT4gKHtcbiAgdmFsdWU6IGl0ZW0uY29kZSxcbiAgbGFiZWw6IGAke2l0ZW0ubmFtZX0gKCR7aXRlbS5jb2RlfSlgLFxufSkpXG5cbmNvbnN0IFBpbmNvZGVFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IHJlYWRPbmx5ID0gYWN0aW9uPy5uYW1lID09PSAnc2hvdydcbiAgY29uc3QgaXNBY3RpdmUgPSBpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnaXNBY3RpdmUnLCB0cnVlKVxuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc05ld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhcbiAgICAgICAgICByZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpc0ZsYWdPbihpdGVtLnBhcmFtcz8uaXNBY3RpdmUpXG4gICAgICAgICAgICAgID8gaXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInXG4gICAgICAgICAgICAgIDogYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYCxcbiAgICAgICAgICB9KSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0UGFydG5lcnMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBwYXJ0bmVySWQgPSBwYXJhbXMucGFydG5lcklkIHx8IHBhcmFtcy5wYXJ0bmVyIHx8ICcnXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGlzTmV3ID8gJ1BpbmNvZGUgYWRkZWQnIDogJ1BpbmNvZGUgdXBkYXRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIHNlcnZpY2VhYmxlIHBpbmNvZGUnIDogYFBJTiAke3BhcmFtcy5waW5jb2RlIHx8ICcnfWB9PC9IMz5cbiAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBjb2xvcjogJyNmZmYnLCBvcGFjaXR5OiAwLjkgfX0+XG4gICAgICAgICAgQ3VzdG9tZXJzIGNhbiBzYXZlIGFuIGFkZHJlc3MgYW5kIGNoZWNrIG91dCBvbmx5IHdoZW4gdGhpcyBwaW5jb2RlIGlzIGFjdGl2ZS5cbiAgICAgICAgPC9wPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGVsaXZlcnkgY292ZXJhZ2U8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gc3RvcCB0YWtpbmcgb3JkZXJzIGZvciB0aGlzIFBJTiB3aXRob3V0IGRlbGV0aW5nIGl0LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdXZSBkZWxpdmVyIGhlcmUnIDogJ05vdCBkZWxpdmVyaW5nJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0FkZHJlc3Mgc2F2ZSBhbmQgY2hlY2tvdXQgYXJlIGFsbG93ZWQnIDogJ0N1c3RvbWVycyB3aWxsIHNlZSB0aGF0IHRoaXMgUElOIGlzIG5vdCBzZXJ2aWNlYWJsZSd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Bc3NpZ25lZCBwYXJ0bmVyPC9oND5cbiAgICAgICAgICA8cD5OZXcgb3JkZXJzIGluIHRoaXMgUElOIGFyZSBhdXRvLWFzc2lnbmVkIHRvIHRoaXMgcGFydG5lci4gWW91IGNhbiByZWFzc2lnbiBsYXRlciBvbiB0aGUgb3JkZXIuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIERlbGl2ZXJ5IHBhcnRuZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcnRuZXJJZH1cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ05vIHBhcnRuZXIgYXNzaWduZWQnIH0sIC4uLnBhcnRuZXJzXX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgncGFydG5lcklkJywgbmV4dClcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgncGFydG5lcicsIG5leHQpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGEgcGFydG5lclwiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIHBhcnRuZXJzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5Mb2NhdGlvbjwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBpbmNvZGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXs2fVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHkgfHwgIWlzTmV3fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBpbmNvZGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJykuc2xpY2UoMCwgNikpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjYtZGlnaXQgUElOXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLnBpbmNvZGUgPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMucGluY29kZS5tZXNzYWdlfTwvc3Bhbj4gOiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5JbmRpYSBQSU4gY29kZSwgNiBkaWdpdHM8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQXJlYSBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYXJlYUxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYXJlYUxhYmVsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBbmRoZXJpIFdlc3QsIEJhbmRyYSwg4oCmXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENpdHlcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY2l0eSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2NpdHknLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk11bWJhaVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5jaXR5ID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLmNpdHkubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0YXRlQ29kZSB8fCBwYXJhbXMuc3RhdGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdTZWxlY3Qgc3RhdGUnIH0sIC4uLlNUQVRFX09QVElPTlNdfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdzdGF0ZUNvZGUnLCBuZXh0KVxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdzdGF0ZScsIG5leHQpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHN0YXRlXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggc3RhdGVzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLnN0YXRlIHx8IGVycm9ycy5zdGF0ZUNvZGUgPyAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+XG4gICAgICAgICAgICAgICAgeyhlcnJvcnMuc3RhdGUgfHwgZXJyb3JzLnN0YXRlQ29kZSkubWVzc2FnZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkFsbCBJbmRpYW4gc3RhdGVzIGFuZCB1bmlvbiB0ZXJyaXRvcmllczwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQWRkIHBpbmNvZGUnIDogJ1NhdmUgcGluY29kZSd9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaW5jb2RlRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3QgU3RhdHVzVG9nZ2xlID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSwgcHJvcGVydHksIHdoZXJlLCBvbkNoYW5nZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgcmF3ID0gcmVjb3JkPy5wYXJhbXM/Lltwcm9wZXJ0eT8ucGF0aF0gPz8gcmVjb3JkPy5wYXJhbXM/LmlzQWN0aXZlXG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlKGlzRmxhZ09uKHJhdykpXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q2hlY2tlZChpc0ZsYWdPbihyYXcpKVxuICB9LCBbcmF3LCByZWNvcmQ/LmlkXSlcblxuICBjb25zdCBwZXJzaXN0ID0gYXN5bmMgKG5leHQpID0+IHtcbiAgICBpZiAoIXJlY29yZD8uaWQpIHJldHVyblxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICd0b2dnbGVBY3RpdmUnLFxuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgZGF0YTogeyBpc0FjdGl2ZTogbmV4dCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNhdmVkID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkPy5wYXJhbXM/LmlzQWN0aXZlXG4gICAgICBzZXRDaGVja2VkKHNhdmVkID09PSB1bmRlZmluZWQgPyBuZXh0IDogaXNGbGFnT24oc2F2ZWQpKVxuICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBub3RpY2U/Lm1lc3NhZ2UgfHwgKG5leHQgPyAnTWFya2VkIGFjdGl2ZScgOiAnTWFya2VkIGluYWN0aXZlJyksXG4gICAgICAgIHR5cGU6IG5vdGljZT8udHlwZSB8fCAnc3VjY2VzcycsXG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBkYXRlIHN0YXR1cy4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKG5leHQpID0+IHtcbiAgICBpZiAod2hlcmUgPT09ICdlZGl0JyAmJiB0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNldENoZWNrZWQobmV4dClcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5leHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGVyc2lzdChuZXh0KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhdHVzU3dpdGNoXG4gICAgICBjb21wYWN0PXt3aGVyZSAhPT0gJ2VkaXQnfVxuICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgIGRpc2FibGVkPXtidXN5fVxuICAgICAgdGl0bGU9e3doZXJlID09PSAnZWRpdCcgPyAoY2hlY2tlZCA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJykgOiB1bmRlZmluZWR9XG4gICAgICBoaW50PXt3aGVyZSA9PT0gJ2VkaXQnID8gcHJvcGVydHk/LmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkfVxuICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1RvZ2dsZVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuZnVuY3Rpb24gcGFkKHZhbHVlKSB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRlSW5wdXQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IHRleHQgPSBTdHJpbmcodmFsdWUpXG4gIGlmICgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9Ly50ZXN0KHRleHQpKSByZXR1cm4gdGV4dC5zbGljZSgwLCAxMClcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7cGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpfS0ke3BhZChkYXRlLmdldERhdGUoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXRXaGVuKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJ+KAlCdcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBkYXRlU3R5bGU6ICdtZWRpdW0nLCB0aW1lU3R5bGU6ICdzaG9ydCcgfSlcbn1cblxuZnVuY3Rpb24gcGFyc2VBZGRyZXNzZXMocGFyYW1zKSB7XG4gIGNvbnN0IHJhdyA9IHBhcmFtcy5hZGRyZXNzZXNcbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0JykgcmV0dXJuIFtyYXddXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJyAmJiByYXcudHJpbSgpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlZC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIGlmIChwYXJzZWQgJiYgdHlwZW9mIHBhcnNlZCA9PT0gJ29iamVjdCcpIHJldHVybiBbcGFyc2VkXVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gZmxhdHRlbmVkIEFkbWluSlMgcGFyYW1zIGJlbG93XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ3JvdXBlZCA9IHt9XG4gIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSBrZXkubWF0Y2goL15hZGRyZXNzZXNcXC4oXFxkKylcXC4oLispJC8pXG4gICAgaWYgKCFtYXRjaCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykgcmV0dXJuXG4gICAgY29uc3QgWywgaW5kZXgsIGZpZWxkXSA9IG1hdGNoXG4gICAgZ3JvdXBlZFtpbmRleF0gPSBncm91cGVkW2luZGV4XSB8fCB7fVxuICAgIGdyb3VwZWRbaW5kZXhdW2ZpZWxkXSA9IHZhbHVlXG4gIH0pXG4gIHJldHVybiBPYmplY3Qua2V5cyhncm91cGVkKVxuICAgIC5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYSkgLSBOdW1iZXIoYikpXG4gICAgLm1hcCgoa2V5KSA9PiBncm91cGVkW2tleV0pXG59XG5cbmZ1bmN0aW9uIGFkZHJlc3NMaW5lcyhhZGRyZXNzKSB7XG4gIHJldHVybiBbXG4gICAgYWRkcmVzcy5saW5lMSxcbiAgICBhZGRyZXNzLmxpbmUyLFxuICAgIFthZGRyZXNzLmNpdHksIGFkZHJlc3Muc3RhdGUsIGFkZHJlc3MucGluY29kZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJyksXG4gICAgYWRkcmVzcy5sYW5kbWFyayA/IGBMYW5kbWFyazogJHthZGRyZXNzLmxhbmRtYXJrfWAgOiAnJyxcbiAgXS5maWx0ZXIoQm9vbGVhbilcbn1cblxuY29uc3QgQ3VzdG9tZXJFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzQWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJ1xuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuICBjb25zdCBhZGRyZXNzZXMgPSB1c2VNZW1vKCgpID0+IHBhcnNlQWRkcmVzc2VzKHBhcmFtcyksIFtwYXJhbXNdKVxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXInLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0N1c3RvbWVyIHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICArOTEge3BhcmFtcy5waG9uZSB8fCAn4oCUJ30gwrcgam9pbmVkIHtmb3JtYXRXaGVuKHBhcmFtcy5jcmVhdGVkQXQpfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5BY2NvdW50IHN0YXR1czwvaDQ+XG4gICAgICAgICAgPHA+SW5hY3RpdmUgY3VzdG9tZXJzIGNhbm5vdCBzaWduIGluIHdpdGggdGhpcyBtb2JpbGUgbnVtYmVyLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBsb2cgaW4gb24gdGhlIHdlYnNpdGUgYW5kIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2ZpbGU8L2g0PlxuICAgICAgICAgIDxwPlBob25lIGNvbWVzIGZyb20gT1RQIGxvZ2luIGFuZCBzdGF5cyBhcyB0aGUgY3VzdG9tZXLigJlzIGxvZ2luIGlkLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ3VzdG9tZXIgbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5uYW1lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLm5hbWUubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNb2JpbGVcbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9IHJlYWRPbmx5IC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBEYXRlIG9mIGJpcnRoXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGVJbnB1dChwYXJhbXMuZGF0ZU9mQmlydGgpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdkYXRlT2ZCaXJ0aCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHtlcnJvcnMuZGF0ZU9mQmlydGggPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMuZGF0ZU9mQmlydGgubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+U2F2ZWQgYWRkcmVzc2VzPC9oND5cbiAgICAgICAgPHA+XG4gICAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGhcbiAgICAgICAgICAgID8gYCR7YWRkcmVzc2VzLmxlbmd0aH0gYWRkcmVzcyR7YWRkcmVzc2VzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ2VzJ30gc2F2ZWQgaW4gdGhlIGN1c3RvbWVyIGFjY291bnQuYFxuICAgICAgICAgICAgOiAnVGhpcyBjdXN0b21lciBoYXMgbm90IHNhdmVkIGEgZGVsaXZlcnkgYWRkcmVzcyB5ZXQuJ31cbiAgICAgICAgPC9wPlxuICAgICAgICB7YWRkcmVzc2VzLmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtZ3JpZFwiPlxuICAgICAgICAgICAge2FkZHJlc3Nlcy5tYXAoKGFkZHJlc3MsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17YWRkcmVzcy5pZCB8fCBgJHthZGRyZXNzLnBpbmNvZGV9LSR7aW5kZXh9YH0gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1jYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hZGRyZXNzLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1sYWJlbFwiPnthZGRyZXNzLmxhYmVsIHx8ICdBZGRyZXNzJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICB7YWRkcmVzcy5waW5jb2RlID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waW5cIj57YWRkcmVzcy5waW5jb2RlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2FkZHJlc3MubmFtZSB8fCBwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIHthZGRyZXNzLnBob25lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waG9uZVwiPis5MSB7YWRkcmVzcy5waG9uZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICB7YWRkcmVzc0xpbmVzKGFkZHJlc3MpLm1hcCgobGluZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPHAga2V5PXtsaW5lfT57bGluZX08L3A+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY3VzdG9tZXJcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lckVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRm9ybUdyb3VwLFxuICBIMixcbiAgSW5wdXQsXG4gIExhYmVsLFxuICBNZXNzYWdlQm94LFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBSRU1FTUJFUkVEX0xPR0lOX0tFWSA9ICd0b2tyaV9hZG1pbl9sb2dpbidcblxuY29uc3QgTG9naW4gPSAoKSA9PiB7XG4gIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHdpbmRvdy5fX0FQUF9TVEFURV9fIHx8IHt9XG4gIGNvbnN0IHsgdHJhbnNsYXRlTWVzc2FnZSB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBhZG1pblJvb3QgPSBhY3Rpb24/LnJlcGxhY2UoL1xcL2xvZ2luJC8sICcnKSB8fCAnJ1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZFVybCA9IGAke2FkbWluUm9vdH0vZm9yZ290LXBhc3N3b3JkYFxuICBjb25zdCBbaWRlbnRpZmllciwgc2V0SWRlbnRpZmllcl0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3JlbWVtYmVyTG9naW4sIHNldFJlbWVtYmVyTG9naW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlbWVtYmVyZWRMb2dpbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSlcbiAgICBpZiAocmVtZW1iZXJlZExvZ2luKSB7XG4gICAgICBzZXRJZGVudGlmaWVyKHJlbWVtYmVyZWRMb2dpbilcbiAgICAgIHNldFJlbWVtYmVyTG9naW4odHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZvcm0gPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZW1haWxJbnB1dCA9IGZvcm0uZWxlbWVudHMubmFtZWRJdGVtKCdlbWFpbCcpXG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0ID8gU3RyaW5nKGVtYWlsSW5wdXQudmFsdWUpIDogaWRlbnRpZmllcikudHJpbSgpXG5cbiAgICBpZiAoZW1haWxJbnB1dCAmJiAndmFsdWUnIGluIGVtYWlsSW5wdXQpIHtcbiAgICAgIGVtYWlsSW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgIH1cblxuICAgIGlmIChyZW1lbWJlckxvZ2luICYmIHZhbHVlKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVksIHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBmbGV4XG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgIG1pbkhlaWdodD1cIjEwMHZoXCJcbiAgICAgIGJnPVwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzAyMmMyMiwgIzA0Nzg1NylcIlxuICAgICAgcD1cInhsXCJcbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGJnPVwid2hpdGVcIlxuICAgICAgICB3aWR0aD17WycxMDAlJywgJzQ0MHB4J119XG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjE4cHhcIlxuICAgICAgICBib3hTaGFkb3c9XCIwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4zNSlcIlxuICAgICAgICBwPVwieDNcIlxuICAgICAgPlxuICAgICAgICA8SDIgY29sb3I9XCIjMDIyYzIyXCIgbWI9XCJzbVwiPlRva3JpaWkgQ01TPC9IMj5cbiAgICAgICAgPFRleHQgY29sb3I9XCIjNjQ3NDhiXCIgbWI9XCJ4bFwiPlxuICAgICAgICAgIFNpZ24gaW4gd2l0aCB5b3VyIGFkbWluIGVtYWlsIG9yIHVzZXJuYW1lIHRvIG1hbmFnZSBwcm9kdWN0cywgb3JkZXJzLCBhbmQgY29udGVudC5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIHtlcnJvck1lc3NhZ2UgPyAoXG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIG1iPVwibGdcIlxuICAgICAgICAgICAgbWVzc2FnZT17ZXJyb3JNZXNzYWdlLnNwbGl0KCcgJykubGVuZ3RoID4gMSA/IGVycm9yTWVzc2FnZSA6IHRyYW5zbGF0ZU1lc3NhZ2UoZXJyb3JNZXNzYWdlKX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJkYW5nZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggYXM9XCJmb3JtXCIgYWN0aW9uPXthY3Rpb259IG1ldGhvZD1cIlBPU1RcIiBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPkVtYWlsIG9yIHVzZXJuYW1lPC9MYWJlbD5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwidXNlcm5hbWVcIlxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2lkZW50aWZpZXJ9XG4gICAgICAgICAgICAgIGtleT17aWRlbnRpZmllciB8fCAnbG9naW4tZW1haWwnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICA8TGFiZWwgcmVxdWlyZWQ+UGFzc3dvcmQ8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9e3Nob3dQYXNzd29yZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtzaG93UGFzc3dvcmQgPyAnSGlkZSBwYXNzd29yZCcgOiAnU2hvdyBwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1Bhc3N3b3JkKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3Nob3dQYXNzd29yZCA/IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOS45IDQuMkExMC43IDEwLjcgMCAwIDEgMTIgNGM1IDAgOSA0LjUgMTAgOGExMi44IDEyLjggMCAwIDEtMi4xIDMuNlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgN1MyIDEyIDIgMTJ6XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZD1cInJlbWVtYmVyLWxvZ2luXCJcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17cmVtZW1iZXJMb2dpbn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UmVtZW1iZXJMb2dpbihldmVudC50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiA4IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1lbWJlci1sb2dpblwiIHN0eWxlPXt7IGNvbG9yOiAnIzQ3NTU2OScsIGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICAgICAgUmVtZW1iZXIgbXkgZW1haWwgb3IgdXNlcm5hbWUgb24gdGhpcyBkZXZpY2VcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgd2lkdGg9XCIxMDAlXCIgbXQ9XCJsZ1wiPlxuICAgICAgICAgICAgU2lnbiBpblxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj17Zm9yZ290UGFzc3dvcmRVcmx9IHN0eWxlPXt7IGNvbG9yOiAnIzA0Nzg1NycsIGZvbnRXZWlnaHQ6IDcwMCB9fT5cbiAgICAgICAgICAgIEZvcmdvdCBwYXNzd29yZD9cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2luXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b25Hcm91cCwgTWVzc2FnZUJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VGaWx0ZXJEcmF3ZXIsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuZnVuY3Rpb24gYWRtaW5Sb290UGF0aCgpIHtcbiAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL14oLiopXFwvcmVzb3VyY2VzXFwvLylcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKVxufVxuXG5mdW5jdGlvbiBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpIHtcbiAgaWYgKHJlc291cmNlSWQgPT09ICdDYXRlZ29yeScpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdjYXRlZ29yaWVzL2V4cG9ydCcsIGltcG9ydFVybDogJ2NhdGVnb3JpZXMvaW1wb3J0JyB9XG4gIH1cbiAgaWYgKHJlc291cmNlSWQgPT09ICdQcm9kdWN0Jykge1xuICAgIHJldHVybiB7IGV4cG9ydFVybDogJ3Byb2R1Y3RzL2V4cG9ydCcsIGltcG9ydFVybDogJ3Byb2R1Y3RzL2ltcG9ydCcgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyh7IHJlc291cmNlLCBvbkltcG9ydGVkIH0pIHtcbiAgY29uc3QgeyB0cmFuc2xhdGVCdXR0b24sIHRyYW5zbGF0ZUFjdGlvbiB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IHRvZ2dsZUZpbHRlciwgZmlsdGVyc0NvdW50IH0gPSB1c2VGaWx0ZXJEcmF3ZXIoKVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuXG4gIGNvbnN0IHJlc291cmNlSWQgPSByZXNvdXJjZS5pZFxuICBjb25zdCBjb25maWcgPSBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpXG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3RQYXRoKClcblxuICBjb25zdCBoYW5kbGVJbXBvcnQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgIGlmICghZmlsZSB8fCAhY29uZmlnKSByZXR1cm5cblxuICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICBzZXRNZXNzYWdlKG51bGwpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmltcG9ydFVybH1gLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvckNvdW50ID0gZGF0YS5lcnJvcnM/Lmxlbmd0aCB8fCAwXG4gICAgICBzZXRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogZXJyb3JDb3VudCA/ICdpbmZvJyA6ICdzdWNjZXNzJyxcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICBlcnJvckNvdW50ID4gMFxuICAgICAgICAgICAgPyBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiAke2Vycm9yQ291bnR9IHJvdyhzKSBjb3VsZCBub3QgYmUgaW1wb3J0ZWQuYFxuICAgICAgICAgICAgOiBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLmAsXG4gICAgICB9KVxuICAgICAgb25JbXBvcnRlZD8uKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6ICdkYW5nZXInLCB0ZXh0OiBlcnJvci5tZXNzYWdlIHx8ICdJbXBvcnQgZmFpbGVkLicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBidXR0b25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFjb25maWcpIHJldHVybiBbXVxuXG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRXhwb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBocmVmOiBgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmV4cG9ydFVybH1gLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGxvYWRpbmcgPyAnSW1wb3J0aW5nLi4uJyA6ICdJbXBvcnQnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIG9uQ2xpY2s6IGxvYWRpbmcgPyB1bmRlZmluZWQgOiAoKSA9PiBmaWxlUmVmLmN1cnJlbnQ/LmNsaWNrKCksXG4gICAgICB9LFxuICAgIF1cblxuICAgIGNvbnN0IG5ld0FjdGlvbiA9IHJlc291cmNlLnJlc291cmNlQWN0aW9ucz8uZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24ubmFtZSA9PT0gJ25ldycpXG4gICAgaWYgKG5ld0FjdGlvbikge1xuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIGljb246IG5ld0FjdGlvbi5pY29uLFxuICAgICAgICBsYWJlbDogdHJhbnNsYXRlQWN0aW9uKG5ld0FjdGlvbi5sYWJlbCwgcmVzb3VyY2VJZCksXG4gICAgICAgIHZhcmlhbnQ6IG5ld0FjdGlvbi52YXJpYW50LFxuICAgICAgICBocmVmOiBgJHtyb290fS9yZXNvdXJjZXMvJHtyZXNvdXJjZUlkfS9hY3Rpb25zL25ld2AsXG4gICAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LW5ldy1idXR0b25gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJLZXkgPSBmaWx0ZXJzQ291bnQgPiAwID8gJ2ZpbHRlckFjdGl2ZScgOiAnZmlsdGVyJ1xuICAgIGl0ZW1zLnB1c2goe1xuICAgICAgbGFiZWw6IHRyYW5zbGF0ZUJ1dHRvbihmaWx0ZXJLZXksIHJlc291cmNlSWQsIHsgY291bnQ6IGZpbHRlcnNDb3VudCB9KSxcbiAgICAgIG9uQ2xpY2s6IHRvZ2dsZUZpbHRlcixcbiAgICAgIGljb246ICdGaWx0ZXInLFxuICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tZmlsdGVyLWJ1dHRvbmAsXG4gICAgfSlcblxuICAgIHJldHVybiBpdGVtc1xuICB9LCBbXG4gICAgY29uZmlnLFxuICAgIHJvb3QsXG4gICAgbG9hZGluZyxcbiAgICByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnMsXG4gICAgcmVzb3VyY2VJZCxcbiAgICB0cmFuc2xhdGVBY3Rpb24sXG4gICAgdHJhbnNsYXRlQnV0dG9uLFxuICAgIGZpbHRlcnNDb3VudCxcbiAgICB0b2dnbGVGaWx0ZXIsXG4gIF0pXG5cbiAgaWYgKCFjb25maWcpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEJveFxuICAgICAgICBtdD1cInhsXCJcbiAgICAgICAgbWI9XCJkZWZhdWx0XCJcbiAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCJcbiAgICAgICAgZmxleFNocmluaz17MH1cbiAgICAgICAgcHg9e1snZGVmYXVsdCcsIDBdfVxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Ub3A6ICctNTJweCcgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvbkdyb3VwIGJ1dHRvbnM9e2J1dHRvbnN9IC8+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17ZmlsZVJlZn1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgYWNjZXB0PVwiLmNzdix0ZXh0L2NzdlwiXG4gICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUltcG9ydH1cbiAgICAgICAgLz5cbiAgICAgIDwvQm94PlxuXG4gICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgIDxCb3ggbWI9XCJkZWZhdWx0XCIgcHg9e1snZGVmYXVsdCcsIDBdfT5cbiAgICAgICAgICA8TWVzc2FnZUJveFxuICAgICAgICAgICAgdmFyaWFudD17bWVzc2FnZS50eXBlfVxuICAgICAgICAgICAgbWVzc2FnZT17bWVzc2FnZS50ZXh0fVxuICAgICAgICAgICAgb25DbG9zZUNsaWNrPXsoKSA9PiBzZXRNZXNzYWdlKG51bGwpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IE9yaWdpbmFsQWN0aW9uSGVhZGVyIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMgZnJvbSAnLi9jYXRhbG9nLWxpc3QtaGVhZGVyLWFjdGlvbnMuanN4J1xuXG5jb25zdCBDQVRBTE9HX1JFU09VUkNFUyA9IG5ldyBTZXQoWydQcm9kdWN0JywgJ0NhdGVnb3J5J10pXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFjdGlvbkhlYWRlcihwcm9wcykge1xuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50LCBhY3Rpb24sIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBCYXNlSGVhZGVyID0gT3JpZ2luYWxDb21wb25lbnQgfHwgT3JpZ2luYWxBY3Rpb25IZWFkZXJcbiAgY29uc3QgaXNDYXRhbG9nTGlzdCA9IGFjdGlvbj8ubmFtZSA9PT0gJ2xpc3QnICYmIENBVEFMT0dfUkVTT1VSQ0VTLmhhcyhyZXNvdXJjZT8uaWQpXG5cbiAgaWYgKCFpc0NhdGFsb2dMaXN0KSB7XG4gICAgcmV0dXJuIDxCYXNlSGVhZGVyIHsuLi5wcm9wc30gLz5cbiAgfVxuXG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQ6IF9pZ25vcmVkLCAuLi5oZWFkZXJQcm9wcyB9ID0gcHJvcHNcblxuICByZXR1cm4gKFxuICAgIDxCb3g+XG4gICAgICA8QmFzZUhlYWRlciB7Li4uaGVhZGVyUHJvcHN9IG9taXRBY3Rpb25zIC8+XG4gICAgICA8Q2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zXG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgb25JbXBvcnRlZD17cHJvcHMuYWN0aW9uUGVyZm9ybWVkfVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IG1lbW8sIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBMYWJlbCwgVGlueU1DRSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGx1Z2luczogW1xuICAgICdjb2RlJyxcbiAgICAnbGluaycsXG4gICAgJ2xpc3RzJyxcbiAgICAnaW1hZ2UnLFxuICAgICd0YWJsZScsXG4gICAgJ2F1dG9saW5rJyxcbiAgICAncHJldmlldycsXG4gICAgJ3NlYXJjaHJlcGxhY2UnLFxuICAgICd3b3JkY291bnQnLFxuICAgICdtZWRpYScsXG4gICAgJ2NvZGVzYW1wbGUnLFxuICBdLFxuICB0b29sYmFyOlxuICAgICd1bmRvIHJlZG8gfCBibG9ja3MgfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgc3RyaWtldGhyb3VnaCB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCBvdXRkZW50IGluZGVudCB8IGxpbmsgaW1hZ2UgdGFibGUgY29kZXNhbXBsZSB8IGNvZGUgfCByZW1vdmVmb3JtYXQnLFxuICBoZWlnaHQ6IDQwMCxcbn1cblxuY29uc3QgUmljaHRleHRFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IHZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/ICcnXG4gIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBuZXdWYWx1ZSlcbiAgICB9LFxuICAgIFtvbkNoYW5nZSwgcHJvcGVydHkucGF0aF0sXG4gIClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLkRFRkFVTFRfT1BUSU9OUyxcbiAgICAuLi4ocHJvcGVydHkucHJvcHMgfHwge30pLFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Rm9ybUdyb3VwIGVycm9yPXtCb29sZWFuKGVycm9yKX0+XG4gICAgICA8TGFiZWwgcmVxdWlyZWQ9e3Byb3BlcnR5LmlzUmVxdWlyZWR9Pntwcm9wZXJ0eS5sYWJlbH08L0xhYmVsPlxuICAgICAgPFRpbnlNQ0UgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17aGFuZGxlVXBkYXRlfSBvcHRpb25zPXtvcHRpb25zfSAvPlxuICAgICAgPEZvcm1NZXNzYWdlPntlcnJvcj8ubWVzc2FnZX08L0Zvcm1NZXNzYWdlPlxuICAgIDwvRm9ybUdyb3VwPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oUmljaHRleHRFZGl0KVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VMb2NhdGlvbiwgdXNlTmF2aWdhdGUgfSBmcm9tICdyZWFjdC1yb3V0ZXInXG5cbmZ1bmN0aW9uIGFkbWluUm9vdChwYXRobmFtZSkge1xuICBjb25zdCBjdXQgPSBwYXRobmFtZS5zZWFyY2goL1xcLyhyZXNvdXJjZXN8cGFnZXMpKFxcL3wkKS8pXG4gIGNvbnN0IHJvb3QgPSBjdXQgPT09IC0xID8gcGF0aG5hbWUgOiBwYXRobmFtZS5zbGljZSgwLCBjdXQpXG4gIHJldHVybiByb290LnJlcGxhY2UoL1xcLyQvLCAnJykgfHwgJy8nXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZGViYXJSZXNvdXJjZVNlY3Rpb24ocHJvcHMpIHtcbiAgY29uc3QgT3JpZ2luYWwgPSBwcm9wcy5PcmlnaW5hbENvbXBvbmVudFxuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKClcbiAgY29uc3QgbmF2aWdhdGUgPSB1c2VOYXZpZ2F0ZSgpXG4gIGNvbnN0IGhyZWYgPSBhZG1pblJvb3QobG9jYXRpb24ucGF0aG5hbWUpXG4gIGNvbnN0IHNlbGVjdGVkID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKSA9PT0gaHJlZi5yZXBsYWNlKC9cXC8kLywgJycpIHx8IGxvY2F0aW9uLnBhdGhuYW1lID09PSBgJHtocmVmfS9gXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGFcbiAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2lkZWJhci1kYXNoYm9hcmQke3NlbGVjdGVkID8gJyBpcy1hY3RpdmUnIDogJyd9YH1cbiAgICAgICAgaHJlZj17aHJlZn1cbiAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIG5hdmlnYXRlKGhyZWYpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxJY29uIGljb249XCJIb21lXCIgLz5cbiAgICAgICAgPHNwYW4+RGFzaGJvYXJkPC9zcGFuPlxuICAgICAgPC9hPlxuICAgICAge09yaWdpbmFsID8gPE9yaWdpbmFsIHJlc291cmNlcz17cHJvcHMucmVzb3VyY2VzfSAvPiA6IG51bGx9XG4gICAgPC8+XG4gIClcbn1cbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Byb2R1Y3QtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEVkaXQgPSBQcm9kdWN0RWRpdFxuaW1wb3J0IENhdGVnb3J5RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jYXRlZ29yeS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeUVkaXQgPSBDYXRlZ29yeUVkaXRcbmltcG9ydCBDbXNMaXN0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Ntcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DbXNMaXN0ID0gQ21zTGlzdFxuaW1wb3J0IFJldmlld0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmV2aWV3LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJldmlld0VkaXQgPSBSZXZpZXdFZGl0XG5pbXBvcnQgU2V0dGluZ3NFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NldHRpbmdzLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNldHRpbmdzRWRpdCA9IFNldHRpbmdzRWRpdFxuaW1wb3J0IENvdXBvbkVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY291cG9uLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNvdXBvbkVkaXQgPSBDb3Vwb25FZGl0XG5pbXBvcnQgT3JkZXJEZXRhaWwgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvb3JkZXItZGV0YWlsJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckRldGFpbCA9IE9yZGVyRGV0YWlsXG5pbXBvcnQgQ2hhbmdlUGFzc3dvcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2hhbmdlLXBhc3N3b3JkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DaGFuZ2VQYXNzd29yZCA9IENoYW5nZVBhc3N3b3JkXG5pbXBvcnQgUGFydG5lckVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5QYXJ0bmVyRWRpdCA9IFBhcnRuZXJFZGl0XG5pbXBvcnQgUGluY29kZUVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGluY29kZS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5QaW5jb2RlRWRpdCA9IFBpbmNvZGVFZGl0XG5pbXBvcnQgU3RhdHVzVG9nZ2xlIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3N0YXR1cy10b2dnbGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlN0YXR1c1RvZ2dsZSA9IFN0YXR1c1RvZ2dsZVxuaW1wb3J0IEN1c3RvbWVyRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jdXN0b21lci1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DdXN0b21lckVkaXQgPSBDdXN0b21lckVkaXRcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9sb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IEFjdGlvbkhlYWRlciBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9hY3Rpb24taGVhZGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5BY3Rpb25IZWFkZXIgPSBBY3Rpb25IZWFkZXJcbmltcG9ydCBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5ID0gRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5XG5pbXBvcnQgU2lkZWJhclJlc291cmNlU2VjdGlvbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2lkZWJhclJlc291cmNlU2VjdGlvbiA9IFNpZGViYXJSZXNvdXJjZVNlY3Rpb24iXSwibmFtZXMiOlsidXNlQW5jaG9yZWRNZW51Iiwib3BlbiIsIndyYXBSZWYiLCJ1c2VSZWYiLCJvcGVuVXAiLCJzZXRPcGVuVXAiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVuZGVmaW5lZCIsInVwZGF0ZSIsIm5vZGUiLCJjdXJyZW50IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwYWNlQmVsb3ciLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImJvdHRvbSIsInRvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiU2VhcmNoYWJsZU11bHRpU2VsZWN0Iiwib3B0aW9ucyIsInNlbGVjdGVkIiwib25DaGFuZ2UiLCJwbGFjZWhvbGRlciIsInNlYXJjaFBsYWNlaG9sZGVyIiwic2V0T3BlbiIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJvbkRvY0NsaWNrIiwiZXZlbnQiLCJjb250YWlucyIsInRhcmdldCIsImRvY3VtZW50Iiwic2VsZWN0ZWRTZXQiLCJ1c2VNZW1vIiwiU2V0Iiwic2VsZWN0ZWRPcHRpb25zIiwiZmlsdGVyIiwiaXRlbSIsImhhcyIsInZhbHVlIiwiZmlsdGVyZWQiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJ0cmltIiwidG9nZ2xlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVmIiwidHlwZSIsIm9uQ2xpY2siLCJsZW5ndGgiLCJtYXAiLCJrZXkiLCJyb2xlIiwidGFiSW5kZXgiLCJzdG9wUHJvcGFnYXRpb24iLCJhdXRvRm9jdXMiLCJjaGVja2VkIiwiRmxhZ0NhcmQiLCJ0aXRsZSIsImhpbnQiLCJpc0ZsYWdPbiIsIlN0YXR1c1N3aXRjaCIsImRpc2FibGVkIiwiY29tcGFjdCIsInByZXZlbnREZWZhdWx0IiwiU2VhcmNoYWJsZVNlbGVjdCIsImZpbmQiLCJhY3RpdmUiLCJMb2NhbFNlbGVjdCIsIlN0cmluZyIsImFwaSIsIkFwaUNsaWVudCIsIlJBTkdFUyIsIldJREdFVFMiLCJpbnIiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsIlJhbmdlU2VsZWN0IiwiYXhpc01heCIsInBhZGRlZCIsIm1hZ25pdHVkZSIsIk1hdGgiLCJmbG9vciIsImxvZzEwIiwibm9ybWFsaXplZCIsIm5pY2UiLCJMaW5lQ2hhcnQiLCJzZXJpZXMiLCJob3ZlciIsInNldEhvdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJwYWRMZWZ0IiwicGFkUmlnaHQiLCJwYWRUb3AiLCJwYWRCb3R0b20iLCJtYXgiLCJwb2ludCIsIm9yZGVyVmFsdWUiLCJwbG90V2lkdGgiLCJwbG90SGVpZ2h0IiwiYmFzZWxpbmUiLCJ5Rm9yIiwic3RlcCIsImNvb3JkcyIsImluZGV4IiwieCIsInkiLCJsaW5lIiwiam9pbiIsImFyZWEiLCJsYWJlbEV2ZXJ5IiwiY2VpbCIsInRpY2tzIiwicmF0aW8iLCJyb3VuZCIsIm9uTW91c2VMZWF2ZSIsInZpZXdCb3giLCJ0aWNrIiwieDEiLCJ4MiIsInkxIiwieTIiLCJ0ZXh0QW5jaG9yIiwiZCIsImZpbGwiLCJvcGFjaXR5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZUxpbmVjYXAiLCJkYXRlIiwiY3giLCJjeSIsInIiLCJvbk1vdXNlRW50ZXIiLCJwb2ludGVyRXZlbnRzIiwic3R5bGUiLCJsZWZ0IiwiUGFnZXIiLCJwYWdlIiwicGFnZVNpemUiLCJ0b3RhbCIsInBhZ2VzIiwibnVtYmVycyIsIm51bWJlciIsInB1c2giLCJEYXNoYm9hcmQiLCJyZXF1ZXN0cyIsInJhbmdlcyIsInNldFJhbmdlcyIsIm9yZGVycyIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiZGF0YSIsInNldERhdGEiLCJzZXRQYWdlcyIsImJ1c3kiLCJzZXRCdXN5IiwibG9hZFdpZGdldCIsIndpZGdldCIsInJhbmdlIiwidGlja2V0IiwiZ2V0RGFzaGJvYXJkIiwicGFyYW1zIiwidGhlbiIsInJlc3BvbnNlIiwiZmluYWxseSIsImZvckVhY2giLCJjaGFuZ2VSYW5nZSIsImNoYW5nZVBhZ2UiLCJCb3giLCJ2YXJpYW50IiwiSDIiLCJtYiIsIkg1IiwiVGV4dCIsIm9yZGVyQ291bnQiLCJyb3dzIiwicm93IiwiaWQiLCJvcmRlck5vIiwibmFtZSIsImFtb3VudCIsInBsYWNlZEF0IiwicGhvbmUiLCJkYXRlT2ZCaXJ0aCIsInJlZ2lzdGVyZWRBdCIsIm5vcm1hbGl6ZVNsdWdJbnB1dCIsInJlcGxhY2UiLCJ3aXRob3V0VHJhaWxpbmdTbGFzaCIsInBhcnNlU2x1Z3MiLCJyYXciLCJBcnJheSIsImlzQXJyYXkiLCJCb29sZWFuIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwic3BsaXQiLCJQcm9kdWN0RWRpdCIsInByb3BzIiwicmVjb3JkIiwiaW5pdGlhbFJlY29yZCIsInJlc291cmNlIiwiaGFuZGxlQ2hhbmdlIiwic3VibWl0IiwiaGFuZGxlU3VibWl0IiwibG9hZGluZyIsInVzZVJlY29yZCIsImFkZE5vdGljZSIsInVzZU5vdGljZSIsImZpbGVSZWYiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJzbHVnRWRpdGVkIiwic2V0U2x1Z0VkaXRlZCIsInNsdWciLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsImNhdGVnb3JpZXMiLCJzZXRDYXRlZ29yaWVzIiwiY3VzdG9tIiwiYXBpQmFzZVVybCIsInByb2R1Y3RVcmxCYXNlIiwibG9jYXRpb24iLCJvcmlnaW4iLCJzbHVnSW5wdXQiLCJwcmV2aWV3U2x1ZyIsInByb2R1Y3RVcmwiLCJzZWxlY3RlZENhdGVnb3J5U2x1Z3MiLCJjYXRlZ29yeUlkcyIsImltYWdlVXJsIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiaWdub3JlIiwiZmV0Y2giLCJqc29uIiwiY2F0Y2giLCJzZXRGaWVsZCIsIm9uUHJvcGVydHlDaGFuZ2UiLCJwcm9wZXJ0eVBhdGgiLCJyZXN0Iiwic2V0U2VsZWN0ZWRDYXRlZ29yaWVzIiwic2x1Z3MiLCJzdHJpbmdpZnkiLCJ1cGxvYWRJbWFnZSIsImZpbGUiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJsb2NhbFByZXZpZXdVcmwiLCJjcmVhdGVPYmplY3RVUkwiLCJtZXRob2QiLCJib2R5Iiwib2siLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsIm5vdGljZSIsImRlc2NyaXB0aW9uUHJvcGVydHkiLCJlZGl0UHJvcGVydGllcyIsInByb3BlcnR5IiwiYXMiLCJvblN1Ym1pdCIsIkgzIiwiY29sb3IiLCJyZXF1aXJlZCIsIm10IiwiaHJlZiIsInJlbCIsIm1pbiIsInByaWNlVmFsdWUiLCJvbGRQcmljZVZhbHVlIiwid2VpZ2h0IiwiYmFkZ2UiLCJzdG9jayIsInNvcnRPcmRlciIsInNyYyIsImFsdCIsImFjY2VwdCIsImlzQmVzdFNlbGxlciIsImlzSW1wb3J0ZWQiLCJpc0ZlYXR1cmVkIiwiaXNBY3RpdmUiLCJtaW5IZWlnaHQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJ3aGVyZSIsIkJ1dHRvbiIsIkljb24iLCJpY29uIiwic3BpbiIsIkNhdGVnb3J5RWRpdCIsImJhbm5lckZpbGVSZWYiLCJiYW5uZXJVcGxvYWRpbmciLCJzZXRCYW5uZXJVcGxvYWRpbmciLCJiYW5uZXJQcmV2aWV3VXJsIiwic2V0QmFubmVyUHJldmlld1VybCIsImNhdGVnb3J5VXJsQmFzZSIsImNhdGVnb3J5VXJsIiwiYmFubmVySW1hZ2VVcmwiLCJiYW5uZXJJbWFnZSIsImRpc3BsYXllZEJhbm5lclVybCIsInVwbG9hZFRvIiwiZmllbGQiLCJzZXRMb2NhbFByZXZpZXciLCJzdWNjZXNzTWVzc2FnZSIsInN1YnRpdGxlIiwibWFyZ2luVG9wIiwiZGlzcGxheSIsIlBFUl9QQUdFX09QVElPTlMiLCJDbXNMaXN0Iiwic2V0VGFnIiwidGl0bGVQcm9wIiwidGl0bGVQcm9wZXJ0eSIsInN0b3JlUGFyYW1zIiwiZmlsdGVycyIsInVzZVF1ZXJ5UGFyYW1zIiwicmVjb3JkcyIsImRpcmVjdGlvbiIsInNvcnRCeSIsImZldGNoRGF0YSIsInBlclBhZ2UiLCJ1c2VSZWNvcmRzIiwic2VsZWN0ZWRSZWNvcmRzIiwiaGFuZGxlU2VsZWN0IiwiaGFuZGxlU2VsZWN0QWxsIiwic2V0U2VsZWN0ZWRSZWNvcmRzIiwidXNlU2VsZWN0ZWRSZWNvcmRzIiwiZGVib3VuY2VSZWYiLCJzdG9yZVBhcmFtc1JlZiIsInRvU3RyaW5nIiwiaGFuZGxlUXVlcnlDaGFuZ2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidHJpbW1lZCIsImhhbmRsZUFjdGlvblBlcmZvcm1lZCIsImN1cnJlbnRQYWdlIiwicm93c1BlclBhZ2UiLCJ0b3RhbFJvd3MiLCJ0b3RhbFBhZ2VzIiwiZnJvbSIsInRvIiwiZ29Ub1BhZ2UiLCJuZXh0UGFnZSIsInNhZmUiLCJjaGFuZ2VQZXJQYWdlIiwibmV4dCIsInBhZ2VOdW1iZXJzIiwid2luZG93U2l6ZSIsInN0YXJ0IiwiZW5kIiwicG9zaXRpb24iLCJtYXhXaWR0aCIsInRyYW5zZm9ybSIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwib3B0aW9uIiwiUmV2aWV3RWRpdCIsInByb3BlcnR5QnlQYXRoIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJyZW5kZXJQcm9wZXJ0eSIsInJlbWFpbmluZ1Byb3BlcnRpZXMiLCJwIiwiSDQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiZyIsIm9iamVjdEZpdCIsIlRBQlMiLCJmaWVsZHMiLCJyZXNvbHZlSW1hZ2VVcmwiLCJJbWFnZVVwbG9hZGVyIiwib25VcGxvYWQiLCJ3aWRlIiwiZGlzcGxheWVkIiwiU2V0dGluZ3NFZGl0IiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwiaGlnaGxpZ2h0RmlsZVJlZiIsImJhbm5lclByZXZpZXciLCJzZXRCYW5uZXJQcmV2aWV3IiwiaGlnaGxpZ2h0UHJldmlldyIsInNldEhpZ2hsaWdodFByZXZpZXciLCJoaWdobGlnaHRVcGxvYWRpbmciLCJzZXRIaWdobGlnaHRVcGxvYWRpbmciLCJob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzIiwiaG9tZUJhbm5lckltYWdlIiwiaGlnaGxpZ2h0SW1hZ2VVcmwiLCJob21lSGlnaGxpZ2h0SW1hZ2UiLCJoYXNoIiwic29tZSIsInRhYiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJzZXRQcmV2aWV3IiwiZmxleCIsImZsZXhEaXJlY3Rpb24iLCJEcmF3ZXJDb250ZW50IiwicHJvcGVydGllcyIsInNoaXBwaW5nRmVlIiwiaGFuZGxpbmdGZWUiLCJEcmF3ZXJGb290ZXIiLCJwYWQiLCJudW0iLCJwYWRTdGFydCIsInRvRGF0ZXRpbWVWYWx1ZSIsIkRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImZvcm1hdERhdGV0aW1lTGFiZWwiLCJkYXkiLCJtb250aCIsInllYXIiLCJob3VyIiwibWludXRlIiwiQ2hvaWNlQ2FyZCIsIkFuY2hvcmVkU2VsZWN0IiwiRGF0ZVRpbWVQaWNrZXIiLCJ2YWxpZCIsIm1vbnRoRGF0ZSIsInNldE1vbnRoRGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsImZpcnN0RGF5IiwiZ2V0RGF5IiwidG90YWxEYXlzIiwiY2VsbHMiLCJpIiwiYXBwbHkiLCJuZXh0SG91cnMiLCJuZXh0TWludXRlcyIsInNlbGVjdGVkRGF5IiwiQ291cG9uRWRpdCIsInNldFByb2R1Y3RzIiwic2VsZWN0ZWRTbHVncyIsInRhcmdldFNsdWdzIiwidGFyZ2V0VHlwZSIsImFwcGx5T24iLCJ1c2FnZVR5cGUiLCJjb3Vwb25UeXBlIiwibG9hZENhdGFsb2ciLCJjYXRlZ29yeURhdGEiLCJhbGxQcm9kdWN0cyIsImhhc01vcmUiLCJwcm9kdWN0RGF0YSIsInNldFNlbGVjdGVkU2x1Z3MiLCJwcm9kdWN0T3B0aW9ucyIsImNhdGVnb3J5T3B0aW9ucyIsImNvZGUiLCJ0b1VwcGVyQ2FzZSIsIm1pbkNhcnQiLCJtYXhEaXNjb3VudCIsInVzYWdlTGltaXQiLCJ1c2VkQ291bnQiLCJzdGFydHNBdCIsImV4cGlyZXNBdCIsIkZVTEZJTExNRU5UIiwiUEFZTUVOVF9PUFRJT05TIiwiZm9ybWF0TW9uZXkiLCJmb3JtYXREYXRlVGltZSIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsInJlc29sdmVJbWFnZSIsIk1vcmVNZW51IiwidW5wYWlkIiwib25DYXNoIiwib25RciIsInNuYXBzaG90Iiwic3RhdHVzIiwicGF5bWVudFN0YXR1cyIsImRlbGl2ZXJ5UGFydG5lcklkIiwiY29udGFjdE5hbWUiLCJjb250YWN0UGhvbmUiLCJhZGRyZXNzTGluZTEiLCJhZGRyZXNzTGluZTIiLCJhZGRyZXNzQ2l0eSIsImFkZHJlc3NTdGF0ZSIsImFkZHJlc3NQaW5jb2RlIiwiYWRkcmVzc0xhbmRtYXJrIiwiT3JkZXJEZXRhaWwiLCJhY3Rpb24iLCJzZXRSZWNvcmQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJhY3Rpb25CdXN5Iiwic2V0QWN0aW9uQnVzeSIsInBhcnRuZXJzIiwic2V0UGFydG5lcnMiLCJzZXRCYXNlbGluZSIsImVkaXRDb250YWN0Iiwic2V0RWRpdENvbnRhY3QiLCJlZGl0QWRkcmVzcyIsInNldEVkaXRBZGRyZXNzIiwicGF0aG5hbWUiLCJyZXNvdXJjZUFjdGlvbiIsInJlc291cmNlSWQiLCJhY3Rpb25OYW1lIiwiaXRlbXMiLCJpdGVtc0pzb24iLCJkaXJ0eSIsImtleXMiLCJsaXN0VXJsIiwiaGFuZGxlU2F2ZSIsInBpbiIsInJ1blBheW1lbnRBY3Rpb24iLCJjb25maXJtIiwicmVjb3JkQWN0aW9uIiwicmVjb3JkSWQiLCJzdGF0dXNMYWJlbCIsInJlc3RvcmVGaWVsZHMiLCJjbG9zZSIsImFkZHJlc3NUZXh0IiwicGF5bWVudExhYmVsIiwicGFydG5lck5hbWUiLCJkZWxpdmVyeVBhcnRuZXJOYW1lIiwiZGVsaXZlcnlQYXJ0bmVyUGhvbmUiLCJpdGVtQ291bnQiLCJyZWR1Y2UiLCJzdW0iLCJxdWFudGl0eSIsImNyZWF0ZWRBdCIsImxpbmVUb3RhbCIsInBheW1lbnRNZXRob2QiLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlDaGFyZ2UiLCJoYW5kbGluZ0NoYXJnZSIsInNtYWxsQ2FydENoYXJnZSIsImRpc2NvdW50IiwiY291cG9uQ29kZSIsImdyYW5kVG90YWwiLCJwYXltZW50Q29sbGVjdGVkQXMiLCJyYXpvcnBheVBheW1lbnRJZCIsInJhem9ycGF5UXJVcmwiLCJpbnB1dE1vZGUiLCJFeWVJY29uIiwiaGlkZGVuIiwiUGFzc3dvcmRGaWVsZCIsInZpc2libGUiLCJvblRvZ2dsZSIsIkxhYmVsIiwiaHRtbEZvciIsImF1dG9Db21wbGV0ZSIsInBhZGRpbmdSaWdodCIsInJpZ2h0IiwiYmFja2dyb3VuZCIsImN1cnNvciIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmciLCJDaGFuZ2VQYXNzd29yZCIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJjb25maXJtUGFzc3dvcmQiLCJzZXRDb25maXJtUGFzc3dvcmQiLCJzaG93UGFzc3dvcmQiLCJzZXRTaG93UGFzc3dvcmQiLCJzaG93Q29uZmlybSIsInNldFNob3dDb25maXJtIiwic2V0RXJyb3IiLCJiYWNrIiwic2F2ZSIsInJlZGlyZWN0VXJsIiwiZXJyIiwiaW5zZXQiLCJ6SW5kZXgiLCJib3hTaGFkb3ciLCJlbWFpbCIsImdhcCIsIlBhcnRuZXJFZGl0IiwiaXNOZXciLCJyZWFkT25seSIsImhhc1Bhc3N3b3JkIiwiZXJyb3JzIiwibWF4TGVuZ3RoIiwic2xpY2UiLCJhZGRyZXNzIiwibm90ZXMiLCJJTkRJQV9TVEFURVMiLCJTVEFURV9PUFRJT05TIiwiUGluY29kZUVkaXQiLCJwYXJ0bmVySWQiLCJwYXJ0bmVyIiwicGluY29kZSIsIm1hcmdpbiIsImFyZWFMYWJlbCIsImNpdHkiLCJzdGF0ZUNvZGUiLCJzdGF0ZSIsIlN0YXR1c1RvZ2dsZSIsInNldENoZWNrZWQiLCJwZXJzaXN0Iiwic2F2ZWQiLCJkZXNjcmlwdGlvbiIsInRvRGF0ZUlucHV0IiwidGV4dCIsImZvcm1hdFdoZW4iLCJwYXJzZUFkZHJlc3NlcyIsImFkZHJlc3NlcyIsImdyb3VwZWQiLCJlbnRyaWVzIiwibWF0Y2giLCJzb3J0IiwiYSIsImIiLCJhZGRyZXNzTGluZXMiLCJsaW5lMSIsImxpbmUyIiwibGFuZG1hcmsiLCJDdXN0b21lckVkaXQiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImFkbWluUm9vdCIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiTWVzc2FnZUJveCIsIkZvcm1Hcm91cCIsImRlZmF1bHRWYWx1ZSIsIm1hcmdpblJpZ2h0IiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJmb250V2VpZ2h0IiwiYWRtaW5Sb290UGF0aCIsImNhdGFsb2dDb25maWciLCJleHBvcnRVcmwiLCJpbXBvcnRVcmwiLCJDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMiLCJvbkltcG9ydGVkIiwidHJhbnNsYXRlQnV0dG9uIiwidHJhbnNsYXRlQWN0aW9uIiwidG9nZ2xlRmlsdGVyIiwiZmlsdGVyc0NvdW50IiwidXNlRmlsdGVyRHJhd2VyIiwic2V0TG9hZGluZyIsInNldE1lc3NhZ2UiLCJjb25maWciLCJyb290IiwiaGFuZGxlSW1wb3J0IiwiY3JlZGVudGlhbHMiLCJlcnJvckNvdW50IiwiY3JlYXRlZCIsInVwZGF0ZWQiLCJidXR0b25zIiwiY2xpY2siLCJuZXdBY3Rpb24iLCJyZXNvdXJjZUFjdGlvbnMiLCJmaWx0ZXJLZXkiLCJjb3VudCIsIkZyYWdtZW50IiwiZmxleFNocmluayIsInB4IiwiQnV0dG9uR3JvdXAiLCJvbkNsb3NlQ2xpY2siLCJDQVRBTE9HX1JFU09VUkNFUyIsIkFjdGlvbkhlYWRlciIsIk9yaWdpbmFsQ29tcG9uZW50IiwiQmFzZUhlYWRlciIsIk9yaWdpbmFsQWN0aW9uSGVhZGVyIiwiaXNDYXRhbG9nTGlzdCIsIl9pZ25vcmVkIiwiaGVhZGVyUHJvcHMiLCJfZXh0ZW5kcyIsIm9taXRBY3Rpb25zIiwiREVGQVVMVF9PUFRJT05TIiwicGx1Z2lucyIsInRvb2xiYXIiLCJSaWNodGV4dEVkaXQiLCJoYW5kbGVVcGRhdGUiLCJ1c2VDYWxsYmFjayIsIm5ld1ZhbHVlIiwiaXNSZXF1aXJlZCIsIlRpbnlNQ0UiLCJGb3JtTWVzc2FnZSIsIm1lbW8iLCJjdXQiLCJzZWFyY2giLCJTaWRlYmFyUmVzb3VyY2VTZWN0aW9uIiwiT3JpZ2luYWwiLCJ1c2VMb2NhdGlvbiIsIm5hdmlnYXRlIiwidXNlTmF2aWdhdGUiLCJyZXNvdXJjZXMiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFFTyxTQUFTQSxpQkFBZUEsQ0FBQ0MsSUFBSSxFQUFFO0VBQ3BDLEVBQUEsTUFBTUMsT0FBTyxHQUFHQyxZQUFNLENB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
