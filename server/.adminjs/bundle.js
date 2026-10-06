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
    compact = false,
    onLabel = 'Active',
    offLabel = 'Inactive'
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
    }, checked ? onLabel : offLabel));
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
  const withoutTrailingSlash$5 = value => String(value || '').replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$5(custom.apiBaseUrl || '/api/v1');
    const productUrlBase = withoutTrailingSlash$5(custom.productUrlBase || `${window.location.origin}/product`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput$1(slugInput) || normalizeSlugInput$1(params.name);
    const productUrl = previewSlug ? `${productUrlBase}/${previewSlug}` : null;
    const selectedCategorySlugs = parseSlugs$2(params.categoryIds);
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$5(custom.appUrl || window.location.origin)}${params.image}`;
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
        setPreviewUrl(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$5(custom.appUrl || window.location.origin)}${media.path}`);
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
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Tax & GST"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isFlagOn(params.isTaxable),
      title: "Taxable",
      hint: isFlagOn(params.isTaxable) ? 'GST will be charged at checkout' : 'No GST on this product',
      onLabel: "Yes",
      offLabel: "No",
      onChange: next => {
        setField('isTaxable', next);
        if (next && Number(params.gstRate || 0) === 0) setField('gstRate', 5);
        if (!next) setField('gstRate', 0);
      }
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "HSN Code", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.hsnCode ?? '0808',
      onChange: event => setField('hsnCode', event.target.value),
      placeholder: "0802 or 0808"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "GST %", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      step: "0.01",
      min: "0",
      value: params.gstRate ?? 0,
      onChange: event => setField('gstRate', Number(event.target.value) || 0),
      placeholder: "5"
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
  const withoutTrailingSlash$4 = value => String(value || '').replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$4(custom.apiBaseUrl || '/api/v1');
    const categoryUrlBase = withoutTrailingSlash$4(custom.categoryUrlBase || `${window.location.origin}/category`);
    const slugInput = params.slug ?? '';
    const previewSlug = normalizeSlugInput(slugInput) || normalizeSlugInput(params.label);
    const categoryUrl = previewSlug ? `${categoryUrlBase}/${previewSlug}` : null;
    const imageUrl = React.useMemo(() => {
      if (!params.image) return '';
      if (/^(https?:|data:|blob:)/.test(params.image)) return params.image;
      return `${withoutTrailingSlash$4(custom.appUrl || window.location.origin)}${params.image}`;
    }, [custom.appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    const bannerImageUrl = React.useMemo(() => {
      if (!params.bannerImage) return '';
      if (/^(https?:|data:|blob:)/.test(params.bannerImage)) return params.bannerImage;
      return `${withoutTrailingSlash$4(custom.appUrl || window.location.origin)}${params.bannerImage}`;
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
        setLocalPreview(/^(https?:|data:|blob:)/.test(media.path) ? media.path : `${withoutTrailingSlash$4(custom.appUrl || window.location.origin)}${media.path}`);
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
      filters,
      parsedQuery
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
    const [query, setQuery] = React.useState(() => String(parsedQuery?.q || filters?.[titleProp] || ''));
    const debounceRef = React.useRef(null);
    const storeParamsRef = React.useRef(storeParams);
    storeParamsRef.current = storeParams;
    React.useEffect(() => {
      setQuery(String(parsedQuery?.q || filters?.[titleProp] || ''));
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
          q: trimmed,
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
        page: String(safe),
        q: parsedQuery?.q || filters?.[titleProp] || undefined
      });
    };
    const changePerPage = next => {
      storeParams({
        page: '1',
        perPage: String(next),
        q: parsedQuery?.q || filters?.[titleProp] || undefined
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
      placeholder: `Search all ${resource.name}...`,
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

  const withoutTrailingSlash$3 = value => String(value || '').replace(/\/+$/, '');
  function resolveImageUrl$1(path, appUrl) {
    if (!path) return '';
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    return `${withoutTrailingSlash$3(appUrl || window.location.origin)}${path}`;
  }
  function FieldError$2({
    error
  }) {
    if (!error?.message) return null;
    return /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, error.message);
  }
  const ReviewEdit = props => {
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
    const fileRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState('');
    const params = record?.params || {};
    const isNew = action?.name === 'new' || !record?.id;
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash$3(custom.apiBaseUrl || '/api/v1');
    const appUrl = custom.appUrl || window.location.origin;
    const errors = React.useMemo(() => record?.errors || {}, [record?.errors]);
    const rating = Math.min(5, Math.max(1, Number(params.rating) || 5));
    const isApproved = isNew && (params.isApproved === undefined || params.isApproved === '') ? true : isFlagOn(params.isApproved);
    React.useEffect(() => {
      if (isNew && (params.isApproved === undefined || params.isApproved === '')) {
        handleChange('isApproved', true);
      }
      if (isNew && !params.rating) handleChange('rating', 5);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew]);
    React.useEffect(() => {
      return () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);
    const imageUrl = React.useMemo(() => resolveImageUrl$1(params.image, appUrl), [appUrl, params.image]);
    const displayedImageUrl = previewUrl || imageUrl;
    const setField = (key, value) => handleChange(key, value);
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
        setField('image', media.path);
        setPreviewUrl(resolveImageUrl$1(media.path, appUrl));
        addNotice({
          message: 'Photo uploaded',
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
            message: notice.message || 'Could not save review',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: isNew ? 'Review created' : 'Review updated',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save review. Please try again.',
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
    }, isNew ? 'Add homepage review' : params.title || 'Review'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Approved reviews appear on the website homepage. Hidden reviews stay in CMS only.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Website visibility"), /*#__PURE__*/React__default.default.createElement("p", null, "Turn this off to hide the review without deleting it."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isApproved,
      onLabel: "Approved",
      offLabel: "Hidden",
      title: isApproved ? 'Approved' : 'Hidden',
      hint: isApproved ? 'Visible on the homepage' : 'Hidden until you approve it',
      onChange: next => setField('isApproved', next)
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Rating"), /*#__PURE__*/React__default.default.createElement("p", null, "Shown as stars on the homepage review card."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Stars", /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: rating,
      options: [5, 4, 3, 2, 1].map(value => ({
        value,
        label: `${value} star${value === 1 ? '' : 's'}`
      })),
      onChange: next => setField('rating', Number(next))
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Review text"), /*#__PURE__*/React__default.default.createElement("p", null, "Keep it short. This is what customers read on the homepage."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Title", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      value: params.title || '',
      onChange: event => setField('title', event.target.value),
      placeholder: "Super fresh fruits"
    }), /*#__PURE__*/React__default.default.createElement(FieldError$2, {
      error: errors.title
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Reviewer name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      value: params.name || '',
      onChange: event => setField('name', event.target.value),
      placeholder: "Priya Sharma"
    }), /*#__PURE__*/React__default.default.createElement(FieldError$2, {
      error: errors.name
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Review", /*#__PURE__*/React__default.default.createElement("textarea", {
      className: "tokri-coupon-input",
      rows: 4,
      required: true,
      value: params.content || '',
      onChange: event => setField('content', event.target.value),
      placeholder: "Always fresh and delivered right on time."
    }), /*#__PURE__*/React__default.default.createElement(FieldError$2, {
      error: errors.content
    }))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Reviewer photo"), /*#__PURE__*/React__default.default.createElement("p", null, "Optional. If empty, the website shows initials instead."), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Photo", /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-upload-drop tokri-upload-drop-round"
    }, displayedImageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: displayedImageUrl,
      alt: params.name || 'Reviewer'
    }) : /*#__PURE__*/React__default.default.createElement("span", null, uploading ? 'Uploading…' : 'Click to upload a photo'), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      onChange: uploadImage
    })), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "JPG, PNG, GIF, or WebP up to 5MB"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading || uploading
    }, loading || uploading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, isNew ? 'Create review' : 'Save review')));
  };

  const TABS = [{
    id: 'general',
    label: 'General',
    fields: ['storeName', 'storeTagline', 'storeEmail', 'storePhone1', 'storePhone2', 'storeAddress', 'promoBanner', 'earlyDelivery']
  }, {
    id: 'charges',
    label: 'Charges',
    fields: ['morningDeliveryTitle', 'morningDeliverySubtitle', 'morningShippingFee', 'morningFreeAbove', 'expressDeliveryTitle', 'expressDeliverySubtitle', 'expressShippingFee', 'expressFreeAbove', 'handlingFee']
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
  const withoutTrailingSlash$2 = value => String(value || '').replace(/\/+$/, '');
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
    return `${withoutTrailingSlash$2(appUrl || window.location.origin)}${path}`;
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
    const apiBaseUrl = withoutTrailingSlash$2(custom.apiBaseUrl || '/api/v1');
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
      }, tab.id === 'charges' ? 'Set copy and prices for Morning and 90-Minute delivery. Handling fee is added to every order.' : tab.id === 'homepage' ? 'These images and categories appear on the website homepage. Click Save changes after uploading.' : 'Update your store settings and click Save changes below.'), tab.id === 'charges' ? /*#__PURE__*/React__default.default.createElement("div", {
        className: "tokri-charges-fields"
      }, /*#__PURE__*/React__default.default.createElement("section", {
        className: "tokri-coupon-card"
      }, /*#__PURE__*/React__default.default.createElement("h4", null, "Morning delivery"), /*#__PURE__*/React__default.default.createElement("p", null, "Shown at checkout when this option is on for the pincode."), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Title", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "text",
        value: record?.params?.morningDeliveryTitle ?? '',
        onChange: event => handleChange('morningDeliveryTitle', event.target.value),
        placeholder: "Flawless Morning Delivery"
      })), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Subtitle", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "text",
        value: record?.params?.morningDeliverySubtitle ?? '',
        onChange: event => handleChange('morningDeliverySubtitle', event.target.value),
        placeholder: "Freshness Guaranteed"
      })), /*#__PURE__*/React__default.default.createElement("div", {
        className: "tokri-coupon-two"
      }, /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Shipping fee (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.morningShippingFee ?? '',
        onChange: event => handleChange('morningShippingFee', event.target.value)
      })), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Free above (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.morningFreeAbove ?? '',
        onChange: event => handleChange('morningFreeAbove', event.target.value)
      }), /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-field-hint"
      }, "0 means no free delivery")))), /*#__PURE__*/React__default.default.createElement("section", {
        className: "tokri-coupon-card"
      }, /*#__PURE__*/React__default.default.createElement("h4", null, "90-Minute delivery"), /*#__PURE__*/React__default.default.createElement("p", null, "Shown at checkout. Disabled pincodes still see this as coming soon."), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Title", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "text",
        value: record?.params?.expressDeliveryTitle ?? '',
        onChange: event => handleChange('expressDeliveryTitle', event.target.value),
        placeholder: "90-Minute Emergency Drops"
      })), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Subtitle", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "text",
        value: record?.params?.expressDeliverySubtitle ?? '',
        onChange: event => handleChange('expressDeliverySubtitle', event.target.value),
        placeholder: "On-Demand Luxury"
      })), /*#__PURE__*/React__default.default.createElement("div", {
        className: "tokri-coupon-two"
      }, /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Shipping fee (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.expressShippingFee ?? '',
        onChange: event => handleChange('expressShippingFee', event.target.value)
      })), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label"
      }, "Free above (\u20B9)", /*#__PURE__*/React__default.default.createElement("input", {
        className: "tokri-coupon-input",
        type: "number",
        min: "0",
        step: "0.01",
        value: record?.params?.expressFreeAbove ?? '',
        onChange: event => handleChange('expressFreeAbove', event.target.value)
      }), /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-field-hint"
      }, "0 means no free delivery")))), /*#__PURE__*/React__default.default.createElement("label", {
        className: "tokri-coupon-label tokri-charges-handling"
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

  const withoutTrailingSlash$1 = value => String(value).replace(/\/+$/, '');
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
    const apiBaseUrl = withoutTrailingSlash$1(custom.apiBaseUrl || '/api/v1');
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

  const FULFILLMENT$1 = {
    pending: {
      label: 'New',
      tone: 'pending'
    },
    paid: {
      label: 'Processing',
      tone: 'processing'
    },
    packed: {
      label: 'Packed',
      tone: 'packed'
    },
    shipped: {
      label: 'Shipped',
      tone: 'shipped'
    },
    delivered: {
      label: 'Delivered',
      tone: 'delivered'
    },
    cancelled: {
      label: 'Cancelled',
      tone: 'cancelled'
    }
  };
  function isOnlineOrder(params = {}) {
    const mode = String(params.paymentMode || '').toLowerCase();
    if (mode === 'online') return true;
    if (mode === 'cod') return false;
    return Boolean(params.razorpayPaymentId || params.razorpayOrderId);
  }
  function paymentBadge(params = {}) {
    const online = isOnlineOrder(params);
    const method = online ? 'Online' : 'COD';
    const status = String(params.paymentStatus || 'pending').toLowerCase();
    if (status === 'paid') return {
      label: `${method} · Paid`,
      tone: 'paid'
    };
    if (status === 'failed') return {
      label: `${method} · Failed`,
      tone: 'failed'
    };
    if (status === 'refunded') return {
      label: `${method} · Refunded`,
      tone: 'refunded'
    };
    if (online) return {
      label: 'Online · Waiting',
      tone: 'waiting'
    };
    return {
      label: 'COD · Unpaid',
      tone: 'pending'
    };
  }
  function Pill({
    label,
    tone
  }) {
    return /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-pill tokri-list-pill is-${tone}`
    }, label);
  }
  function getFulfillmentBadge(status) {
    const key = String(status || 'pending').toLowerCase();
    return FULFILLMENT$1[key] || FULFILLMENT$1.pending;
  }
  function getPaymentBadge(params) {
    return paymentBadge(params);
  }
  function FulfillmentBadge({
    record
  }) {
    const badge = getFulfillmentBadge(record?.params?.status);
    return /*#__PURE__*/React__default.default.createElement(Pill, {
      label: badge.label,
      tone: badge.tone
    });
  }
  function PaymentBadge({
    record
  }) {
    const badge = getPaymentBadge(record?.params);
    return /*#__PURE__*/React__default.default.createElement(Pill, {
      label: badge.label,
      tone: badge.tone
    });
  }
  function OrderListBadge({
    record,
    property
  }) {
    const path = property?.path || property?.propertyPath || '';
    if (path === 'status') return /*#__PURE__*/React__default.default.createElement(FulfillmentBadge, {
      record: record
    });
    return /*#__PURE__*/React__default.default.createElement(PaymentBadge, {
      record: record
    });
  }

  const api$3 = new adminjs.ApiClient();
  const FULFILLMENT = [{
    value: 'pending',
    label: 'New'
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
    label: 'Unpaid'
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
  function CopyId({
    label,
    value,
    href
  }) {
    const [copied, setCopied] = React.useState(false);
    if (!value) return null;
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-rzp-row"
    }, /*#__PURE__*/React__default.default.createElement("span", null, label), /*#__PURE__*/React__default.default.createElement("code", null, value), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => {
        navigator.clipboard?.writeText(value)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }).catch(() => {});
      }
    }, copied ? 'Copied' : 'Copy'), href ? /*#__PURE__*/React__default.default.createElement("a", {
      href: href,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Open in Razorpay") : null);
  }
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
    canSyncRazorpay,
    busy,
    onCash,
    onQr,
    onSyncRazorpay
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
    if (!unpaid && !canSyncRazorpay) return null;
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
    }, busy === 'generateQr' ? 'Creating…' : 'Generate payment QR'), canSyncRazorpay ? /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      disabled: Boolean(busy),
      onClick: () => {
        setOpen(false);
        onSyncRazorpay();
      }
    }, busy === 'syncRazorpay' ? 'Checking Razorpay…' : 'Sync Razorpay payment') : null) : null);
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
    const canSyncRazorpay = unpaid && params.paymentMode === 'online';
    React.useEffect(() => {
      if (!canSyncRazorpay || !record?.id) return undefined;
      let ignore = false;
      api$3.recordAction({
        resourceId: resource.id,
        recordId: record.id,
        actionName: 'syncRazorpay'
      }).then(response => {
        if (ignore) return;
        if (response.data?.record) {
          setRecord(response.data.record);
          setBaseline(snapshot(response.data.record.params));
        }
        const notice = response.data?.notice;
        if (notice?.type === 'success') addNotice(notice);
      }).catch(() => {});
      return () => {
        ignore = true;
      };
    }, [canSyncRazorpay, record?.id, resource.id, setRecord]);
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
    const fulfillment = getFulfillmentBadge(params.status);
    const payment = getPaymentBadge(params);
    const statusLabel = fulfillment.label;
    const restoreFields = (keys, close) => {
      keys.forEach(key => handleChange(key, baseline[key] || ''));
      close(false);
    };
    const addressText = [params.addressLine1, params.addressLine2, [params.addressCity, params.addressState, params.addressPincode].filter(Boolean).join(', '), params.addressLandmark ? `Landmark: ${params.addressLandmark}` : ''].filter(Boolean);
    const paymentLabel = payment.label;
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
      className: `tokri-order-pill is-${payment.tone}`
    }, paymentLabel), /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-pill is-${fulfillment.tone}`
    }, statusLabel)), /*#__PURE__*/React__default.default.createElement("p", null, formatDateTime(params.createdAt)))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-actions"
    }, /*#__PURE__*/React__default.default.createElement("a", {
      className: "tokri-order-invoice",
      href: `/tokri-backoffice/orders/${record.id}/invoice?download=1`,
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Download PDF invoice"
    }, "Download Invoice"), /*#__PURE__*/React__default.default.createElement("button", {
      className: "tokri-order-save",
      type: "submit",
      disabled: !dirty || loading || saving
    }, saving ? 'Saving…' : 'Save'), /*#__PURE__*/React__default.default.createElement(MoreMenu, {
      unpaid: unpaid,
      canSyncRazorpay: canSyncRazorpay,
      busy: actionBusy,
      onCash: () => runPaymentAction('collectCash'),
      onQr: () => runPaymentAction('generateQr'),
      onSyncRazorpay: () => runPaymentAction('syncRazorpay')
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-layout"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-main"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-order-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-card-head"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: `tokri-order-mark is-${fulfillment.tone}`
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
      className: `tokri-order-mark is-${payment.tone}`
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("strong", null, paymentLabel), /*#__PURE__*/React__default.default.createElement("span", null, params.paymentMethod || 'Cash on delivery')), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-select"
    }, /*#__PURE__*/React__default.default.createElement(LocalSelect, {
      value: params.paymentStatus || 'pending',
      options: PAYMENT_OPTIONS,
      onChange: value => handleChange('paymentStatus', value)
    }))), /*#__PURE__*/React__default.default.createElement("dl", {
      className: "tokri-order-totals"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Subtotal"), /*#__PURE__*/React__default.default.createElement("dd", null, itemCount, " ", itemCount === 1 ? 'item' : 'items'), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.itemsTotal))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Delivery", params.deliveryOption ? ` · ${params.deliveryOption === 'express' ? '90-minute' : 'Morning'}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, params.freeDeliveryApplied || Number(params.deliveryCharge) === 0 ? 'Free (Welcome offer)' : formatMoney(params.deliveryCharge))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Handling"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.handlingCharge))), Number(params.taxTotal) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Taxes (GST)", params.isInterState ? ' · IGST' : ' · CGST+SGST'), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.taxTotal))) : null, Number(params.smallCartCharge) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Small cart"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.smallCartCharge))) : null, Number(params.discount) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Discount", params.couponCode ? ` · ${params.couponCode}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, "-", formatMoney(params.discount))) : null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "is-total"
    }, /*#__PURE__*/React__default.default.createElement("dt", null, "Total"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.grandTotal)))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-collected"
    }, /*#__PURE__*/React__default.default.createElement("span", null, params.paymentStatus === 'paid' ? 'Paid by customer' : 'Still to collect'), /*#__PURE__*/React__default.default.createElement("b", null, formatMoney(params.grandTotal))), params.paymentCollectedAs ? /*#__PURE__*/React__default.default.createElement("p", {
      className: "tokri-order-meta"
    }, "Collected as ", params.paymentCollectedAs) : null, params.paymentMode === 'online' || params.razorpayPaymentId || params.razorpayOrderId ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-order-rzp"
    }, /*#__PURE__*/React__default.default.createElement(CopyId, {
      label: "Payment ID",
      value: params.razorpayPaymentId,
      href: params.razorpayPaymentId ? `https://dashboard.razorpay.com/app/payments/${encodeURIComponent(params.razorpayPaymentId)}` : ''
    }), /*#__PURE__*/React__default.default.createElement(CopyId, {
      label: "Razorpay order",
      value: params.razorpayOrderId,
      href: params.razorpayOrderId ? `https://dashboard.razorpay.com/app/orders/${encodeURIComponent(params.razorpayOrderId)}` : ''
    }), !params.razorpayPaymentId ? /*#__PURE__*/React__default.default.createElement("p", {
      className: "tokri-order-meta"
    }, "No Razorpay payment ID yet. Use Sync Razorpay payment if money was captured.") : null) : null, params.razorpayQrUrl ? /*#__PURE__*/React__default.default.createElement("img", {
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
  function PasswordField$1({
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
    }, "Set a new password for ", record?.params?.name || record?.params?.email || 'this user', "."), /*#__PURE__*/React__default.default.createElement(PasswordField$1, {
      id: "new-password",
      label: "New password",
      value: password,
      onChange: setPassword,
      visible: showPassword,
      onToggle: () => setShowPassword(value => !value)
    }), /*#__PURE__*/React__default.default.createElement(PasswordField$1, {
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
  function FieldError$1({
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
    }), errors.email ? /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    })), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    }), /*#__PURE__*/React__default.default.createElement(FieldError$1, {
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
    const morningEnabled = isNew && (params.morningEnabled === undefined || params.morningEnabled === '') ? true : isFlagOn(params.morningEnabled);
    const expressEnabled = isNew && (params.expressEnabled === undefined || params.expressEnabled === '') ? false : isFlagOn(params.expressEnabled);
    const [partners, setPartners] = React.useState([]);
    React.useEffect(() => {
      if (isNew && (params.isActive === undefined || params.isActive === '')) {
        handleChange('isActive', true);
      }
      if (isNew && (params.morningEnabled === undefined || params.morningEnabled === '')) {
        handleChange('morningEnabled', true);
      }
      if (isNew && (params.expressEnabled === undefined || params.expressEnabled === '')) {
        handleChange('expressEnabled', false);
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
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Delivery options"), /*#__PURE__*/React__default.default.createElement("p", null, "Turn an option off to show it as coming soon at checkout. If both are off, this PIN is not deliverable."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: morningEnabled,
      disabled: readOnly,
      onLabel: "On",
      offLabel: "Off",
      title: "Morning delivery",
      hint: morningEnabled ? 'Shoppers can choose morning delivery' : 'Shown as coming soon',
      onChange: next => setField('morningEnabled', next)
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: expressEnabled,
      disabled: readOnly,
      onLabel: "On",
      offLabel: "Off",
      title: "90-Minute delivery",
      hint: expressEnabled ? 'Shoppers can choose 90-minute delivery' : 'Shown as coming soon',
      onChange: next => setField('expressEnabled', next)
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
    const field = property?.path || 'isActive';
    const actionName = property?.custom?.actionName || 'toggleActive';
    const onLabel = property?.custom?.onLabel || 'Active';
    const offLabel = property?.custom?.offLabel || 'Inactive';
    const raw = record?.params?.[field];
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
          actionName,
          method: 'post',
          data: {
            [field]: next
          }
        });
        const saved = response.data?.record?.params?.[field];
        setChecked(saved === undefined ? next : isFlagOn(saved));
        const notice = response.data?.notice;
        addNotice({
          message: notice?.message || (next ? `Marked ${onLabel.toLowerCase()}` : `Marked ${offLabel.toLowerCase()}`),
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
        onChange(field, next);
        return;
      }
      persist(next);
    };
    return /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      compact: where !== 'edit',
      checked: checked,
      disabled: busy,
      onLabel: onLabel,
      offLabel: offLabel,
      title: where === 'edit' ? checked ? onLabel : offLabel : undefined,
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
  function formatWhen$1(value) {
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
    }, "+91 ", params.phone || '—', " \xB7 joined ", formatWhen$1(params.createdAt))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
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

  const ROLES = [{
    value: 'staff',
    title: 'Staff',
    hint: 'Access only the areas you tick below'
  }, {
    value: 'admin',
    title: 'Admin',
    hint: 'Full access to the CMS'
  }, {
    value: 'super_admin',
    title: 'Super admin',
    hint: 'Full access, same as admin'
  }];
  const PERMISSIONS = [{
    key: 'manageProducts',
    label: 'Products',
    hint: 'Add and edit products'
  }, {
    key: 'manageCatalog',
    label: 'Catalog',
    hint: 'Categories and collections'
  }, {
    key: 'manageMedia',
    label: 'Media',
    hint: 'Upload and replace images'
  }, {
    key: 'manageOrders',
    label: 'Orders',
    hint: 'View and update orders'
  }, {
    key: 'manageCoupons',
    label: 'Coupons',
    hint: 'Create discount codes'
  }, {
    key: 'manageContent',
    label: 'Content',
    hint: 'Pages and reviews'
  }, {
    key: 'manageSettings',
    label: 'Settings',
    hint: 'Store and homepage settings'
  }, {
    key: 'manageUsers',
    label: 'Team',
    hint: 'Create users and change access'
  }];
  function FieldError({
    error
  }) {
    if (!error?.message) return null;
    return /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-error"
    }, error.message);
  }
  function PasswordField({
    label,
    value,
    onChange,
    error,
    placeholder
  }) {
    const [visible, setVisible] = React.useState(false);
    return /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, label, /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-password-wrap"
    }, /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: visible ? 'text' : 'password',
      value: value,
      onChange: event => onChange(event.target.value),
      placeholder: placeholder,
      autoComplete: "new-password"
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-password-toggle",
      "aria-label": visible ? 'Hide password' : 'Show password',
      onClick: () => setVisible(current => !current)
    }, visible ? 'Hide' : 'Show')), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: error
    }));
  }
  const TeamEdit = props => {
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
    const role = params.role || 'staff';
    const isActive = isNew && (params.isActive === undefined || params.isActive === '') ? true : isFlagOn(params.isActive);
    React.useEffect(() => {
      if (isNew && (params.isActive === undefined || params.isActive === '')) {
        handleChange('isActive', true);
      }
      if (isNew && !params.role) handleChange('role', 'staff');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew]);
    const errors = React.useMemo(() => record?.errors || {}, [record?.errors]);
    const setField = (key, value) => handleChange(key, value);
    const permissionOn = key => isFlagOn(params[`permissions.${key}`]);
    const submit = event => {
      event.preventDefault();
      handleSubmit().then(response => {
        const notice = response?.data?.notice;
        if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save team member',
            type: 'error'
          });
          return;
        }
        addNotice({
          message: isNew ? 'Team member created' : 'Team member updated',
          type: 'success'
        });
      }).catch(() => {
        addNotice({
          message: 'Could not save team member. Please try again.',
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
    }, isNew ? 'Add team member' : params.name || 'Team member'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "They sign in to Tokriii CMS with username or email. Inactive users cannot log in.")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Account status"), /*#__PURE__*/React__default.default.createElement("p", null, "Turn this off to block CMS login without deleting the account."), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isActive,
      title: isActive ? 'Active' : 'Inactive',
      hint: isActive ? 'Can sign in to the admin panel' : 'Login is blocked until you turn this on',
      onChange: next => setField('isActive', next)
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Role"), /*#__PURE__*/React__default.default.createElement("p", null, "Admin and super admin get full access. Staff only gets the permissions you enable."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, ROLES.map(item => /*#__PURE__*/React__default.default.createElement(FlagCard, {
      key: item.value,
      selected: role === item.value,
      title: item.title,
      hint: item.hint,
      onClick: () => setField('role', item.value)
    }))))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Login details"), /*#__PURE__*/React__default.default.createElement("p", null, "Username or email can be used on the CMS login screen."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Full name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      value: params.name || '',
      onChange: event => setField('name', event.target.value),
      placeholder: "Team member name"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.name
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Username", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      required: true,
      value: params.username || '',
      onChange: event => setField('username', event.target.value.trim()),
      placeholder: "e.g. ravi.cms"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.username
    }))), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Email", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "email",
      required: true,
      value: params.email || '',
      onChange: event => setField('email', event.target.value),
      placeholder: "name@tokriii.com"
    }), /*#__PURE__*/React__default.default.createElement(FieldError, {
      error: errors.email
    })), isNew ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-two"
    }, /*#__PURE__*/React__default.default.createElement(PasswordField, {
      label: "Password",
      value: params.password || '',
      onChange: value => setField('password', value),
      error: errors.password,
      placeholder: "At least 6 characters"
    }), /*#__PURE__*/React__default.default.createElement(PasswordField, {
      label: "Confirm password",
      value: params.confirmPassword || '',
      onChange: value => setField('confirmPassword', value),
      error: errors.confirmPassword,
      placeholder: "Type password again"
    })) : /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "Use Change password from the team list to reset login.")), role === 'staff' ? /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Permissions"), /*#__PURE__*/React__default.default.createElement("p", null, "Only used for staff. Toggle what this person can open in the CMS."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-perm-list"
    }, PERMISSIONS.map(item => /*#__PURE__*/React__default.default.createElement("div", {
      key: item.key,
      className: "tokri-perm-row"
    }, /*#__PURE__*/React__default.default.createElement("span", null, /*#__PURE__*/React__default.default.createElement("strong", null, item.label), /*#__PURE__*/React__default.default.createElement("span", null, item.hint)), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      compact: true,
      checked: permissionOn(item.key),
      onChange: next => setField(`permissions.${item.key}`, next)
    }))))) : null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, isNew ? 'Create team member' : 'Save team member')));
  };

  const FOLDERS = ['all', 'products', 'categories', 'reviews', 'pages', 'general'];
  const withoutTrailingSlash = value => String(value || '').replace(/\/+$/, '');
  function formatSize(bytes) {
    const size = Number(bytes) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  function formatWhen(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  function resolveUrl(path, appUrl) {
    if (!path) return '';
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    return `${withoutTrailingSlash(appUrl || window.location.origin)}${path}`;
  }
  const MediaLibrary = props => {
    const {
      resource,
      setTag
    } = props;
    const addNotice = adminjs.useNotice();
    const {
      storeParams,
      filters
    } = adminjs.useQueryParams();
    const {
      records,
      loading,
      fetchData,
      total,
      perPage
    } = adminjs.useRecords(resource.id);
    const fileRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const [busyId, setBusyId] = React.useState('');
    const folder = String(filters?.folder || 'all');
    const custom = resource?.options?.custom || {};
    const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1');
    const appUrl = custom.appUrl || window.location.origin;
    const uploadFolder = folder === 'all' ? 'general' : folder;
    React.useEffect(() => {
      if (setTag) setTag(String(total || 0));
    }, [total, setTag]);
    React.useEffect(() => {
      if (Number(perPage) < 50) storeParams({
        perPage: '50'
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const items = React.useMemo(() => (records || []).map(item => ({
      id: item.id,
      name: item.params?.originalName || item.params?.filename || 'Image',
      folder: item.params?.folder || 'general',
      path: item.params?.path || '',
      size: item.params?.size,
      createdAt: item.params?.createdAt,
      url: resolveUrl(item.params?.path, appUrl)
    })), [appUrl, records]);
    const setFolder = next => {
      storeParams({
        page: '1',
        filters: next === 'all' ? {} : {
          folder: next
        }
      });
    };
    const uploadFiles = async files => {
      const list = [...files].filter(file => file.type.startsWith('image/'));
      if (!list.length) return;
      setUploading(true);
      try {
        for (const file of list) {
          const formData = new FormData();
          formData.append('folder', uploadFolder);
          formData.append('file', file);
          const response = await fetch(`${apiBaseUrl}/media/upload`, {
            method: 'POST',
            body: formData
          });
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Could not upload ${file.name}`);
          }
        }
        addNotice({
          message: list.length === 1 ? 'Image uploaded' : `${list.length} images uploaded`,
          type: 'success'
        });
        fetchData();
      } catch (error) {
        addNotice({
          message: error.message || 'Upload failed',
          type: 'error'
        });
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    const copyPath = async path => {
      try {
        await navigator.clipboard.writeText(path);
        addNotice({
          message: 'File path copied',
          type: 'success'
        });
      } catch {
        addNotice({
          message: path,
          type: 'info'
        });
      }
    };
    const remove = async (id, name) => {
      if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
      setBusyId(id);
      try {
        const response = await fetch(`${apiBaseUrl}/media/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || 'Could not delete image');
        }
        addNotice({
          message: data.message || 'Image deleted',
          type: 'success'
        });
        fetchData();
      } catch (error) {
        addNotice({
          message: error.message || 'Could not delete image',
          type: 'error'
        });
      } finally {
        setBusyId('');
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-hero"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      color: "white"
    }, "Media library"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "white"
    }, "Upload images used on products, categories, reviews, and the homepage. Files stay on this server.")), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Upload"), /*#__PURE__*/React__default.default.createElement("p", null, "Files go into the ", /*#__PURE__*/React__default.default.createElement("strong", null, uploadFolder), " folder", folder === 'all' ? ' (select a folder below to change this).' : '.'), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-upload-drop",
      onDragOver: event => event.preventDefault(),
      onDrop: event => {
        event.preventDefault();
        uploadFiles(event.dataTransfer.files);
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, uploading ? 'Uploading…' : 'Click or drop images here'), /*#__PURE__*/React__default.default.createElement("input", {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      multiple: true,
      disabled: uploading,
      onChange: event => uploadFiles(event.target.files)
    })), /*#__PURE__*/React__default.default.createElement("span", {
      className: "tokri-field-hint"
    }, "JPG, PNG, GIF, or WebP up to 5MB each")), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Library"), /*#__PURE__*/React__default.default.createElement("p", null, total || 0, " file", (total || 0) === 1 ? '' : 's', folder !== 'all' ? ` in ${folder}` : '', "."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-folder-chips"
    }, FOLDERS.map(item => /*#__PURE__*/React__default.default.createElement("button", {
      key: item,
      type: "button",
      className: `tokri-folder-chip${folder === item ? ' is-on' : ''}`,
      onClick: () => setFolder(item)
    }, item === 'all' ? 'All folders' : item))), loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "xl"
    }, "Loading images\u2026") : items.length ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-media-grid"
    }, items.map(item => /*#__PURE__*/React__default.default.createElement("article", {
      key: item.id,
      className: "tokri-media-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-media-thumb"
    }, item.url ? /*#__PURE__*/React__default.default.createElement("img", {
      src: item.url,
      alt: item.name
    }) : /*#__PURE__*/React__default.default.createElement("span", null, "No preview")), /*#__PURE__*/React__default.default.createElement("strong", {
      title: item.name
    }, item.name), /*#__PURE__*/React__default.default.createElement("span", null, item.folder, " \xB7 ", formatSize(item.size), item.createdAt ? ` · ${formatWhen(item.createdAt)}` : ''), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-media-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      size: "sm",
      variant: "text",
      onClick: () => copyPath(item.path)
    }, "Copy path"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      size: "sm",
      variant: "danger",
      disabled: busyId === item.id,
      onClick: () => remove(item.id, item.name)
    }, busyId === item.id ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Delete"))))) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "xl"
    }, "No images in this folder yet.")));
  };

  const TaxEdit = props => {
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
    const params = record?.params || {};
    const setField = (key, value) => handleChange(key, value);
    const isTaxableBool = isFlagOn(params.isTaxable);
    const handleTaxableToggle = value => {
      setField('isTaxable', value);
      if (!value) {
        setField('gstRate', 0);
      } else if (Number(params.gstRate || 0) === 0) {
        setField('gstRate', 5);
      }
    };
    const onSubmit = async event => {
      event?.preventDefault?.();
      try {
        await handleSubmit();
        addNotice({
          message: 'Tax configuration updated successfully.',
          type: 'success'
        });
      } catch (error) {
        addNotice({
          message: error.message || 'Failed to update tax configuration',
          type: 'error'
        });
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      onSubmit: onSubmit,
      className: "tokri-coupon-form"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-head"
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement(designSystem.H3, null, params.productName || 'Edit Product Tax'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      opacity: 0.7
    }, "Configure HSN code and GST percentage for this product."))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Product details"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Product name", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.productName || '',
      disabled: true,
      style: {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "Category", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.categoryName || 'General',
      disabled: true,
      style: {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Taxability status"), /*#__PURE__*/React__default.default.createElement(StatusSwitch, {
      checked: isTaxableBool,
      title: "Taxable",
      hint: isTaxableBool ? 'GST will be charged at checkout' : '0% GST (fresh fruits / exempt)',
      onLabel: "Yes",
      offLabel: "No",
      onChange: handleTaxableToggle
    })), /*#__PURE__*/React__default.default.createElement("section", {
      className: "tokri-coupon-card"
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "GST & HSN details"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-coupon-grid"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "HSN code", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      value: params.hsnCode || '0808',
      onChange: event => setField('hsnCode', event.target.value),
      placeholder: "e.g. 0802 for dry fruits, 0808 for fresh fruits"
    })), /*#__PURE__*/React__default.default.createElement("label", {
      className: "tokri-coupon-label"
    }, "GST % rate", /*#__PURE__*/React__default.default.createElement("input", {
      className: "tokri-coupon-input",
      type: "number",
      step: "0.01",
      min: "0",
      max: "100",
      value: params.gstRate ?? (isTaxableBool ? 5 : 0),
      onChange: event => setField('gstRate', Number(event.target.value) || 0),
      placeholder: "e.g. 5 for dry fruits"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      opacity: 0.7,
      fontSize: "12px"
    }, isTaxableBool ? `At checkout, intra-state orders split into ${(Number(params.gstRate || 5) / 2).toFixed(1)}% CGST + ${(Number(params.gstRate || 5) / 2).toFixed(1)}% SGST; inter-state orders charge ${Number(params.gstRate || 5)}% IGST.` : 'Product is exempt/non-taxable (0% GST).')), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      className: "tokri-coupon-actions"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained",
      type: "submit",
      disabled: loading
    }, loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Loader",
      spin: true
    }) : null, "Save tax settings")));
  };

  function copyText(value) {
    if (!value || !navigator.clipboard?.writeText) return Promise.reject();
    return navigator.clipboard.writeText(value);
  }
  function RazorpayPaymentId({
    record
  }) {
    const paymentId = String(record?.params?.razorpayPaymentId || '').trim();
    const paid = record?.params?.paymentStatus === 'paid';
    const [copied, setCopied] = React.useState(false);
    if (!paid || !paymentId) {
      return /*#__PURE__*/React__default.default.createElement("span", {
        className: "tokri-rzp-empty"
      }, "\u2014");
    }
    const handleCopy = event => {
      event.preventDefault();
      event.stopPropagation();
      copyText(paymentId).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }).catch(() => {});
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-rzp-cell",
      onClick: event => event.stopPropagation()
    }, /*#__PURE__*/React__default.default.createElement("a", {
      className: "tokri-rzp-id",
      href: `https://dashboard.razorpay.com/app/payments/${encodeURIComponent(paymentId)}`,
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Open this payment in Razorpay"
    }, paymentId), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "tokri-rzp-copy",
      onClick: handleCopy
    }, copied ? 'Copied' : 'Copy'));
  }

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
          text: errorCount > 0 ? `Import finished. ${data.created} added, ${data.updated} updated. ${errorCount} row(s) could not be imported. Existing rows are matched by slug.` : `Import finished. ${data.created} added, ${data.updated} updated. Existing rows are matched by slug — keep slug the same to update price.`
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
        label: 'Export CSV',
        variant: 'text',
        href: `${root}/catalog/${config.exportUrl}`
      }, {
        label: 'Export Excel',
        variant: 'text',
        href: `${root}/catalog/${config.exportUrl}?format=xlsx`
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
      accept: ".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  AdminJS.UserComponents.TeamEdit = TeamEdit;
  AdminJS.UserComponents.MediaLibrary = MediaLibrary;
  AdminJS.UserComponents.TaxEdit = TaxEdit;
  AdminJS.UserComponents.RazorpayPaymentId = RazorpayPaymentId;
  AdminJS.UserComponents.OrderListBadge = OrderListBadge;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;
  AdminJS.UserComponents.SidebarResourceSection = SidebarResourceSection;
  AdminJS.UserComponents.RecordsTable = RecordsTable;
  AdminJS.UserComponents.RecordsTableHeader = RecordsTableHeader;

})(React, AdminJS, AdminJSDesignSystem, ReactRouter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3JtLWNvbnRyb2xzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWxpc3QtYmFkZ2VzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvaW5kaWEtc3RhdGVzLmpzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGVhbS1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL21lZGlhLWxpYnJhcnkuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGF4LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmF6b3JwYXktcGF5bWVudC1pZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9sb2dpbi5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jYXRhbG9nLWxpc3QtaGVhZGVyLWFjdGlvbnMuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvYWN0aW9uLWhlYWRlci5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yaWNodGV4dC1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NpZGViYXItZGFzaGJvYXJkLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmVjb3Jkcy10YWJsZS1oZWFkZXIuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQW5jaG9yZWRNZW51KG9wZW4pIHtcbiAgY29uc3Qgd3JhcFJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbb3BlblVwLCBzZXRPcGVuVXBdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW9wZW4pIHJldHVybiB1bmRlZmluZWRcblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGUgPSB3cmFwUmVmLmN1cnJlbnRcbiAgICAgIGlmICghbm9kZSkgcmV0dXJuXG4gICAgICBjb25zdCByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgY29uc3Qgc3BhY2VCZWxvdyA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHJlY3QuYm90dG9tXG4gICAgICBzZXRPcGVuVXAoc3BhY2VCZWxvdyA8IDI0MCAmJiByZWN0LnRvcCA+IHNwYWNlQmVsb3cpXG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIH1cbiAgfSwgW29wZW5dKVxuXG4gIHJldHVybiB7IHdyYXBSZWYsIG9wZW5VcCB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2hhYmxlTXVsdGlTZWxlY3QoeyBvcHRpb25zLCBzZWxlY3RlZCwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IHNlbGVjdGVkU2V0ID0gdXNlTWVtbygoKSA9PiBuZXcgU2V0KHNlbGVjdGVkKSwgW3NlbGVjdGVkXSlcbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKSlcbiAgY29uc3QgZmlsdGVyZWQgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT5cbiAgICBgJHtpdGVtLmxhYmVsfSAke2l0ZW0udmFsdWV9YC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpKSxcbiAgKVxuXG4gIGNvbnN0IHRvZ2dsZSA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzZWxlY3RlZFNldC5oYXModmFsdWUpKSBvbkNoYW5nZShzZWxlY3RlZC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IHZhbHVlKSlcbiAgICBlbHNlIG9uQ2hhbmdlKFsuLi5zZWxlY3RlZCwgdmFsdWVdKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubGVuZ3RoID8gKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBzXCI+XG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNoaXBcIj5cbiAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICB0b2dnbGUoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgw5dcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1wbGFjZWhvbGRlclwiPntwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtjaGVja2VkID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGUoaXRlbS52YWx1ZSl9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZsYWdDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmxhZ09uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gJ3RydWUnIHx8IHZhbHVlID09PSAnb24nIHx8IHZhbHVlID09PSAxIHx8IHZhbHVlID09PSAnMSdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFN0YXR1c1N3aXRjaCh7XG4gIGNoZWNrZWQsXG4gIG9uQ2hhbmdlLFxuICBkaXNhYmxlZCxcbiAgdGl0bGUsXG4gIGhpbnQsXG4gIGNvbXBhY3QgPSBmYWxzZSxcbiAgb25MYWJlbCA9ICdBY3RpdmUnLFxuICBvZmZMYWJlbCA9ICdJbmFjdGl2ZScsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1zd2l0Y2gke2NoZWNrZWQgPyAnIGlzLW9uJyA6ICcnfSR7Y29tcGFjdCA/ICcgaXMtY29tcGFjdCcgOiAnJ31gfVxuICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgYXJpYS1wcmVzc2VkPXtjaGVja2VkfVxuICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgaWYgKCFkaXNhYmxlZCkgb25DaGFuZ2UoIWNoZWNrZWQpXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXN3aXRjaC10cmFja1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtdGh1bWJcIiAvPlxuICAgICAgPC9zcGFuPlxuICAgICAge3RpdGxlIHx8IGhpbnQgPyAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXN3aXRjaC1jb3B5XCI+XG4gICAgICAgICAge3RpdGxlID8gPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+IDogbnVsbH1cbiAgICAgICAgICB7aGludCA/IDxzcGFuPntoaW50fTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApIDogKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1zdGF0dXMtcGlsbCR7Y2hlY2tlZCA/ICcgaXMtb24nIDogJyd9YH0+XG4gICAgICAgICAge2NoZWNrZWQgPyBvbkxhYmVsIDogb2ZmTGFiZWx9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICl9XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNlYXJjaGFibGVTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBzZWFyY2hQbGFjZWhvbGRlciwgZGlzYWJsZWQgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuICBjb25zdCBzZWxlY3RlZCA9IG9wdGlvbnMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiXG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGlmICghZGlzYWJsZWQpIHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3NlbGVjdGVkID8gJycgOiAndG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXInfT5cbiAgICAgICAgICB7c2VsZWN0ZWQ/LmxhYmVsIHx8IHBsYWNlaG9sZGVyfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRRdWVyeShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NlYXJjaFBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgIHtmaWx0ZXJlZC5sZW5ndGggPyAoXG4gICAgICAgICAgICAgIGZpbHRlcmVkLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGl0ZW0udmFsdWUgPT09IHZhbHVlXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZSB8fCAnZW1wdHknfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2FjdGl2ZSA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICBzZXRRdWVyeSgnJylcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gTG9jYWxTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIGRpc2FibGVkIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IFN0cmluZyhpdGVtLnZhbHVlKSA9PT0gU3RyaW5nKHZhbHVlKSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxvY2FsLXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1sb2NhbC1zZWxlY3QtY29udHJvbFwiXG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGlmICghZGlzYWJsZWQpIHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8c3Bhbj57c2VsZWN0ZWQ/LmxhYmVsIHx8IHZhbHVlfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1sb2NhbC1zZWxlY3QtbWVudSR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICB7b3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHtTdHJpbmcoaXRlbS52YWx1ZSkgPT09IFN0cmluZyh2YWx1ZSkgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBMb2NhbFNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5jb25zdCBSQU5HRVMgPSBbXG4gIHsgdmFsdWU6ICc3ZCcsIGxhYmVsOiAnNyBkYXlzJyB9LFxuICB7IHZhbHVlOiAndGhpc01vbnRoJywgbGFiZWw6ICdUaGlzIG1vbnRoJyB9LFxuICB7IHZhbHVlOiAnbGFzdE1vbnRoJywgbGFiZWw6ICdMYXN0IG1vbnRoJyB9LFxuICB7IHZhbHVlOiAnOTBkJywgbGFiZWw6ICczIG1vbnRocycgfSxcbl1cbmNvbnN0IFdJREdFVFMgPSBbJ29yZGVyVmFsdWUnLCAnb3JkZXJzJywgJ2N1c3RvbWVycycsICdwcm9kdWN0cyddXG5cbmNvbnN0IGluciA9ICh2YWx1ZSkgPT5cbiAgYOKCuSR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwIH0pfWBcblxuZnVuY3Rpb24gUmFuZ2VTZWxlY3QoeyB2YWx1ZSwgb25DaGFuZ2UgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktcmFuZ2Utc2VsZWN0XCI+XG4gICAgICA8TG9jYWxTZWxlY3QgdmFsdWU9e3ZhbHVlfSBvcHRpb25zPXtSQU5HRVN9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBheGlzTWF4KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA8PSAwKSByZXR1cm4gMTAwMFxuICBjb25zdCBwYWRkZWQgPSB2YWx1ZSAqIDEuMVxuICBjb25zdCBtYWduaXR1ZGUgPSAxMCAqKiBNYXRoLmZsb29yKE1hdGgubG9nMTAocGFkZGVkKSlcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHBhZGRlZCAvIG1hZ25pdHVkZVxuICBjb25zdCBuaWNlID0gbm9ybWFsaXplZCA8PSAxID8gMSA6IG5vcm1hbGl6ZWQgPD0gMiA/IDIgOiBub3JtYWxpemVkIDw9IDUgPyA1IDogMTBcbiAgcmV0dXJuIG5pY2UgKiBtYWduaXR1ZGVcbn1cblxuZnVuY3Rpb24gTGluZUNoYXJ0KHsgc2VyaWVzIH0pIHtcbiAgY29uc3QgW2hvdmVyLCBzZXRIb3Zlcl0gPSB1c2VTdGF0ZShudWxsKVxuICBjb25zdCB3aWR0aCA9IDEyMDBcbiAgY29uc3QgaGVpZ2h0ID0gMzIwXG4gIGNvbnN0IHBhZExlZnQgPSA4NlxuICBjb25zdCBwYWRSaWdodCA9IDE4XG4gIGNvbnN0IHBhZFRvcCA9IDE4XG4gIGNvbnN0IHBhZEJvdHRvbSA9IDM2XG4gIGNvbnN0IG1heCA9IGF4aXNNYXgoTWF0aC5tYXgoLi4uc2VyaWVzLm1hcCgocG9pbnQpID0+IHBvaW50Lm9yZGVyVmFsdWUpLCAwKSlcbiAgY29uc3QgcGxvdFdpZHRoID0gd2lkdGggLSBwYWRMZWZ0IC0gcGFkUmlnaHRcbiAgY29uc3QgcGxvdEhlaWdodCA9IGhlaWdodCAtIHBhZFRvcCAtIHBhZEJvdHRvbVxuICBjb25zdCBiYXNlbGluZSA9IHBhZFRvcCArIHBsb3RIZWlnaHRcbiAgY29uc3QgeUZvciA9ICh2YWx1ZSkgPT4gYmFzZWxpbmUgLSAodmFsdWUgLyBtYXgpICogcGxvdEhlaWdodFxuICBjb25zdCBzdGVwID0gc2VyaWVzLmxlbmd0aCA+IDEgPyBwbG90V2lkdGggLyAoc2VyaWVzLmxlbmd0aCAtIDEpIDogcGxvdFdpZHRoXG4gIGNvbnN0IGNvb3JkcyA9IHNlcmllcy5tYXAoKHBvaW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHggPSBzZXJpZXMubGVuZ3RoID09PSAxID8gcGFkTGVmdCArIHBsb3RXaWR0aCAvIDIgOiBwYWRMZWZ0ICsgaW5kZXggKiBzdGVwXG4gICAgcmV0dXJuIHsgeCwgeTogeUZvcihwb2ludC5vcmRlclZhbHVlKSwgcG9pbnQgfVxuICB9KVxuICBjb25zdCBsaW5lID0gY29vcmRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IGAke2luZGV4ID8gJ0wnIDogJ00nfSR7aXRlbS54fSwke2l0ZW0ueX1gKS5qb2luKCcgJylcbiAgY29uc3QgYXJlYSA9IGNvb3Jkcy5sZW5ndGhcbiAgICA/IGAke2xpbmV9IEwke2Nvb3Jkc1tjb29yZHMubGVuZ3RoIC0gMV0ueH0sJHtiYXNlbGluZX0gTCR7Y29vcmRzWzBdLnh9LCR7YmFzZWxpbmV9IFpgXG4gICAgOiAnJ1xuICBjb25zdCBsYWJlbEV2ZXJ5ID0gc2VyaWVzLmxlbmd0aCA+IDIwID8gTWF0aC5jZWlsKHNlcmllcy5sZW5ndGggLyA4KSA6IHNlcmllcy5sZW5ndGggPiAxMCA/IDQgOiAxXG4gIGNvbnN0IHRpY2tzID0gWzAsIDAuMjUsIDAuNSwgMC43NSwgMV0ubWFwKChyYXRpbykgPT4gKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChtYXggKiByYXRpbyksXG4gICAgeTogeUZvcihtYXggKiByYXRpbyksXG4gIH0pKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1wbG90XCIgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRIb3ZlcihudWxsKX0+XG4gICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YH0gY2xhc3NOYW1lPVwidG9rcmktY2hhcnRcIiByb2xlPVwiaW1nXCI+XG4gICAgICAgIHt0aWNrcy5tYXAoKHRpY2spID0+IChcbiAgICAgICAgICA8ZyBrZXk9e3RpY2sudmFsdWV9PlxuICAgICAgICAgICAgPGxpbmUgeDE9e3BhZExlZnR9IHgyPXt3aWR0aCAtIHBhZFJpZ2h0fSB5MT17dGljay55fSB5Mj17dGljay55fSBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1ncmlkbGluZVwiIC8+XG4gICAgICAgICAgICA8dGV4dCB4PXtwYWRMZWZ0IC0gMTB9IHk9e3RpY2sueSArIDR9IHRleHRBbmNob3I9XCJlbmRcIiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1heGlzXCI+XG4gICAgICAgICAgICAgIHtpbnIodGljay52YWx1ZSl9XG4gICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApKX1cbiAgICAgICAgPHBhdGggZD17YXJlYX0gZmlsbD1cIiMwNDc4NTdcIiBvcGFjaXR5PVwiMC4xNlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9e2xpbmV9IGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiM1wiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICB7Y29vcmRzLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgIDxnIGtleT17aXRlbS5wb2ludC5kYXRlfT5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgY3g9e2l0ZW0ueH1cbiAgICAgICAgICAgICAgY3k9e2l0ZW0ueX1cbiAgICAgICAgICAgICAgcj1cIjE0XCJcbiAgICAgICAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRIb3ZlcihpdGVtKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Y2lyY2xlIGN4PXtpdGVtLnh9IGN5PXtpdGVtLnl9IHI9XCI0LjVcIiBmaWxsPVwiI2ZmZlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjJcIiBwb2ludGVyRXZlbnRzPVwibm9uZVwiIC8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApKX1cbiAgICAgICAge2Nvb3Jkcy5tYXAoKGl0ZW0sIGluZGV4KSA9PlxuICAgICAgICAgIGluZGV4ICUgbGFiZWxFdmVyeSA9PT0gMCA/IChcbiAgICAgICAgICAgIDx0ZXh0IGtleT17YCR7aXRlbS5wb2ludC5kYXRlfS1sYWJlbGB9IHg9e2l0ZW0ueH0geT17aGVpZ2h0IC0gOH0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWxhYmVsXCI+XG4gICAgICAgICAgICAgIHtpdGVtLnBvaW50LmxhYmVsfVxuICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICkgOiBudWxsLFxuICAgICAgICApfVxuICAgICAgPC9zdmc+XG4gICAgICB7aG92ZXIgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaGFydC10aXAke2hvdmVyLnkgPCA5MCA/ICcgaXMtYmVsb3cnIDogJyd9YH1cbiAgICAgICAgICBzdHlsZT17eyBsZWZ0OiBgJHsoaG92ZXIueCAvIHdpZHRoKSAqIDEwMH0lYCwgdG9wOiBgJHsoaG92ZXIueSAvIGhlaWdodCkgKiAxMDB9JWAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPntob3Zlci5wb2ludC5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgPHN0cm9uZz57aW5yKGhvdmVyLnBvaW50Lm9yZGVyVmFsdWUpfTwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFBhZ2VyKHsgcGFnZSwgcGFnZVNpemUsIHRvdGFsLCBvbkNoYW5nZSB9KSB7XG4gIGNvbnN0IHBhZ2VzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKCh0b3RhbCB8fCAwKSAvIHBhZ2VTaXplKSlcbiAgaWYgKHBhZ2VzIDw9IDEpIHJldHVybiBudWxsXG4gIGNvbnN0IG51bWJlcnMgPSBbXVxuICBmb3IgKGxldCBudW1iZXIgPSAxOyBudW1iZXIgPD0gcGFnZXM7IG51bWJlciArPSAxKSBudW1iZXJzLnB1c2gobnVtYmVyKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LXBhZ2VzXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1wYWdlc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17cGFnZSA8PSAxfSBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShwYWdlIC0gMSl9PlxuICAgICAgICAgIFByZXZcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIHtudW1iZXJzLm1hcCgobnVtYmVyKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBrZXk9e251bWJlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17bnVtYmVyID09PSBwYWdlID8gJ2lzLWN1cnJlbnQnIDogJyd9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZShudW1iZXIpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtudW1iZXJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17cGFnZSA+PSBwYWdlc30gb25DbGljaz17KCkgPT4gb25DaGFuZ2UocGFnZSArIDEpfT5cbiAgICAgICAgICBOZXh0XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICBjb25zdCByZXF1ZXN0cyA9IHVzZVJlZih7fSlcbiAgY29uc3QgW3Jhbmdlcywgc2V0UmFuZ2VzXSA9IHVzZVN0YXRlKHtcbiAgICBvcmRlclZhbHVlOiAnN2QnLFxuICAgIG9yZGVyczogJzdkJyxcbiAgICBjdXN0b21lcnM6ICc3ZCcsXG4gICAgcHJvZHVjdHM6ICc3ZCcsXG4gIH0pXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHt9KVxuICBjb25zdCBbcGFnZXMsIHNldFBhZ2VzXSA9IHVzZVN0YXRlKHsgb3JkZXJzOiAxLCBjdXN0b21lcnM6IDEgfSlcbiAgY29uc3QgW2J1c3ksIHNldEJ1c3ldID0gdXNlU3RhdGUoe1xuICAgIG9yZGVyVmFsdWU6IHRydWUsXG4gICAgb3JkZXJzOiB0cnVlLFxuICAgIGN1c3RvbWVyczogdHJ1ZSxcbiAgICBwcm9kdWN0czogdHJ1ZSxcbiAgfSlcblxuICBjb25zdCBsb2FkV2lkZ2V0ID0gKHdpZGdldCwgcmFuZ2UsIHBhZ2UgPSAxKSA9PiB7XG4gICAgY29uc3QgdGlja2V0ID0gKHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSB8fCAwKSArIDFcbiAgICByZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gPSB0aWNrZXRcbiAgICBzZXRCdXN5KChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogdHJ1ZSB9KSlcbiAgICBhcGlcbiAgICAgIC5nZXREYXNoYm9hcmQoeyBwYXJhbXM6IHsgd2lkZ2V0LCByYW5nZSwgcGFnZSB9IH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlcXVlc3RzLmN1cnJlbnRbd2lkZ2V0XSAhPT0gdGlja2V0KSByZXR1cm5cbiAgICAgICAgc2V0RGF0YSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgLi4ucmVzcG9uc2UuZGF0YSB9KSlcbiAgICAgIH0pXG4gICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gIT09IHRpY2tldCkgcmV0dXJuXG4gICAgICAgIHNldEJ1c3koKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiBmYWxzZSB9KSlcbiAgICAgIH0pXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIFdJREdFVFMuZm9yRWFjaCgod2lkZ2V0KSA9PiBsb2FkV2lkZ2V0KHdpZGdldCwgJzdkJykpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGNoYW5nZVJhbmdlID0gKHdpZGdldCwgcmFuZ2UpID0+IHtcbiAgICBzZXRSYW5nZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiByYW5nZSB9KSlcbiAgICBpZiAod2lkZ2V0ID09PSAnb3JkZXJzJyB8fCB3aWRnZXQgPT09ICdjdXN0b21lcnMnKSB7XG4gICAgICBzZXRQYWdlcygoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IDEgfSkpXG4gICAgfVxuICAgIGxvYWRXaWRnZXQod2lkZ2V0LCByYW5nZSwgMSlcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVBhZ2UgPSAod2lkZ2V0LCBwYWdlKSA9PiB7XG4gICAgc2V0UGFnZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiBwYWdlIH0pKVxuICAgIGxvYWRXaWRnZXQod2lkZ2V0LCByYW5nZXNbd2lkZ2V0XSwgcGFnZSlcbiAgfVxuXG4gIGNvbnN0IG9yZGVyVmFsdWUgPSBkYXRhLm9yZGVyVmFsdWVcbiAgY29uc3Qgb3JkZXJzID0gZGF0YS5vcmRlcnNcbiAgY29uc3QgY3VzdG9tZXJzID0gZGF0YS5jdXN0b21lcnNcbiAgY29uc3QgcHJvZHVjdHMgPSBkYXRhLnByb2R1Y3RzXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJ0cmFuc3BhcmVudFwiIGNsYXNzTmFtZT1cInRva3JpLWFuYWx5dGljc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hbmFseXRpY3MtaGVhZFwiPlxuICAgICAgICA8SDIgbWI9XCJzbVwiPkRhc2hib2FyZDwvSDI+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZCB0b2tyaS1jaGFydC1jYXJkLXdpZGVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8SDUgbWI9XCJzbVwiPk9yZGVyIFZhbHVlPC9INT5cbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgIHtidXN5Lm9yZGVyVmFsdWUgJiYgIW9yZGVyVmFsdWVcbiAgICAgICAgICAgICAgICA/ICdMb2FkaW5n4oCmJ1xuICAgICAgICAgICAgICAgIDogYCR7aW5yKG9yZGVyVmFsdWU/LnRvdGFsKX0gZnJvbSAke29yZGVyVmFsdWU/Lm9yZGVyQ291bnQgfHwgMH0gb3JkZXJzYH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5vcmRlclZhbHVlfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgnb3JkZXJWYWx1ZScsIHZhbHVlKX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtvcmRlclZhbHVlPy5zZXJpZXM/Lmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWZyYW1lXCI+XG4gICAgICAgICAgICA8TGluZUNoYXJ0IHNlcmllcz17b3JkZXJWYWx1ZS5zZXJpZXN9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXNwbGl0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SDUgbWI9XCJzbVwiPk9yZGVyIEFtb3VudDwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kub3JkZXJzICYmICFvcmRlcnMgPyAnTG9hZGluZ+KApicgOiBgJHtvcmRlcnM/LnRvdGFsIHx8IDB9IG9yZGVyc2B9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMub3JkZXJzfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgnb3JkZXJzJywgdmFsdWUpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtvcmRlcnM/LnJvd3M/Lmxlbmd0aCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktdGFibGUtd3JhcFwiPlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidG9rcmktZGF0YS10YWJsZVwiPlxuICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk9yZGVyIG51bWJlcjwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkFtb3VudDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5QbGFjZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtvcmRlcnMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm9yZGVyTm99PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntpbnIocm93LmFtb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5wbGFjZWRBdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PntidXN5Lm9yZGVycyA/ICdMb2FkaW5n4oCmJyA6ICdObyBvcmRlcnMgaW4gdGhpcyBwZXJpb2QuJ308L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8UGFnZXJcbiAgICAgICAgICAgIHBhZ2U9e29yZGVycz8ucGFnZSB8fCBwYWdlcy5vcmRlcnN9XG4gICAgICAgICAgICBwYWdlU2l6ZT17b3JkZXJzPy5wYWdlU2l6ZSB8fCAxMH1cbiAgICAgICAgICAgIHRvdGFsPXtvcmRlcnM/LnRvdGFsIHx8IDB9XG4gICAgICAgICAgICBvbkNoYW5nZT17KHBhZ2UpID0+IGNoYW5nZVBhZ2UoJ29yZGVycycsIHBhZ2UpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5OZXcgQ3VzdG9tZXJzPC9INT5cbiAgICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAgICB7YnVzeS5jdXN0b21lcnMgJiYgIWN1c3RvbWVycyA/ICdMb2FkaW5n4oCmJyA6IGAke2N1c3RvbWVycz8udG90YWwgfHwgMH0gcGVvcGxlIHJlZ2lzdGVyZWRgfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLmN1c3RvbWVyc30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ2N1c3RvbWVycycsIHZhbHVlKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7Y3VzdG9tZXJzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPlBob25lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkRhdGUgb2YgYmlydGg8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAge2N1c3RvbWVycy5yb3dzLm1hcCgocm93KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3Jvdy5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD4rOTEge3Jvdy5waG9uZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93LmRhdGVPZkJpcnRofTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cucmVnaXN0ZXJlZEF0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+e2J1c3kuY3VzdG9tZXJzID8gJ0xvYWRpbmfigKYnIDogJ05vIG5ldyBjdXN0b21lcnMgaW4gdGhpcyBwZXJpb2QuJ308L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8UGFnZXJcbiAgICAgICAgICAgIHBhZ2U9e2N1c3RvbWVycz8ucGFnZSB8fCBwYWdlcy5jdXN0b21lcnN9XG4gICAgICAgICAgICBwYWdlU2l6ZT17Y3VzdG9tZXJzPy5wYWdlU2l6ZSB8fCAxMH1cbiAgICAgICAgICAgIHRvdGFsPXtjdXN0b21lcnM/LnRvdGFsIHx8IDB9XG4gICAgICAgICAgICBvbkNoYW5nZT17KHBhZ2UpID0+IGNoYW5nZVBhZ2UoJ2N1c3RvbWVycycsIHBhZ2UpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXNwbGl0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1oZWFkXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8SDUgbWI9XCJzbVwiPkJlc3QgU2VsbGluZyBQcm9kdWN0czwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kucHJvZHVjdHMgJiYgIXByb2R1Y3RzID8gJ0xvYWRpbmfigKYnIDogJ1RvcCA1IGJ5IG51bWJlciBvZiBvcmRlcnMnfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLnByb2R1Y3RzfSBvbkNoYW5nZT17KHZhbHVlKSA9PiBjaGFuZ2VSYW5nZSgncHJvZHVjdHMnLCB2YWx1ZSl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3Byb2R1Y3RzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWN0PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk9yZGVyczwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5BbW91bnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtwcm9kdWN0cy5yb3dzLm1hcCgocm93KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e3Jvdy5uYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cub3JkZXJzfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntpbnIocm93LmFtb3VudCl9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT57YnVzeS5wcm9kdWN0cyA/ICdMb2FkaW5n4oCmJyA6ICdObyBwcm9kdWN0cyBzb2xkIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgRmxhZ0NhcmQsIGlzRmxhZ09uLCBTZWFyY2hhYmxlTXVsdGlTZWxlY3QsIFN0YXR1c1N3aXRjaCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IG5vcm1hbGl6ZVNsdWdJbnB1dCA9ICh2YWx1ZSkgPT5cbiAgU3RyaW5nKHZhbHVlIHx8ICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9bJ1wiXS9nLCAnJylcbiAgICAucmVwbGFjZSgvW15hLXowLTldKy9nLCAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG5cbmNvbnN0IHdpdGhvdXRUcmFpbGluZ1NsYXNoID0gKHZhbHVlKSA9PiBTdHJpbmcodmFsdWUgfHwgJycpLnJlcGxhY2UoL1xcLyskLywgJycpXG5cbmZ1bmN0aW9uIHBhcnNlU2x1Z3MocmF3KSB7XG4gIGlmICghcmF3KSByZXR1cm4gW11cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5tYXAoKGl0ZW0pID0+IFN0cmluZyhpdGVtKS50cmltKCkpLmZpbHRlcihCb29sZWFuKVxuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpKSByZXR1cm4gcGFyc2VTbHVncyhwYXJzZWQpXG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIHJhd1xuICAgICAgLnNwbGl0KCcsJylcbiAgICAgIC5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICB9XG4gIHJldHVybiBbXVxufVxuXG5jb25zdCBQcm9kdWN0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBwcm9kdWN0VXJsQmFzZSA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKFxuICAgIGN1c3RvbS5wcm9kdWN0VXJsQmFzZSB8fCBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9wcm9kdWN0YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubmFtZSlcbiAgY29uc3QgcHJvZHVjdFVybCA9IHByZXZpZXdTbHVnID8gYCR7cHJvZHVjdFVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcbiAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeVNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMuY2F0ZWdvcnlJZHMpXG5cbiAgY29uc3QgaW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5pbWFnZSkpIHJldHVybiBwYXJhbXMuaW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5pbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuaW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ25hbWUnICYmICFzbHVnRWRpdGVkKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ3NsdWcnLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNldFNlbGVjdGVkQ2F0ZWdvcmllcyA9IChzbHVncykgPT4gc2V0RmllbGQoJ2NhdGVnb3J5SWRzJywgSlNPTi5zdHJpbmdpZnkoc2x1Z3MpKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdwcm9kdWN0cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ2ltYWdlJywgbWVkaWEucGF0aClcbiAgICAgIGhhbmRsZUNoYW5nZSgnbWVkaWFJZCcsIG1lZGlhLmlkKVxuICAgICAgc2V0UHJldmlld1VybChcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ1Byb2R1Y3Qgc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcHJvZHVjdCcsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubmFtZSB8fCAnTmV3IHByb2R1Y3QnfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5BZGQgcGhvdG9zLCBwcmljZXMsIGFuZCBvbmUgb3IgbW9yZSBjYXRlZ29yaWVzIGZvciB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQWxwaG9uc28gTWFuZ29cIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFNsdWdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17c2x1Z0lucHV0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJhdXRvLWdlbmVyYXRlZCBmcm9tIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgUHJldmlldzp7JyAnfVxuICAgICAgICAgICAge3Byb2R1Y3RVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e3Byb2R1Y3RVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICB7cHJvZHVjdFVybH1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgJ0dlbmVyYXRlZCBmcm9tIHByb2R1Y3QgbmFtZSB3aGVuIHNhdmVkJ1xuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFByaWNlICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucHJpY2VWYWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncHJpY2VWYWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIE9sZCBwcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm9sZFByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ29sZFByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiT3B0aW9uYWxcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgV2VpZ2h0XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy53ZWlnaHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3dlaWdodCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxIGtnXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIEJhZGdlXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5iYWRnZSB8fCAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYmFkZ2UnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2hcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU3RvY2tcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0b2NrID8/IDEwMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc3RvY2snLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU29ydCBvcmRlclxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc29ydE9yZGVyID8/IDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3NvcnRPcmRlcicsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+VGF4ICYgR1NUPC9oND5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTIgfX0+XG4gICAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2lzRmxhZ09uKHBhcmFtcy5pc1RheGFibGUpfVxuICAgICAgICAgICAgICB0aXRsZT1cIlRheGFibGVcIlxuICAgICAgICAgICAgICBoaW50PXtpc0ZsYWdPbihwYXJhbXMuaXNUYXhhYmxlKSA/ICdHU1Qgd2lsbCBiZSBjaGFyZ2VkIGF0IGNoZWNrb3V0JyA6ICdObyBHU1Qgb24gdGhpcyBwcm9kdWN0J31cbiAgICAgICAgICAgICAgb25MYWJlbD1cIlllc1wiXG4gICAgICAgICAgICAgIG9mZkxhYmVsPVwiTm9cIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnaXNUYXhhYmxlJywgbmV4dClcbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBOdW1iZXIocGFyYW1zLmdzdFJhdGUgfHwgMCkgPT09IDApIHNldEZpZWxkKCdnc3RSYXRlJywgNSlcbiAgICAgICAgICAgICAgICBpZiAoIW5leHQpIHNldEZpZWxkKCdnc3RSYXRlJywgMClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIEhTTiBDb2RlXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5oc25Db2RlID8/ICcwODA4J31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnaHNuQ29kZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIwODAyIG9yIDA4MDhcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgR1NUICVcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5nc3RSYXRlID8/IDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2dzdFJhdGUnLCBOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKSB8fCAwKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjVcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Byb2R1Y3QgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSBzcXVhcmUgcHJvZHVjdCBwaG90bzwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yaWVzPC9oND5cbiAgICAgICAgPHA+QSBwcm9kdWN0IGNhbiBhcHBlYXIgaW4gbW9yZSB0aGFuIG9uZSBjYXRlZ29yeSBvbiB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFNlbGVjdCBjYXRlZ29yaWVzXG4gICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKX1cbiAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENhdGVnb3J5U2x1Z3N9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRDYXRlZ29yaWVzfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggYW5kIHNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5TdG9yZSBwbGFjZW1lbnQ8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiQmVzdHNlbGxlclwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBiZXN0c2VsbGVyc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNCZXN0U2VsbGVyJywgIShwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzSW1wb3J0ZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzSW1wb3J0ZWQgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiSW1wb3J0ZWRcIlxuICAgICAgICAgICAgaGludD1cIlNob3cgaW4gaW1wb3J0ZWQgZnJ1aXRzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0ltcG9ydGVkJywgIShwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNGZWF0dXJlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNGZWF0dXJlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJGZWF0dXJlZFwiXG4gICAgICAgICAgICBoaW50PVwiSGlnaGxpZ2h0IHRoaXMgZnJ1aXRcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzRmVhdHVyZWQnLCAhKHBhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnfVxuICAgICAgICAgICAgdGl0bGU9XCJBY3RpdmVcIlxuICAgICAgICAgICAgaGludD1cIlZpc2libGUgdG8gY3VzdG9tZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBwcm9kdWN0XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PlxuICBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgQ2F0ZWdvcnlFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgYmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Jhbm5lclByZXZpZXdVcmwsIHNldEJhbm5lclByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubGFiZWwpXG4gIGNvbnN0IGNhdGVnb3J5VXJsID0gcHJldmlld1NsdWcgPyBgJHtjYXRlZ29yeVVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYW5uZXJJbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5iYW5uZXJJbWFnZSkpIHJldHVybiBwYXJhbXMuYmFubmVySW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5iYW5uZXJJbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuYmFubmVySW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEJhbm5lclVybCA9IGJhbm5lclByZXZpZXdVcmwgfHwgYmFubmVySW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChiYW5uZXJQcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGJhbm5lclByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbYmFubmVyUHJldmlld1VybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdsYWJlbCcgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkVG8gPSBhc3luYyAoZmlsZSwgZmllbGQsIHNldExvY2FsUHJldmlldywgc2V0QnVzeSwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnY2F0ZWdvcmllcycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBzZXRMb2NhbFByZXZpZXcoVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgICBzZXRCdXN5KHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldExvY2FsUHJldmlldyhcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDYXRlZ29yeSBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubGFiZWwgfHwgJ05ldyBjYXRlZ29yeSd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHNob3Agc2VjdGlvbiB3aXRoIGEgdGh1bWJuYWlsLCBiYW5uZXIsIGFuZCBwYWdlIGNvcHkuPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTGFiZWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdsYWJlbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2ggRnJ1aXRzXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQYWdlIGhlYWRpbmdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNhbWUgYXMgbGFiZWwgaWYgZW1wdHlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN1YnRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdWJ0aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaG9ydCBsaW5lIHVuZGVyIHRoZSBoZWFkaW5nXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBsYWJlbFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgICB7Y2F0ZWdvcnlVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e2NhdGVnb3J5VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge2NhdGVnb3J5VXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gY2F0ZWdvcnkgbGFiZWwgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTb3J0IG9yZGVyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zb3J0T3JkZXIgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc29ydE9yZGVyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gd2Vic2l0ZSBhbmQgYXBwXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNhdGVnb3J5IGltYWdlPC9oND5cbiAgICAgICAgICA8cD5TcXVhcmUgdGh1bWJuYWlsIHVzZWQgaW4gdGhlIGhvbWUgY2F0ZWdvcnkgZ3JpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IHByZXZpZXcnfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGNhdGVnb3J5IGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkVG8oZmlsZSwgJ2ltYWdlJywgc2V0UHJldmlld1VybCwgc2V0VXBsb2FkaW5nLCAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yeSBiYW5uZXI8L2g0PlxuICAgICAgICA8cD5XaWRlIGltYWdlIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2UuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3AgdG9rcmktdXBsb2FkLWRyb3Atd2lkZVwiPlxuICAgICAgICAgIHtkaXNwbGF5ZWRCYW5uZXJVcmwgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkQmFubmVyVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgYmFubmVyJ30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGEgd2lkZSBiYW5uZXIgKDE2MDDDlzQwMCByZWNvbW1lbmRlZCk8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRUbyhcbiAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAnYmFubmVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyUHJldmlld1VybCxcbiAgICAgICAgICAgICAgICAgIHNldEJhbm5lclVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICdCYW5uZXIgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkRlc2NyaXB0aW9uPC9oND5cbiAgICAgICAge2Rlc2NyaXB0aW9uUHJvcGVydHkgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT5cbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtkZXNjcmlwdGlvblByb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7cmVzb3VyY2UuZWRpdFByb3BlcnRpZXNcbiAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gWydpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCkpXG4gICAgICAgICAgLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjYXRlZ29yeVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBJY29uLCBJbnB1dCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBSZWNvcmRzVGFibGUsXG4gIHVzZVF1ZXJ5UGFyYW1zLFxuICB1c2VSZWNvcmRzLFxuICB1c2VTZWxlY3RlZFJlY29yZHMsXG59IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBMb2NhbFNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IFBFUl9QQUdFX09QVElPTlMgPSBbMTAsIDI1LCA1MF1cblxuY29uc3QgQ21zTGlzdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlUHJvcCA9IHJlc291cmNlLnRpdGxlUHJvcGVydHk/Lm5hbWUgfHwgcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ucHJvcGVydHlQYXRoIHx8ICdpZCdcblxuICBjb25zdCB7IHN0b3JlUGFyYW1zLCBmaWx0ZXJzLCBwYXJzZWRRdWVyeSB9ID0gdXNlUXVlcnlQYXJhbXMoKVxuICBjb25zdCB7XG4gICAgcmVjb3JkcyxcbiAgICBsb2FkaW5nLFxuICAgIGRpcmVjdGlvbixcbiAgICBzb3J0QnksXG4gICAgcGFnZSxcbiAgICB0b3RhbCxcbiAgICBmZXRjaERhdGEsXG4gICAgcGVyUGFnZSxcbiAgfSA9IHVzZVJlY29yZHMocmVzb3VyY2UuaWQpXG4gIGNvbnN0IHtcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgaGFuZGxlU2VsZWN0LFxuICAgIGhhbmRsZVNlbGVjdEFsbCxcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMsXG4gIH0gPSB1c2VTZWxlY3RlZFJlY29yZHMocmVjb3JkcylcblxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlKCgpID0+IFN0cmluZyhwYXJzZWRRdWVyeT8ucSB8fCBmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gIGNvbnN0IGRlYm91bmNlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IHN0b3JlUGFyYW1zUmVmID0gdXNlUmVmKHN0b3JlUGFyYW1zKVxuICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50ID0gc3RvcmVQYXJhbXNcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFF1ZXJ5KFN0cmluZyhwYXJzZWRRdWVyeT8ucSB8fCBmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCAnJykpXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzKFtdKVxuICB9LCBbcmVzb3VyY2UuaWQsIHRpdGxlUHJvcCwgc2V0U2VsZWN0ZWRSZWNvcmRzXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZXRUYWcpIHNldFRhZyh0b3RhbC50b1N0cmluZygpKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgY29uc3QgaGFuZGxlUXVlcnlDaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIHNldFF1ZXJ5KHZhbHVlKVxuXG4gICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIGRlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKClcbiAgICAgIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQoe1xuICAgICAgICBwYWdlOiAnMScsXG4gICAgICAgIHE6IHRyaW1tZWQsXG4gICAgICAgIGZpbHRlcnM6IHRyaW1tZWQgPyB7IFt0aXRsZVByb3BdOiB0cmltbWVkIH0gOiB7fSxcbiAgICAgIH0pXG4gICAgfSwgMzAwKVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGRlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChkZWJvdW5jZVJlZi5jdXJyZW50KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQWN0aW9uUGVyZm9ybWVkID0gKCkgPT4gZmV0Y2hEYXRhKClcblxuICBjb25zdCBjdXJyZW50UGFnZSA9IE51bWJlcihwYWdlKSB8fCAxXG4gIGNvbnN0IHJvd3NQZXJQYWdlID0gTnVtYmVyKHBlclBhZ2UpIHx8IDEwXG4gIGNvbnN0IHRvdGFsUm93cyA9IE51bWJlcih0b3RhbCkgfHwgMFxuICBjb25zdCB0b3RhbFBhZ2VzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKHRvdGFsUm93cyAvIHJvd3NQZXJQYWdlKSB8fCAxKVxuICBjb25zdCBmcm9tID0gdG90YWxSb3dzID09PSAwID8gMCA6IChjdXJyZW50UGFnZSAtIDEpICogcm93c1BlclBhZ2UgKyAxXG4gIGNvbnN0IHRvID0gTWF0aC5taW4oY3VycmVudFBhZ2UgKiByb3dzUGVyUGFnZSwgdG90YWxSb3dzKVxuXG4gIGNvbnN0IGdvVG9QYWdlID0gKG5leHRQYWdlKSA9PiB7XG4gICAgY29uc3Qgc2FmZSA9IE1hdGgubWluKE1hdGgubWF4KDEsIG5leHRQYWdlKSwgdG90YWxQYWdlcylcbiAgICBzdG9yZVBhcmFtcyh7XG4gICAgICBwYWdlOiBTdHJpbmcoc2FmZSksXG4gICAgICBxOiBwYXJzZWRRdWVyeT8ucSB8fCBmaWx0ZXJzPy5bdGl0bGVQcm9wXSB8fCB1bmRlZmluZWQsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVBlclBhZ2UgPSAobmV4dCkgPT4ge1xuICAgIHN0b3JlUGFyYW1zKHtcbiAgICAgIHBhZ2U6ICcxJyxcbiAgICAgIHBlclBhZ2U6IFN0cmluZyhuZXh0KSxcbiAgICAgIHE6IHBhcnNlZFF1ZXJ5Py5xIHx8IGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8IHVuZGVmaW5lZCxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcGFnZU51bWJlcnMgPSBbXVxuICBjb25zdCB3aW5kb3dTaXplID0gNVxuICBsZXQgc3RhcnQgPSBNYXRoLm1heCgxLCBjdXJyZW50UGFnZSAtIE1hdGguZmxvb3Iod2luZG93U2l6ZSAvIDIpKVxuICBsZXQgZW5kID0gTWF0aC5taW4odG90YWxQYWdlcywgc3RhcnQgKyB3aW5kb3dTaXplIC0gMSlcbiAgc3RhcnQgPSBNYXRoLm1heCgxLCBlbmQgLSB3aW5kb3dTaXplICsgMSlcbiAgZm9yIChsZXQgbnVtYmVyID0gc3RhcnQ7IG51bWJlciA8PSBlbmQ7IG51bWJlciArPSAxKSBwYWdlTnVtYmVycy5wdXNoKG51bWJlcilcblxuICByZXR1cm4gKFxuICAgIDxCb3ggdmFyaWFudD1cImdyZXlcIj5cbiAgICAgIDxCb3ggbWI9XCJsZ1wiIHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtYXhXaWR0aDogNDIwIH19PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIGxlZnQ6IDEyLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJY29uIGljb249XCJTZWFyY2hcIiAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVRdWVyeUNoYW5nZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17YFNlYXJjaCBhbGwgJHtyZXNvdXJjZS5uYW1lfS4uLmB9XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ0xlZnQ6IDM2IH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCB2YXJpYW50PVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxSZWNvcmRzVGFibGVcbiAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgcmVjb3Jkcz17cmVjb3Jkc31cbiAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2hhbmRsZUFjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgaXNMb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uXCI+XG4gICAgICAgICAgPFRleHQgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXN1bW1hcnlcIj5cbiAgICAgICAgICAgIHt0b3RhbFJvd3MgPT09IDAgPyAnTm8gcmVjb3JkcycgOiBgU2hvd2luZyAke2Zyb2194oCTJHt0b30gb2YgJHt0b3RhbFJvd3N9YH1cbiAgICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1zaXplXCI+XG4gICAgICAgICAgICA8c3Bhbj5Sb3dzPC9zcGFuPlxuICAgICAgICAgICAgPExvY2FsU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtTdHJpbmcocm93c1BlclBhZ2UpfVxuICAgICAgICAgICAgICBvcHRpb25zPXtQRVJfUEFHRV9PUFRJT05TLm1hcCgob3B0aW9uKSA9PiAoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBTdHJpbmcob3B0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogU3RyaW5nKG9wdGlvbiksXG4gICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBjaGFuZ2VQZXJQYWdlKE51bWJlcihuZXh0KSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tcGFnZXNcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtjdXJyZW50UGFnZSA8PSAxfSBvbkNsaWNrPXsoKSA9PiBnb1RvUGFnZShjdXJyZW50UGFnZSAtIDEpfT5cbiAgICAgICAgICAgICAgUHJldlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7cGFnZU51bWJlcnMubWFwKChudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGtleT17bnVtYmVyfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17bnVtYmVyID09PSBjdXJyZW50UGFnZSA/ICdpcy1jdXJyZW50JyA6ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKG51bWJlcil9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7bnVtYmVyfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e2N1cnJlbnRQYWdlID49IHRvdGFsUGFnZXN9IG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKGN1cnJlbnRQYWdlICsgMSl9PlxuICAgICAgICAgICAgICBOZXh0XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbXNMaXN0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiByZXNvbHZlSW1hZ2VVcmwocGF0aCwgYXBwVXJsKSB7XG4gIGlmICghcGF0aCkgcmV0dXJuICcnXG4gIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXRoKSkgcmV0dXJuIHBhdGhcbiAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhdGh9YFxufVxuXG5mdW5jdGlvbiBGaWVsZEVycm9yKHsgZXJyb3IgfSkge1xuICBpZiAoIWVycm9yPy5tZXNzYWdlKSByZXR1cm4gbnVsbFxuICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3IubWVzc2FnZX08L3NwYW4+XG59XG5cbmNvbnN0IFJldmlld0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgYXBwVXJsID0gY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIGNvbnN0IGVycm9ycyA9IHVzZU1lbW8oKCkgPT4gcmVjb3JkPy5lcnJvcnMgfHwge30sIFtyZWNvcmQ/LmVycm9yc10pXG4gIGNvbnN0IHJhdGluZyA9IE1hdGgubWluKDUsIE1hdGgubWF4KDEsIE51bWJlcihwYXJhbXMucmF0aW5nKSB8fCA1KSlcbiAgY29uc3QgaXNBcHByb3ZlZCA9XG4gICAgaXNOZXcgJiYgKHBhcmFtcy5pc0FwcHJvdmVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQXBwcm92ZWQgPT09ICcnKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FwcHJvdmVkKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBcHByb3ZlZCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FwcHJvdmVkID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnaXNBcHByb3ZlZCcsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAhcGFyYW1zLnJhdGluZykgaGFuZGxlQ2hhbmdlKCdyYXRpbmcnLCA1KVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5pbWFnZV0sXG4gIClcbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdyZXZpZXdzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIHNldEZpZWxkKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3VXJsKHJlc29sdmVJbWFnZVVybChtZWRpYS5wYXRoLCBhcHBVcmwpKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ1Bob3RvIHVwbG9hZGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHJldmlldycsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBpc05ldyA/ICdSZXZpZXcgY3JlYXRlZCcgOiAnUmV2aWV3IHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcmV2aWV3LiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGhvbWVwYWdlIHJldmlldycgOiBwYXJhbXMudGl0bGUgfHwgJ1Jldmlldyd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPlxuICAgICAgICAgIEFwcHJvdmVkIHJldmlld3MgYXBwZWFyIG9uIHRoZSB3ZWJzaXRlIGhvbWVwYWdlLiBIaWRkZW4gcmV2aWV3cyBzdGF5IGluIENNUyBvbmx5LlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5XZWJzaXRlIHZpc2liaWxpdHk8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gaGlkZSB0aGUgcmV2aWV3IHdpdGhvdXQgZGVsZXRpbmcgaXQuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQXBwcm92ZWR9XG4gICAgICAgICAgICBvbkxhYmVsPVwiQXBwcm92ZWRcIlxuICAgICAgICAgICAgb2ZmTGFiZWw9XCJIaWRkZW5cIlxuICAgICAgICAgICAgdGl0bGU9e2lzQXBwcm92ZWQgPyAnQXBwcm92ZWQnIDogJ0hpZGRlbid9XG4gICAgICAgICAgICBoaW50PXtpc0FwcHJvdmVkID8gJ1Zpc2libGUgb24gdGhlIGhvbWVwYWdlJyA6ICdIaWRkZW4gdW50aWwgeW91IGFwcHJvdmUgaXQnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBcHByb3ZlZCcsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5SYXRpbmc8L2g0PlxuICAgICAgICAgIDxwPlNob3duIGFzIHN0YXJzIG9uIHRoZSBob21lcGFnZSByZXZpZXcgY2FyZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhcnNcbiAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cmF0aW5nfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbNSwgNCwgMywgMiwgMV0ubWFwKCh2YWx1ZSkgPT4gKHtcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBsYWJlbDogYCR7dmFsdWV9IHN0YXIke3ZhbHVlID09PSAxID8gJycgOiAncyd9YCxcbiAgICAgICAgICAgICAgfSkpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdyYXRpbmcnLCBOdW1iZXIobmV4dCkpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlJldmlldyB0ZXh0PC9oND5cbiAgICAgICAgPHA+S2VlcCBpdCBzaG9ydC4gVGhpcyBpcyB3aGF0IGN1c3RvbWVycyByZWFkIG9uIHRoZSBob21lcGFnZS48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy50aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3RpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTdXBlciBmcmVzaCBmcnVpdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMudGl0bGV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBSZXZpZXdlciBuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUHJpeWEgU2hhcm1hXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLm5hbWV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBSZXZpZXdcbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICByb3dzPXs0fVxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGVudCB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjb250ZW50JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQWx3YXlzIGZyZXNoIGFuZCBkZWxpdmVyZWQgcmlnaHQgb24gdGltZS5cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5jb250ZW50fSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UmV2aWV3ZXIgcGhvdG88L2g0PlxuICAgICAgICA8cD5PcHRpb25hbC4gSWYgZW1wdHksIHRoZSB3ZWJzaXRlIHNob3dzIGluaXRpYWxzIGluc3RlYWQuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgUGhvdG9cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcCB0b2tyaS11cGxvYWQtZHJvcC1yb3VuZFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Jldmlld2VyJ30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayB0byB1cGxvYWQgYSBwaG90byd9PC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CPC9zcGFuPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHJldmlldycgOiAnU2F2ZSByZXZpZXcnfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJldmlld0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBEcmF3ZXJDb250ZW50LFxuICBEcmF3ZXJGb290ZXIsXG4gIEg0LFxuICBJY29uLFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VSZWNvcmQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBUQUJTID0gW1xuICB7XG4gICAgaWQ6ICdnZW5lcmFsJyxcbiAgICBsYWJlbDogJ0dlbmVyYWwnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3N0b3JlTmFtZScsXG4gICAgICAnc3RvcmVUYWdsaW5lJyxcbiAgICAgICdzdG9yZUVtYWlsJyxcbiAgICAgICdzdG9yZVBob25lMScsXG4gICAgICAnc3RvcmVQaG9uZTInLFxuICAgICAgJ3N0b3JlQWRkcmVzcycsXG4gICAgICAncHJvbW9CYW5uZXInLFxuICAgICAgJ2Vhcmx5RGVsaXZlcnknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2NoYXJnZXMnLFxuICAgIGxhYmVsOiAnQ2hhcmdlcycsXG4gICAgZmllbGRzOiBbXG4gICAgICAnbW9ybmluZ0RlbGl2ZXJ5VGl0bGUnLFxuICAgICAgJ21vcm5pbmdEZWxpdmVyeVN1YnRpdGxlJyxcbiAgICAgICdtb3JuaW5nU2hpcHBpbmdGZWUnLFxuICAgICAgJ21vcm5pbmdGcmVlQWJvdmUnLFxuICAgICAgJ2V4cHJlc3NEZWxpdmVyeVRpdGxlJyxcbiAgICAgICdleHByZXNzRGVsaXZlcnlTdWJ0aXRsZScsXG4gICAgICAnZXhwcmVzc1NoaXBwaW5nRmVlJyxcbiAgICAgICdleHByZXNzRnJlZUFib3ZlJyxcbiAgICAgICdoYW5kbGluZ0ZlZScsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaG9tZXBhZ2UnLFxuICAgIGxhYmVsOiAnSG9tZXBhZ2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2hvbWVCYW5uZXJJbWFnZScsXG4gICAgICAnaG9tZU1vYmlsZUJhbm5lckltYWdlJyxcbiAgICAgICdob21lSGlnaGxpZ2h0SW1hZ2UnLFxuICAgICAgJ2hvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MnLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BheW1lbnRzJyxcbiAgICBsYWJlbDogJ1BheW1lbnRzJyxcbiAgICBmaWVsZHM6IFsncmF6b3JwYXlFbmFibGVkJywgJ3Jhem9ycGF5S2V5SWQnLCAncmF6b3JwYXlLZXlTZWNyZXQnLCAnY29kRW5hYmxlZCddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdub3RpZmljYXRpb25zJyxcbiAgICBsYWJlbDogJ05vdGlmaWNhdGlvbnMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ21zZzkxRW5hYmxlZCcsXG4gICAgICAnbXNnOTFBdXRoS2V5JyxcbiAgICAgICdtc2c5MVNlbmRlcklkJyxcbiAgICAgICdtc2c5MU90cFRlbXBsYXRlSWQnLFxuICAgICAgJ21zZzkxT3JkZXJUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwRW5hYmxlZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcE51bWJlcicsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cFRlbXBsYXRlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3JkZXJUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcExhbmd1YWdlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwTmFtZXNwYWNlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3RwQnV0dG9uJyxcbiAgICBdLFxuICB9LFxuXVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUltYWdlVXJsKHBhdGgsIGFwcFVybCkge1xuICBpZiAoIXBhdGgpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGF0aCkpIHJldHVybiBwYXRoXG4gIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChhcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXRofWBcbn1cblxuZnVuY3Rpb24gSW1hZ2VVcGxvYWRlcih7XG4gIGxhYmVsLFxuICBoaW50LFxuICB2YWx1ZSxcbiAgcHJldmlld1VybCxcbiAgdXBsb2FkaW5nLFxuICBmaWxlUmVmLFxuICBvblVwbG9hZCxcbiAgd2lkZSxcbn0pIHtcbiAgY29uc3QgZGlzcGxheWVkID0gcHJldmlld1VybCB8fCB2YWx1ZVxuXG4gIHJldHVybiAoXG4gICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAge2xhYmVsfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktdXBsb2FkLWRyb3Ake3dpZGUgPyAnIHRva3JpLXVwbG9hZC1kcm9wLXdpZGUnIDogJyd9YH0+XG4gICAgICAgIHtkaXNwbGF5ZWQgPyAoXG4gICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZH0gYWx0PXtgJHtsYWJlbH0gcHJldmlld2B9IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4+e3VwbG9hZGluZyA/ICdVcGxvYWRpbmfigKYnIDogJ0NsaWNrIHRvIHVwbG9hZCBhbiBpbWFnZSd9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17b25VcGxvYWR9IC8+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+e2hpbnR9PC9zcGFuPlxuICAgIDwvbGFiZWw+XG4gIClcbn1cblxuY29uc3QgU2V0dGluZ3NFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IHVzZVN0YXRlKCdnZW5lcmFsJylcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgbW9iaWxlQmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBoaWdobGlnaHRGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtiYW5uZXJQcmV2aWV3LCBzZXRCYW5uZXJQcmV2aWV3XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbbW9iaWxlQmFubmVyUHJldmlldywgc2V0TW9iaWxlQmFubmVyUHJldmlld10gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2hpZ2hsaWdodFByZXZpZXcsIHNldEhpZ2hsaWdodFByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21vYmlsZUJhbm5lclVwbG9hZGluZywgc2V0TW9iaWxlQmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbaGlnaGxpZ2h0VXBsb2FkaW5nLCBzZXRIaWdobGlnaHRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgYXBwVXJsID0gY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmhvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MpXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKFxuICAgICgpID0+IHJlc29sdmVJbWFnZVVybChwYXJhbXMuaG9tZUJhbm5lckltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5ob21lQmFubmVySW1hZ2VdLFxuICApXG4gIGNvbnN0IG1vYmlsZUJhbm5lckltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmhvbWVNb2JpbGVCYW5uZXJJbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaG9tZU1vYmlsZUJhbm5lckltYWdlXSxcbiAgKVxuICBjb25zdCBoaWdobGlnaHRJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVIaWdobGlnaHRJbWFnZV0sXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpXG4gICAgaWYgKGhhc2ggPT09ICdhcHBlYXJhbmNlJykge1xuICAgICAgc2V0QWN0aXZlVGFiKCdjaGFyZ2VzJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoaGFzaCAmJiBUQUJTLnNvbWUoKHRhYikgPT4gdGFiLmlkID09PSBoYXNoKSkge1xuICAgICAgc2V0QWN0aXZlVGFiKGhhc2gpXG4gICAgfVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgYCMke2FjdGl2ZVRhYn1gKVxuICB9LCBbYWN0aXZlVGFiXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3KVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChtb2JpbGVCYW5uZXJQcmV2aWV3Py5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKG1vYmlsZUJhbm5lclByZXZpZXcpXG4gICAgfVxuICB9LCBbbW9iaWxlQmFubmVyUHJldmlld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGhpZ2hsaWdodFByZXZpZXc/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoaGlnaGxpZ2h0UHJldmlldylcbiAgICB9XG4gIH0sIFtoaWdobGlnaHRQcmV2aWV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBpZ25vcmUgPSBmYWxzZVxuICAgIGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFtdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW2FwaUJhc2VVcmxdKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50LCBmaWVsZCwgc2V0UHJldmlldywgc2V0QnVzeSwgZmlsZVJlZiwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ2dlbmVyYWwnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXcobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldEJ1c3kodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXcocmVzb2x2ZUltYWdlVXJsKG1lZGlhLnBhdGgsIGFwcFVybCkpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnc3VjY2VzcycgfHwgcmVzcG9uc2U/LmRhdGE/LnJlY29yZCkge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiAnU2V0dGluZ3Mgc2F2ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGZsZXggZmxleERpcmVjdGlvbj1cImNvbHVtblwiIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtdGFic1wiIG1iPVwieGxcIj5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2V0dGluZ3MtdGFiJHthY3RpdmVUYWIgPT09IHRhYi5pZCA/ICcgaXMtYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIodGFiLmlkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGFiLmxhYmVsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8RHJhd2VyQ29udGVudD5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKChwcm9wZXJ0eSkgPT5cbiAgICAgICAgICAgIHRhYi5maWVsZHMuaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgICAgICAgICApXG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtcGFuZWxcIlxuICAgICAgICAgICAgICBwPVwieGxcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiBhY3RpdmVUYWIgPT09IHRhYi5pZCA/ICdibG9jaycgOiAnbm9uZScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEg0IG1iPVwic21cIj57dGFiLmxhYmVsfTwvSDQ+XG4gICAgICAgICAgICAgIDxUZXh0IG1iPVwieGxcIiBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICAgICAgICB7dGFiLmlkID09PSAnY2hhcmdlcydcbiAgICAgICAgICAgICAgICAgID8gJ1NldCBjb3B5IGFuZCBwcmljZXMgZm9yIE1vcm5pbmcgYW5kIDkwLU1pbnV0ZSBkZWxpdmVyeS4gSGFuZGxpbmcgZmVlIGlzIGFkZGVkIHRvIGV2ZXJ5IG9yZGVyLidcbiAgICAgICAgICAgICAgICAgIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnXG4gICAgICAgICAgICAgICAgICAgID8gJ1RoZXNlIGltYWdlcyBhbmQgY2F0ZWdvcmllcyBhcHBlYXIgb24gdGhlIHdlYnNpdGUgaG9tZXBhZ2UuIENsaWNrIFNhdmUgY2hhbmdlcyBhZnRlciB1cGxvYWRpbmcuJ1xuICAgICAgICAgICAgICAgICAgICA6ICdVcGRhdGUgeW91ciBzdG9yZSBzZXR0aW5ncyBhbmQgY2xpY2sgU2F2ZSBjaGFuZ2VzIGJlbG93Lid9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcmdlcy1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5Nb3JuaW5nIGRlbGl2ZXJ5PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHA+U2hvd24gYXQgY2hlY2tvdXQgd2hlbiB0aGlzIG9wdGlvbiBpcyBvbiBmb3IgdGhlIHBpbmNvZGUuPC9wPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgVGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/Lm1vcm5pbmdEZWxpdmVyeVRpdGxlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRGVsaXZlcnlUaXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZsYXdsZXNzIE1vcm5pbmcgRGVsaXZlcnlcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICBTdWJ0aXRsZVxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8ubW9ybmluZ0RlbGl2ZXJ5U3VidGl0bGUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ21vcm5pbmdEZWxpdmVyeVN1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2huZXNzIEd1YXJhbnRlZWRcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNoaXBwaW5nIGZlZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/Lm1vcm5pbmdTaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nU2hpcHBpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyZWUgYWJvdmUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5tb3JuaW5nRnJlZUFib3ZlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ21vcm5pbmdGcmVlQWJvdmUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj4wIG1lYW5zIG5vIGZyZWUgZGVsaXZlcnk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+OTAtTWludXRlIGRlbGl2ZXJ5PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHA+U2hvd24gYXQgY2hlY2tvdXQuIERpc2FibGVkIHBpbmNvZGVzIHN0aWxsIHNlZSB0aGlzIGFzIGNvbWluZyBzb29uLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzRGVsaXZlcnlUaXRsZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnZXhwcmVzc0RlbGl2ZXJ5VGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI5MC1NaW51dGUgRW1lcmdlbmN5IERyb3BzXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgU3VidGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmV4cHJlc3NEZWxpdmVyeVN1YnRpdGxlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdleHByZXNzRGVsaXZlcnlTdWJ0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9uLURlbWFuZCBMdXh1cnlcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNoaXBwaW5nIGZlZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmV4cHJlc3NTaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdleHByZXNzU2hpcHBpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyZWUgYWJvdmUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzRnJlZUFib3ZlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2V4cHJlc3NGcmVlQWJvdmUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj4wIG1lYW5zIG5vIGZyZWUgZGVsaXZlcnk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsIHRva3JpLWNoYXJnZXMtaGFuZGxpbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgSGFuZGxpbmcgY2hhcmdlICjigrkpXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uaGFuZGxpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdoYW5kbGluZ0ZlZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5DYXJ0IGhhbmRsaW5nIGZlZSBhZGRlZCB0byBldmVyeSBvcmRlcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiB0YWIuaWQgPT09ICdob21lcGFnZScgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1ob21lcGFnZS1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiSG9tZSBiYW5uZXIgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBoaW50PVwiRGVza3RvcCAvIGxhcmdlLXNjcmVlbiBoZXJvIGJhbm5lci4gSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Jhbm5lckltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXtiYW5uZXJQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e2Jhbm5lclVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgd2lkZVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUJhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJhbm5lclByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5uZXJGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0Jhbm5lciBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw9XCJIb21lIG1vYmlsZSBiYW5uZXIgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gcGhvbmVzLiBJZiBlbXB0eSwgdGhlIGRlc2t0b3AgYmFubmVyIGlzIHVzZWQgaW5zdGVhZC5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bW9iaWxlQmFubmVySW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e21vYmlsZUJhbm5lclByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17bW9iaWxlQmFubmVyVXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXttb2JpbGVCYW5uZXJGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZU1vYmlsZUJhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldE1vYmlsZUJhbm5lclByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2JpbGVCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVCYW5uZXJGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ01vYmlsZSBiYW5uZXIgaW1hZ2UgdXBsb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiRnJ1aXQgaGlnaGxpZ2h0IGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIlJlcGxhY2VzIHRoZSBraXdpIGltYWdlIGluIOKAnFRoZSBTbWFsbCBGcnVpdCB3aXRoIGEgQmlnIFB1bmNo4oCdIG9uIHRoZSB3ZWJzaXRlLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtoaWdobGlnaHRJbWFnZVVybH1cbiAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17aGlnaGxpZ2h0UHJldmlld31cbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nPXtoaWdobGlnaHRVcGxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWY9e2hpZ2hsaWdodEZpbGVSZWZ9XG4gICAgICAgICAgICAgICAgICAgIG9uVXBsb2FkPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdob21lSGlnaGxpZ2h0SW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGlnaGxpZ2h0UHJldmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhpZ2hsaWdodFVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodEZpbGVSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAnSGlnaGxpZ2h0IGltYWdlIHVwbG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIEhvbWVwYWdlIGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e2NhdGVnb3JpZXMubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsIHx8IGl0ZW0udGl0bGUgfHwgaXRlbS5zbHVnLFxuICAgICAgICAgICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRDYXRlZ29yeVNsdWdzfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2x1Z3MpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoJ2hvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MnLCBKU09OLnN0cmluZ2lmeShzbHVncykpXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGFuZCBzZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICBUaGVzZSBjYXRlZ29yaWVzIGxvYWQgb24gdGhlIHdlYnNpdGUgYWZ0ZXIgdGhlIGZydWl0IGhpZ2hsaWdodCBzZWN0aW9uLCBvbmUgYXRcbiAgICAgICAgICAgICAgICAgICAgICBhIHRpbWUgYXMgdGhlIHZpc2l0b3Igc2Nyb2xscy5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L0RyYXdlckNvbnRlbnQ+XG5cbiAgICAgIDxEcmF3ZXJGb290ZXI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjaGFuZ2VzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EcmF3ZXJGb290ZXI+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcGFkKG51bSkge1xuICByZXR1cm4gU3RyaW5nKG51bSkucGFkU3RhcnQoMiwgJzAnKVxufVxuXG5mdW5jdGlvbiB0b0RhdGV0aW1lVmFsdWUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke3BhZChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtwYWQoZGF0ZS5nZXREYXRlKCkpfVQke3BhZChkYXRlLmdldEhvdXJzKCkpfToke3BhZChkYXRlLmdldE1pbnV0ZXMoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRldGltZUxhYmVsKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRheTogJzItZGlnaXQnLFxuICAgIG1vbnRoOiAnc2hvcnQnLFxuICAgIHllYXI6ICdudW1lcmljJyxcbiAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgbWludXRlOiAnMi1kaWdpdCcsXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW29wZW5VcCwgc2V0T3BlblVwXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgc2V0T3BlblVwKHNwYWNlQmVsb3cgPCAyNDAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBvcGVuVXAgfVxufVxuXG5mdW5jdGlvbiBDaG9pY2VDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZnVuY3Rpb24gQW5jaG9yZWRTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIHBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPntzZWxlY3RlZD8ubGFiZWwgfHwgcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAge29wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7aXRlbS52YWx1ZSA9PT0gdmFsdWUgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIERhdGVUaW1lUGlja2VyKHsgdmFsdWUsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IHBhcnNlZCA9IHZhbHVlID8gbmV3IERhdGUodmFsdWUpIDogbnVsbFxuICBjb25zdCB2YWxpZCA9IHBhcnNlZCAmJiAhTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpID8gcGFyc2VkIDogbnVsbFxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21vbnRoRGF0ZSwgc2V0TW9udGhEYXRlXSA9IHVzZVN0YXRlKHZhbGlkIHx8IG5ldyBEYXRlKCkpXG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0SG91cnMoKSkgOiAnMDAnKVxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSh2YWxpZCA/IHBhZCh2YWxpZC5nZXRNaW51dGVzKCkpIDogJzAwJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghdmFsaWQpIHJldHVyblxuICAgIHNldE1vbnRoRGF0ZSh2YWxpZClcbiAgICBzZXRIb3VycyhwYWQodmFsaWQuZ2V0SG91cnMoKSkpXG4gICAgc2V0TWludXRlcyhwYWQodmFsaWQuZ2V0TWludXRlcygpKSlcbiAgfSwgW3ZhbHVlXSlcblxuICBjb25zdCB5ZWFyID0gbW9udGhEYXRlLmdldEZ1bGxZZWFyKClcbiAgY29uc3QgbW9udGggPSBtb250aERhdGUuZ2V0TW9udGgoKVxuICBjb25zdCBmaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKS5nZXREYXkoKVxuICBjb25zdCB0b3RhbERheXMgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLmdldERhdGUoKVxuICBjb25zdCBjZWxscyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3REYXk7IGkgKz0gMSkgY2VsbHMucHVzaChudWxsKVxuICBmb3IgKGxldCBkYXkgPSAxOyBkYXkgPD0gdG90YWxEYXlzOyBkYXkgKz0gMSkgY2VsbHMucHVzaChkYXkpXG5cbiAgY29uc3QgYXBwbHkgPSAoZGF5LCBuZXh0SG91cnMgPSBob3VycywgbmV4dE1pbnV0ZXMgPSBtaW51dGVzKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGAke3llYXJ9LSR7cGFkKG1vbnRoICsgMSl9LSR7cGFkKGRheSl9VCR7cGFkKE51bWJlcihuZXh0SG91cnMpIHx8IDApfToke3BhZChOdW1iZXIobmV4dE1pbnV0ZXMpIHx8IDApfWBcbiAgICBvbkNoYW5nZShuZXh0KVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWREYXkgPVxuICAgIHZhbGlkICYmIHZhbGlkLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiYgdmFsaWQuZ2V0TW9udGgoKSA9PT0gbW9udGggPyB2YWxpZC5nZXREYXRlKCkgOiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXJcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpfT5cbiAgICAgICAgPHNwYW4+e3ZhbGlkID8gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWxpZCkgOiBwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgIDxzcGFuPvCfk4U8L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLWRhdGVwaWNrZXItcG9wJHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1uYXZcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldE1vbnRoRGF0ZShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIDEpKX0+XG4gICAgICAgICAgICAgIOKAuVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8c3Ryb25nPlxuICAgICAgICAgICAgICB7bW9udGhEYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbW9udGg6ICdsb25nJywgeWVhcjogJ251bWVyaWMnIH0pfVxuICAgICAgICAgICAgPC9zdHJvbmc+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLpcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci13ZWVrXCI+XG4gICAgICAgICAgICB7WydTdScsICdNbycsICdUdScsICdXZScsICdUaCcsICdGcicsICdTYSddLm1hcCgobGFiZWwpID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtsYWJlbH0+e2xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1ncmlkXCI+XG4gICAgICAgICAgICB7Y2VsbHMubWFwKChkYXksIGluZGV4KSA9PlxuICAgICAgICAgICAgICBkYXkgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3NlbGVjdGVkRGF5ID09PSBkYXkgPyAnaXMtc2VsZWN0ZWQnIDogJyd9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBhcHBseShkYXkpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtkYXl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgZW1wdHktJHtpbmRleH1gfSAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItdGltZVwiPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBIb3VyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjIzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17aG91cnN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbigyMywgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0SG91cnMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIG5leHQsIG1pbnV0ZXMpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIE1pbnV0ZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCI1OVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e21pbnV0ZXN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbig1OSwgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0TWludXRlcyhuZXh0KVxuICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF5KSBhcHBseShzZWxlY3RlZERheSwgaG91cnMsIG5leHQpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLWNsZWFyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKCcnKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIENsZWFyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBDb3Vwb25FZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBzZWxlY3RlZFNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMudGFyZ2V0U2x1Z3MpXG4gIGNvbnN0IHRhcmdldFR5cGUgPSBwYXJhbXMudGFyZ2V0VHlwZSB8fCAnYWxsJ1xuICBjb25zdCBhcHBseU9uID0gcGFyYW1zLmFwcGx5T24gfHwgJ2NhcnQnXG4gIGNvbnN0IHVzYWdlVHlwZSA9IHBhcmFtcy51c2FnZVR5cGUgfHwgJ3VubGltaXRlZCdcbiAgY29uc3QgY291cG9uVHlwZSA9IHBhcmFtcy50eXBlIHx8ICdwZXJjZW50J1xuICBjb25zdCBpc0FjdGl2ZSA9IHBhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRDYXRhbG9nKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlEYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIGNvbnN0IGFsbFByb2R1Y3RzID0gW11cbiAgICAgICAgbGV0IHBhZ2UgPSAxXG4gICAgICAgIGxldCBoYXNNb3JlID0gdHJ1ZVxuICAgICAgICB3aGlsZSAoaGFzTW9yZSAmJiBwYWdlIDw9IDIwKSB7XG4gICAgICAgICAgY29uc3QgcHJvZHVjdERhdGEgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9wcm9kdWN0cz9wYWdlPSR7cGFnZX0mbGltaXQ9MTAwYCkudGhlbigocmVzcG9uc2UpID0+XG4gICAgICAgICAgICByZXNwb25zZS5qc29uKCksXG4gICAgICAgICAgKVxuICAgICAgICAgIGFsbFByb2R1Y3RzLnB1c2goLi4uKHByb2R1Y3REYXRhLnByb2R1Y3RzIHx8IFtdKSlcbiAgICAgICAgICBoYXNNb3JlID0gQm9vbGVhbihwcm9kdWN0RGF0YS5oYXNNb3JlKVxuICAgICAgICAgIHBhZ2UgKz0gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBzZXRQcm9kdWN0cyhhbGxQcm9kdWN0cylcbiAgICAgICAgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGNhdGVnb3J5RGF0YSkgPyBjYXRlZ29yeURhdGEgOiBbXSlcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgIHNldFByb2R1Y3RzKFtdKVxuICAgICAgICAgIHNldENhdGVnb3JpZXMoW10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkQ2F0YWxvZygpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzZXRTZWxlY3RlZFNsdWdzID0gKG5leHQpID0+IHNldEZpZWxkKCd0YXJnZXRTbHVncycsIEpTT04uc3RyaW5naWZ5KG5leHQpKVxuXG4gIGNvbnN0IHByb2R1Y3RPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBwcm9kdWN0cy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLm5hbWUgfSkpLFxuICAgIFtwcm9kdWN0c10sXG4gIClcbiAgY29uc3QgY2F0ZWdvcnlPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubGFiZWwgfSkpLFxuICAgIFtjYXRlZ29yaWVzXSxcbiAgKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdXBvbiBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24uIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHN0b3JlIGNvdXBvbjwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBTZXQgd2hvIGdldHMgdGhlIGRpc2NvdW50LCB3aGVyZSBpdCBhcHBsaWVzLCBhbmQgaG93IG1hbnkgdGltZXMgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNvdXBvbiBjb2RlPC9oND5cbiAgICAgICAgICA8cD5DdXN0b21lcnMgd2lsbCB0eXBlIHRoaXMgYXQgY2hlY2tvdXQgb24gdGhlIHdlYnNpdGUgYW5kIGFwcC48L3A+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXQgdG9rcmktY291cG9uLWNvZGVcIlxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2NvZGUnLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldFTENPTUUxMFwiXG4gICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10b2dnbGVcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIENvdXBvbiBpcyBhY3RpdmVcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGlzY291bnQ8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdwZXJjZW50J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJQZXJjZW50IG9mZlwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIDEwJSBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdwZXJjZW50Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdmbGF0J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJGbGF0IGFtb3VudFwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIOKCuTUwIG9mZlwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd0eXBlJywgJ2ZsYXQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAge2NvdXBvblR5cGUgPT09ICdwZXJjZW50JyA/ICdQZXJjZW50IHZhbHVlJyA6ICdBbW91bnQgKOKCuSknfVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNaW4gY2FydCAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm1pbkNhcnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21pbkNhcnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNYXggZGlzY291bnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5tYXhEaXNjb3VudCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbWF4RGlzY291bnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTm8gY2FwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QXBwbHkgZGlzY291bnQgb248L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdjYXJ0J31cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FydCB0b3RhbFwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIHRoZSBpdGVtcyBzdWJ0b3RhbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnYXBwbHlPbicsICdjYXJ0Jyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdzaGlwcGluZyd9XG4gICAgICAgICAgICB0aXRsZT1cIlNoaXBwaW5nIGZlZVwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIGRlbGl2ZXJ5IGNoYXJnZXNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnc2hpcHBpbmcnKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PldobyBjYW4gZ2V0IHRoaXMgZGlzY291bnQ8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgQXBwbHkgdG9cbiAgICAgICAgICA8QW5jaG9yZWRTZWxlY3RcbiAgICAgICAgICAgIHZhbHVlPXt0YXJnZXRUeXBlfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDaG9vc2Ugd2hvIHRoaXMgY291cG9uIGFwcGxpZXMgdG9cIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgIHNldEZpZWxkKCd0YXJnZXRUeXBlJywgbmV4dClcbiAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRTbHVncyhbXSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdhbGwnLCBsYWJlbDogJ0FsbCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ3Byb2R1Y3RzJywgbGFiZWw6ICdTZWxlY3RlZCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ2NhdGVnb3JpZXMnLCBsYWJlbDogJ1NlbGVjdGVkIGNhdGVnb3JpZXMnIH0sXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAge3RhcmdldFR5cGUgPT09ICdwcm9kdWN0cycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUHJvZHVjdHNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17cHJvZHVjdE9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgcHJvZHVjdHNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwcm9kdWN0c1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAnY2F0ZWdvcmllcycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2F0ZWdvcmllc1xuICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yeU9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Vc2FnZTwvaDQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJ31cbiAgICAgICAgICAgICAgdGl0bGU9XCJVbmxpbWl0ZWRcIlxuICAgICAgICAgICAgICBoaW50PVwiQ3VzdG9tZXJzIGNhbiByZXVzZSBpdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAndW5saW1pdGVkJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3NpbmdsZSd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiU2luZ2xlIHVzZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJPbmUgdXNlIHBlciBjdXN0b21lclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAnc2luZ2xlJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt1c2FnZVR5cGUgPT09ICd1bmxpbWl0ZWQnID8gKFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPcHRpb25hbCBnbG9iYWwgY2FwXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy51c2FnZUxpbWl0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd1c2FnZUxpbWl0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxlYXZlIGJsYW5rIGZvciB1bmxpbWl0ZWRcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQ+RWFjaCBsb2dnZWQtaW4gY3VzdG9tZXIgY2FuIHVzZSB0aGlzIGNvdXBvbiBvbmNlLjwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtwYXJhbXMudXNlZENvdW50ID8gPFRleHQgbXQ9XCJkZWZhdWx0XCI+VXNlZCB7cGFyYW1zLnVzZWRDb3VudH0gdGltZShzKSBzbyBmYXIuPC9UZXh0PiA6IG51bGx9XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5TY2hlZHVsZTwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhcnRzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuc3RhcnRzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdzdGFydHNBdCcsIG5leHQgfHwgbnVsbCl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHN0YXJ0IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEV4cGlyZXMgYXRcbiAgICAgICAgICAgIDxEYXRlVGltZVBpY2tlclxuICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRldGltZVZhbHVlKHBhcmFtcy5leHBpcmVzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdleHBpcmVzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBleHBpcnkgZGF0ZSBhbmQgdGltZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjb3Vwb25cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb3Vwb25FZGl0XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmNvbnN0IEZVTEZJTExNRU5UID0ge1xuICBwZW5kaW5nOiB7IGxhYmVsOiAnTmV3JywgdG9uZTogJ3BlbmRpbmcnIH0sXG4gIHBhaWQ6IHsgbGFiZWw6ICdQcm9jZXNzaW5nJywgdG9uZTogJ3Byb2Nlc3NpbmcnIH0sXG4gIHBhY2tlZDogeyBsYWJlbDogJ1BhY2tlZCcsIHRvbmU6ICdwYWNrZWQnIH0sXG4gIHNoaXBwZWQ6IHsgbGFiZWw6ICdTaGlwcGVkJywgdG9uZTogJ3NoaXBwZWQnIH0sXG4gIGRlbGl2ZXJlZDogeyBsYWJlbDogJ0RlbGl2ZXJlZCcsIHRvbmU6ICdkZWxpdmVyZWQnIH0sXG4gIGNhbmNlbGxlZDogeyBsYWJlbDogJ0NhbmNlbGxlZCcsIHRvbmU6ICdjYW5jZWxsZWQnIH0sXG59XG5cbmZ1bmN0aW9uIGlzT25saW5lT3JkZXIocGFyYW1zID0ge30pIHtcbiAgY29uc3QgbW9kZSA9IFN0cmluZyhwYXJhbXMucGF5bWVudE1vZGUgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgaWYgKG1vZGUgPT09ICdvbmxpbmUnKSByZXR1cm4gdHJ1ZVxuICBpZiAobW9kZSA9PT0gJ2NvZCcpIHJldHVybiBmYWxzZVxuICByZXR1cm4gQm9vbGVhbihwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgfHwgcGFyYW1zLnJhem9ycGF5T3JkZXJJZClcbn1cblxuZnVuY3Rpb24gcGF5bWVudEJhZGdlKHBhcmFtcyA9IHt9KSB7XG4gIGNvbnN0IG9ubGluZSA9IGlzT25saW5lT3JkZXIocGFyYW1zKVxuICBjb25zdCBtZXRob2QgPSBvbmxpbmUgPyAnT25saW5lJyA6ICdDT0QnXG4gIGNvbnN0IHN0YXR1cyA9IFN0cmluZyhwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAncGVuZGluZycpLnRvTG93ZXJDYXNlKClcblxuICBpZiAoc3RhdHVzID09PSAncGFpZCcpIHJldHVybiB7IGxhYmVsOiBgJHttZXRob2R9IMK3IFBhaWRgLCB0b25lOiAncGFpZCcgfVxuICBpZiAoc3RhdHVzID09PSAnZmFpbGVkJykgcmV0dXJuIHsgbGFiZWw6IGAke21ldGhvZH0gwrcgRmFpbGVkYCwgdG9uZTogJ2ZhaWxlZCcgfVxuICBpZiAoc3RhdHVzID09PSAncmVmdW5kZWQnKSByZXR1cm4geyBsYWJlbDogYCR7bWV0aG9kfSDCtyBSZWZ1bmRlZGAsIHRvbmU6ICdyZWZ1bmRlZCcgfVxuICBpZiAob25saW5lKSByZXR1cm4geyBsYWJlbDogJ09ubGluZSDCtyBXYWl0aW5nJywgdG9uZTogJ3dhaXRpbmcnIH1cbiAgcmV0dXJuIHsgbGFiZWw6ICdDT0QgwrcgVW5wYWlkJywgdG9uZTogJ3BlbmRpbmcnIH1cbn1cblxuZnVuY3Rpb24gUGlsbCh7IGxhYmVsLCB0b25lIH0pIHtcbiAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLXBpbGwgdG9rcmktbGlzdC1waWxsIGlzLSR7dG9uZX1gfT57bGFiZWx9PC9zcGFuPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsZmlsbG1lbnRCYWRnZShzdGF0dXMpIHtcbiAgY29uc3Qga2V5ID0gU3RyaW5nKHN0YXR1cyB8fCAncGVuZGluZycpLnRvTG93ZXJDYXNlKClcbiAgcmV0dXJuIEZVTEZJTExNRU5UW2tleV0gfHwgRlVMRklMTE1FTlQucGVuZGluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF5bWVudEJhZGdlKHBhcmFtcykge1xuICByZXR1cm4gcGF5bWVudEJhZGdlKHBhcmFtcylcbn1cblxuZnVuY3Rpb24gRnVsZmlsbG1lbnRCYWRnZSh7IHJlY29yZCB9KSB7XG4gIGNvbnN0IGJhZGdlID0gZ2V0RnVsZmlsbG1lbnRCYWRnZShyZWNvcmQ/LnBhcmFtcz8uc3RhdHVzKVxuICByZXR1cm4gPFBpbGwgbGFiZWw9e2JhZGdlLmxhYmVsfSB0b25lPXtiYWRnZS50b25lfSAvPlxufVxuXG5mdW5jdGlvbiBQYXltZW50QmFkZ2UoeyByZWNvcmQgfSkge1xuICBjb25zdCBiYWRnZSA9IGdldFBheW1lbnRCYWRnZShyZWNvcmQ/LnBhcmFtcylcbiAgcmV0dXJuIDxQaWxsIGxhYmVsPXtiYWRnZS5sYWJlbH0gdG9uZT17YmFkZ2UudG9uZX0gLz5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gT3JkZXJMaXN0QmFkZ2UoeyByZWNvcmQsIHByb3BlcnR5IH0pIHtcbiAgY29uc3QgcGF0aCA9IHByb3BlcnR5Py5wYXRoIHx8IHByb3BlcnR5Py5wcm9wZXJ0eVBhdGggfHwgJydcbiAgaWYgKHBhdGggPT09ICdzdGF0dXMnKSByZXR1cm4gPEZ1bGZpbGxtZW50QmFkZ2UgcmVjb3JkPXtyZWNvcmR9IC8+XG4gIHJldHVybiA8UGF5bWVudEJhZGdlIHJlY29yZD17cmVjb3JkfSAvPlxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFNlYXJjaGFibGVTZWxlY3QsIHVzZUFuY2hvcmVkTWVudSB9IGZyb20gJy4vZm9ybS1jb250cm9scydcbmltcG9ydCB7IGdldEZ1bGZpbGxtZW50QmFkZ2UsIGdldFBheW1lbnRCYWRnZSB9IGZyb20gJy4vb3JkZXItbGlzdC1iYWRnZXMuanN4J1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3QgRlVMRklMTE1FTlQgPSBbXG4gIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdOZXcnIH0sXG4gIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQcm9jZXNzaW5nJyB9LFxuICB7IHZhbHVlOiAncGFja2VkJywgbGFiZWw6ICdQYWNrZWQnIH0sXG4gIHsgdmFsdWU6ICdzaGlwcGVkJywgbGFiZWw6ICdTaGlwcGVkJyB9LFxuICB7IHZhbHVlOiAnZGVsaXZlcmVkJywgbGFiZWw6ICdEZWxpdmVyZWQnIH0sXG4gIHsgdmFsdWU6ICdjYW5jZWxsZWQnLCBsYWJlbDogJ0NhbmNlbGxlZCcgfSxcbl1cblxuY29uc3QgUEFZTUVOVF9PUFRJT05TID0gW1xuICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnVW5wYWlkJyB9LFxuICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUGFpZCcgfSxcbiAgeyB2YWx1ZTogJ2ZhaWxlZCcsIGxhYmVsOiAnRmFpbGVkJyB9LFxuICB7IHZhbHVlOiAncmVmdW5kZWQnLCBsYWJlbDogJ1JlZnVuZGVkJyB9LFxuXVxuXG5mdW5jdGlvbiBDb3B5SWQoeyBsYWJlbCwgdmFsdWUsIGhyZWYgfSkge1xuICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGlmICghdmFsdWUpIHJldHVybiBudWxsXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yenAtcm93XCI+XG4gICAgICA8c3Bhbj57bGFiZWx9PC9zcGFuPlxuICAgICAgPGNvZGU+e3ZhbHVlfTwvY29kZT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkPy53cml0ZVRleHQodmFsdWUpPy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHNldENvcGllZCh0cnVlKVxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gc2V0Q29waWVkKGZhbHNlKSwgMTIwMClcbiAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7fSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2NvcGllZCA/ICdDb3BpZWQnIDogJ0NvcHknfVxuICAgICAgPC9idXR0b24+XG4gICAgICB7aHJlZiA/IChcbiAgICAgICAgPGEgaHJlZj17aHJlZn0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgIE9wZW4gaW4gUmF6b3JwYXlcbiAgICAgICAgPC9hPlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGFtb3VudCkpIHJldHVybiAn4oK5MCdcbiAgcmV0dXJuIGDigrkke2Ftb3VudC50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KX1gXG59XG5cbmNvbnN0IGZvcm1hdERhdGVUaW1lID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICByZXR1cm4gbmV3IERhdGUodmFsdWUpLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXRlU3R5bGU6ICdtZWRpdW0nLFxuICAgIHRpbWVTdHlsZTogJ3Nob3J0JyxcbiAgfSlcbn1cblxuY29uc3QgcmVzb2x2ZUltYWdlID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QodmFsdWUpKSByZXR1cm4gdmFsdWVcbiAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJy8nKSkgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHt2YWx1ZX1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBNb3JlTWVudSh7IHVucGFpZCwgY2FuU3luY1Jhem9ycGF5LCBidXN5LCBvbkNhc2gsIG9uUXIsIG9uU3luY1Jhem9ycGF5IH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgaWYgKCF1bnBhaWQgJiYgIWNhblN5bmNSYXpvcnBheSkgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbW9yZVwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIE1vcmUgYWN0aW9uc1xuICAgICAgICA8c3Bhbj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1tb3JlLW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihidXN5KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgb25DYXNoKClcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2J1c3kgPT09ICdjb2xsZWN0Q2FzaCcgPyAnU2F2aW5n4oCmJyA6ICdNYXJrIGNhc2ggY29sbGVjdGVkJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGJ1c3kpfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICBvblFyKClcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2J1c3kgPT09ICdnZW5lcmF0ZVFyJyA/ICdDcmVhdGluZ+KApicgOiAnR2VuZXJhdGUgcGF5bWVudCBRUid9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge2NhblN5bmNSYXpvcnBheSA/IChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGJ1c3kpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgICBvblN5bmNSYXpvcnBheSgpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtidXN5ID09PSAnc3luY1Jhem9ycGF5JyA/ICdDaGVja2luZyBSYXpvcnBheeKApicgOiAnU3luYyBSYXpvcnBheSBwYXltZW50J31cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIHNuYXBzaG90KHBhcmFtcyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzIHx8ICcnLFxuICAgIHBheW1lbnRTdGF0dXM6IHBhcmFtcy5wYXltZW50U3RhdHVzIHx8ICcnLFxuICAgIGRlbGl2ZXJ5UGFydG5lcklkOiBwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJycsXG4gICAgY29udGFjdE5hbWU6IHBhcmFtcy5jb250YWN0TmFtZSB8fCAnJyxcbiAgICBjb250YWN0UGhvbmU6IHBhcmFtcy5jb250YWN0UGhvbmUgfHwgJycsXG4gICAgYWRkcmVzc0xpbmUxOiBwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnLFxuICAgIGFkZHJlc3NMaW5lMjogcGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJyxcbiAgICBhZGRyZXNzQ2l0eTogcGFyYW1zLmFkZHJlc3NDaXR5IHx8ICcnLFxuICAgIGFkZHJlc3NTdGF0ZTogcGFyYW1zLmFkZHJlc3NTdGF0ZSB8fCAnJyxcbiAgICBhZGRyZXNzUGluY29kZTogcGFyYW1zLmFkZHJlc3NQaW5jb2RlIHx8ICcnLFxuICAgIGFkZHJlc3NMYW5kbWFyazogcGFyYW1zLmFkZHJlc3NMYW5kbWFyayB8fCAnJyxcbiAgfVxufVxuXG5jb25zdCBPcmRlckRldGFpbCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0LCBsb2FkaW5nLCBzZXRSZWNvcmQgfSA9IHVzZVJlY29yZChpbml0aWFsUmVjb3JkLCByZXNvdXJjZS5pZClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYWN0aW9uQnVzeSwgc2V0QWN0aW9uQnVzeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfV0pXG4gIGNvbnN0IFtiYXNlbGluZSwgc2V0QmFzZWxpbmVdID0gdXNlU3RhdGUoKCkgPT4gc25hcHNob3QoaW5pdGlhbFJlY29yZD8ucGFyYW1zKSlcbiAgY29uc3QgW2VkaXRDb250YWN0LCBzZXRFZGl0Q29udGFjdF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2VkaXRBZGRyZXNzLCBzZXRFZGl0QWRkcmVzc10gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhY3Rpb24/Lm5hbWUgIT09ICdzaG93JykgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGNvbnN0IG5leHQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvc2hvd1xcLz8kLywgJy9lZGl0JylcbiAgICBpZiAobmV4dCAhPT0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShuZXh0KVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSwgW2FjdGlvbj8ubmFtZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhbXG4gICAgICAgICAgeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfSxcbiAgICAgICAgICAuLi5yZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLnBhcmFtcz8uaXNBY3RpdmUgPT09IGZhbHNlXG4gICAgICAgICAgICAgID8gYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYFxuICAgICAgICAgICAgICA6IGl0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJyxcbiAgICAgICAgICB9KSksXG4gICAgICAgIF0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldFBhcnRuZXJzKFt7IHZhbHVlOiAnJywgbGFiZWw6ICdVbmFzc2lnbmVkJyB9XSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGl0ZW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocGFyYW1zLml0ZW1zSnNvbiB8fCAnW10nKVxuICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+ICh7IC4uLml0ZW0sIGltYWdlOiByZXNvbHZlSW1hZ2UoaXRlbS5pbWFnZSkgfSkpXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH0sIFtwYXJhbXMuaXRlbXNKc29uXSlcblxuICBjb25zdCBjdXJyZW50ID0gc25hcHNob3QocGFyYW1zKVxuICBjb25zdCBkaXJ0eSA9IE9iamVjdC5rZXlzKGN1cnJlbnQpLnNvbWUoKGtleSkgPT4gY3VycmVudFtrZXldICE9PSBiYXNlbGluZVtrZXldKVxuICBjb25zdCBsaXN0VXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL3JlY29yZHNcXC8uKiQvLCAnJylcbiAgY29uc3QgdW5wYWlkID0gcGFyYW1zLnBheW1lbnRTdGF0dXMgIT09ICdwYWlkJ1xuICBjb25zdCBjYW5TeW5jUmF6b3JwYXkgPSB1bnBhaWQgJiYgcGFyYW1zLnBheW1lbnRNb2RlID09PSAnb25saW5lJ1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjYW5TeW5jUmF6b3JwYXkgfHwgIXJlY29yZD8uaWQpIHJldHVybiB1bmRlZmluZWRcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZTogJ3N5bmNSYXpvcnBheScsXG4gICAgICB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgICAgc2V0UmVjb3JkKHJlc3BvbnNlLmRhdGEucmVjb3JkKVxuICAgICAgICAgIHNldEJhc2VsaW5lKHNuYXBzaG90KHJlc3BvbnNlLmRhdGEucmVjb3JkLnBhcmFtcykpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdzdWNjZXNzJykgYWRkTm90aWNlKG5vdGljZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge30pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFtjYW5TeW5jUmF6b3JwYXksIHJlY29yZD8uaWQsIHJlc291cmNlLmlkLCBzZXRSZWNvcmRdKVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgcGhvbmUgPSBTdHJpbmcocGFyYW1zLmNvbnRhY3RQaG9uZSB8fCAnJykucmVwbGFjZSgvXFxEL2csICcnKVxuICAgIGNvbnN0IHBpbiA9IFN0cmluZyhwYXJhbXMuYWRkcmVzc1BpbmNvZGUgfHwgJycpLnJlcGxhY2UoL1xcRC9nLCAnJylcbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuY29udGFjdE5hbWUgfHwgJycpLnRyaW0oKSB8fCBwaG9uZS5sZW5ndGggPCAxMCkge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0VudGVyIHRoZSBjdXN0b21lciBuYW1lIGFuZCBhIDEwLWRpZ2l0IGNvbnRhY3QgbnVtYmVyLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnKS50cmltKCkgfHwgIVN0cmluZyhwYXJhbXMuYWRkcmVzc0NpdHkgfHwgJycpLnRyaW0oKSB8fCAhU3RyaW5nKHBhcmFtcy5hZGRyZXNzU3RhdGUgfHwgJycpLnRyaW0oKSB8fCBwaW4ubGVuZ3RoICE9PSA2KSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnRW50ZXIgdGhlIGhvdXNlLCBjaXR5LCBzdGF0ZSwgYW5kIGEgNi1kaWdpdCBwaW5jb2RlLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzdWJtaXQoKVxuICAgICAgY29uc3QgbmV4dCA9IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQ/LnBhcmFtc1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QobmV4dCkpXG4gICAgICAgIHNldEVkaXRDb250YWN0KGZhbHNlKVxuICAgICAgICBzZXRFZGl0QWRkcmVzcyhmYWxzZSlcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJ1blBheW1lbnRBY3Rpb24gPSBhc3luYyAoYWN0aW9uTmFtZSkgPT4ge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnY29sbGVjdENhc2gnICYmICF3aW5kb3cuY29uZmlybSgnTWFyayB0aGlzIG9yZGVyIGFzIHBhaWQgaW4gY2FzaD8nKSkgcmV0dXJuXG4gICAgc2V0QWN0aW9uQnVzeShhY3Rpb25OYW1lKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZSxcbiAgICAgIH0pXG4gICAgICBpZiAocmVzcG9uc2UuZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgIHNldFJlY29yZChyZXNwb25zZS5kYXRhLnJlY29yZClcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QocmVzcG9uc2UuZGF0YS5yZWNvcmQucGFyYW1zKSlcbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZShyZXNwb25zZS5kYXRhPy5ub3RpY2UgfHwgeyBtZXNzYWdlOiAnVXBkYXRlZC4nLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwZGF0ZSBwYXltZW50LicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QWN0aW9uQnVzeSgnJylcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uPy5uYW1lID09PSAnc2hvdycpIHJldHVybiBudWxsXG5cbiAgY29uc3QgZnVsZmlsbG1lbnQgPSBnZXRGdWxmaWxsbWVudEJhZGdlKHBhcmFtcy5zdGF0dXMpXG4gIGNvbnN0IHBheW1lbnQgPSBnZXRQYXltZW50QmFkZ2UocGFyYW1zKVxuICBjb25zdCBzdGF0dXNMYWJlbCA9IGZ1bGZpbGxtZW50LmxhYmVsXG4gIGNvbnN0IHJlc3RvcmVGaWVsZHMgPSAoa2V5cywgY2xvc2UpID0+IHtcbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgYmFzZWxpbmVba2V5XSB8fCAnJykpXG4gICAgY2xvc2UoZmFsc2UpXG4gIH1cbiAgY29uc3QgYWRkcmVzc1RleHQgPSBbXG4gICAgcGFyYW1zLmFkZHJlc3NMaW5lMSxcbiAgICBwYXJhbXMuYWRkcmVzc0xpbmUyLFxuICAgIFtwYXJhbXMuYWRkcmVzc0NpdHksIHBhcmFtcy5hZGRyZXNzU3RhdGUsIHBhcmFtcy5hZGRyZXNzUGluY29kZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJyksXG4gICAgcGFyYW1zLmFkZHJlc3NMYW5kbWFyayA/IGBMYW5kbWFyazogJHtwYXJhbXMuYWRkcmVzc0xhbmRtYXJrfWAgOiAnJyxcbiAgXS5maWx0ZXIoQm9vbGVhbilcbiAgY29uc3QgcGF5bWVudExhYmVsID0gcGF5bWVudC5sYWJlbFxuICBjb25zdCBwYXJ0bmVyTmFtZSA9IHBhcmFtcy5kZWxpdmVyeVBhcnRuZXJOYW1lXG4gICAgPyBgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyTmFtZX0ke3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJQaG9uZSA/IGAgwrcgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyUGhvbmV9YCA6ICcnfWBcbiAgICA6ICdObyBkZWxpdmVyeSBwYXJ0bmVyIHlldCdcbiAgY29uc3QgaXRlbUNvdW50ID0gaXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIE51bWJlcihpdGVtLnF1YW50aXR5IHx8IDApLCAwKVxuXG4gIHJldHVybiAoXG4gICAgPGZvcm0gY2xhc3NOYW1lPVwidG9rcmktb3JkZXJcIiBvblN1Ym1pdD17aGFuZGxlU2F2ZX0+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRpdGxlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYmFja1wiIGhyZWY9e2xpc3RVcmx9IGFyaWEtbGFiZWw9XCJCYWNrIHRvIG9yZGVyc1wiPuKGkDwvYT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aXRsZS1yb3dcIj5cbiAgICAgICAgICAgICAgPGgyPiN7cGFyYW1zLm9yZGVyTm99PC9oMj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke3BheW1lbnQudG9uZX1gfT57cGF5bWVudExhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke2Z1bGZpbGxtZW50LnRvbmV9YH0+e3N0YXR1c0xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHA+e2Zvcm1hdERhdGVUaW1lKHBhcmFtcy5jcmVhdGVkQXQpfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYWN0aW9uc1wiPlxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnZvaWNlXCJcbiAgICAgICAgICAgIGhyZWY9e2AvdG9rcmktYmFja29mZmljZS9vcmRlcnMvJHtyZWNvcmQuaWR9L2ludm9pY2U/ZG93bmxvYWQ9MWB9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB0aXRsZT1cIkRvd25sb2FkIFBERiBpbnZvaWNlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBEb3dubG9hZCBJbnZvaWNlXG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2F2ZVwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17IWRpcnR5IHx8IGxvYWRpbmcgfHwgc2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8TW9yZU1lbnVcbiAgICAgICAgICAgIHVucGFpZD17dW5wYWlkfVxuICAgICAgICAgICAgY2FuU3luY1Jhem9ycGF5PXtjYW5TeW5jUmF6b3JwYXl9XG4gICAgICAgICAgICBidXN5PXthY3Rpb25CdXN5fVxuICAgICAgICAgICAgb25DYXNoPXsoKSA9PiBydW5QYXltZW50QWN0aW9uKCdjb2xsZWN0Q2FzaCcpfVxuICAgICAgICAgICAgb25Rcj17KCkgPT4gcnVuUGF5bWVudEFjdGlvbignZ2VuZXJhdGVRcicpfVxuICAgICAgICAgICAgb25TeW5jUmF6b3JwYXk9eygpID0+IHJ1blBheW1lbnRBY3Rpb24oJ3N5bmNSYXpvcnBheScpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbGF5b3V0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbWFpblwiPlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZC1oZWFkXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1hcmsgaXMtJHtmdWxmaWxsbWVudC50b25lfWB9IC8+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57c3RhdHVzTGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW1Db3VudH0ge2l0ZW1Db3VudCA9PT0gMSA/ICdpdGVtJyA6ICdpdGVtcyd9IMK3IHtwYXJ0bmVyTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17RlVMRklMTE1FTlR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ3N0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2l0ZW1zLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZW1wdHlcIj5ObyBpdGVtcyBvbiB0aGlzIG9yZGVyLjwvcD5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iLXdyYXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pbWFnZSA/IDxpbWcgc3JjPXtpdGVtLmltYWdlfSBhbHQ9XCJcIiAvPiA6IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iXCIgLz59XG4gICAgICAgICAgICAgICAgICAgICAgPGVtPntpdGVtLnF1YW50aXR5fTwvZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2l0ZW0ubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS53ZWlnaHQgPyA8c3Bhbj57aXRlbS53ZWlnaHR9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xdHlcIj57Zm9ybWF0TW9uZXkoaXRlbS5wcmljZVZhbHVlKX0gw5cge2l0ZW0ucXVhbnRpdHl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8Yj57Zm9ybWF0TW9uZXkoaXRlbS5saW5lVG90YWwpfTwvYj5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZC1oZWFkXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1hcmsgaXMtJHtwYXltZW50LnRvbmV9YH0gLz5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXltZW50TGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e3BhcmFtcy5wYXltZW50TWV0aG9kIHx8ICdDYXNoIG9uIGRlbGl2ZXJ5J308L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1BBWU1FTlRfT1BUSU9OU31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGhhbmRsZUNoYW5nZSgncGF5bWVudFN0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvdGFsc1wiPlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5TdWJ0b3RhbDwvZHQ+PGRkPntpdGVtQ291bnR9IHtpdGVtQ291bnQgPT09IDEgPyAnaXRlbScgOiAnaXRlbXMnfTwvZGQ+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaXRlbXNUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZHQ+RGVsaXZlcnl7cGFyYW1zLmRlbGl2ZXJ5T3B0aW9uID8gYCDCtyAke3BhcmFtcy5kZWxpdmVyeU9wdGlvbiA9PT0gJ2V4cHJlc3MnID8gJzkwLW1pbnV0ZScgOiAnTW9ybmluZyd9YCA6ICcnfTwvZHQ+XG4gICAgICAgICAgICAgICAgPGRkIC8+XG4gICAgICAgICAgICAgICAgPGRkPntwYXJhbXMuZnJlZURlbGl2ZXJ5QXBwbGllZCB8fCBOdW1iZXIocGFyYW1zLmRlbGl2ZXJ5Q2hhcmdlKSA9PT0gMCA/ICdGcmVlIChXZWxjb21lIG9mZmVyKScgOiBmb3JtYXRNb25leShwYXJhbXMuZGVsaXZlcnlDaGFyZ2UpfTwvZGQ+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5IYW5kbGluZzwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaGFuZGxpbmdDaGFyZ2UpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLnRheFRvdGFsKSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkdD5UYXhlcyAoR1NUKXtwYXJhbXMuaXNJbnRlclN0YXRlID8gJyDCtyBJR1NUJyA6ICcgwrcgQ0dTVCtTR1NUJ308L2R0PlxuICAgICAgICAgICAgICAgICAgPGRkIC8+XG4gICAgICAgICAgICAgICAgICA8ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy50YXhUb3RhbCl9PC9kZD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLnNtYWxsQ2FydENoYXJnZSkgPiAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXY+PGR0PlNtYWxsIGNhcnQ8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLnNtYWxsQ2FydENoYXJnZSl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLmRpc2NvdW50KSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj48ZHQ+RGlzY291bnR7cGFyYW1zLmNvdXBvbkNvZGUgPyBgIMK3ICR7cGFyYW1zLmNvdXBvbkNvZGV9YCA6ICcnfTwvZHQ+PGRkIC8+PGRkPi17Zm9ybWF0TW9uZXkocGFyYW1zLmRpc2NvdW50KX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpcy10b3RhbFwiPjxkdD5Ub3RhbDwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNvbGxlY3RlZFwiPlxuICAgICAgICAgICAgICA8c3Bhbj57cGFyYW1zLnBheW1lbnRTdGF0dXMgPT09ICdwYWlkJyA/ICdQYWlkIGJ5IGN1c3RvbWVyJyA6ICdTdGlsbCB0byBjb2xsZWN0J308L3NwYW4+XG4gICAgICAgICAgICAgIDxiPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7cGFyYW1zLnBheW1lbnRDb2xsZWN0ZWRBcyA/IDxwIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1ldGFcIj5Db2xsZWN0ZWQgYXMge3BhcmFtcy5wYXltZW50Q29sbGVjdGVkQXN9PC9wPiA6IG51bGx9XG4gICAgICAgICAgICB7cGFyYW1zLnBheW1lbnRNb2RlID09PSAnb25saW5lJyB8fCBwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgfHwgcGFyYW1zLnJhem9ycGF5T3JkZXJJZCA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yenBcIj5cbiAgICAgICAgICAgICAgICA8Q29weUlkXG4gICAgICAgICAgICAgICAgICBsYWJlbD1cIlBheW1lbnQgSURcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZH1cbiAgICAgICAgICAgICAgICAgIGhyZWY9e3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZFxuICAgICAgICAgICAgICAgICAgICA/IGBodHRwczovL2Rhc2hib2FyZC5yYXpvcnBheS5jb20vYXBwL3BheW1lbnRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtcy5yYXpvcnBheVBheW1lbnRJZCl9YFxuICAgICAgICAgICAgICAgICAgICA6ICcnfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPENvcHlJZFxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJSYXpvcnBheSBvcmRlclwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnJhem9ycGF5T3JkZXJJZH1cbiAgICAgICAgICAgICAgICAgIGhyZWY9e3BhcmFtcy5yYXpvcnBheU9yZGVySWRcbiAgICAgICAgICAgICAgICAgICAgPyBgaHR0cHM6Ly9kYXNoYm9hcmQucmF6b3JwYXkuY29tL2FwcC9vcmRlcnMvJHtlbmNvZGVVUklDb21wb25lbnQocGFyYW1zLnJhem9ycGF5T3JkZXJJZCl9YFxuICAgICAgICAgICAgICAgICAgICA6ICcnfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgeyFwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgPyAoXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tZXRhXCI+Tm8gUmF6b3JwYXkgcGF5bWVudCBJRCB5ZXQuIFVzZSBTeW5jIFJhem9ycGF5IHBheW1lbnQgaWYgbW9uZXkgd2FzIGNhcHR1cmVkLjwvcD5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlRclVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xclwiIHNyYz17cGFyYW1zLnJhem9ycGF5UXJVcmx9IGFsdD1cIkRvb3JzdGVwIHBheW1lbnQgUVJcIiAvPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8YXNpZGUgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2lkZVwiPlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoMz5DdXN0b21lcjwvaDM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5Db250YWN0PC9oND5cbiAgICAgICAgICAgICAge2VkaXRDb250YWN0ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFsnY29udGFjdE5hbWUnLCAnY29udGFjdFBob25lJ10sIHNldEVkaXRDb250YWN0KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCIgb25DbGljaz17KCkgPT4gc2V0RWRpdENvbnRhY3QodHJ1ZSl9PlxuICAgICAgICAgICAgICAgICAgRWRpdFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ZWRpdENvbnRhY3QgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdC1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGFjdE5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdE5hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgUGhvbmUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb250YWN0UGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdFBob25lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXJlYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXJhbXMuY29udGFjdE5hbWUgfHwgJ+KAlCd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHA+e3BhcmFtcy5jb250YWN0UGhvbmUgPyBgKzkxICR7cGFyYW1zLmNvbnRhY3RQaG9uZX1gIDogJ+KAlCd9PC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5TaGlwcGluZyBhZGRyZXNzPC9oND5cbiAgICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFxuICAgICAgICAgICAgICAgICAgICBbJ2FkZHJlc3NMaW5lMScsICdhZGRyZXNzTGluZTInLCAnYWRkcmVzc0NpdHknLCAnYWRkcmVzc1N0YXRlJywgJ2FkZHJlc3NQaW5jb2RlJywgJ2FkZHJlc3NMYW5kbWFyayddLFxuICAgICAgICAgICAgICAgICAgICBzZXRFZGl0QWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiIG9uQ2xpY2s9eygpID0+IHNldEVkaXRBZGRyZXNzKHRydWUpfT5cbiAgICAgICAgICAgICAgICAgIEVkaXRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXQtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBIb3VzZSAvIGZsYXRcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NMaW5lMScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBTdHJlZXQgLyBhcmVhXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYWRkcmVzcy1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzQ2l0eSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NDaXR5JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgU3RhdGVcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc1N0YXRlIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc1N0YXRlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzUGluY29kZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NQaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgTGFuZG1hcmtcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xhbmRtYXJrIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0xhbmRtYXJrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yZWFkXCI+XG4gICAgICAgICAgICAgICAge2FkZHJlc3NUZXh0Lmxlbmd0aCA/IGFkZHJlc3NUZXh0Lm1hcCgobGluZSkgPT4gPHAga2V5PXtsaW5lfT57bGluZX08L3A+KSA6IDxwPuKAlDwvcD59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxoND5EZWxpdmVyeSBwYXJ0bmVyPC9oND5cbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJyd9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3BhcnRuZXJzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ2RlbGl2ZXJ5UGFydG5lcklkJywgdmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlVuYXNzaWduZWRcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwYXJ0bmVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9hc2lkZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBPcmRlckRldGFpbFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIElucHV0LCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBFeWVJY29uID0gKHsgaGlkZGVuIH0pID0+XG4gIGhpZGRlbiA/IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgPHBhdGggZD1cIk05LjkgNC4yQTEwLjcgMTAuNyAwIDAgMSAxMiA0YzUgMCA5IDQuNSAxMCA4YTEyLjggMTIuOCAwIDAgMS0yLjEgMy42XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgPC9zdmc+XG4gICkgOiAoXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3UzIgMTIgMiAxMnpcIiAvPlxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICA8L3N2Zz5cbiAgKVxuXG5mdW5jdGlvbiBQYXNzd29yZEZpZWxkKHsgaWQsIGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIHZpc2libGUsIG9uVG9nZ2xlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgIDxMYWJlbCBodG1sRm9yPXtpZH0gcmVxdWlyZWQ+e2xhYmVsfTwvTGFiZWw+XG4gICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiB3aWR0aD1cIjEwMCVcIj5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgIHR5cGU9e3Zpc2libGUgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEV5ZUljb24gaGlkZGVuPXt2aXNpYmxlfSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NvbmZpcm1QYXNzd29yZCwgc2V0Q29uZmlybVBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93Q29uZmlybSwgc2V0U2hvd0NvbmZpcm1dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0RXJyb3IoJycpXG4gICAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCA2KSB7XG4gICAgICBzZXRFcnJvcignUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgc2V0RXJyb3IoJ05ldyBwYXNzd29yZCBhbmQgY29uZmlybSBwYXNzd29yZCBtdXN0IGJlIHRoZSBzYW1lLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICdjaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IHBhc3N3b3JkLCBjb25maXJtUGFzc3dvcmQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZS5kYXRhPy5ub3RpY2VcbiAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgc2V0RXJyb3Iobm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKG5vdGljZSkgYWRkTm90aWNlKG5vdGljZSlcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gcmVzcG9uc2UuZGF0YT8ucmVkaXJlY3RVcmxcbiAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2xvc2UoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICBpbnNldDogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMiwgMTIsIDgsIDAuNjIpJyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB6SW5kZXg6IDgwLFxuICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBhcz1cImZvcm1cIlxuICAgICAgICBvblN1Ym1pdD17c2F2ZX1cbiAgICAgICAgYmc9XCJ3aGl0ZVwiXG4gICAgICAgIHdpZHRoPXtbJzEwMCUnLCAnNDIwcHgnXX1cbiAgICAgICAgcD1cInhsXCJcbiAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxNiwgYm94U2hhZG93OiAnMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMjgpJyB9fVxuICAgICAgPlxuICAgICAgICA8SDMgbWI9XCJzbVwiPkNoYW5nZSBwYXNzd29yZDwvSDM+XG4gICAgICAgIDxUZXh0IG1iPVwieGxcIiBjb2xvcj1cIiM2NDc0OGJcIj5cbiAgICAgICAgICBTZXQgYSBuZXcgcGFzc3dvcmQgZm9yIHtyZWNvcmQ/LnBhcmFtcz8ubmFtZSB8fCByZWNvcmQ/LnBhcmFtcz8uZW1haWwgfHwgJ3RoaXMgdXNlcid9LlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICBpZD1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJOZXcgcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0UGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd1Bhc3N3b3JkfVxuICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRTaG93UGFzc3dvcmQoKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwiY29uZmlybS1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICB2YWx1ZT17Y29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd0NvbmZpcm19XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dDb25maXJtKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7ZXJyb3IgPyAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIGNvbG9yPVwiI2RjMjYyNlwiPntlcnJvcn08L1RleHQ+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCIgc3R5bGU9e3sgZ2FwOiAxMCB9fT5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9e2Nsb3NlfSBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIHZhcmlhbnQ9XCJjb250YWluZWRcIiBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlIHBhc3N3b3JkJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VQYXNzd29yZFxuIiwiLyoqIElTTyAzMTY2LTI6SU4gY29kZXMuIEtlcHQgbmV4dCB0byB0aGUgQWRtaW5KUyBmb3JtIHNvIHRoZSBkcm9wZG93biBhbHdheXMgaGFzIGV2ZXJ5IHN0YXRlLiAqL1xuZXhwb3J0IGNvbnN0IElORElBX1NUQVRFUyA9IFtcbiAgeyBjb2RlOiAnQU4nLCBuYW1lOiAnQW5kYW1hbiBhbmQgTmljb2JhciBJc2xhbmRzJyB9LFxuICB7IGNvZGU6ICdBUCcsIG5hbWU6ICdBbmRocmEgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnQVInLCBuYW1lOiAnQXJ1bmFjaGFsIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ0FTJywgbmFtZTogJ0Fzc2FtJyB9LFxuICB7IGNvZGU6ICdCUicsIG5hbWU6ICdCaWhhcicgfSxcbiAgeyBjb2RlOiAnQ0gnLCBuYW1lOiAnQ2hhbmRpZ2FyaCcgfSxcbiAgeyBjb2RlOiAnQ1QnLCBuYW1lOiAnQ2hoYXR0aXNnYXJoJyB9LFxuICB7IGNvZGU6ICdESCcsIG5hbWU6ICdEYWRyYSBhbmQgTmFnYXIgSGF2ZWxpIGFuZCBEYW1hbiBhbmQgRGl1JyB9LFxuICB7IGNvZGU6ICdETCcsIG5hbWU6ICdEZWxoaScgfSxcbiAgeyBjb2RlOiAnR0EnLCBuYW1lOiAnR29hJyB9LFxuICB7IGNvZGU6ICdHSicsIG5hbWU6ICdHdWphcmF0JyB9LFxuICB7IGNvZGU6ICdIUicsIG5hbWU6ICdIYXJ5YW5hJyB9LFxuICB7IGNvZGU6ICdIUCcsIG5hbWU6ICdIaW1hY2hhbCBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdKSycsIG5hbWU6ICdKYW1tdSBhbmQgS2FzaG1pcicgfSxcbiAgeyBjb2RlOiAnSkgnLCBuYW1lOiAnSmhhcmtoYW5kJyB9LFxuICB7IGNvZGU6ICdLQScsIG5hbWU6ICdLYXJuYXRha2EnIH0sXG4gIHsgY29kZTogJ0tMJywgbmFtZTogJ0tlcmFsYScgfSxcbiAgeyBjb2RlOiAnTEEnLCBuYW1lOiAnTGFkYWtoJyB9LFxuICB7IGNvZGU6ICdMRCcsIG5hbWU6ICdMYWtzaGFkd2VlcCcgfSxcbiAgeyBjb2RlOiAnTVAnLCBuYW1lOiAnTWFkaHlhIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ01IJywgbmFtZTogJ01haGFyYXNodHJhJyB9LFxuICB7IGNvZGU6ICdNTicsIG5hbWU6ICdNYW5pcHVyJyB9LFxuICB7IGNvZGU6ICdNTCcsIG5hbWU6ICdNZWdoYWxheWEnIH0sXG4gIHsgY29kZTogJ01aJywgbmFtZTogJ01pem9yYW0nIH0sXG4gIHsgY29kZTogJ05MJywgbmFtZTogJ05hZ2FsYW5kJyB9LFxuICB7IGNvZGU6ICdPUicsIG5hbWU6ICdPZGlzaGEnIH0sXG4gIHsgY29kZTogJ1BZJywgbmFtZTogJ1B1ZHVjaGVycnknIH0sXG4gIHsgY29kZTogJ1BCJywgbmFtZTogJ1B1bmphYicgfSxcbiAgeyBjb2RlOiAnUkonLCBuYW1lOiAnUmFqYXN0aGFuJyB9LFxuICB7IGNvZGU6ICdTSycsIG5hbWU6ICdTaWtraW0nIH0sXG4gIHsgY29kZTogJ1ROJywgbmFtZTogJ1RhbWlsIE5hZHUnIH0sXG4gIHsgY29kZTogJ1RHJywgbmFtZTogJ1RlbGFuZ2FuYScgfSxcbiAgeyBjb2RlOiAnVFInLCBuYW1lOiAnVHJpcHVyYScgfSxcbiAgeyBjb2RlOiAnVVAnLCBuYW1lOiAnVXR0YXIgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnVVQnLCBuYW1lOiAnVXR0YXJha2hhbmQnIH0sXG4gIHsgY29kZTogJ1dCJywgbmFtZTogJ1dlc3QgQmVuZ2FsJyB9LFxuXVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0LCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcbmltcG9ydCB7IElORElBX1NUQVRFUyB9IGZyb20gJy4vaW5kaWEtc3RhdGVzLmpzJ1xuXG5jb25zdCBWRUhJQ0xFX1RZUEVTID0gW1xuICB7IHZhbHVlOiAnQmlrZScsIGxhYmVsOiAnQmlrZScgfSxcbiAgeyB2YWx1ZTogJ1Njb290ZXInLCBsYWJlbDogJ1Njb290ZXInIH0sXG4gIHsgdmFsdWU6ICdFbGVjdHJpYyBiaWtlJywgbGFiZWw6ICdFbGVjdHJpYyBiaWtlJyB9LFxuICB7IHZhbHVlOiAnQ3ljbGUnLCBsYWJlbDogJ0N5Y2xlJyB9LFxuICB7IHZhbHVlOiAnVmFuJywgbGFiZWw6ICdWYW4nIH0sXG4gIHsgdmFsdWU6ICdPdGhlcicsIGxhYmVsOiAnT3RoZXInIH0sXG5dXG5cbmNvbnN0IFNUQVRFX09QVElPTlMgPSBJTkRJQV9TVEFURVMubWFwKChpdGVtKSA9PiAoe1xuICB2YWx1ZTogaXRlbS5uYW1lLFxuICBsYWJlbDogaXRlbS5uYW1lLFxufSkpXG5cbmZ1bmN0aW9uIEZpZWxkRXJyb3IoeyBlcnJvciB9KSB7XG4gIGlmICghZXJyb3I/Lm1lc3NhZ2UpIHJldHVybiBudWxsXG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvci5tZXNzYWdlfTwvc3Bhbj5cbn1cblxuY29uc3QgUGFydG5lckVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc05ldyA9IGFjdGlvbj8ubmFtZSA9PT0gJ25ldycgfHwgIXJlY29yZD8uaWRcbiAgY29uc3QgcmVhZE9ubHkgPSBhY3Rpb24/Lm5hbWUgPT09ICdzaG93J1xuICBjb25zdCBoYXNQYXNzd29yZCA9IEJvb2xlYW4ocGFyYW1zLmhhc1Bhc3N3b3JkKVxuICBjb25zdCBpc0FjdGl2ZSA9IGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFydG5lcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3XG4gICAgICAgICAgICA/ICdQYXJ0bmVyIHNhdmVkLiBBIHBhc3N3b3JkIGVtYWlsIHdpbGwgYmUgc2VudCBpZiB0aGV5IGRvIG5vdCBoYXZlIGEgcGFzc3dvcmQgeWV0LidcbiAgICAgICAgICAgIDogJ1BhcnRuZXIgdXBkYXRlZCcsXG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwYXJ0bmVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGRlbGl2ZXJ5IHBhcnRuZXInIDogcGFyYW1zLm5hbWUgfHwgJ0RlbGl2ZXJ5IHBhcnRuZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBDb2xsZWN0IGZ1bGwgS1lDIGFuZCBjb250YWN0IGRldGFpbHMuIFRoZXkgbG9nIGluIHRvIHRoZSBUb2tyaWlpIFBhcnRuZXIgYXBwIHdpdGggdGhpcyBlbWFpbFxuICAgICAgICAgIGFmdGVyIHNldHRpbmcgYSBwYXNzd29yZCBmcm9tIHRoZSBpbnZpdGUgbWFpbC5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPkluYWN0aXZlIHBhcnRuZXJzIGNhbm5vdCBsb2cgaW4sIGV2ZW4gaWYgdGhleSBhbHJlYWR5IHNldCBhIHBhc3N3b3JkLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBzaWduIGluIHRvIHRoZSBwYXJ0bmVyIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7IWlzTmV3ID8gKFxuICAgICAgICAgICAgPFRleHQgbXQ9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgIHtoYXNQYXNzd29yZCA/ICdQYXNzd29yZCBpcyBhbHJlYWR5IHNldC4nIDogJ05vIHBhc3N3b3JkIHlldCDigJQgc2VuZCB0aGUgaW52aXRlIGVtYWlsIGFmdGVyIHNhdmluZy4nfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+TG9naW4gZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+RW1haWwgaXMgdXNlZCB0byBjcmVhdGUgYW5kIHJlc2V0IHRoZSBwYXJ0bmVyIHBhc3N3b3JkLiBObyBTTVMgaXMgc2VudC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRW1haWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZW1haWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWFpbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwicGFydG5lckBleGFtcGxlLmNvbVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5lbWFpbCA/IDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1haWx9IC8+IDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+UGFzc3dvcmQgbGluayBpcyBzZW50IHRvIHRoaXMgaW5ib3g8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTW9iaWxlIG51bWJlclxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEwfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaG9uZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDEwKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMTAtZGlnaXQgbnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnBob25lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UGVyc29uYWwgZGV0YWlsczwvaDQ+XG4gICAgICAgIDxwPk5hbWUgaXMgc2hvd24gb24gb3JkZXJzLiBGYXRoZXImYXBvcztzIG5hbWUgYW5kIERPQiBoZWxwIHdpdGggS1lDIHJlY29yZHMuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGdWxsIG5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBhcnRuZXIgZnVsbCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLm5hbWV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGYXRoZXImYXBvcztzIC8gZ3VhcmRpYW4gbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmZhdGhlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdmYXRoZXJOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBcyBvbiBBYWRoYWFyIC8gZG9jdW1lbnRzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBEYXRlIG9mIGJpcnRoIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmRhdGVPZkJpcnRoIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2RhdGVPZkJpcnRoJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+S1lDIGRvY3VtZW50czwvaDQ+XG4gICAgICAgIDxwPlBBTiBhbmQgQWFkaGFhciBhcmUgcmVxdWlyZWQgZm9yIHBhcnRuZXIgb25ib2FyZGluZy48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBBTiBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGFuTnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYW5OdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bXkEtWjAtOV0vZywgJycpLnNsaWNlKDAsIDEwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFCQ0RFMTIzNEZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGFuTnVtYmVyfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWFkaGFhciBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEyfVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFhZGhhYXJOdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ2FhZGhhYXJOdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMikpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMi1kaWdpdCBBYWRoYWFyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmFhZGhhYXJOdW1iZXJ9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DdXJyZW50IGFkZHJlc3M8L2g0PlxuICAgICAgICA8cD5XaGVyZSB0aGUgcGFydG5lciBjdXJyZW50bHkgbGl2ZXMgLyBvcGVyYXRlcyBmcm9tLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDFcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWRkcmVzc0xpbmUxJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSAvIHN0cmVldCAvIGFyZWFcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuYWRkcmVzc0xpbmUxfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxhbmRtYXJrLCBjb2xvbnlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jaXR5IHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2l0eVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5jaXR5fSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17Nn1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5waW5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGluY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDYpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI2LWRpZ2l0IHBpbmNvZGVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGluY29kZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCBzdGF0ZScgfSwgLi4uU1RBVEVfT1BUSU9OU119XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ3N0YXRlJywgbmV4dCl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5zdGF0ZX0gLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFBlcm1hbmVudCBhZGRyZXNzIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dCB0b2tyaS10ZXh0YXJlYVwiXG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wZXJtYW5lbnRBZGRyZXNzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3Blcm1hbmVudEFkZHJlc3MnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJJZiBkaWZmZXJlbnQgZnJvbSBjdXJyZW50IGFkZHJlc3NcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RW1lcmdlbmN5IGNvbnRhY3Q8L2g0PlxuICAgICAgICAgIDxwPlNvbWVvbmUgd2UgY2FuIGNhbGwgaWYgdGhlIHBhcnRuZXIgaXMgdW5yZWFjaGFibGUuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENvbnRhY3QgbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtZXJnZW5jeU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWVyZ2VuY3lOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJSZWxhdGl2ZSAvIGZyaWVuZCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDb250YWN0IG1vYmlsZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5lbWVyZ2VuY3lQaG9uZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnZW1lcmdlbmN5UGhvbmUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMC1kaWdpdCBudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1lcmdlbmN5UGhvbmV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlZlaGljbGUgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+VXNlZCBmb3IgZGVsaXZlcnkgYXNzaWdubWVudCBhbmQgc3VwcG9ydC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgVmVoaWNsZSB0eXBlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiA2IH19PlxuICAgICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZlaGljbGVUeXBlIHx8ICcnfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdTZWxlY3QgdmVoaWNsZScgfSwgLi4uVkVISUNMRV9UWVBFU119XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgndmVoaWNsZVR5cGUnLCBuZXh0KX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFZlaGljbGUgbnVtYmVyIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudmVoaWNsZU51bWJlciB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgndmVoaWNsZU51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnNsaWNlKDAsIDIwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gTUgxMkFCMTIzNFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QmFuayBkZXRhaWxzPC9oND5cbiAgICAgICAgPHA+Rm9yIHBheW91dHMgYW5kIHJlaW1idXJzZW1lbnRzLiBPcHRpb25hbCBmb3Igbm93LCBidXQgcmVjb21tZW5kZWQuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBY2NvdW50IGhvbGRlciBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWNjb3VudEhvbGRlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhY2NvdW50SG9sZGVyTmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXMgcGVyIGJhbmsgYWNjb3VudFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWNjb3VudCBudW1iZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hY2NvdW50TnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWNjb3VudE51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQmFuayBhY2NvdW50IG51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgSUZTQyBjb2RlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICBtYXhMZW5ndGg9ezExfVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5pZnNjQ29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpZnNjQ29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1teQS1aMC05XS9nLCAnJykuc2xpY2UoMCwgMTEpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTQklOMDAwMTIzNFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmlmc2NDb2RlfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+SW50ZXJuYWwgbm90ZXM8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgTm90ZXMgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLXRleHRhcmVhXCJcbiAgICAgICAgICAgIHJvd3M9ezR9XG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5vdGVzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25vdGVzJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2hpZnQgdGltaW5nLCBodWIsIG9yIGFueXRoaW5nIHlvdXIgdGVhbSBzaG91bGQgcmVtZW1iZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHBhcnRuZXInIDogJ1NhdmUgcGFydG5lcid9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0bmVyRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFNlYXJjaGFibGVTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuaW1wb3J0IHsgSU5ESUFfU1RBVEVTIH0gZnJvbSAnLi9pbmRpYS1zdGF0ZXMuanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTVEFURV9PUFRJT05TID0gSU5ESUFfU1RBVEVTLm1hcCgoaXRlbSkgPT4gKHtcbiAgdmFsdWU6IGl0ZW0uY29kZSxcbiAgbGFiZWw6IGAke2l0ZW0ubmFtZX0gKCR7aXRlbS5jb2RlfSlgLFxufSkpXG5cbmNvbnN0IFBpbmNvZGVFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IHJlYWRPbmx5ID0gYWN0aW9uPy5uYW1lID09PSAnc2hvdydcbiAgY29uc3QgaXNBY3RpdmUgPSBpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgbW9ybmluZ0VuYWJsZWQgPSBpc05ldyAmJiAocGFyYW1zLm1vcm5pbmdFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1vcm5pbmdFbmFibGVkID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5tb3JuaW5nRW5hYmxlZClcbiAgY29uc3QgZXhwcmVzc0VuYWJsZWQgPSBpc05ldyAmJiAocGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSAnJylcbiAgICA/IGZhbHNlXG4gICAgOiBpc0ZsYWdPbihwYXJhbXMuZXhwcmVzc0VuYWJsZWQpXG4gIGNvbnN0IFtwYXJ0bmVycywgc2V0UGFydG5lcnNdID0gdXNlU3RhdGUoW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ2lzQWN0aXZlJywgdHJ1ZSlcbiAgICB9XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRW5hYmxlZCcsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnZXhwcmVzc0VuYWJsZWQnLCBmYWxzZSlcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNOZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgYXBpXG4gICAgICAucmVzb3VyY2VBY3Rpb24oeyByZXNvdXJjZUlkOiAnRGVsaXZlcnlQYXJ0bmVyJywgYWN0aW9uTmFtZTogJ2xpc3QnLCBwYXJhbXM6IHsgcGVyUGFnZTogMjAwIH0gfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IHJlc3BvbnNlLmRhdGE/LnJlY29yZHMgfHwgW11cbiAgICAgICAgc2V0UGFydG5lcnMoXG4gICAgICAgICAgcmVjb3Jkcy5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5pZCB8fCBpdGVtLnBhcmFtcz8uaWQsXG4gICAgICAgICAgICBsYWJlbDogaXNGbGFnT24oaXRlbS5wYXJhbXM/LmlzQWN0aXZlKVxuICAgICAgICAgICAgICA/IGl0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJ1xuICAgICAgICAgICAgICA6IGAke2l0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJ30gKGluYWN0aXZlKWAsXG4gICAgICAgICAgfSkpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldFBhcnRuZXJzKFtdKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgZXJyb3JzID0gdXNlTWVtbygoKSA9PiByZWNvcmQ/LmVycm9ycyB8fCB7fSwgW3JlY29yZD8uZXJyb3JzXSlcbiAgY29uc3QgcGFydG5lcklkID0gcGFyYW1zLnBhcnRuZXJJZCB8fCBwYXJhbXMucGFydG5lciB8fCAnJ1xuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGluY29kZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBpc05ldyA/ICdQaW5jb2RlIGFkZGVkJyA6ICdQaW5jb2RlIHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcGluY29kZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e2lzTmV3ID8gJ0FkZCBzZXJ2aWNlYWJsZSBwaW5jb2RlJyA6IGBQSU4gJHtwYXJhbXMucGluY29kZSB8fCAnJ31gfTwvSDM+XG4gICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgY29sb3I6ICcjZmZmJywgb3BhY2l0eTogMC45IH19PlxuICAgICAgICAgIEN1c3RvbWVycyBjYW4gc2F2ZSBhbiBhZGRyZXNzIGFuZCBjaGVjayBvdXQgb25seSB3aGVuIHRoaXMgcGluY29kZSBpcyBhY3RpdmUuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkRlbGl2ZXJ5IGNvdmVyYWdlPC9oND5cbiAgICAgICAgICA8cD5UdXJuIHRoaXMgb2ZmIHRvIHN0b3AgdGFraW5nIG9yZGVycyBmb3IgdGhpcyBQSU4gd2l0aG91dCBkZWxldGluZyBpdC48L3A+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICB0aXRsZT17aXNBY3RpdmUgPyAnV2UgZGVsaXZlciBoZXJlJyA6ICdOb3QgZGVsaXZlcmluZyd9XG4gICAgICAgICAgICBoaW50PXtpc0FjdGl2ZSA/ICdBZGRyZXNzIHNhdmUgYW5kIGNoZWNrb3V0IGFyZSBhbGxvd2VkJyA6ICdDdXN0b21lcnMgd2lsbCBzZWUgdGhhdCB0aGlzIFBJTiBpcyBub3Qgc2VydmljZWFibGUnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGVsaXZlcnkgb3B0aW9uczwvaDQ+XG4gICAgICAgICAgPHA+VHVybiBhbiBvcHRpb24gb2ZmIHRvIHNob3cgaXQgYXMgY29taW5nIHNvb24gYXQgY2hlY2tvdXQuIElmIGJvdGggYXJlIG9mZiwgdGhpcyBQSU4gaXMgbm90IGRlbGl2ZXJhYmxlLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXttb3JuaW5nRW5hYmxlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIG9uTGFiZWw9XCJPblwiXG4gICAgICAgICAgICBvZmZMYWJlbD1cIk9mZlwiXG4gICAgICAgICAgICB0aXRsZT1cIk1vcm5pbmcgZGVsaXZlcnlcIlxuICAgICAgICAgICAgaGludD17bW9ybmluZ0VuYWJsZWQgPyAnU2hvcHBlcnMgY2FuIGNob29zZSBtb3JuaW5nIGRlbGl2ZXJ5JyA6ICdTaG93biBhcyBjb21pbmcgc29vbid9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdtb3JuaW5nRW5hYmxlZCcsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17ZXhwcmVzc0VuYWJsZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICBvbkxhYmVsPVwiT25cIlxuICAgICAgICAgICAgb2ZmTGFiZWw9XCJPZmZcIlxuICAgICAgICAgICAgdGl0bGU9XCI5MC1NaW51dGUgZGVsaXZlcnlcIlxuICAgICAgICAgICAgaGludD17ZXhwcmVzc0VuYWJsZWQgPyAnU2hvcHBlcnMgY2FuIGNob29zZSA5MC1taW51dGUgZGVsaXZlcnknIDogJ1Nob3duIGFzIGNvbWluZyBzb29uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2V4cHJlc3NFbmFibGVkJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkFzc2lnbmVkIHBhcnRuZXI8L2g0PlxuICAgICAgICAgIDxwPk5ldyBvcmRlcnMgaW4gdGhpcyBQSU4gYXJlIGF1dG8tYXNzaWduZWQgdG8gdGhpcyBwYXJ0bmVyLiBZb3UgY2FuIHJlYXNzaWduIGxhdGVyIG9uIHRoZSBvcmRlci48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRGVsaXZlcnkgcGFydG5lciA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFydG5lcklkfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbeyB2YWx1ZTogJycsIGxhYmVsOiAnTm8gcGFydG5lciBhc3NpZ25lZCcgfSwgLi4ucGFydG5lcnNdfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYXJ0bmVySWQnLCBuZXh0KVxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYXJ0bmVyJywgbmV4dClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgYSBwYXJ0bmVyXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcGFydG5lcnNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkxvY2F0aW9uPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezZ9XG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seSB8fCAhaXNOZXd9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGluY29kZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3BpbmNvZGUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCA2KSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiNi1kaWdpdCBQSU5cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMucGluY29kZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5waW5jb2RlLm1lc3NhZ2V9PC9zcGFuPiA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkluZGlhIFBJTiBjb2RlLCA2IGRpZ2l0czwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBcmVhIG5hbWUgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hcmVhTGFiZWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhcmVhTGFiZWwnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFuZGhlcmkgV2VzdCwgQmFuZHJhLCDigKZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jaXR5IHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTXVtYmFpXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLmNpdHkgPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMuY2l0eS5tZXNzYWdlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhdGVcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc3RhdGVDb2RlIHx8IHBhcmFtcy5zdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCBzdGF0ZScgfSwgLi4uU1RBVEVfT1BUSU9OU119XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3N0YXRlQ29kZScsIG5leHQpXG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3N0YXRlJywgbmV4dClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3Qgc3RhdGVcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBzdGF0ZXNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMuc3RhdGUgfHwgZXJyb3JzLnN0YXRlQ29kZSA/IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj5cbiAgICAgICAgICAgICAgICB7KGVycm9ycy5zdGF0ZSB8fCBlcnJvcnMuc3RhdGVDb2RlKS5tZXNzYWdlfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+QWxsIEluZGlhbiBzdGF0ZXMgYW5kIHVuaW9uIHRlcnJpdG9yaWVzPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAge3JlYWRPbmx5ID8gbnVsbCA6IChcbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICAgIHtpc05ldyA/ICdBZGQgcGluY29kZScgOiAnU2F2ZSBwaW5jb2RlJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpbmNvZGVFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU3RhdHVzU3dpdGNoLCBpc0ZsYWdPbiB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTdGF0dXNUb2dnbGUgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlLCBwcm9wZXJ0eSwgd2hlcmUsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWVsZCA9IHByb3BlcnR5Py5wYXRoIHx8ICdpc0FjdGl2ZSdcbiAgY29uc3QgYWN0aW9uTmFtZSA9IHByb3BlcnR5Py5jdXN0b20/LmFjdGlvbk5hbWUgfHwgJ3RvZ2dsZUFjdGl2ZSdcbiAgY29uc3Qgb25MYWJlbCA9IHByb3BlcnR5Py5jdXN0b20/Lm9uTGFiZWwgfHwgJ0FjdGl2ZSdcbiAgY29uc3Qgb2ZmTGFiZWwgPSBwcm9wZXJ0eT8uY3VzdG9tPy5vZmZMYWJlbCB8fCAnSW5hY3RpdmUnXG4gIGNvbnN0IHJhdyA9IHJlY29yZD8ucGFyYW1zPy5bZmllbGRdXG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlKGlzRmxhZ09uKHJhdykpXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q2hlY2tlZChpc0ZsYWdPbihyYXcpKVxuICB9LCBbcmF3LCByZWNvcmQ/LmlkXSlcblxuICBjb25zdCBwZXJzaXN0ID0gYXN5bmMgKG5leHQpID0+IHtcbiAgICBpZiAoIXJlY29yZD8uaWQpIHJldHVyblxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWUsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IFtmaWVsZF06IG5leHQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBzYXZlZCA9IHJlc3BvbnNlLmRhdGE/LnJlY29yZD8ucGFyYW1zPy5bZmllbGRdXG4gICAgICBzZXRDaGVja2VkKHNhdmVkID09PSB1bmRlZmluZWQgPyBuZXh0IDogaXNGbGFnT24oc2F2ZWQpKVxuICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBub3RpY2U/Lm1lc3NhZ2UgfHwgKG5leHQgPyBgTWFya2VkICR7b25MYWJlbC50b0xvd2VyQ2FzZSgpfWAgOiBgTWFya2VkICR7b2ZmTGFiZWwudG9Mb3dlckNhc2UoKX1gKSxcbiAgICAgICAgdHlwZTogbm90aWNlPy50eXBlIHx8ICdzdWNjZXNzJyxcbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGRhdGUgc3RhdHVzLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAobmV4dCkgPT4ge1xuICAgIGlmICh3aGVyZSA9PT0gJ2VkaXQnICYmIHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0Q2hlY2tlZChuZXh0KVxuICAgICAgb25DaGFuZ2UoZmllbGQsIG5leHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGVyc2lzdChuZXh0KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhdHVzU3dpdGNoXG4gICAgICBjb21wYWN0PXt3aGVyZSAhPT0gJ2VkaXQnfVxuICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgIGRpc2FibGVkPXtidXN5fVxuICAgICAgb25MYWJlbD17b25MYWJlbH1cbiAgICAgIG9mZkxhYmVsPXtvZmZMYWJlbH1cbiAgICAgIHRpdGxlPXt3aGVyZSA9PT0gJ2VkaXQnID8gKGNoZWNrZWQgPyBvbkxhYmVsIDogb2ZmTGFiZWwpIDogdW5kZWZpbmVkfVxuICAgICAgaGludD17d2hlcmUgPT09ICdlZGl0JyA/IHByb3BlcnR5Py5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZH1cbiAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNUb2dnbGVcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU3RhdHVzU3dpdGNoLCBpc0ZsYWdPbiB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmZ1bmN0aW9uIHBhZCh2YWx1ZSkge1xuICByZXR1cm4gU3RyaW5nKHZhbHVlKS5wYWRTdGFydCgyLCAnMCcpXG59XG5cbmZ1bmN0aW9uIHRvRGF0ZUlucHV0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCB0ZXh0ID0gU3RyaW5nKHZhbHVlKVxuICBpZiAoL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8udGVzdCh0ZXh0KSkgcmV0dXJuIHRleHQuc2xpY2UoMCwgMTApXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke3BhZChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtwYWQoZGF0ZS5nZXREYXRlKCkpfWBcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2hlbih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJ+KAlCdcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICfigJQnXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgZGF0ZVN0eWxlOiAnbWVkaXVtJywgdGltZVN0eWxlOiAnc2hvcnQnIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlQWRkcmVzc2VzKHBhcmFtcykge1xuICBjb25zdCByYXcgPSBwYXJhbXMuYWRkcmVzc2VzXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcuZmlsdGVyKEJvb2xlYW4pXG4gIGlmIChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gJ29iamVjdCcpIHJldHVybiBbcmF3XVxuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycgJiYgcmF3LnRyaW0oKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZWQuZmlsdGVyKEJvb2xlYW4pXG4gICAgICBpZiAocGFyc2VkICYmIHR5cGVvZiBwYXJzZWQgPT09ICdvYmplY3QnKSByZXR1cm4gW3BhcnNlZF1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGZsYXR0ZW5lZCBBZG1pbkpTIHBhcmFtcyBiZWxvd1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdyb3VwZWQgPSB7fVxuICBPYmplY3QuZW50cmllcyhwYXJhbXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IG1hdGNoID0ga2V5Lm1hdGNoKC9eYWRkcmVzc2VzXFwuKFxcZCspXFwuKC4rKSQvKVxuICAgIGlmICghbWF0Y2ggfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHJldHVyblxuICAgIGNvbnN0IFssIGluZGV4LCBmaWVsZF0gPSBtYXRjaFxuICAgIGdyb3VwZWRbaW5kZXhdID0gZ3JvdXBlZFtpbmRleF0gfHwge31cbiAgICBncm91cGVkW2luZGV4XVtmaWVsZF0gPSB2YWx1ZVxuICB9KVxuICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBlZClcbiAgICAuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuICAgIC5tYXAoKGtleSkgPT4gZ3JvdXBlZFtrZXldKVxufVxuXG5mdW5jdGlvbiBhZGRyZXNzTGluZXMoYWRkcmVzcykge1xuICByZXR1cm4gW1xuICAgIGFkZHJlc3MubGluZTEsXG4gICAgYWRkcmVzcy5saW5lMixcbiAgICBbYWRkcmVzcy5jaXR5LCBhZGRyZXNzLnN0YXRlLCBhZGRyZXNzLnBpbmNvZGVdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpLFxuICAgIGFkZHJlc3MubGFuZG1hcmsgPyBgTGFuZG1hcms6ICR7YWRkcmVzcy5sYW5kbWFya31gIDogJycsXG4gIF0uZmlsdGVyKEJvb2xlYW4pXG59XG5cbmNvbnN0IEN1c3RvbWVyRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc0FjdGl2ZSA9IHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJydcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgYWRkcmVzc2VzID0gdXNlTWVtbygoKSA9PiBwYXJzZUFkZHJlc3NlcyhwYXJhbXMpLCBbcGFyYW1zXSlcbiAgY29uc3QgZXJyb3JzID0gdXNlTWVtbygoKSA9PiByZWNvcmQ/LmVycm9ycyB8fCB7fSwgW3JlY29yZD8uZXJyb3JzXSlcbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGN1c3RvbWVyJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDdXN0b21lciB1cGRhdGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIGN1c3RvbWVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ0N1c3RvbWVyJ308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgKzkxIHtwYXJhbXMucGhvbmUgfHwgJ+KAlCd9IMK3IGpvaW5lZCB7Zm9ybWF0V2hlbihwYXJhbXMuY3JlYXRlZEF0KX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPkluYWN0aXZlIGN1c3RvbWVycyBjYW5ub3Qgc2lnbiBpbiB3aXRoIHRoaXMgbW9iaWxlIG51bWJlci48L3A+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICB0aXRsZT17aXNBY3RpdmUgPyAnQWN0aXZlJyA6ICdJbmFjdGl2ZSd9XG4gICAgICAgICAgICBoaW50PXtpc0FjdGl2ZSA/ICdDYW4gbG9nIGluIG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAnIDogJ0xvZ2luIGlzIGJsb2NrZWQgdW50aWwgeW91IHR1cm4gdGhpcyBvbid9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9maWxlPC9oND5cbiAgICAgICAgICA8cD5QaG9uZSBjb21lcyBmcm9tIE9UUCBsb2dpbiBhbmQgc3RheXMgYXMgdGhlIGN1c3RvbWVy4oCZcyBsb2dpbiBpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkN1c3RvbWVyIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMubmFtZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5uYW1lLm1lc3NhZ2V9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTW9iaWxlXG4gICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIiB2YWx1ZT17cGFyYW1zLnBob25lIHx8ICcnfSByZWFkT25seSAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgRGF0ZSBvZiBiaXJ0aFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRlSW5wdXQocGFyYW1zLmRhdGVPZkJpcnRoKX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZGF0ZU9mQmlydGgnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICB7ZXJyb3JzLmRhdGVPZkJpcnRoID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLmRhdGVPZkJpcnRoLm1lc3NhZ2V9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlNhdmVkIGFkZHJlc3NlczwvaDQ+XG4gICAgICAgIDxwPlxuICAgICAgICAgIHthZGRyZXNzZXMubGVuZ3RoXG4gICAgICAgICAgICA/IGAke2FkZHJlc3Nlcy5sZW5ndGh9IGFkZHJlc3Mke2FkZHJlc3Nlcy5sZW5ndGggPT09IDEgPyAnJyA6ICdlcyd9IHNhdmVkIGluIHRoZSBjdXN0b21lciBhY2NvdW50LmBcbiAgICAgICAgICAgIDogJ1RoaXMgY3VzdG9tZXIgaGFzIG5vdCBzYXZlZCBhIGRlbGl2ZXJ5IGFkZHJlc3MgeWV0Lid9XG4gICAgICAgIDwvcD5cbiAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGggPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hZGRyZXNzLWdyaWRcIj5cbiAgICAgICAgICAgIHthZGRyZXNzZXMubWFwKChhZGRyZXNzLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2FkZHJlc3MuaWQgfHwgYCR7YWRkcmVzcy5waW5jb2RlfS0ke2luZGV4fWB9IGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy10b3BcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtbGFiZWxcIj57YWRkcmVzcy5sYWJlbCB8fCAnQWRkcmVzcyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAge2FkZHJlc3MucGluY29kZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtcGluXCI+e2FkZHJlc3MucGluY29kZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPnthZGRyZXNzLm5hbWUgfHwgcGFyYW1zLm5hbWUgfHwgJ0N1c3RvbWVyJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICB7YWRkcmVzcy5waG9uZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtcGhvbmVcIj4rOTEge2FkZHJlc3MucGhvbmV9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICAgICAge2FkZHJlc3NMaW5lcyhhZGRyZXNzKS5tYXAoKGxpbmUpID0+IChcbiAgICAgICAgICAgICAgICAgIDxwIGtleT17bGluZX0+e2xpbmV9PC9wPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGN1c3RvbWVyXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tZXJFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgUk9MRVMgPSBbXG4gIHsgdmFsdWU6ICdzdGFmZicsIHRpdGxlOiAnU3RhZmYnLCBoaW50OiAnQWNjZXNzIG9ubHkgdGhlIGFyZWFzIHlvdSB0aWNrIGJlbG93JyB9LFxuICB7IHZhbHVlOiAnYWRtaW4nLCB0aXRsZTogJ0FkbWluJywgaGludDogJ0Z1bGwgYWNjZXNzIHRvIHRoZSBDTVMnIH0sXG4gIHsgdmFsdWU6ICdzdXBlcl9hZG1pbicsIHRpdGxlOiAnU3VwZXIgYWRtaW4nLCBoaW50OiAnRnVsbCBhY2Nlc3MsIHNhbWUgYXMgYWRtaW4nIH0sXG5dXG5cbmNvbnN0IFBFUk1JU1NJT05TID0gW1xuICB7IGtleTogJ21hbmFnZVByb2R1Y3RzJywgbGFiZWw6ICdQcm9kdWN0cycsIGhpbnQ6ICdBZGQgYW5kIGVkaXQgcHJvZHVjdHMnIH0sXG4gIHsga2V5OiAnbWFuYWdlQ2F0YWxvZycsIGxhYmVsOiAnQ2F0YWxvZycsIGhpbnQ6ICdDYXRlZ29yaWVzIGFuZCBjb2xsZWN0aW9ucycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VNZWRpYScsIGxhYmVsOiAnTWVkaWEnLCBoaW50OiAnVXBsb2FkIGFuZCByZXBsYWNlIGltYWdlcycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VPcmRlcnMnLCBsYWJlbDogJ09yZGVycycsIGhpbnQ6ICdWaWV3IGFuZCB1cGRhdGUgb3JkZXJzJyB9LFxuICB7IGtleTogJ21hbmFnZUNvdXBvbnMnLCBsYWJlbDogJ0NvdXBvbnMnLCBoaW50OiAnQ3JlYXRlIGRpc2NvdW50IGNvZGVzJyB9LFxuICB7IGtleTogJ21hbmFnZUNvbnRlbnQnLCBsYWJlbDogJ0NvbnRlbnQnLCBoaW50OiAnUGFnZXMgYW5kIHJldmlld3MnIH0sXG4gIHsga2V5OiAnbWFuYWdlU2V0dGluZ3MnLCBsYWJlbDogJ1NldHRpbmdzJywgaGludDogJ1N0b3JlIGFuZCBob21lcGFnZSBzZXR0aW5ncycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VVc2VycycsIGxhYmVsOiAnVGVhbScsIGhpbnQ6ICdDcmVhdGUgdXNlcnMgYW5kIGNoYW5nZSBhY2Nlc3MnIH0sXG5dXG5cbmZ1bmN0aW9uIEZpZWxkRXJyb3IoeyBlcnJvciB9KSB7XG4gIGlmICghZXJyb3I/Lm1lc3NhZ2UpIHJldHVybiBudWxsXG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvci5tZXNzYWdlfTwvc3Bhbj5cbn1cblxuZnVuY3Rpb24gUGFzc3dvcmRGaWVsZCh7IGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIGVycm9yLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFt2aXNpYmxlLCBzZXRWaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICByZXR1cm4gKFxuICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgIHtsYWJlbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXBhc3N3b3JkLXdyYXBcIj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICB0eXBlPXt2aXNpYmxlID8gJ3RleHQnIDogJ3Bhc3N3b3JkJ31cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgYXV0b0NvbXBsZXRlPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXBhc3N3b3JkLXRvZ2dsZVwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRWaXNpYmxlKChjdXJyZW50KSA9PiAhY3VycmVudCl9XG4gICAgICAgID5cbiAgICAgICAgICB7dmlzaWJsZSA/ICdIaWRlJyA6ICdTaG93J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3NwYW4+XG4gICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3J9IC8+XG4gICAgPC9sYWJlbD5cbiAgKVxufVxuXG5jb25zdCBUZWFtRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzTmV3ID0gYWN0aW9uPy5uYW1lID09PSAnbmV3JyB8fCAhcmVjb3JkPy5pZFxuICBjb25zdCByb2xlID0gcGFyYW1zLnJvbGUgfHwgJ3N0YWZmJ1xuICBjb25zdCBpc0FjdGl2ZSA9XG4gICAgaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpXG4gICAgICA/IHRydWVcbiAgICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAhcGFyYW1zLnJvbGUpIGhhbmRsZUNoYW5nZSgncm9sZScsICdzdGFmZicpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNOZXddKVxuXG4gIGNvbnN0IGVycm9ycyA9IHVzZU1lbW8oKCkgPT4gcmVjb3JkPy5lcnJvcnMgfHwge30sIFtyZWNvcmQ/LmVycm9yc10pXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuICBjb25zdCBwZXJtaXNzaW9uT24gPSAoa2V5KSA9PiBpc0ZsYWdPbihwYXJhbXNbYHBlcm1pc3Npb25zLiR7a2V5fWBdKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSB0ZWFtIG1lbWJlcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3ID8gJ1RlYW0gbWVtYmVyIGNyZWF0ZWQnIDogJ1RlYW0gbWVtYmVyIHVwZGF0ZWQnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgdGVhbSBtZW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntpc05ldyA/ICdBZGQgdGVhbSBtZW1iZXInIDogcGFyYW1zLm5hbWUgfHwgJ1RlYW0gbWVtYmVyJ308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgVGhleSBzaWduIGluIHRvIFRva3JpaWkgQ01TIHdpdGggdXNlcm5hbWUgb3IgZW1haWwuIEluYWN0aXZlIHVzZXJzIGNhbm5vdCBsb2cgaW4uXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkFjY291bnQgc3RhdHVzPC9oND5cbiAgICAgICAgICA8cD5UdXJuIHRoaXMgb2ZmIHRvIGJsb2NrIENNUyBsb2dpbiB3aXRob3V0IGRlbGV0aW5nIHRoZSBhY2NvdW50LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBzaWduIGluIHRvIHRoZSBhZG1pbiBwYW5lbCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlJvbGU8L2g0PlxuICAgICAgICAgIDxwPkFkbWluIGFuZCBzdXBlciBhZG1pbiBnZXQgZnVsbCBhY2Nlc3MuIFN0YWZmIG9ubHkgZ2V0cyB0aGUgcGVybWlzc2lvbnMgeW91IGVuYWJsZS48L3A+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICB7Uk9MRVMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZD17cm9sZSA9PT0gaXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXRlbS50aXRsZX1cbiAgICAgICAgICAgICAgICBoaW50PXtpdGVtLmhpbnR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3JvbGUnLCBpdGVtLnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkxvZ2luIGRldGFpbHM8L2g0PlxuICAgICAgICA8cD5Vc2VybmFtZSBvciBlbWFpbCBjYW4gYmUgdXNlZCBvbiB0aGUgQ01TIGxvZ2luIHNjcmVlbi48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEZ1bGwgbmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRlYW0gbWVtYmVyIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMubmFtZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFVzZXJuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy51c2VybmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3VzZXJuYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiByYXZpLmNtc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy51c2VybmFtZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIEVtYWlsXG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtYWlsIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2VtYWlsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwibmFtZUB0b2tyaWlpLmNvbVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmVtYWlsfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICB7aXNOZXcgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYXNzd29yZCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gc2V0RmllbGQoJ3Bhc3N3b3JkJywgdmFsdWUpfVxuICAgICAgICAgICAgICBlcnJvcj17ZXJyb3JzLnBhc3N3b3JkfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkF0IGxlYXN0IDYgY2hhcmFjdGVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb25maXJtUGFzc3dvcmQgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IHNldEZpZWxkKCdjb25maXJtUGFzc3dvcmQnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgIGVycm9yPXtlcnJvcnMuY29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgcGFzc3dvcmQgYWdhaW5cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+VXNlIENoYW5nZSBwYXNzd29yZCBmcm9tIHRoZSB0ZWFtIGxpc3QgdG8gcmVzZXQgbG9naW4uPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICB7cm9sZSA9PT0gJ3N0YWZmJyA/IChcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UGVybWlzc2lvbnM8L2g0PlxuICAgICAgICAgIDxwPk9ubHkgdXNlZCBmb3Igc3RhZmYuIFRvZ2dsZSB3aGF0IHRoaXMgcGVyc29uIGNhbiBvcGVuIGluIHRoZSBDTVMuPC9wPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktcGVybS1saXN0XCI+XG4gICAgICAgICAgICB7UEVSTUlTU0lPTlMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmtleX0gY2xhc3NOYW1lPVwidG9rcmktcGVybS1yb3dcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2l0ZW0ubGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5oaW50fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgICAgICAgY29tcGFjdFxuICAgICAgICAgICAgICAgICAgY2hlY2tlZD17cGVybWlzc2lvbk9uKGl0ZW0ua2V5KX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoYHBlcm1pc3Npb25zLiR7aXRlbS5rZXl9YCwgbmV4dCl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgKSA6IG51bGx9XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHRlYW0gbWVtYmVyJyA6ICdTYXZlIHRlYW0gbWVtYmVyJ31cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZWFtRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUXVlcnlQYXJhbXMsIHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJ1xuY29uc3QgRk9MREVSUyA9IFsnYWxsJywgJ3Byb2R1Y3RzJywgJ2NhdGVnb3JpZXMnLCAncmV2aWV3cycsICdwYWdlcycsICdnZW5lcmFsJ11cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gZm9ybWF0U2l6ZShieXRlcykge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGJ5dGVzKSB8fCAwXG4gIGlmIChzaXplIDwgMTAyNCkgcmV0dXJuIGAke3NpemV9IEJgXG4gIGlmIChzaXplIDwgMTAyNCAqIDEwMjQpIHJldHVybiBgJHtNYXRoLnJvdW5kKHNpemUgLyAxMDI0KX0gS0JgXG4gIHJldHVybiBgJHsoc2l6ZSAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMSl9IE1CYFxufVxuXG5mdW5jdGlvbiBmb3JtYXRXaGVuKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCB5ZWFyOiAnbnVtZXJpYycgfSlcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVVybChwYXRoLCBhcHBVcmwpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhdGgpKSByZXR1cm4gcGF0aFxuICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGF0aH1gXG59XG5cbmNvbnN0IE1lZGlhTGlicmFyeSA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgc3RvcmVQYXJhbXMsIGZpbHRlcnMgfSA9IHVzZVF1ZXJ5UGFyYW1zKClcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBmZXRjaERhdGEsIHRvdGFsLCBwZXJQYWdlIH0gPSB1c2VSZWNvcmRzKHJlc291cmNlLmlkKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2J1c3lJZCwgc2V0QnVzeUlkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBmb2xkZXIgPSBTdHJpbmcoZmlsdGVycz8uZm9sZGVyIHx8ICdhbGwnKVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCB1cGxvYWRGb2xkZXIgPSBmb2xkZXIgPT09ICdhbGwnID8gJ2dlbmVyYWwnIDogZm9sZGVyXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2V0VGFnKSBzZXRUYWcoU3RyaW5nKHRvdGFsIHx8IDApKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoTnVtYmVyKHBlclBhZ2UpIDwgNTApIHN0b3JlUGFyYW1zKHsgcGVyUGFnZTogJzUwJyB9KVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW10pXG5cbiAgY29uc3QgaXRlbXMgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICAocmVjb3JkcyB8fCBbXSkubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgbmFtZTogaXRlbS5wYXJhbXM/Lm9yaWdpbmFsTmFtZSB8fCBpdGVtLnBhcmFtcz8uZmlsZW5hbWUgfHwgJ0ltYWdlJyxcbiAgICAgICAgZm9sZGVyOiBpdGVtLnBhcmFtcz8uZm9sZGVyIHx8ICdnZW5lcmFsJyxcbiAgICAgICAgcGF0aDogaXRlbS5wYXJhbXM/LnBhdGggfHwgJycsXG4gICAgICAgIHNpemU6IGl0ZW0ucGFyYW1zPy5zaXplLFxuICAgICAgICBjcmVhdGVkQXQ6IGl0ZW0ucGFyYW1zPy5jcmVhdGVkQXQsXG4gICAgICAgIHVybDogcmVzb2x2ZVVybChpdGVtLnBhcmFtcz8ucGF0aCwgYXBwVXJsKSxcbiAgICAgIH0pKSxcbiAgICBbYXBwVXJsLCByZWNvcmRzXSxcbiAgKVxuXG4gIGNvbnN0IHNldEZvbGRlciA9IChuZXh0KSA9PiB7XG4gICAgc3RvcmVQYXJhbXMoe1xuICAgICAgcGFnZTogJzEnLFxuICAgICAgZmlsdGVyczogbmV4dCA9PT0gJ2FsbCcgPyB7fSA6IHsgZm9sZGVyOiBuZXh0IH0sXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHVwbG9hZEZpbGVzID0gYXN5bmMgKGZpbGVzKSA9PiB7XG4gICAgY29uc3QgbGlzdCA9IFsuLi5maWxlc10uZmlsdGVyKChmaWxlKSA9PiBmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpXG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBsaXN0KSB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCB1cGxvYWRGb2xkZXIpXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICB9KVxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCBgQ291bGQgbm90IHVwbG9hZCAke2ZpbGUubmFtZX1gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBsaXN0Lmxlbmd0aCA9PT0gMSA/ICdJbWFnZSB1cGxvYWRlZCcgOiBgJHtsaXN0Lmxlbmd0aH0gaW1hZ2VzIHVwbG9hZGVkYCxcbiAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgfSlcbiAgICAgIGZldGNoRGF0YSgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ1VwbG9hZCBmYWlsZWQnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3QgY29weVBhdGggPSBhc3luYyAocGF0aCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ZpbGUgcGF0aCBjb3BpZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IHBhdGgsIHR5cGU6ICdpbmZvJyB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZSA9IGFzeW5jIChpZCwgbmFtZSkgPT4ge1xuICAgIGlmICghd2luZG93LmNvbmZpcm0oYERlbGV0ZSDigJwke25hbWV94oCdPyBUaGlzIGNhbm5vdCBiZSB1bmRvbmUuYCkpIHJldHVyblxuICAgIHNldEJ1c3lJZChpZClcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS8ke2lkfWAsIHsgbWV0aG9kOiAnREVMRVRFJyB9KVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8ICdDb3VsZCBub3QgZGVsZXRlIGltYWdlJylcbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGRhdGEubWVzc2FnZSB8fCAnSW1hZ2UgZGVsZXRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgZmV0Y2hEYXRhKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IGRlbGV0ZSBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeUlkKCcnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPk1lZGlhIGxpYnJhcnk8L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgVXBsb2FkIGltYWdlcyB1c2VkIG9uIHByb2R1Y3RzLCBjYXRlZ29yaWVzLCByZXZpZXdzLCBhbmQgdGhlIGhvbWVwYWdlLiBGaWxlcyBzdGF5IG9uIHRoaXMgc2VydmVyLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlVwbG9hZDwvaDQ+XG4gICAgICAgIDxwPlxuICAgICAgICAgIEZpbGVzIGdvIGludG8gdGhlIDxzdHJvbmc+e3VwbG9hZEZvbGRlcn08L3N0cm9uZz4gZm9sZGVyXG4gICAgICAgICAge2ZvbGRlciA9PT0gJ2FsbCcgPyAnIChzZWxlY3QgYSBmb2xkZXIgYmVsb3cgdG8gY2hhbmdlIHRoaXMpLicgOiAnLid9XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGxhYmVsXG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3BcIlxuICAgICAgICAgIG9uRHJhZ092ZXI9eyhldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKX1cbiAgICAgICAgICBvbkRyb3A9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgdXBsb2FkRmlsZXMoZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKVxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj57dXBsb2FkaW5nID8gJ1VwbG9hZGluZ+KApicgOiAnQ2xpY2sgb3IgZHJvcCBpbWFnZXMgaGVyZSd9PC9zcGFuPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZGluZ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwbG9hZEZpbGVzKGV2ZW50LnRhcmdldC5maWxlcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CIGVhY2g8L3NwYW4+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5MaWJyYXJ5PC9oND5cbiAgICAgICAgPHA+e3RvdGFsIHx8IDB9IGZpbGV7KHRvdGFsIHx8IDApID09PSAxID8gJycgOiAncyd9e2ZvbGRlciAhPT0gJ2FsbCcgPyBgIGluICR7Zm9sZGVyfWAgOiAnJ30uPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWZvbGRlci1jaGlwc1wiPlxuICAgICAgICAgIHtGT0xERVJTLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0ZW19XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1mb2xkZXItY2hpcCR7Zm9sZGVyID09PSBpdGVtID8gJyBpcy1vbicgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGb2xkZXIoaXRlbSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtID09PSAnYWxsJyA/ICdBbGwgZm9sZGVycycgOiBpdGVtfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxUZXh0IG10PVwieGxcIj5Mb2FkaW5nIGltYWdlc+KApjwvVGV4dD5cbiAgICAgICAgKSA6IGl0ZW1zLmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLWdyaWRcIj5cbiAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9XCJ0b2tyaS1tZWRpYS1jYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tZWRpYS10aHVtYlwiPlxuICAgICAgICAgICAgICAgICAge2l0ZW0udXJsID8gPGltZyBzcmM9e2l0ZW0udXJsfSBhbHQ9e2l0ZW0ubmFtZX0gLz4gOiA8c3Bhbj5ObyBwcmV2aWV3PC9zcGFuPn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nIHRpdGxlPXtpdGVtLm5hbWV9PntpdGVtLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICB7aXRlbS5mb2xkZXJ9IMK3IHtmb3JtYXRTaXplKGl0ZW0uc2l6ZSl9XG4gICAgICAgICAgICAgICAgICB7aXRlbS5jcmVhdGVkQXQgPyBgIMK3ICR7Zm9ybWF0V2hlbihpdGVtLmNyZWF0ZWRBdCl9YCA6ICcnfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gc2l6ZT1cInNtXCIgdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXsoKSA9PiBjb3B5UGF0aChpdGVtLnBhdGgpfT5cbiAgICAgICAgICAgICAgICAgICAgQ29weSBwYXRoXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImRhbmdlclwiXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtidXN5SWQgPT09IGl0ZW0uaWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZShpdGVtLmlkLCBpdGVtLm5hbWUpfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7YnVzeUlkID09PSBpdGVtLmlkID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICBEZWxldGVcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtdD1cInhsXCI+Tm8gaW1hZ2VzIGluIHRoaXMgZm9sZGVyIHlldC48L1RleHQ+XG4gICAgICAgICl9XG4gICAgICA8L3NlY3Rpb24+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFMaWJyYXJ5XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgaXNGbGFnT24sIFN0YXR1c1N3aXRjaCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IFRheEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBpc1RheGFibGVCb29sID0gaXNGbGFnT24ocGFyYW1zLmlzVGF4YWJsZSlcblxuICBjb25zdCBoYW5kbGVUYXhhYmxlVG9nZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgc2V0RmllbGQoJ2lzVGF4YWJsZScsIHZhbHVlKVxuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHNldEZpZWxkKCdnc3RSYXRlJywgMClcbiAgICB9IGVsc2UgaWYgKE51bWJlcihwYXJhbXMuZ3N0UmF0ZSB8fCAwKSA9PT0gMCkge1xuICAgICAgc2V0RmllbGQoJ2dzdFJhdGUnLCA1KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG9uU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQ/LnByZXZlbnREZWZhdWx0Py4oKVxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVTdWJtaXQoKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ1RheCBjb25maWd1cmF0aW9uIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5LicsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gdXBkYXRlIHRheCBjb25maWd1cmF0aW9uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17b25TdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZWFkXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPEgzPntwYXJhbXMucHJvZHVjdE5hbWUgfHwgJ0VkaXQgUHJvZHVjdCBUYXgnfTwvSDM+XG4gICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIENvbmZpZ3VyZSBIU04gY29kZSBhbmQgR1NUIHBlcmNlbnRhZ2UgZm9yIHRoaXMgcHJvZHVjdC5cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5Qcm9kdWN0IGRldGFpbHM8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUHJvZHVjdCBuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wcm9kdWN0TmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogMC43LCBjdXJzb3I6ICdub3QtYWxsb3dlZCcgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDYXRlZ29yeVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY2F0ZWdvcnlOYW1lIHx8ICdHZW5lcmFsJ31cbiAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogMC43LCBjdXJzb3I6ICdub3QtYWxsb3dlZCcgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5UYXhhYmlsaXR5IHN0YXR1czwvaDQ+XG4gICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICBjaGVja2VkPXtpc1RheGFibGVCb29sfVxuICAgICAgICAgIHRpdGxlPVwiVGF4YWJsZVwiXG4gICAgICAgICAgaGludD17aXNUYXhhYmxlQm9vbCA/ICdHU1Qgd2lsbCBiZSBjaGFyZ2VkIGF0IGNoZWNrb3V0JyA6ICcwJSBHU1QgKGZyZXNoIGZydWl0cyAvIGV4ZW1wdCknfVxuICAgICAgICAgIG9uTGFiZWw9XCJZZXNcIlxuICAgICAgICAgIG9mZkxhYmVsPVwiTm9cIlxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVUYXhhYmxlVG9nZ2xlfVxuICAgICAgICAvPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+R1NUICYgSFNOIGRldGFpbHM8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgSFNOIGNvZGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmhzbkNvZGUgfHwgJzA4MDgnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnaHNuQ29kZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiAwODAyIGZvciBkcnkgZnJ1aXRzLCAwODA4IGZvciBmcmVzaCBmcnVpdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEdTVCAlIHJhdGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgbWF4PVwiMTAwXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5nc3RSYXRlID8/IChpc1RheGFibGVCb29sID8gNSA6IDApfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZ3N0UmF0ZScsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gNSBmb3IgZHJ5IGZydWl0c1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fSBmb250U2l6ZT1cIjEycHhcIj5cbiAgICAgICAgICB7aXNUYXhhYmxlQm9vbFxuICAgICAgICAgICAgPyBgQXQgY2hlY2tvdXQsIGludHJhLXN0YXRlIG9yZGVycyBzcGxpdCBpbnRvICR7KE51bWJlcihwYXJhbXMuZ3N0UmF0ZSB8fCA1KSAvIDIpLnRvRml4ZWQoMSl9JSBDR1NUICsgJHsoTnVtYmVyKHBhcmFtcy5nc3RSYXRlIHx8IDUpIC8gMikudG9GaXhlZCgxKX0lIFNHU1Q7IGludGVyLXN0YXRlIG9yZGVycyBjaGFyZ2UgJHtOdW1iZXIocGFyYW1zLmdzdFJhdGUgfHwgNSl9JSBJR1NULmBcbiAgICAgICAgICAgIDogJ1Byb2R1Y3QgaXMgZXhlbXB0L25vbi10YXhhYmxlICgwJSBHU1QpLid9XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgdGF4IHNldHRpbmdzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGF4RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5cbmZ1bmN0aW9uIGNvcHlUZXh0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgfHwgIW5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dCkgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgcmV0dXJuIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHZhbHVlKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSYXpvcnBheVBheW1lbnRJZCh7IHJlY29yZCB9KSB7XG4gIGNvbnN0IHBheW1lbnRJZCA9IFN0cmluZyhyZWNvcmQ/LnBhcmFtcz8ucmF6b3JwYXlQYXltZW50SWQgfHwgJycpLnRyaW0oKVxuICBjb25zdCBwYWlkID0gcmVjb3JkPy5wYXJhbXM/LnBheW1lbnRTdGF0dXMgPT09ICdwYWlkJ1xuICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgaWYgKCFwYWlkIHx8ICFwYXltZW50SWQpIHtcbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktcnpwLWVtcHR5XCI+4oCUPC9zcGFuPlxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29weSA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGNvcHlUZXh0KHBheW1lbnRJZClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgc2V0Q29waWVkKHRydWUpXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHNldENvcGllZChmYWxzZSksIDEyMDApXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHt9KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXJ6cC1jZWxsXCIgb25DbGljaz17KGV2ZW50KSA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKX0+XG4gICAgICA8YVxuICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1yenAtaWRcIlxuICAgICAgICBocmVmPXtgaHR0cHM6Ly9kYXNoYm9hcmQucmF6b3JwYXkuY29tL2FwcC9wYXltZW50cy8ke2VuY29kZVVSSUNvbXBvbmVudChwYXltZW50SWQpfWB9XG4gICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICB0aXRsZT1cIk9wZW4gdGhpcyBwYXltZW50IGluIFJhem9ycGF5XCJcbiAgICAgID5cbiAgICAgICAge3BheW1lbnRJZH1cbiAgICAgIDwvYT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLXJ6cC1jb3B5XCIgb25DbGljaz17aGFuZGxlQ29weX0+XG4gICAgICAgIHtjb3BpZWQgPyAnQ29waWVkJyA6ICdDb3B5J31cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIEZvcm1Hcm91cCxcbiAgSDIsXG4gIElucHV0LFxuICBMYWJlbCxcbiAgTWVzc2FnZUJveCxcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgUkVNRU1CRVJFRF9MT0dJTl9LRVkgPSAndG9rcmlfYWRtaW5fbG9naW4nXG5cbmNvbnN0IExvZ2luID0gKCkgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgZXJyb3JNZXNzYWdlIH0gPSB3aW5kb3cuX19BUFBfU1RBVEVfXyB8fCB7fVxuICBjb25zdCB7IHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgYWRtaW5Sb290ID0gYWN0aW9uPy5yZXBsYWNlKC9cXC9sb2dpbiQvLCAnJykgfHwgJydcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRVcmwgPSBgJHthZG1pblJvb3R9L2ZvcmdvdC1wYXNzd29yZGBcbiAgY29uc3QgW2lkZW50aWZpZXIsIHNldElkZW50aWZpZXJdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtyZW1lbWJlckxvZ2luLCBzZXRSZW1lbWJlckxvZ2luXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZW1lbWJlcmVkTG9naW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgaWYgKHJlbWVtYmVyZWRMb2dpbikge1xuICAgICAgc2V0SWRlbnRpZmllcihyZW1lbWJlcmVkTG9naW4pXG4gICAgICBzZXRSZW1lbWJlckxvZ2luKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBmb3JtLmVsZW1lbnRzLm5hbWVkSXRlbSgnZW1haWwnKVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCA/IFN0cmluZyhlbWFpbElucHV0LnZhbHVlKSA6IGlkZW50aWZpZXIpLnRyaW0oKVxuXG4gICAgaWYgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0KSB7XG4gICAgICBlbWFpbElucHV0LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAocmVtZW1iZXJMb2dpbiAmJiB2YWx1ZSkge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgZmxleFxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBtaW5IZWlnaHQ9XCIxMDB2aFwiXG4gICAgICBiZz1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwMjJjMjIsICMwNDc4NTcpXCJcbiAgICAgIHA9XCJ4bFwiXG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0NDBweCddfVxuICAgICAgICBib3JkZXJSYWRpdXM9XCIxOHB4XCJcbiAgICAgICAgYm94U2hhZG93PVwiMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMzUpXCJcbiAgICAgICAgcD1cIngzXCJcbiAgICAgID5cbiAgICAgICAgPEgyIGNvbG9yPVwiIzAyMmMyMlwiIG1iPVwic21cIj5Ub2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwiIzY0NzQ4YlwiIG1iPVwieGxcIj5cbiAgICAgICAgICBTaWduIGluIHdpdGggeW91ciBhZG1pbiBlbWFpbCBvciB1c2VybmFtZSB0byBtYW5hZ2UgcHJvZHVjdHMsIG9yZGVycywgYW5kIGNvbnRlbnQuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZXJyb3JNZXNzYWdlID8gKFxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICBtYj1cImxnXCJcbiAgICAgICAgICAgIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSl9XG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGFzPVwiZm9ybVwiIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5FbWFpbCBvciB1c2VybmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpZGVudGlmaWVyfVxuICAgICAgICAgICAgICBrZXk9e2lkZW50aWZpZXIgfHwgJ2xvZ2luLWVtYWlsJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPlBhc3N3b3JkPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPXtzaG93UGFzc3dvcmQgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17c2hvd1Bhc3N3b3JkID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgaWQ9XCJyZW1lbWJlci1sb2dpblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e3JlbWVtYmVyTG9naW59XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFJlbWVtYmVyTG9naW4oZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5SaWdodDogOCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtZW1iZXItbG9naW5cIiBzdHlsZT17eyBjb2xvcjogJyM0NzU1NjknLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgIFJlbWVtYmVyIG15IGVtYWlsIG9yIHVzZXJuYW1lIG9uIHRoaXMgZGV2aWNlXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIHdpZHRoPVwiMTAwJVwiIG10PVwibGdcIj5cbiAgICAgICAgICAgIFNpZ24gaW5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxhIGhyZWY9e2ZvcmdvdFBhc3N3b3JkVXJsfSBzdHlsZT17eyBjb2xvcjogJyMwNDc4NTcnLCBmb250V2VpZ2h0OiA3MDAgfX0+XG4gICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpblxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uR3JvdXAsIE1lc3NhZ2VCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlRmlsdGVyRHJhd2VyLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnXG5cbmZ1bmN0aW9uIGFkbWluUm9vdFBhdGgoKSB7XG4gIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9eKC4qKVxcL3Jlc291cmNlc1xcLy8pXG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKSB7XG4gIGlmIChyZXNvdXJjZUlkID09PSAnQ2F0ZWdvcnknKSB7XG4gICAgcmV0dXJuIHsgZXhwb3J0VXJsOiAnY2F0ZWdvcmllcy9leHBvcnQnLCBpbXBvcnRVcmw6ICdjYXRlZ29yaWVzL2ltcG9ydCcgfVxuICB9XG4gIGlmIChyZXNvdXJjZUlkID09PSAnUHJvZHVjdCcpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdwcm9kdWN0cy9leHBvcnQnLCBpbXBvcnRVcmw6ICdwcm9kdWN0cy9pbXBvcnQnIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMoeyByZXNvdXJjZSwgb25JbXBvcnRlZCB9KSB7XG4gIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uLCB0cmFuc2xhdGVBY3Rpb24gfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyB0b2dnbGVGaWx0ZXIsIGZpbHRlcnNDb3VudCB9ID0gdXNlRmlsdGVyRHJhd2VyKClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcblxuICBjb25zdCByZXNvdXJjZUlkID0gcmVzb3VyY2UuaWRcbiAgY29uc3QgY29uZmlnID0gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKVxuICBjb25zdCByb290ID0gYWRtaW5Sb290UGF0aCgpXG5cbiAgY29uc3QgaGFuZGxlSW1wb3J0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICBpZiAoIWZpbGUgfHwgIWNvbmZpZykgcmV0dXJuXG5cbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgc2V0TWVzc2FnZShudWxsKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5pbXBvcnRVcmx9YCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JDb3VudCA9IGRhdGEuZXJyb3JzPy5sZW5ndGggfHwgMFxuICAgICAgc2V0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IGVycm9yQ291bnQgPyAnaW5mbycgOiAnc3VjY2VzcycsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgZXJyb3JDb3VudCA+IDBcbiAgICAgICAgICAgID8gYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC4gJHtlcnJvckNvdW50fSByb3cocykgY291bGQgbm90IGJlIGltcG9ydGVkLiBFeGlzdGluZyByb3dzIGFyZSBtYXRjaGVkIGJ5IHNsdWcuYFxuICAgICAgICAgICAgOiBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiBFeGlzdGluZyByb3dzIGFyZSBtYXRjaGVkIGJ5IHNsdWcg4oCUIGtlZXAgc2x1ZyB0aGUgc2FtZSB0byB1cGRhdGUgcHJpY2UuYCxcbiAgICAgIH0pXG4gICAgICBvbkltcG9ydGVkPy4oKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogJ2RhbmdlcicsIHRleHQ6IGVycm9yLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1dHRvbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWNvbmZpZykgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQgQ1NWJyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBocmVmOiBgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmV4cG9ydFVybH1gLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQgRXhjZWwnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L2NhdGFsb2cvJHtjb25maWcuZXhwb3J0VXJsfT9mb3JtYXQ9eGxzeGAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogbG9hZGluZyA/ICdJbXBvcnRpbmcuLi4nIDogJ0ltcG9ydCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgb25DbGljazogbG9hZGluZyA/IHVuZGVmaW5lZCA6ICgpID0+IGZpbGVSZWYuY3VycmVudD8uY2xpY2soKSxcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3QgbmV3QWN0aW9uID0gcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zPy5maW5kKChhY3Rpb24pID0+IGFjdGlvbi5uYW1lID09PSAnbmV3JylcbiAgICBpZiAobmV3QWN0aW9uKSB7XG4gICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgaWNvbjogbmV3QWN0aW9uLmljb24sXG4gICAgICAgIGxhYmVsOiB0cmFuc2xhdGVBY3Rpb24obmV3QWN0aW9uLmxhYmVsLCByZXNvdXJjZUlkKSxcbiAgICAgICAgdmFyaWFudDogbmV3QWN0aW9uLnZhcmlhbnQsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L3Jlc291cmNlcy8ke3Jlc291cmNlSWR9L2FjdGlvbnMvbmV3YCxcbiAgICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tbmV3LWJ1dHRvbmAsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlcktleSA9IGZpbHRlcnNDb3VudCA+IDAgPyAnZmlsdGVyQWN0aXZlJyA6ICdmaWx0ZXInXG4gICAgaXRlbXMucHVzaCh7XG4gICAgICBsYWJlbDogdHJhbnNsYXRlQnV0dG9uKGZpbHRlcktleSwgcmVzb3VyY2VJZCwgeyBjb3VudDogZmlsdGVyc0NvdW50IH0pLFxuICAgICAgb25DbGljazogdG9nZ2xlRmlsdGVyLFxuICAgICAgaWNvbjogJ0ZpbHRlcicsXG4gICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1maWx0ZXItYnV0dG9uYCxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGl0ZW1zXG4gIH0sIFtcbiAgICBjb25maWcsXG4gICAgcm9vdCxcbiAgICBsb2FkaW5nLFxuICAgIHJlc291cmNlLnJlc291cmNlQWN0aW9ucyxcbiAgICByZXNvdXJjZUlkLFxuICAgIHRyYW5zbGF0ZUFjdGlvbixcbiAgICB0cmFuc2xhdGVCdXR0b24sXG4gICAgZmlsdGVyc0NvdW50LFxuICAgIHRvZ2dsZUZpbHRlcixcbiAgXSlcblxuICBpZiAoIWNvbmZpZykgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Qm94XG4gICAgICAgIG10PVwieGxcIlxuICAgICAgICBtYj1cImRlZmF1bHRcIlxuICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIlxuICAgICAgICBmbGV4U2hyaW5rPXswfVxuICAgICAgICBweD17WydkZWZhdWx0JywgMF19XG4gICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogJy01MnB4JyB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uR3JvdXAgYnV0dG9ucz17YnV0dG9uc30gLz5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBhY2NlcHQ9XCIuY3N2LC54bHN4LHRleHQvY3N2LGFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCJcbiAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlSW1wb3J0fVxuICAgICAgICAvPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHttZXNzYWdlICYmIChcbiAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIiBweD17WydkZWZhdWx0JywgMF19PlxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICB2YXJpYW50PXttZXNzYWdlLnR5cGV9XG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlLnRleHR9XG4gICAgICAgICAgICBvbkNsb3NlQ2xpY2s9eygpID0+IHNldE1lc3NhZ2UobnVsbCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgT3JpZ2luYWxBY3Rpb25IZWFkZXIgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyBmcm9tICcuL2NhdGFsb2ctbGlzdC1oZWFkZXItYWN0aW9ucy5qc3gnXG5cbmNvbnN0IENBVEFMT0dfUkVTT1VSQ0VTID0gbmV3IFNldChbJ1Byb2R1Y3QnLCAnQ2F0ZWdvcnknXSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWN0aW9uSGVhZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQsIGFjdGlvbiwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IEJhc2VIZWFkZXIgPSBPcmlnaW5hbENvbXBvbmVudCB8fCBPcmlnaW5hbEFjdGlvbkhlYWRlclxuICBjb25zdCBpc0NhdGFsb2dMaXN0ID0gYWN0aW9uPy5uYW1lID09PSAnbGlzdCcgJiYgQ0FUQUxPR19SRVNPVVJDRVMuaGFzKHJlc291cmNlPy5pZClcblxuICBpZiAoIWlzQ2F0YWxvZ0xpc3QpIHtcbiAgICByZXR1cm4gPEJhc2VIZWFkZXIgey4uLnByb3BzfSAvPlxuICB9XG5cbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudDogX2lnbm9yZWQsIC4uLmhlYWRlclByb3BzIH0gPSBwcm9wc1xuXG4gIHJldHVybiAoXG4gICAgPEJveD5cbiAgICAgIDxCYXNlSGVhZGVyIHsuLi5oZWFkZXJQcm9wc30gb21pdEFjdGlvbnMgLz5cbiAgICAgIDxDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnNcbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICBvbkltcG9ydGVkPXtwcm9wcy5hY3Rpb25QZXJmb3JtZWR9XG4gICAgICAvPlxuICAgIDwvQm94PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgbWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIExhYmVsLCBUaW55TUNFIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbHVnaW5zOiBbXG4gICAgJ2NvZGUnLFxuICAgICdsaW5rJyxcbiAgICAnbGlzdHMnLFxuICAgICdpbWFnZScsXG4gICAgJ3RhYmxlJyxcbiAgICAnYXV0b2xpbmsnLFxuICAgICdwcmV2aWV3JyxcbiAgICAnc2VhcmNocmVwbGFjZScsXG4gICAgJ3dvcmRjb3VudCcsXG4gICAgJ21lZGlhJyxcbiAgICAnY29kZXNhbXBsZScsXG4gIF0sXG4gIHRvb2xiYXI6XG4gICAgJ3VuZG8gcmVkbyB8IGJsb2NrcyB8IGJvbGQgaXRhbGljIHVuZGVybGluZSBzdHJpa2V0aHJvdWdoIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgYWxpZ25qdXN0aWZ5IHwgYnVsbGlzdCBudW1saXN0IG91dGRlbnQgaW5kZW50IHwgbGluayBpbWFnZSB0YWJsZSBjb2Rlc2FtcGxlIHwgY29kZSB8IHJlbW92ZWZvcm1hdCcsXG4gIGhlaWdodDogNDAwLFxufVxuXG5jb25zdCBSaWNodGV4dEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9ID0gcHJvcHNcbiAgY29uc3QgdmFsdWUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkucGF0aF0gPz8gJydcbiAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF1cblxuICBjb25zdCBoYW5kbGVVcGRhdGUgPSB1c2VDYWxsYmFjayhcbiAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5ld1ZhbHVlKVxuICAgIH0sXG4gICAgW29uQ2hhbmdlLCBwcm9wZXJ0eS5wYXRoXSxcbiAgKVxuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLihwcm9wZXJ0eS5wcm9wcyB8fCB7fSksXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXAgZXJyb3I9e0Jvb2xlYW4oZXJyb3IpfT5cbiAgICAgIDxMYWJlbCByZXF1aXJlZD17cHJvcGVydHkuaXNSZXF1aXJlZH0+e3Byb3BlcnR5LmxhYmVsfTwvTGFiZWw+XG4gICAgICA8VGlueU1DRSB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtoYW5kbGVVcGRhdGV9IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gICAgICA8Rm9ybU1lc3NhZ2U+e2Vycm9yPy5tZXNzYWdlfTwvRm9ybU1lc3NhZ2U+XG4gICAgPC9Gb3JtR3JvdXA+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSaWNodGV4dEVkaXQpXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZUxvY2F0aW9uLCB1c2VOYXZpZ2F0ZSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuZnVuY3Rpb24gYWRtaW5Sb290KHBhdGhuYW1lKSB7XG4gIGNvbnN0IGN1dCA9IHBhdGhuYW1lLnNlYXJjaCgvXFwvKHJlc291cmNlc3xwYWdlcykoXFwvfCQpLylcbiAgY29uc3Qgcm9vdCA9IGN1dCA9PT0gLTEgPyBwYXRobmFtZSA6IHBhdGhuYW1lLnNsaWNlKDAsIGN1dClcbiAgcmV0dXJuIHJvb3QucmVwbGFjZSgvXFwvJC8sICcnKSB8fCAnLydcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lkZWJhclJlc291cmNlU2VjdGlvbihwcm9wcykge1xuICBjb25zdCBPcmlnaW5hbCA9IHByb3BzLk9yaWdpbmFsQ29tcG9uZW50XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKVxuICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKClcbiAgY29uc3QgaHJlZiA9IGFkbWluUm9vdChsb2NhdGlvbi5wYXRobmFtZSlcbiAgY29uc3Qgc2VsZWN0ZWQgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8kLywgJycpID09PSBocmVmLnJlcGxhY2UoL1xcLyQvLCAnJykgfHwgbG9jYXRpb24ucGF0aG5hbWUgPT09IGAke2hyZWZ9L2BcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8YVxuICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1zaWRlYmFyLWRhc2hib2FyZCR7c2VsZWN0ZWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICBocmVmPXtocmVmfVxuICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgbmF2aWdhdGUoaHJlZilcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEljb24gaWNvbj1cIkhvbWVcIiAvPlxuICAgICAgICA8c3Bhbj5EYXNoYm9hcmQ8L3NwYW4+XG4gICAgICA8L2E+XG4gICAgICB7T3JpZ2luYWwgPyA8T3JpZ2luYWwgcmVzb3VyY2VzPXtwcm9wcy5yZXNvdXJjZXN9IC8+IDogbnVsbH1cbiAgICA8Lz5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTG9hZGVyLCBUYWJsZSwgVGFibGVCb2R5IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIE5vUmVjb3JkcyxcbiAgUmVjb3JkSW5MaXN0LFxuICBSZWNvcmRzVGFibGVIZWFkZXIsXG4gIFNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgZ2V0UmVzb3VyY2VFbGVtZW50Q3NzID0gKHJlc291cmNlSWQsIHN1ZmZpeCkgPT4gYCR7cmVzb3VyY2VJZH0tJHtzdWZmaXh9YFxuXG4vKipcbiAqIEFkbWluSlMgbWFya3MgdGhlIGhlYWRlciBjaGVja2JveCBjaGVja2VkIHdoZW4gQU5ZIHJvdyBpcyBzZWxlY3RlZC5cbiAqIE92ZXJyaWRlIHNvOiBub25lID0gdW5jaGVja2VkLCBzb21lID0gaW5kZXRlcm1pbmF0ZSwgYWxsID0gY2hlY2tlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVjb3Jkc1RhYmxlKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICByZXNvdXJjZSxcbiAgICByZWNvcmRzLFxuICAgIGFjdGlvblBlcmZvcm1lZCxcbiAgICBzb3J0QnksXG4gICAgZGlyZWN0aW9uLFxuICAgIGlzTG9hZGluZyxcbiAgICBvblNlbGVjdCxcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgb25TZWxlY3RBbGwsXG4gIH0gPSBwcm9wc1xuXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcbiAgICBpZiAoaXNMb2FkaW5nKSByZXR1cm4gPExvYWRlciAvPlxuICAgIHJldHVybiA8Tm9SZWNvcmRzIHJlc291cmNlPXtyZXNvdXJjZX0gLz5cbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ291bnQgPSBzZWxlY3RlZFJlY29yZHNcbiAgICA/IHJlY29yZHMuZmlsdGVyKChyZWNvcmQpID0+IHNlbGVjdGVkUmVjb3Jkcy5zb21lKChzZWxlY3RlZCkgPT4gc2VsZWN0ZWQuaWQgPT09IHJlY29yZC5pZCkpLmxlbmd0aFxuICAgIDogMFxuICBjb25zdCBzZWxlY3RlZEFsbCA9IHNlbGVjdGVkQ291bnQgPiAwICYmIHNlbGVjdGVkQ291bnQgPT09IHJlY29yZHMubGVuZ3RoXG4gIGNvbnN0IGluZGV0ZXJtaW5hdGUgPSBzZWxlY3RlZENvdW50ID4gMCAmJiBzZWxlY3RlZENvdW50IDwgcmVjb3Jkcy5sZW5ndGhcbiAgY29uc3QgcmVjb3Jkc0hhdmVCdWxrQWN0aW9uID0gISFyZWNvcmRzLmZpbmQoKHJlY29yZCkgPT4gcmVjb3JkLmJ1bGtBY3Rpb25zLmxlbmd0aClcblxuICBjb25zdCBjb250ZW50VGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHJlc291cmNlLmlkLCAndGFibGUnKVxuICBjb25zdCBzZWxlY3RlZFRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyhyZXNvdXJjZS5pZCwgJ3RhYmxlLXNlbGVjdGVkLXJlY29yZHMnKVxuICBjb25zdCBib2R5VGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHJlc291cmNlLmlkLCAndGFibGUtYm9keScpXG5cbiAgcmV0dXJuIChcbiAgICA8VGFibGUgZGF0YS1jc3M9e2NvbnRlbnRUYWd9PlxuICAgICAgPFNlbGVjdGVkUmVjb3Jkc1xuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHNlbGVjdGVkUmVjb3Jkcz17c2VsZWN0ZWRSZWNvcmRzfVxuICAgICAgICBkYXRhLWNzcz17c2VsZWN0ZWRUYWd9XG4gICAgICAvPlxuICAgICAgPFJlY29yZHNUYWJsZUhlYWRlclxuICAgICAgICBwcm9wZXJ0aWVzPXtyZXNvdXJjZS5saXN0UHJvcGVydGllc31cbiAgICAgICAgdGl0bGVQcm9wZXJ0eT17cmVzb3VyY2UudGl0bGVQcm9wZXJ0eX1cbiAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICBvblNlbGVjdEFsbD17cmVjb3Jkc0hhdmVCdWxrQWN0aW9uID8gb25TZWxlY3RBbGwgOiB1bmRlZmluZWR9XG4gICAgICAgIHNlbGVjdGVkQWxsPXtzZWxlY3RlZEFsbH1cbiAgICAgICAgaW5kZXRlcm1pbmF0ZT17aW5kZXRlcm1pbmF0ZX1cbiAgICAgIC8+XG4gICAgICA8VGFibGVCb2R5IGRhdGEtY3NzPXtib2R5VGFnfT5cbiAgICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IChcbiAgICAgICAgICA8UmVjb3JkSW5MaXN0XG4gICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgIGtleT17cmVjb3JkLmlkfVxuICAgICAgICAgICAgYWN0aW9uUGVyZm9ybWVkPXthY3Rpb25QZXJmb3JtZWR9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e1xuICAgICAgICAgICAgICBzZWxlY3RlZFJlY29yZHMgJiYgISFzZWxlY3RlZFJlY29yZHMuZmluZCgoc2VsZWN0ZWQpID0+IHNlbGVjdGVkLmlkID09PSByZWNvcmQuaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L1RhYmxlQm9keT5cbiAgICA8L1RhYmxlPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFRhYmxlQ2VsbCwgVGFibGVIZWFkLCBUYWJsZVJvdyB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBQcm9wZXJ0eUhlYWRlciB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGdldFJlc291cmNlRWxlbWVudENzcyA9IChyZXNvdXJjZUlkLCBzdWZmaXgpID0+IGAke3Jlc291cmNlSWR9LSR7c3VmZml4fWBcblxuY29uc3QgZGlzcGxheSA9IChpc1RpdGxlKSA9PiBbXG4gIGlzVGl0bGUgPyAndGFibGUtY2VsbCcgOiAnbm9uZScsXG4gIGlzVGl0bGUgPyAndGFibGUtY2VsbCcgOiAnbm9uZScsXG4gICd0YWJsZS1jZWxsJyxcbiAgJ3RhYmxlLWNlbGwnLFxuXVxuXG5mdW5jdGlvbiBTZWxlY3RBbGxDaGVja0JveCh7IGNoZWNrZWQsIGluZGV0ZXJtaW5hdGUsIG9uQ2hhbmdlIH0pIHtcbiAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWYobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LmluZGV0ZXJtaW5hdGUgPSBCb29sZWFuKGluZGV0ZXJtaW5hdGUpXG4gICAgfVxuICB9LCBbaW5kZXRlcm1pbmF0ZSwgY2hlY2tlZF0pXG5cbiAgcmV0dXJuIChcbiAgICA8bGFiZWxcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNlbGVjdC1hbGwke2luZGV0ZXJtaW5hdGUgPyAnIGlzLWluZGV0ZXJtaW5hdGUnIDogJyd9JHtjaGVja2VkID8gJyBpcy1jaGVja2VkJyA6ICcnfWB9XG4gICAgICBzdHlsZT17eyBtYXJnaW5MZWZ0OiA1IH19XG4gICAgPlxuICAgICAgPGlucHV0XG4gICAgICAgIHJlZj17aW5wdXRSZWZ9XG4gICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgIGNoZWNrZWQ9e0Jvb2xlYW4oY2hlY2tlZCl9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgYXJpYS1jaGVja2VkPXtpbmRldGVybWluYXRlID8gJ21peGVkJyA6IGNoZWNrZWQgPyAndHJ1ZScgOiAnZmFsc2UnfVxuICAgICAgLz5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXNlbGVjdC1hbGwtYm94XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtpbmRldGVybWluYXRlID8gKFxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzTmFtZT1cInRva3JpLXNlbGVjdC1hbGwtaWNvblwiPlxuICAgICAgICAgICAgPGxpbmUgeDE9XCI2XCIgeTE9XCIxMlwiIHgyPVwiMThcIiB5Mj1cIjEyXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgKSA6IGNoZWNrZWQgPyAoXG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgY2xhc3NOYW1lPVwidG9rcmktc2VsZWN0LWFsbC1pY29uXCI+XG4gICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlY29yZHNUYWJsZUhlYWRlcihwcm9wcykge1xuICBjb25zdCB7XG4gICAgdGl0bGVQcm9wZXJ0eSxcbiAgICBwcm9wZXJ0aWVzLFxuICAgIHNvcnRCeSxcbiAgICBkaXJlY3Rpb24sXG4gICAgb25TZWxlY3RBbGwsXG4gICAgc2VsZWN0ZWRBbGwsXG4gICAgaW5kZXRlcm1pbmF0ZSxcbiAgfSA9IHByb3BzXG5cbiAgY29uc3QgY29udGVudFRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyh0aXRsZVByb3BlcnR5LnJlc291cmNlSWQsICd0YWJsZS1oZWFkJylcbiAgY29uc3Qgcm93VGFnID0gYCR7dGl0bGVQcm9wZXJ0eS5yZXNvdXJjZUlkfS10YWJsZS1oZWFkLXJvd2BcbiAgY29uc3QgY2hlY2tib3hDc3MgPSBgJHt0aXRsZVByb3BlcnR5LnJlc291cmNlSWR9LWNoZWNrYm94LXRhYmxlLWNlbGxgXG5cbiAgcmV0dXJuIChcbiAgICA8VGFibGVIZWFkIGRhdGEtY3NzPXtjb250ZW50VGFnfT5cbiAgICAgIDxUYWJsZVJvdyBkYXRhLWNzcz17cm93VGFnfT5cbiAgICAgICAgPFRhYmxlQ2VsbCBkYXRhLWNzcz17Y2hlY2tib3hDc3N9PlxuICAgICAgICAgIHtvblNlbGVjdEFsbCA/IChcbiAgICAgICAgICAgIDxTZWxlY3RBbGxDaGVja0JveFxuICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25TZWxlY3RBbGwoKX1cbiAgICAgICAgICAgICAgY2hlY2tlZD17Qm9vbGVhbihzZWxlY3RlZEFsbCl9XG4gICAgICAgICAgICAgIGluZGV0ZXJtaW5hdGU9e0Jvb2xlYW4oaW5kZXRlcm1pbmF0ZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAge3Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgIDxQcm9wZXJ0eUhlYWRlclxuICAgICAgICAgICAgZGlzcGxheT17ZGlzcGxheShwcm9wZXJ0eS5pc1RpdGxlKX1cbiAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgdGl0bGVQcm9wZXJ0eT17dGl0bGVQcm9wZXJ0eX1cbiAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICAgIDxUYWJsZUNlbGwga2V5PVwiYWN0aW9uc1wiIHN0eWxlPXt7IHdpZHRoOiA4MCB9fSAvPlxuICAgICAgPC9UYWJsZVJvdz5cbiAgICA8L1RhYmxlSGVhZD5cbiAgKVxufVxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUHJvZHVjdEVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0RWRpdCA9IFByb2R1Y3RFZGl0XG5pbXBvcnQgQ2F0ZWdvcnlFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdGVnb3J5RWRpdCA9IENhdGVnb3J5RWRpdFxuaW1wb3J0IENtc0xpc3QgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNtc0xpc3QgPSBDbXNMaXN0XG5pbXBvcnQgUmV2aWV3RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmV2aWV3RWRpdCA9IFJldmlld0VkaXRcbmltcG9ydCBTZXR0aW5nc0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2V0dGluZ3NFZGl0ID0gU2V0dGluZ3NFZGl0XG5pbXBvcnQgQ291cG9uRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jb3Vwb24tZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ291cG9uRWRpdCA9IENvdXBvbkVkaXRcbmltcG9ydCBPcmRlckRldGFpbCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vcmRlci1kZXRhaWwnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyRGV0YWlsID0gT3JkZXJEZXRhaWxcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNoYW5nZVBhc3N3b3JkID0gQ2hhbmdlUGFzc3dvcmRcbmltcG9ydCBQYXJ0bmVyRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wYXJ0bmVyLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBhcnRuZXJFZGl0ID0gUGFydG5lckVkaXRcbmltcG9ydCBQaW5jb2RlRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9waW5jb2RlLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBpbmNvZGVFZGl0ID0gUGluY29kZUVkaXRcbmltcG9ydCBTdGF0dXNUb2dnbGUgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc3RhdHVzLXRvZ2dsZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU3RhdHVzVG9nZ2xlID0gU3RhdHVzVG9nZ2xlXG5pbXBvcnQgQ3VzdG9tZXJFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkN1c3RvbWVyRWRpdCA9IEN1c3RvbWVyRWRpdFxuaW1wb3J0IFRlYW1FZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3RlYW0tZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVGVhbUVkaXQgPSBUZWFtRWRpdFxuaW1wb3J0IE1lZGlhTGlicmFyeSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9tZWRpYS1saWJyYXJ5J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5NZWRpYUxpYnJhcnkgPSBNZWRpYUxpYnJhcnlcbmltcG9ydCBUYXhFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3RheC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5UYXhFZGl0ID0gVGF4RWRpdFxuaW1wb3J0IFJhem9ycGF5UGF5bWVudElkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Jhem9ycGF5LXBheW1lbnQtaWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJhem9ycGF5UGF5bWVudElkID0gUmF6b3JwYXlQYXltZW50SWRcbmltcG9ydCBPcmRlckxpc3RCYWRnZSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vcmRlci1saXN0LWJhZGdlcydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJMaXN0QmFkZ2UgPSBPcmRlckxpc3RCYWRnZVxuaW1wb3J0IExvZ2luIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgQWN0aW9uSGVhZGVyIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkFjdGlvbkhlYWRlciA9IEFjdGlvbkhlYWRlclxuaW1wb3J0IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yaWNodGV4dC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgPSBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHlcbmltcG9ydCBTaWRlYmFyUmVzb3VyY2VTZWN0aW9uIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3NpZGViYXItZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TaWRlYmFyUmVzb3VyY2VTZWN0aW9uID0gU2lkZWJhclJlc291cmNlU2VjdGlvblxuaW1wb3J0IFJlY29yZHNUYWJsZSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZWNvcmRzLXRhYmxlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWNvcmRzVGFibGUgPSBSZWNvcmRzVGFibGVcbmltcG9ydCBSZWNvcmRzVGFibGVIZWFkZXIgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmVjb3Jkcy10YWJsZS1oZWFkZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZHNUYWJsZUhlYWRlciA9IFJlY29yZHNUYWJsZUhlYWRlciJdLCJuYW1lcyI6WyJ1c2VBbmNob3JlZE1lbnUiLCJvcGVuIiwid3JhcFJlZiIsInVzZVJlZiIsIm9wZW5VcCIsInNldE9wZW5VcCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidW5kZWZpbmVkIiwidXBkYXRlIiwibm9kZSIsImN1cnJlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3BhY2VCZWxvdyIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiYm90dG9tIiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJTZWFyY2hhYmxlTXVsdGlTZWxlY3QiLCJvcHRpb25zIiwic2VsZWN0ZWQiLCJvbkNoYW5nZSIsInBsYWNlaG9sZGVyIiwic2VhcmNoUGxhY2Vob2xkZXIiLCJzZXRPcGVuIiwicXVlcnkiLCJzZXRRdWVyeSIsIm9uRG9jQ2xpY2siLCJldmVudCIsImNvbnRhaW5zIiwidGFyZ2V0IiwiZG9jdW1lbnQiLCJzZWxlY3RlZFNldCIsInVzZU1lbW8iLCJTZXQiLCJzZWxlY3RlZE9wdGlvbnMiLCJmaWx0ZXIiLCJpdGVtIiwiaGFzIiwidmFsdWUiLCJmaWx0ZXJlZCIsImxhYmVsIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInRyaW0iLCJ0b2dnbGUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyZWYiLCJ0eXBlIiwib25DbGljayIsImxlbmd0aCIsIm1hcCIsImtleSIsInJvbGUiLCJ0YWJJbmRleCIsInN0b3BQcm9wYWdhdGlvbiIsImF1dG9Gb2N1cyIsImNoZWNrZWQiLCJGbGFnQ2FyZCIsInRpdGxlIiwiaGludCIsImlzRmxhZ09uIiwiU3RhdHVzU3dpdGNoIiwiZGlzYWJsZWQiLCJjb21wYWN0Iiwib25MYWJlbCIsIm9mZkxhYmVsIiwicHJldmVudERlZmF1bHQiLCJTZWFyY2hhYmxlU2VsZWN0IiwiZmluZCIsImFjdGl2ZSIsIkxvY2FsU2VsZWN0IiwiU3RyaW5nIiwiYXBpIiwiQXBpQ2xpZW50IiwiUkFOR0VTIiwiV0lER0VUUyIsImluciIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiUmFuZ2VTZWxlY3QiLCJheGlzTWF4IiwicGFkZGVkIiwibWFnbml0dWRlIiwiTWF0aCIsImZsb29yIiwibG9nMTAiLCJub3JtYWxpemVkIiwibmljZSIsIkxpbmVDaGFydCIsInNlcmllcyIsImhvdmVyIiwic2V0SG92ZXIiLCJ3aWR0aCIsImhlaWdodCIsInBhZExlZnQiLCJwYWRSaWdodCIsInBhZFRvcCIsInBhZEJvdHRvbSIsIm1heCIsInBvaW50Iiwib3JkZXJWYWx1ZSIsInBsb3RXaWR0aCIsInBsb3RIZWlnaHQiLCJiYXNlbGluZSIsInlGb3IiLCJzdGVwIiwiY29vcmRzIiwiaW5kZXgiLCJ4IiwieSIsImxpbmUiLCJqb2luIiwiYXJlYSIsImxhYmVsRXZlcnkiLCJjZWlsIiwidGlja3MiLCJyYXRpbyIsInJvdW5kIiwib25Nb3VzZUxlYXZlIiwidmlld0JveCIsInRpY2siLCJ4MSIsIngyIiwieTEiLCJ5MiIsInRleHRBbmNob3IiLCJkIiwiZmlsbCIsIm9wYWNpdHkiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVqb2luIiwic3Ryb2tlTGluZWNhcCIsImRhdGUiLCJjeCIsImN5IiwiciIsIm9uTW91c2VFbnRlciIsInBvaW50ZXJFdmVudHMiLCJzdHlsZSIsImxlZnQiLCJQYWdlciIsInBhZ2UiLCJwYWdlU2l6ZSIsInRvdGFsIiwicGFnZXMiLCJudW1iZXJzIiwibnVtYmVyIiwicHVzaCIsIkRhc2hib2FyZCIsInJlcXVlc3RzIiwicmFuZ2VzIiwic2V0UmFuZ2VzIiwib3JkZXJzIiwiY3VzdG9tZXJzIiwicHJvZHVjdHMiLCJkYXRhIiwic2V0RGF0YSIsInNldFBhZ2VzIiwiYnVzeSIsInNldEJ1c3kiLCJsb2FkV2lkZ2V0Iiwid2lkZ2V0IiwicmFuZ2UiLCJ0aWNrZXQiLCJnZXREYXNoYm9hcmQiLCJwYXJhbXMiLCJ0aGVuIiwicmVzcG9uc2UiLCJmaW5hbGx5IiwiZm9yRWFjaCIsImNoYW5nZVJhbmdlIiwiY2hhbmdlUGFnZSIsIkJveCIsInZhcmlhbnQiLCJIMiIsIm1iIiwiSDUiLCJUZXh0Iiwib3JkZXJDb3VudCIsInJvd3MiLCJyb3ciLCJpZCIsIm9yZGVyTm8iLCJuYW1lIiwiYW1vdW50IiwicGxhY2VkQXQiLCJwaG9uZSIsImRhdGVPZkJpcnRoIiwicmVnaXN0ZXJlZEF0Iiwibm9ybWFsaXplU2x1Z0lucHV0IiwicmVwbGFjZSIsIndpdGhvdXRUcmFpbGluZ1NsYXNoIiwicGFyc2VTbHVncyIsInJhdyIsIkFycmF5IiwiaXNBcnJheSIsIkJvb2xlYW4iLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJzcGxpdCIsIlByb2R1Y3RFZGl0IiwicHJvcHMiLCJyZWNvcmQiLCJpbml0aWFsUmVjb3JkIiwicmVzb3VyY2UiLCJoYW5kbGVDaGFuZ2UiLCJzdWJtaXQiLCJoYW5kbGVTdWJtaXQiLCJsb2FkaW5nIiwidXNlUmVjb3JkIiwiYWRkTm90aWNlIiwidXNlTm90aWNlIiwiZmlsZVJlZiIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsInNsdWdFZGl0ZWQiLCJzZXRTbHVnRWRpdGVkIiwic2x1ZyIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwiY2F0ZWdvcmllcyIsInNldENhdGVnb3JpZXMiLCJjdXN0b20iLCJhcGlCYXNlVXJsIiwicHJvZHVjdFVybEJhc2UiLCJsb2NhdGlvbiIsIm9yaWdpbiIsInNsdWdJbnB1dCIsInByZXZpZXdTbHVnIiwicHJvZHVjdFVybCIsInNlbGVjdGVkQ2F0ZWdvcnlTbHVncyIsImNhdGVnb3J5SWRzIiwiaW1hZ2VVcmwiLCJpbWFnZSIsInRlc3QiLCJhcHBVcmwiLCJkaXNwbGF5ZWRJbWFnZVVybCIsInN0YXJ0c1dpdGgiLCJVUkwiLCJyZXZva2VPYmplY3RVUkwiLCJpZ25vcmUiLCJmZXRjaCIsImpzb24iLCJjYXRjaCIsInNldEZpZWxkIiwib25Qcm9wZXJ0eUNoYW5nZSIsInByb3BlcnR5UGF0aCIsInJlc3QiLCJzZXRTZWxlY3RlZENhdGVnb3JpZXMiLCJzbHVncyIsInN0cmluZ2lmeSIsInVwbG9hZEltYWdlIiwiZmlsZSIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImxvY2FsUHJldmlld1VybCIsImNyZWF0ZU9iamVjdFVSTCIsIm1ldGhvZCIsImJvZHkiLCJvayIsImVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwibWVkaWEiLCJwYXRoIiwibm90aWNlIiwiZGVzY3JpcHRpb25Qcm9wZXJ0eSIsImVkaXRQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJhcyIsIm9uU3VibWl0IiwiSDMiLCJjb2xvciIsInJlcXVpcmVkIiwibXQiLCJocmVmIiwicmVsIiwibWluIiwicHJpY2VWYWx1ZSIsIm9sZFByaWNlVmFsdWUiLCJ3ZWlnaHQiLCJiYWRnZSIsInN0b2NrIiwic29ydE9yZGVyIiwibWFyZ2luQm90dG9tIiwiaXNUYXhhYmxlIiwibmV4dCIsImdzdFJhdGUiLCJoc25Db2RlIiwic3JjIiwiYWx0IiwiYWNjZXB0IiwiaXNCZXN0U2VsbGVyIiwiaXNJbXBvcnRlZCIsImlzRmVhdHVyZWQiLCJpc0FjdGl2ZSIsIm1pbkhlaWdodCIsIkJhc2VQcm9wZXJ0eUNvbXBvbmVudCIsIndoZXJlIiwiQnV0dG9uIiwiSWNvbiIsImljb24iLCJzcGluIiwiQ2F0ZWdvcnlFZGl0IiwiYmFubmVyRmlsZVJlZiIsImJhbm5lclVwbG9hZGluZyIsInNldEJhbm5lclVwbG9hZGluZyIsImJhbm5lclByZXZpZXdVcmwiLCJzZXRCYW5uZXJQcmV2aWV3VXJsIiwiY2F0ZWdvcnlVcmxCYXNlIiwiY2F0ZWdvcnlVcmwiLCJiYW5uZXJJbWFnZVVybCIsImJhbm5lckltYWdlIiwiZGlzcGxheWVkQmFubmVyVXJsIiwidXBsb2FkVG8iLCJmaWVsZCIsInNldExvY2FsUHJldmlldyIsInN1Y2Nlc3NNZXNzYWdlIiwic3VidGl0bGUiLCJtYXJnaW5Ub3AiLCJkaXNwbGF5IiwiUEVSX1BBR0VfT1BUSU9OUyIsIkNtc0xpc3QiLCJzZXRUYWciLCJ0aXRsZVByb3AiLCJ0aXRsZVByb3BlcnR5Iiwic3RvcmVQYXJhbXMiLCJmaWx0ZXJzIiwicGFyc2VkUXVlcnkiLCJ1c2VRdWVyeVBhcmFtcyIsInJlY29yZHMiLCJkaXJlY3Rpb24iLCJzb3J0QnkiLCJmZXRjaERhdGEiLCJwZXJQYWdlIiwidXNlUmVjb3JkcyIsInNlbGVjdGVkUmVjb3JkcyIsImhhbmRsZVNlbGVjdCIsImhhbmRsZVNlbGVjdEFsbCIsInNldFNlbGVjdGVkUmVjb3JkcyIsInVzZVNlbGVjdGVkUmVjb3JkcyIsInEiLCJkZWJvdW5jZVJlZiIsInN0b3JlUGFyYW1zUmVmIiwidG9TdHJpbmciLCJoYW5kbGVRdWVyeUNoYW5nZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ0cmltbWVkIiwiaGFuZGxlQWN0aW9uUGVyZm9ybWVkIiwiY3VycmVudFBhZ2UiLCJyb3dzUGVyUGFnZSIsInRvdGFsUm93cyIsInRvdGFsUGFnZXMiLCJmcm9tIiwidG8iLCJnb1RvUGFnZSIsIm5leHRQYWdlIiwic2FmZSIsImNoYW5nZVBlclBhZ2UiLCJwYWdlTnVtYmVycyIsIndpbmRvd1NpemUiLCJzdGFydCIsImVuZCIsInBvc2l0aW9uIiwibWF4V2lkdGgiLCJ0cmFuc2Zvcm0iLCJJbnB1dCIsInBhZGRpbmdMZWZ0IiwiUmVjb3Jkc1RhYmxlIiwiYWN0aW9uUGVyZm9ybWVkIiwib25TZWxlY3QiLCJvblNlbGVjdEFsbCIsImlzTG9hZGluZyIsIm9wdGlvbiIsInJlc29sdmVJbWFnZVVybCIsIkZpZWxkRXJyb3IiLCJSZXZpZXdFZGl0IiwiYWN0aW9uIiwiaXNOZXciLCJlcnJvcnMiLCJyYXRpbmciLCJpc0FwcHJvdmVkIiwiY29udGVudCIsIlRBQlMiLCJmaWVsZHMiLCJJbWFnZVVwbG9hZGVyIiwib25VcGxvYWQiLCJ3aWRlIiwiZGlzcGxheWVkIiwiU2V0dGluZ3NFZGl0IiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwibW9iaWxlQmFubmVyRmlsZVJlZiIsImhpZ2hsaWdodEZpbGVSZWYiLCJiYW5uZXJQcmV2aWV3Iiwic2V0QmFubmVyUHJldmlldyIsIm1vYmlsZUJhbm5lclByZXZpZXciLCJzZXRNb2JpbGVCYW5uZXJQcmV2aWV3IiwiaGlnaGxpZ2h0UHJldmlldyIsInNldEhpZ2hsaWdodFByZXZpZXciLCJtb2JpbGVCYW5uZXJVcGxvYWRpbmciLCJzZXRNb2JpbGVCYW5uZXJVcGxvYWRpbmciLCJoaWdobGlnaHRVcGxvYWRpbmciLCJzZXRIaWdobGlnaHRVcGxvYWRpbmciLCJob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzIiwiaG9tZUJhbm5lckltYWdlIiwibW9iaWxlQmFubmVySW1hZ2VVcmwiLCJob21lTW9iaWxlQmFubmVySW1hZ2UiLCJoaWdobGlnaHRJbWFnZVVybCIsImhvbWVIaWdobGlnaHRJbWFnZSIsImhhc2giLCJzb21lIiwidGFiIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsInNldFByZXZpZXciLCJmbGV4IiwiZmxleERpcmVjdGlvbiIsIkRyYXdlckNvbnRlbnQiLCJwcm9wZXJ0aWVzIiwicCIsIkg0IiwibW9ybmluZ0RlbGl2ZXJ5VGl0bGUiLCJtb3JuaW5nRGVsaXZlcnlTdWJ0aXRsZSIsIm1vcm5pbmdTaGlwcGluZ0ZlZSIsIm1vcm5pbmdGcmVlQWJvdmUiLCJleHByZXNzRGVsaXZlcnlUaXRsZSIsImV4cHJlc3NEZWxpdmVyeVN1YnRpdGxlIiwiZXhwcmVzc1NoaXBwaW5nRmVlIiwiZXhwcmVzc0ZyZWVBYm92ZSIsImhhbmRsaW5nRmVlIiwiRHJhd2VyRm9vdGVyIiwicGFkIiwibnVtIiwicGFkU3RhcnQiLCJ0b0RhdGV0aW1lVmFsdWUiLCJEYXRlIiwiaXNOYU4iLCJnZXRUaW1lIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJmb3JtYXREYXRldGltZUxhYmVsIiwiZGF5IiwibW9udGgiLCJ5ZWFyIiwiaG91ciIsIm1pbnV0ZSIsIkNob2ljZUNhcmQiLCJBbmNob3JlZFNlbGVjdCIsIkRhdGVUaW1lUGlja2VyIiwidmFsaWQiLCJtb250aERhdGUiLCJzZXRNb250aERhdGUiLCJob3VycyIsInNldEhvdXJzIiwibWludXRlcyIsInNldE1pbnV0ZXMiLCJmaXJzdERheSIsImdldERheSIsInRvdGFsRGF5cyIsImNlbGxzIiwiaSIsImFwcGx5IiwibmV4dEhvdXJzIiwibmV4dE1pbnV0ZXMiLCJzZWxlY3RlZERheSIsIkNvdXBvbkVkaXQiLCJzZXRQcm9kdWN0cyIsInNlbGVjdGVkU2x1Z3MiLCJ0YXJnZXRTbHVncyIsInRhcmdldFR5cGUiLCJhcHBseU9uIiwidXNhZ2VUeXBlIiwiY291cG9uVHlwZSIsImxvYWRDYXRhbG9nIiwiY2F0ZWdvcnlEYXRhIiwiYWxsUHJvZHVjdHMiLCJoYXNNb3JlIiwicHJvZHVjdERhdGEiLCJzZXRTZWxlY3RlZFNsdWdzIiwicHJvZHVjdE9wdGlvbnMiLCJjYXRlZ29yeU9wdGlvbnMiLCJjb2RlIiwidG9VcHBlckNhc2UiLCJtaW5DYXJ0IiwibWF4RGlzY291bnQiLCJ1c2FnZUxpbWl0IiwidXNlZENvdW50Iiwic3RhcnRzQXQiLCJleHBpcmVzQXQiLCJGVUxGSUxMTUVOVCIsInBlbmRpbmciLCJ0b25lIiwicGFpZCIsInBhY2tlZCIsInNoaXBwZWQiLCJkZWxpdmVyZWQiLCJjYW5jZWxsZWQiLCJpc09ubGluZU9yZGVyIiwibW9kZSIsInBheW1lbnRNb2RlIiwicmF6b3JwYXlQYXltZW50SWQiLCJyYXpvcnBheU9yZGVySWQiLCJwYXltZW50QmFkZ2UiLCJvbmxpbmUiLCJzdGF0dXMiLCJwYXltZW50U3RhdHVzIiwiUGlsbCIsImdldEZ1bGZpbGxtZW50QmFkZ2UiLCJnZXRQYXltZW50QmFkZ2UiLCJGdWxmaWxsbWVudEJhZGdlIiwiUGF5bWVudEJhZGdlIiwiT3JkZXJMaXN0QmFkZ2UiLCJQQVlNRU5UX09QVElPTlMiLCJDb3B5SWQiLCJjb3BpZWQiLCJzZXRDb3BpZWQiLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJmb3JtYXRNb25leSIsImZvcm1hdERhdGVUaW1lIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwicmVzb2x2ZUltYWdlIiwiTW9yZU1lbnUiLCJ1bnBhaWQiLCJjYW5TeW5jUmF6b3JwYXkiLCJvbkNhc2giLCJvblFyIiwib25TeW5jUmF6b3JwYXkiLCJzbmFwc2hvdCIsImRlbGl2ZXJ5UGFydG5lcklkIiwiY29udGFjdE5hbWUiLCJjb250YWN0UGhvbmUiLCJhZGRyZXNzTGluZTEiLCJhZGRyZXNzTGluZTIiLCJhZGRyZXNzQ2l0eSIsImFkZHJlc3NTdGF0ZSIsImFkZHJlc3NQaW5jb2RlIiwiYWRkcmVzc0xhbmRtYXJrIiwiT3JkZXJEZXRhaWwiLCJzZXRSZWNvcmQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJhY3Rpb25CdXN5Iiwic2V0QWN0aW9uQnVzeSIsInBhcnRuZXJzIiwic2V0UGFydG5lcnMiLCJzZXRCYXNlbGluZSIsImVkaXRDb250YWN0Iiwic2V0RWRpdENvbnRhY3QiLCJlZGl0QWRkcmVzcyIsInNldEVkaXRBZGRyZXNzIiwicGF0aG5hbWUiLCJyZXNvdXJjZUFjdGlvbiIsInJlc291cmNlSWQiLCJhY3Rpb25OYW1lIiwiaXRlbXMiLCJpdGVtc0pzb24iLCJkaXJ0eSIsIk9iamVjdCIsImtleXMiLCJsaXN0VXJsIiwicmVjb3JkQWN0aW9uIiwicmVjb3JkSWQiLCJoYW5kbGVTYXZlIiwicGluIiwicnVuUGF5bWVudEFjdGlvbiIsImNvbmZpcm0iLCJmdWxmaWxsbWVudCIsInBheW1lbnQiLCJzdGF0dXNMYWJlbCIsInJlc3RvcmVGaWVsZHMiLCJjbG9zZSIsImFkZHJlc3NUZXh0IiwicGF5bWVudExhYmVsIiwicGFydG5lck5hbWUiLCJkZWxpdmVyeVBhcnRuZXJOYW1lIiwiZGVsaXZlcnlQYXJ0bmVyUGhvbmUiLCJpdGVtQ291bnQiLCJyZWR1Y2UiLCJzdW0iLCJxdWFudGl0eSIsImNyZWF0ZWRBdCIsImxpbmVUb3RhbCIsInBheW1lbnRNZXRob2QiLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlPcHRpb24iLCJmcmVlRGVsaXZlcnlBcHBsaWVkIiwiZGVsaXZlcnlDaGFyZ2UiLCJoYW5kbGluZ0NoYXJnZSIsInRheFRvdGFsIiwiaXNJbnRlclN0YXRlIiwic21hbGxDYXJ0Q2hhcmdlIiwiZGlzY291bnQiLCJjb3Vwb25Db2RlIiwiZ3JhbmRUb3RhbCIsInBheW1lbnRDb2xsZWN0ZWRBcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInJhem9ycGF5UXJVcmwiLCJpbnB1dE1vZGUiLCJFeWVJY29uIiwiaGlkZGVuIiwiUGFzc3dvcmRGaWVsZCIsInZpc2libGUiLCJvblRvZ2dsZSIsIkxhYmVsIiwiaHRtbEZvciIsImF1dG9Db21wbGV0ZSIsInBhZGRpbmdSaWdodCIsInJpZ2h0IiwiYm9yZGVyIiwiYmFja2dyb3VuZCIsImN1cnNvciIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmciLCJDaGFuZ2VQYXNzd29yZCIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJjb25maXJtUGFzc3dvcmQiLCJzZXRDb25maXJtUGFzc3dvcmQiLCJzaG93UGFzc3dvcmQiLCJzZXRTaG93UGFzc3dvcmQiLCJzaG93Q29uZmlybSIsInNldFNob3dDb25maXJtIiwic2V0RXJyb3IiLCJiYWNrIiwic2F2ZSIsInJlZGlyZWN0VXJsIiwiZXJyIiwiaW5zZXQiLCJ6SW5kZXgiLCJiZyIsImJvcmRlclJhZGl1cyIsImJveFNoYWRvdyIsImVtYWlsIiwiZ2FwIiwiSU5ESUFfU1RBVEVTIiwiVkVISUNMRV9UWVBFUyIsIlNUQVRFX09QVElPTlMiLCJQYXJ0bmVyRWRpdCIsInJlYWRPbmx5IiwiaGFzUGFzc3dvcmQiLCJtYXhMZW5ndGgiLCJzbGljZSIsImZhdGhlck5hbWUiLCJwYW5OdW1iZXIiLCJhYWRoYWFyTnVtYmVyIiwiY2l0eSIsInBpbmNvZGUiLCJzdGF0ZSIsInBlcm1hbmVudEFkZHJlc3MiLCJlbWVyZ2VuY3lOYW1lIiwiZW1lcmdlbmN5UGhvbmUiLCJ2ZWhpY2xlVHlwZSIsInZlaGljbGVOdW1iZXIiLCJhY2NvdW50SG9sZGVyTmFtZSIsImFjY291bnROdW1iZXIiLCJpZnNjQ29kZSIsIm5vdGVzIiwiUGluY29kZUVkaXQiLCJtb3JuaW5nRW5hYmxlZCIsImV4cHJlc3NFbmFibGVkIiwicGFydG5lcklkIiwicGFydG5lciIsIm1hcmdpbiIsImFyZWFMYWJlbCIsInN0YXRlQ29kZSIsIlN0YXR1c1RvZ2dsZSIsInNldENoZWNrZWQiLCJwZXJzaXN0Iiwic2F2ZWQiLCJkZXNjcmlwdGlvbiIsInRvRGF0ZUlucHV0IiwidGV4dCIsImZvcm1hdFdoZW4iLCJwYXJzZUFkZHJlc3NlcyIsImFkZHJlc3NlcyIsImdyb3VwZWQiLCJlbnRyaWVzIiwibWF0Y2giLCJzb3J0IiwiYSIsImIiLCJhZGRyZXNzTGluZXMiLCJhZGRyZXNzIiwibGluZTEiLCJsaW5lMiIsImxhbmRtYXJrIiwiQ3VzdG9tZXJFZGl0IiwiUk9MRVMiLCJQRVJNSVNTSU9OUyIsInNldFZpc2libGUiLCJUZWFtRWRpdCIsInBlcm1pc3Npb25PbiIsInVzZXJuYW1lIiwiRk9MREVSUyIsImZvcm1hdFNpemUiLCJieXRlcyIsInNpemUiLCJ0b0ZpeGVkIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwicmVzb2x2ZVVybCIsIk1lZGlhTGlicmFyeSIsImJ1c3lJZCIsInNldEJ1c3lJZCIsImZvbGRlciIsInVwbG9hZEZvbGRlciIsIm9yaWdpbmFsTmFtZSIsImZpbGVuYW1lIiwidXJsIiwic2V0Rm9sZGVyIiwidXBsb2FkRmlsZXMiLCJsaXN0IiwiY29weVBhdGgiLCJyZW1vdmUiLCJvbkRyYWdPdmVyIiwib25Ecm9wIiwiZGF0YVRyYW5zZmVyIiwibXVsdGlwbGUiLCJUYXhFZGl0IiwiaXNUYXhhYmxlQm9vbCIsImhhbmRsZVRheGFibGVUb2dnbGUiLCJwcm9kdWN0TmFtZSIsImNhdGVnb3J5TmFtZSIsImZvbnRTaXplIiwiY29weVRleHQiLCJQcm9taXNlIiwicmVqZWN0IiwiUmF6b3JwYXlQYXltZW50SWQiLCJwYXltZW50SWQiLCJoYW5kbGVDb3B5IiwiUkVNRU1CRVJFRF9MT0dJTl9LRVkiLCJMb2dpbiIsImVycm9yTWVzc2FnZSIsIl9fQVBQX1NUQVRFX18iLCJ0cmFuc2xhdGVNZXNzYWdlIiwidXNlVHJhbnNsYXRpb24iLCJhZG1pblJvb3QiLCJmb3Jnb3RQYXNzd29yZFVybCIsImlkZW50aWZpZXIiLCJzZXRJZGVudGlmaWVyIiwicmVtZW1iZXJMb2dpbiIsInNldFJlbWVtYmVyTG9naW4iLCJyZW1lbWJlcmVkTG9naW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZm9ybSIsImN1cnJlbnRUYXJnZXQiLCJlbWFpbElucHV0IiwiZWxlbWVudHMiLCJuYW1lZEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsIk1lc3NhZ2VCb3giLCJGb3JtR3JvdXAiLCJkZWZhdWx0VmFsdWUiLCJtYXJnaW5SaWdodCIsInRleHRBbGlnbiIsImZvbnRXZWlnaHQiLCJhZG1pblJvb3RQYXRoIiwiY2F0YWxvZ0NvbmZpZyIsImV4cG9ydFVybCIsImltcG9ydFVybCIsIkNhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyIsIm9uSW1wb3J0ZWQiLCJ0cmFuc2xhdGVCdXR0b24iLCJ0cmFuc2xhdGVBY3Rpb24iLCJ0b2dnbGVGaWx0ZXIiLCJmaWx0ZXJzQ291bnQiLCJ1c2VGaWx0ZXJEcmF3ZXIiLCJzZXRMb2FkaW5nIiwic2V0TWVzc2FnZSIsImNvbmZpZyIsInJvb3QiLCJoYW5kbGVJbXBvcnQiLCJjcmVkZW50aWFscyIsImVycm9yQ291bnQiLCJjcmVhdGVkIiwidXBkYXRlZCIsImJ1dHRvbnMiLCJjbGljayIsIm5ld0FjdGlvbiIsInJlc291cmNlQWN0aW9ucyIsImZpbHRlcktleSIsImNvdW50IiwiRnJhZ21lbnQiLCJmbGV4U2hyaW5rIiwicHgiLCJCdXR0b25Hcm91cCIsIm9uQ2xvc2VDbGljayIsIkNBVEFMT0dfUkVTT1VSQ0VTIiwiQWN0aW9uSGVhZGVyIiwiT3JpZ2luYWxDb21wb25lbnQiLCJCYXNlSGVhZGVyIiwiT3JpZ2luYWxBY3Rpb25IZWFkZXIiLCJpc0NhdGFsb2dMaXN0IiwiX2lnbm9yZWQiLCJoZWFkZXJQcm9wcyIsIl9leHRlbmRzIiwib21pdEFjdGlvbnMiLCJERUZBVUxUX09QVElPTlMiLCJwbHVnaW5zIiwidG9vbGJhciIsIlJpY2h0ZXh0RWRpdCIsImhhbmRsZVVwZGF0ZSIsInVzZUNhbGxiYWNrIiwibmV3VmFsdWUiLCJpc1JlcXVpcmVkIiwiVGlueU1DRSIsIkZvcm1NZXNzYWdlIiwibWVtbyIsImN1dCIsInNlYXJjaCIsIlNpZGViYXJSZXNvdXJjZVNlY3Rpb24iLCJPcmlnaW5hbCIsInVzZUxvY2F0aW9uIiwibmF2aWdhdGUiLCJ1c2VOYXZpZ2F0ZSIsInJlc291cmNlcyIsImdldFJlc291cmNlRWxlbWVudENzcyIsInN1ZmZpeCIsIkxvYWRlciIsIk5vUmVjb3JkcyIsInNlbGVjdGVkQ291bnQiLCJzZWxlY3RlZEFsbCIsImluZGV0ZXJtaW5hdGUiLCJyZWNvcmRzSGF2ZUJ1bGtBY3Rpb24iLCJidWxrQWN0aW9ucyIsImNvbnRlbnRUYWciLCJzZWxlY3RlZFRhZyIsImJvZHlUYWciLCJUYWJsZSIsIlNlbGVjdGVkUmVjb3JkcyIsIlJlY29yZHNUYWJsZUhlYWRlciIsImxpc3RQcm9wZXJ0aWVzIiwiVGFibGVCb2R5IiwiUmVjb3JkSW5MaXN0IiwiaXNTZWxlY3RlZCIsImlzVGl0bGUiLCJTZWxlY3RBbGxDaGVja0JveCIsImlucHV0UmVmIiwibWFyZ2luTGVmdCIsInBvaW50cyIsInJvd1RhZyIsImNoZWNrYm94Q3NzIiwiVGFibGVIZWFkIiwiVGFibGVSb3ciLCJUYWJsZUNlbGwiLCJQcm9wZXJ0eUhlYWRlciIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIkRlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVPLFNBQVNBLGlCQUFlQSxDQUFDQyxJQUFJLEVBQUU7RUFDcEMsRUFBQSxNQUFNQyxPQUFPLEdBQUdDLFlBQU0sQ0FBQyxJQUFJLENBQUM7SUFDNUIsTUFBTSxDQUFDQyxNQUFNLEVBQUVDLFNBQVMsQ0FBQyxHQUFHQyxjQUFRLENBQUMsS0FBSyxDQUFDO0VBRTNDQyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNkLElBQUEsSUFBSSxDQUFDTixJQUFJLEVBQUUsT0FBT08sU0FBUztNQUUzQixNQUFNQyxNQUFNLEdBQUdBLE1BQU07RUFDbkIsTUFBQSxNQUFNQyxJQUFJLEdBQUdSLE9BQU8sQ0FBQ1MsT0FBTztRQUM1QixJQUFJLENBQUNELElBQUksRUFBRTtFQUNYLE1BQUEsTUFBTUUsSUFBSSxHQUFHRixJQUFJLENBQUNHLHFCQUFxQixFQUFFO1FBQ3pDLE1BQU1DLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxX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
