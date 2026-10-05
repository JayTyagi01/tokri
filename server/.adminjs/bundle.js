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
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Subtotal"), /*#__PURE__*/React__default.default.createElement("dd", null, itemCount, " ", itemCount === 1 ? 'item' : 'items'), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.itemsTotal))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Delivery", params.deliveryOption ? ` · ${params.deliveryOption === 'express' ? '90-minute' : 'Morning'}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.deliveryCharge))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Handling"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.handlingCharge))), Number(params.smallCartCharge) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Small cart"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.smallCartCharge))) : null, Number(params.discount) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Discount", params.couponCode ? ` · ${params.couponCode}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, "-", formatMoney(params.discount))) : null, /*#__PURE__*/React__default.default.createElement("div", {
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
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;
  AdminJS.UserComponents.SidebarResourceSection = SidebarResourceSection;
  AdminJS.UserComponents.RecordsTable = RecordsTable;
  AdminJS.UserComponents.RecordsTableHeader = RecordsTableHeader;

})(React, AdminJS, AdminJSDesignSystem, ReactRouter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3JtLWNvbnRyb2xzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvaW5kaWEtc3RhdGVzLmpzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGVhbS1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL21lZGlhLWxpYnJhcnkuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZWNvcmRzLXRhYmxlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUtaGVhZGVyLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW29wZW5VcCwgc2V0T3BlblVwXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgc2V0T3BlblVwKHNwYWNlQmVsb3cgPCAyNDAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBvcGVuVXAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGbGFnQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsYWdPbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJ29uJyB8fCB2YWx1ZSA9PT0gMSB8fCB2YWx1ZSA9PT0gJzEnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGF0dXNTd2l0Y2goe1xuICBjaGVja2VkLFxuICBvbkNoYW5nZSxcbiAgZGlzYWJsZWQsXG4gIHRpdGxlLFxuICBoaW50LFxuICBjb21wYWN0ID0gZmFsc2UsXG4gIG9uTGFiZWwgPSAnQWN0aXZlJyxcbiAgb2ZmTGFiZWwgPSAnSW5hY3RpdmUnLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc3dpdGNoJHtjaGVja2VkID8gJyBpcy1vbicgOiAnJ30ke2NvbXBhY3QgPyAnIGlzLWNvbXBhY3QnIDogJyd9YH1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgIGFyaWEtcHJlc3NlZD17Y2hlY2tlZH1cbiAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGlmICghZGlzYWJsZWQpIG9uQ2hhbmdlKCFjaGVja2VkKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtdHJhY2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktc3dpdGNoLXRodW1iXCIgLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIHt0aXRsZSB8fCBoaW50ID8gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtY29weVwiPlxuICAgICAgICAgIHt0aXRsZSA/IDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPiA6IG51bGx9XG4gICAgICAgICAge2hpbnQgPyA8c3Bhbj57aGludH08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKSA6IChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktc3RhdHVzLXBpbGwke2NoZWNrZWQgPyAnIGlzLW9uJyA6ICcnfWB9PlxuICAgICAgICAgIHtjaGVja2VkID8gb25MYWJlbCA6IG9mZkxhYmVsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2hhYmxlU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIsIGRpc2FibGVkIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIlxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBpZiAoIWRpc2FibGVkKSBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudClcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtzZWxlY3RlZCA/ICcnIDogJ3Rva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyJ30+XG4gICAgICAgICAge3NlbGVjdGVkPy5sYWJlbCB8fCBwbGFjZWhvbGRlcn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBpdGVtLnZhbHVlID09PSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWUgfHwgJ2VtcHR5J31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHthY3RpdmUgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgc2V0UXVlcnkoJycpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExvY2FsU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBkaXNhYmxlZCB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBTdHJpbmcoaXRlbS52YWx1ZSkgPT09IFN0cmluZyh2YWx1ZSkpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1sb2NhbC1zZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbG9jYWwtc2VsZWN0LWNvbnRyb2xcIlxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBpZiAoIWRpc2FibGVkKSBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudClcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4+e3NlbGVjdGVkPy5sYWJlbCB8fCB2YWx1ZX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbG9jYWwtc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAge29wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7U3RyaW5nKGl0ZW0udmFsdWUpID09PSBTdHJpbmcodmFsdWUpID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgQm94LCBIMiwgSDUsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuY29uc3QgUkFOR0VTID0gW1xuICB7IHZhbHVlOiAnN2QnLCBsYWJlbDogJzcgZGF5cycgfSxcbiAgeyB2YWx1ZTogJ3RoaXNNb250aCcsIGxhYmVsOiAnVGhpcyBtb250aCcgfSxcbiAgeyB2YWx1ZTogJ2xhc3RNb250aCcsIGxhYmVsOiAnTGFzdCBtb250aCcgfSxcbiAgeyB2YWx1ZTogJzkwZCcsIGxhYmVsOiAnMyBtb250aHMnIH0sXG5dXG5jb25zdCBXSURHRVRTID0gWydvcmRlclZhbHVlJywgJ29yZGVycycsICdjdXN0b21lcnMnLCAncHJvZHVjdHMnXVxuXG5jb25zdCBpbnIgPSAodmFsdWUpID0+XG4gIGDigrkke051bWJlcih2YWx1ZSB8fCAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMCB9KX1gXG5cbmZ1bmN0aW9uIFJhbmdlU2VsZWN0KHsgdmFsdWUsIG9uQ2hhbmdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXJhbmdlLXNlbGVjdFwiPlxuICAgICAgPExvY2FsU2VsZWN0IHZhbHVlPXt2YWx1ZX0gb3B0aW9ucz17UkFOR0VTfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gYXhpc01heCh2YWx1ZSkge1xuICBpZiAodmFsdWUgPD0gMCkgcmV0dXJuIDEwMDBcbiAgY29uc3QgcGFkZGVkID0gdmFsdWUgKiAxLjFcbiAgY29uc3QgbWFnbml0dWRlID0gMTAgKiogTWF0aC5mbG9vcihNYXRoLmxvZzEwKHBhZGRlZCkpXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBwYWRkZWQgLyBtYWduaXR1ZGVcbiAgY29uc3QgbmljZSA9IG5vcm1hbGl6ZWQgPD0gMSA/IDEgOiBub3JtYWxpemVkIDw9IDIgPyAyIDogbm9ybWFsaXplZCA8PSA1ID8gNSA6IDEwXG4gIHJldHVybiBuaWNlICogbWFnbml0dWRlXG59XG5cbmZ1bmN0aW9uIExpbmVDaGFydCh7IHNlcmllcyB9KSB7XG4gIGNvbnN0IFtob3Zlciwgc2V0SG92ZXJdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3Qgd2lkdGggPSAxMjAwXG4gIGNvbnN0IGhlaWdodCA9IDMyMFxuICBjb25zdCBwYWRMZWZ0ID0gODZcbiAgY29uc3QgcGFkUmlnaHQgPSAxOFxuICBjb25zdCBwYWRUb3AgPSAxOFxuICBjb25zdCBwYWRCb3R0b20gPSAzNlxuICBjb25zdCBtYXggPSBheGlzTWF4KE1hdGgubWF4KC4uLnNlcmllcy5tYXAoKHBvaW50KSA9PiBwb2ludC5vcmRlclZhbHVlKSwgMCkpXG4gIGNvbnN0IHBsb3RXaWR0aCA9IHdpZHRoIC0gcGFkTGVmdCAtIHBhZFJpZ2h0XG4gIGNvbnN0IHBsb3RIZWlnaHQgPSBoZWlnaHQgLSBwYWRUb3AgLSBwYWRCb3R0b21cbiAgY29uc3QgYmFzZWxpbmUgPSBwYWRUb3AgKyBwbG90SGVpZ2h0XG4gIGNvbnN0IHlGb3IgPSAodmFsdWUpID0+IGJhc2VsaW5lIC0gKHZhbHVlIC8gbWF4KSAqIHBsb3RIZWlnaHRcbiAgY29uc3Qgc3RlcCA9IHNlcmllcy5sZW5ndGggPiAxID8gcGxvdFdpZHRoIC8gKHNlcmllcy5sZW5ndGggLSAxKSA6IHBsb3RXaWR0aFxuICBjb25zdCBjb29yZHMgPSBzZXJpZXMubWFwKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB4ID0gc2VyaWVzLmxlbmd0aCA9PT0gMSA/IHBhZExlZnQgKyBwbG90V2lkdGggLyAyIDogcGFkTGVmdCArIGluZGV4ICogc3RlcFxuICAgIHJldHVybiB7IHgsIHk6IHlGb3IocG9pbnQub3JkZXJWYWx1ZSksIHBvaW50IH1cbiAgfSlcbiAgY29uc3QgbGluZSA9IGNvb3Jkcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiBgJHtpbmRleCA/ICdMJyA6ICdNJ30ke2l0ZW0ueH0sJHtpdGVtLnl9YCkuam9pbignICcpXG4gIGNvbnN0IGFyZWEgPSBjb29yZHMubGVuZ3RoXG4gICAgPyBgJHtsaW5lfSBMJHtjb29yZHNbY29vcmRzLmxlbmd0aCAtIDFdLnh9LCR7YmFzZWxpbmV9IEwke2Nvb3Jkc1swXS54fSwke2Jhc2VsaW5lfSBaYFxuICAgIDogJydcbiAgY29uc3QgbGFiZWxFdmVyeSA9IHNlcmllcy5sZW5ndGggPiAyMCA/IE1hdGguY2VpbChzZXJpZXMubGVuZ3RoIC8gOCkgOiBzZXJpZXMubGVuZ3RoID4gMTAgPyA0IDogMVxuICBjb25zdCB0aWNrcyA9IFswLCAwLjI1LCAwLjUsIDAuNzUsIDFdLm1hcCgocmF0aW8pID0+ICh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQobWF4ICogcmF0aW8pLFxuICAgIHk6IHlGb3IobWF4ICogcmF0aW8pLFxuICB9KSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtcGxvdFwiIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXIobnVsbCl9PlxuICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWB9IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0XCIgcm9sZT1cImltZ1wiPlxuICAgICAgICB7dGlja3MubWFwKCh0aWNrKSA9PiAoXG4gICAgICAgICAgPGcga2V5PXt0aWNrLnZhbHVlfT5cbiAgICAgICAgICAgIDxsaW5lIHgxPXtwYWRMZWZ0fSB4Mj17d2lkdGggLSBwYWRSaWdodH0geTE9e3RpY2sueX0geTI9e3RpY2sueX0gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtZ3JpZGxpbmVcIiAvPlxuICAgICAgICAgICAgPHRleHQgeD17cGFkTGVmdCAtIDEwfSB5PXt0aWNrLnkgKyA0fSB0ZXh0QW5jaG9yPVwiZW5kXCIgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtYXhpc1wiPlxuICAgICAgICAgICAgICB7aW5yKHRpY2sudmFsdWUpfVxuICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKSl9XG4gICAgICAgIDxwYXRoIGQ9e2FyZWF9IGZpbGw9XCIjMDQ3ODU3XCIgb3BhY2l0eT1cIjAuMTZcIiAvPlxuICAgICAgICA8cGF0aCBkPXtsaW5lfSBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjNcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICAgICAge2Nvb3Jkcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICA8ZyBrZXk9e2l0ZW0ucG9pbnQuZGF0ZX0+XG4gICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgIGN4PXtpdGVtLnh9XG4gICAgICAgICAgICAgIGN5PXtpdGVtLnl9XG4gICAgICAgICAgICAgIHI9XCIxNFwiXG4gICAgICAgICAgICAgIGZpbGw9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXIoaXRlbSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGNpcmNsZSBjeD17aXRlbS54fSBjeT17aXRlbS55fSByPVwiNC41XCIgZmlsbD1cIiNmZmZcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIyXCIgcG9pbnRlckV2ZW50cz1cIm5vbmVcIiAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKSl9XG4gICAgICAgIHtjb29yZHMubWFwKChpdGVtLCBpbmRleCkgPT5cbiAgICAgICAgICBpbmRleCAlIGxhYmVsRXZlcnkgPT09IDAgPyAoXG4gICAgICAgICAgICA8dGV4dCBrZXk9e2Ake2l0ZW0ucG9pbnQuZGF0ZX0tbGFiZWxgfSB4PXtpdGVtLnh9IHk9e2hlaWdodCAtIDh9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1sYWJlbFwiPlxuICAgICAgICAgICAgICB7aXRlbS5wb2ludC5sYWJlbH1cbiAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICApIDogbnVsbCxcbiAgICAgICAgKX1cbiAgICAgIDwvc3ZnPlxuICAgICAge2hvdmVyID8gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktY2hhcnQtdGlwJHtob3Zlci55IDwgOTAgPyAnIGlzLWJlbG93JyA6ICcnfWB9XG4gICAgICAgICAgc3R5bGU9e3sgbGVmdDogYCR7KGhvdmVyLnggLyB3aWR0aCkgKiAxMDB9JWAsIHRvcDogYCR7KGhvdmVyLnkgLyBoZWlnaHQpICogMTAwfSVgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj57aG92ZXIucG9pbnQubGFiZWx9PC9zcGFuPlxuICAgICAgICAgIDxzdHJvbmc+e2lucihob3Zlci5wb2ludC5vcmRlclZhbHVlKX08L3N0cm9uZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBQYWdlcih7IHBhZ2UsIHBhZ2VTaXplLCB0b3RhbCwgb25DaGFuZ2UgfSkge1xuICBjb25zdCBwYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbCgodG90YWwgfHwgMCkgLyBwYWdlU2l6ZSkpXG4gIGlmIChwYWdlcyA8PSAxKSByZXR1cm4gbnVsbFxuICBjb25zdCBudW1iZXJzID0gW11cbiAgZm9yIChsZXQgbnVtYmVyID0gMTsgbnVtYmVyIDw9IHBhZ2VzOyBudW1iZXIgKz0gMSkgbnVtYmVycy5wdXNoKG51bWJlcilcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1wYWdlc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tcGFnZXNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e3BhZ2UgPD0gMX0gb25DbGljaz17KCkgPT4gb25DaGFuZ2UocGFnZSAtIDEpfT5cbiAgICAgICAgICBQcmV2XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICB7bnVtYmVycy5tYXAoKG51bWJlcikgPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAga2V5PXtudW1iZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9e251bWJlciA9PT0gcGFnZSA/ICdpcy1jdXJyZW50JyA6ICcnfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DaGFuZ2UobnVtYmVyKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bnVtYmVyfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e3BhZ2UgPj0gcGFnZXN9IG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHBhZ2UgKyAxKX0+XG4gICAgICAgICAgTmV4dFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgcmVxdWVzdHMgPSB1c2VSZWYoe30pXG4gIGNvbnN0IFtyYW5nZXMsIHNldFJhbmdlc10gPSB1c2VTdGF0ZSh7XG4gICAgb3JkZXJWYWx1ZTogJzdkJyxcbiAgICBvcmRlcnM6ICc3ZCcsXG4gICAgY3VzdG9tZXJzOiAnN2QnLFxuICAgIHByb2R1Y3RzOiAnN2QnLFxuICB9KVxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7fSlcbiAgY29uc3QgW3BhZ2VzLCBzZXRQYWdlc10gPSB1c2VTdGF0ZSh7IG9yZGVyczogMSwgY3VzdG9tZXJzOiAxIH0pXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKHtcbiAgICBvcmRlclZhbHVlOiB0cnVlLFxuICAgIG9yZGVyczogdHJ1ZSxcbiAgICBjdXN0b21lcnM6IHRydWUsXG4gICAgcHJvZHVjdHM6IHRydWUsXG4gIH0pXG5cbiAgY29uc3QgbG9hZFdpZGdldCA9ICh3aWRnZXQsIHJhbmdlLCBwYWdlID0gMSkgPT4ge1xuICAgIGNvbnN0IHRpY2tldCA9IChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gfHwgMCkgKyAxXG4gICAgcmVxdWVzdHMuY3VycmVudFt3aWRnZXRdID0gdGlja2V0XG4gICAgc2V0QnVzeSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IHRydWUgfSkpXG4gICAgYXBpXG4gICAgICAuZ2V0RGFzaGJvYXJkKHsgcGFyYW1zOiB7IHdpZGdldCwgcmFuZ2UsIHBhZ2UgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gIT09IHRpY2tldCkgcmV0dXJuXG4gICAgICAgIHNldERhdGEoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIC4uLnJlc3BvbnNlLmRhdGEgfSkpXG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdHMuY3VycmVudFt3aWRnZXRdICE9PSB0aWNrZXQpIHJldHVyblxuICAgICAgICBzZXRCdXN5KChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogZmFsc2UgfSkpXG4gICAgICB9KVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBXSURHRVRTLmZvckVhY2goKHdpZGdldCkgPT4gbG9hZFdpZGdldCh3aWRnZXQsICc3ZCcpKVxuICB9LCBbXSlcblxuICBjb25zdCBjaGFuZ2VSYW5nZSA9ICh3aWRnZXQsIHJhbmdlKSA9PiB7XG4gICAgc2V0UmFuZ2VzKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogcmFuZ2UgfSkpXG4gICAgaWYgKHdpZGdldCA9PT0gJ29yZGVycycgfHwgd2lkZ2V0ID09PSAnY3VzdG9tZXJzJykge1xuICAgICAgc2V0UGFnZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiAxIH0pKVxuICAgIH1cbiAgICBsb2FkV2lkZ2V0KHdpZGdldCwgcmFuZ2UsIDEpXG4gIH1cblxuICBjb25zdCBjaGFuZ2VQYWdlID0gKHdpZGdldCwgcGFnZSkgPT4ge1xuICAgIHNldFBhZ2VzKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogcGFnZSB9KSlcbiAgICBsb2FkV2lkZ2V0KHdpZGdldCwgcmFuZ2VzW3dpZGdldF0sIHBhZ2UpXG4gIH1cblxuICBjb25zdCBvcmRlclZhbHVlID0gZGF0YS5vcmRlclZhbHVlXG4gIGNvbnN0IG9yZGVycyA9IGRhdGEub3JkZXJzXG4gIGNvbnN0IGN1c3RvbWVycyA9IGRhdGEuY3VzdG9tZXJzXG4gIGNvbnN0IHByb2R1Y3RzID0gZGF0YS5wcm9kdWN0c1xuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwidHJhbnNwYXJlbnRcIiBjbGFzc05hbWU9XCJ0b2tyaS1hbmFseXRpY3NcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktYW5hbHl0aWNzLWhlYWRcIj5cbiAgICAgICAgPEgyIG1iPVwic21cIj5EYXNoYm9hcmQ8L0gyPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmQgdG9rcmktY2hhcnQtY2FyZC13aWRlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEg1IG1iPVwic21cIj5PcmRlciBWYWx1ZTwvSDU+XG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICB7YnVzeS5vcmRlclZhbHVlICYmICFvcmRlclZhbHVlXG4gICAgICAgICAgICAgICAgPyAnTG9hZGluZ+KApidcbiAgICAgICAgICAgICAgICA6IGAke2lucihvcmRlclZhbHVlPy50b3RhbCl9IGZyb20gJHtvcmRlclZhbHVlPy5vcmRlckNvdW50IHx8IDB9IG9yZGVyc2B9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMub3JkZXJWYWx1ZX0gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ29yZGVyVmFsdWUnLCB2YWx1ZSl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7b3JkZXJWYWx1ZT8uc2VyaWVzPy5sZW5ndGggPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1mcmFtZVwiPlxuICAgICAgICAgICAgPExpbmVDaGFydCBzZXJpZXM9e29yZGVyVmFsdWUuc2VyaWVzfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1zcGxpdFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5PcmRlciBBbW91bnQ8L0g1PlxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICAgIHtidXN5Lm9yZGVycyAmJiAhb3JkZXJzID8gJ0xvYWRpbmfigKYnIDogYCR7b3JkZXJzPy50b3RhbCB8fCAwfSBvcmRlcnNgfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLm9yZGVyc30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ29yZGVycycsIHZhbHVlKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7b3JkZXJzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5PcmRlciBudW1iZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5BbW91bnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+UGxhY2VkPC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICB7b3JkZXJzLnJvd3MubWFwKChyb3cpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17cm93LmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5vcmRlck5vfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aW5yKHJvdy5hbW91bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cucGxhY2VkQXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT57YnVzeS5vcmRlcnMgPyAnTG9hZGluZ+KApicgOiAnTm8gb3JkZXJzIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFBhZ2VyXG4gICAgICAgICAgICBwYWdlPXtvcmRlcnM/LnBhZ2UgfHwgcGFnZXMub3JkZXJzfVxuICAgICAgICAgICAgcGFnZVNpemU9e29yZGVycz8ucGFnZVNpemUgfHwgMTB9XG4gICAgICAgICAgICB0b3RhbD17b3JkZXJzPy50b3RhbCB8fCAwfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhwYWdlKSA9PiBjaGFuZ2VQYWdlKCdvcmRlcnMnLCBwYWdlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxINSBtYj1cInNtXCI+TmV3IEN1c3RvbWVyczwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kuY3VzdG9tZXJzICYmICFjdXN0b21lcnMgPyAnTG9hZGluZ+KApicgOiBgJHtjdXN0b21lcnM/LnRvdGFsIHx8IDB9IHBlb3BsZSByZWdpc3RlcmVkYH1cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5jdXN0b21lcnN9IG9uQ2hhbmdlPXsodmFsdWUpID0+IGNoYW5nZVJhbmdlKCdjdXN0b21lcnMnLCB2YWx1ZSl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2N1c3RvbWVycz8ucm93cz8ubGVuZ3RoID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS10YWJsZS13cmFwXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0b2tyaS1kYXRhLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5QaG9uZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5EYXRlIG9mIGJpcnRoPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtjdXN0b21lcnMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+KzkxIHtyb3cucGhvbmV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5kYXRlT2ZCaXJ0aH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93LnJlZ2lzdGVyZWRBdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PntidXN5LmN1c3RvbWVycyA/ICdMb2FkaW5n4oCmJyA6ICdObyBuZXcgY3VzdG9tZXJzIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFBhZ2VyXG4gICAgICAgICAgICBwYWdlPXtjdXN0b21lcnM/LnBhZ2UgfHwgcGFnZXMuY3VzdG9tZXJzfVxuICAgICAgICAgICAgcGFnZVNpemU9e2N1c3RvbWVycz8ucGFnZVNpemUgfHwgMTB9XG4gICAgICAgICAgICB0b3RhbD17Y3VzdG9tZXJzPy50b3RhbCB8fCAwfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhwYWdlKSA9PiBjaGFuZ2VQYWdlKCdjdXN0b21lcnMnLCBwYWdlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1zcGxpdFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5CZXN0IFNlbGxpbmcgUHJvZHVjdHM8L0g1PlxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICAgIHtidXN5LnByb2R1Y3RzICYmICFwcm9kdWN0cyA/ICdMb2FkaW5n4oCmJyA6ICdUb3AgNSBieSBudW1iZXIgb2Ygb3JkZXJzJ31cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5wcm9kdWN0c30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ3Byb2R1Y3RzJywgdmFsdWUpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtwcm9kdWN0cz8ucm93cz8ubGVuZ3RoID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS10YWJsZS13cmFwXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0b2tyaS1kYXRhLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+UHJvZHVjdDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5PcmRlcnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+QW1vdW50PC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICB7cHJvZHVjdHMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm9yZGVyc308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aW5yKHJvdy5hbW91bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+e2J1c3kucHJvZHVjdHMgPyAnTG9hZGluZ+KApicgOiAnTm8gcHJvZHVjdHMgc29sZCBpbiB0aGlzIHBlcmlvZC4nfTwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuY29uc3QgUHJvZHVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgcHJvZHVjdFVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20ucHJvZHVjdFVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcHJvZHVjdGAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLm5hbWUpXG4gIGNvbnN0IHByb2R1Y3RVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke3Byb2R1Y3RVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmNhdGVnb3J5SWRzKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZXRTZWxlY3RlZENhdGVnb3JpZXMgPSAoc2x1Z3MpID0+IHNldEZpZWxkKCdjYXRlZ29yeUlkcycsIEpTT04uc3RyaW5naWZ5KHNsdWdzKSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncHJvZHVjdHMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ21lZGlhSWQnLCBtZWRpYS5pZClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdQcm9kdWN0IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRpb25Qcm9wZXJ0eSA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbmQoXG4gICAgKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS5wcm9wZXJ0eVBhdGggPT09ICdkZXNjcmlwdGlvbicsXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ05ldyBwcm9kdWN0J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+QWRkIHBob3RvcywgcHJpY2VzLCBhbmQgb25lIG9yIG1vcmUgY2F0ZWdvcmllcyBmb3IgdGhlIHdlYnNpdGUgYW5kIGFwcC48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9kdWN0IGRldGFpbHM8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFscGhvbnNvIE1hbmdvXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtwcm9kdWN0VXJsID8gKFxuICAgICAgICAgICAgICA8YSBocmVmPXtwcm9kdWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge3Byb2R1Y3RVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBwcm9kdWN0IG5hbWUgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBQcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPbGQgcHJpY2UgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5vbGRQcmljZVZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdvbGRQcmljZVZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9wdGlvbmFsXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFdlaWdodFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMud2VpZ2h0IHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd3ZWlnaHQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMSBrZ1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBCYWRnZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYmFkZ2UgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2JhZGdlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNoXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0b2NrXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdG9jayA/PyAxMDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N0b2NrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2R1Y3QgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Byb2R1Y3QgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSBzcXVhcmUgcHJvZHVjdCBwaG90bzwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yaWVzPC9oND5cbiAgICAgICAgPHA+QSBwcm9kdWN0IGNhbiBhcHBlYXIgaW4gbW9yZSB0aGFuIG9uZSBjYXRlZ29yeSBvbiB0aGUgd2Vic2l0ZSBhbmQgYXBwLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFNlbGVjdCBjYXRlZ29yaWVzXG4gICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKX1cbiAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENhdGVnb3J5U2x1Z3N9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRDYXRlZ29yaWVzfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggYW5kIHNlbGVjdCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5TdG9yZSBwbGFjZW1lbnQ8L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiQmVzdHNlbGxlclwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBiZXN0c2VsbGVyc1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNCZXN0U2VsbGVyJywgIShwYXJhbXMuaXNCZXN0U2VsbGVyID09PSB0cnVlIHx8IHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzSW1wb3J0ZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzSW1wb3J0ZWQgPT09ICd0cnVlJ31cbiAgICAgICAgICAgIHRpdGxlPVwiSW1wb3J0ZWRcIlxuICAgICAgICAgICAgaGludD1cIlNob3cgaW4gaW1wb3J0ZWQgZnJ1aXRzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0ltcG9ydGVkJywgIShwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNGZWF0dXJlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNGZWF0dXJlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJGZWF0dXJlZFwiXG4gICAgICAgICAgICBoaW50PVwiSGlnaGxpZ2h0IHRoaXMgZnJ1aXRcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzRmVhdHVyZWQnLCAhKHBhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnfVxuICAgICAgICAgICAgdGl0bGU9XCJBY3RpdmVcIlxuICAgICAgICAgICAgaGludD1cIlZpc2libGUgdG8gY3VzdG9tZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBwcm9kdWN0XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgbm9ybWFsaXplU2x1Z0lucHV0ID0gKHZhbHVlKSA9PlxuICBTdHJpbmcodmFsdWUgfHwgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1snXCJdL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXmEtejAtOV0rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJylcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuY29uc3QgQ2F0ZWdvcnlFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgYmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NsdWdFZGl0ZWQsIHNldFNsdWdFZGl0ZWRdID0gdXNlU3RhdGUoQm9vbGVhbihpbml0aWFsUmVjb3JkPy5wYXJhbXM/LnNsdWcpKVxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2Jhbm5lclByZXZpZXdVcmwsIHNldEJhbm5lclByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgY3VzdG9tID0gcmVzb3VyY2U/Lm9wdGlvbnM/LmN1c3RvbSB8fCB7fVxuICBjb25zdCBhcGlCYXNlVXJsID0gd2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwaUJhc2VVcmwgfHwgJy9hcGkvdjEnKVxuICBjb25zdCBjYXRlZ29yeVVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20uY2F0ZWdvcnlVcmxCYXNlIHx8IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2NhdGVnb3J5YCxcbiAgKVxuICBjb25zdCBzbHVnSW5wdXQgPSBwYXJhbXMuc2x1ZyA/PyAnJ1xuICBjb25zdCBwcmV2aWV3U2x1ZyA9IG5vcm1hbGl6ZVNsdWdJbnB1dChzbHVnSW5wdXQpIHx8IG5vcm1hbGl6ZVNsdWdJbnB1dChwYXJhbXMubGFiZWwpXG4gIGNvbnN0IGNhdGVnb3J5VXJsID0gcHJldmlld1NsdWcgPyBgJHtjYXRlZ29yeVVybEJhc2V9LyR7cHJldmlld1NsdWd9YCA6IG51bGxcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmltYWdlKSkgcmV0dXJuIHBhcmFtcy5pbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5pbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYW5uZXJJbWFnZSkgcmV0dXJuICcnXG4gICAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhcmFtcy5iYW5uZXJJbWFnZSkpIHJldHVybiBwYXJhbXMuYmFubmVySW1hZ2VcbiAgICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhcmFtcy5iYW5uZXJJbWFnZX1gXG4gIH0sIFtjdXN0b20uYXBwVXJsLCBwYXJhbXMuYmFubmVySW1hZ2VdKVxuXG4gIGNvbnN0IGRpc3BsYXllZEJhbm5lclVybCA9IGJhbm5lclByZXZpZXdVcmwgfHwgYmFubmVySW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChiYW5uZXJQcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGJhbm5lclByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbYmFubmVyUHJldmlld1VybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICdsYWJlbCcgJiYgIXNsdWdFZGl0ZWQpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnc2x1ZycsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSkpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdXBsb2FkVG8gPSBhc3luYyAoZmlsZSwgZmllbGQsIHNldExvY2FsUHJldmlldywgc2V0QnVzeSwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAnY2F0ZWdvcmllcycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBzZXRMb2NhbFByZXZpZXcoVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgICBzZXRCdXN5KHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgb25Qcm9wZXJ0eUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldExvY2FsUHJldmlldyhcbiAgICAgICAgL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QobWVkaWEucGF0aClcbiAgICAgICAgICA/IG1lZGlhLnBhdGhcbiAgICAgICAgICA6IGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHttZWRpYS5wYXRofWAsXG4gICAgICApXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDYXRlZ29yeSBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjYXRlZ29yeScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gIH1cblxuICBjb25zdCBkZXNjcmlwdGlvblByb3BlcnR5ID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmluZChcbiAgICAocHJvcGVydHkpID0+IHByb3BlcnR5LnByb3BlcnR5UGF0aCA9PT0gJ2Rlc2NyaXB0aW9uJyxcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubGFiZWwgfHwgJ05ldyBjYXRlZ29yeSd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHNob3Agc2VjdGlvbiB3aXRoIGEgdGh1bWJuYWlsLCBiYW5uZXIsIGFuZCBwYWdlIGNvcHkuPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTGFiZWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdsYWJlbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2ggRnJ1aXRzXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQYWdlIGhlYWRpbmdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNhbWUgYXMgbGFiZWwgaWYgZW1wdHlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN1YnRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdWJ0aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaG9ydCBsaW5lIHVuZGVyIHRoZSBoZWFkaW5nXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBsYWJlbFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICBQcmV2aWV3OnsnICd9XG4gICAgICAgICAgICB7Y2F0ZWdvcnlVcmwgPyAoXG4gICAgICAgICAgICAgIDxhIGhyZWY9e2NhdGVnb3J5VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge2NhdGVnb3J5VXJsfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAnR2VuZXJhdGVkIGZyb20gY2F0ZWdvcnkgbGFiZWwgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBTb3J0IG9yZGVyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zb3J0T3JkZXIgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc29ydE9yZGVyJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gd2Vic2l0ZSBhbmQgYXBwXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKCdpc0FjdGl2ZScsICEocGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZScpKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNhdGVnb3J5IGltYWdlPC9oND5cbiAgICAgICAgICA8cD5TcXVhcmUgdGh1bWJuYWlsIHVzZWQgaW4gdGhlIGhvbWUgY2F0ZWdvcnkgZ3JpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubGFiZWwgfHwgJ0NhdGVnb3J5IHByZXZpZXcnfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGNhdGVnb3J5IGltYWdlPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkVG8oZmlsZSwgJ2ltYWdlJywgc2V0UHJldmlld1VybCwgc2V0VXBsb2FkaW5nLCAnSW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DYXRlZ29yeSBiYW5uZXI8L2g0PlxuICAgICAgICA8cD5XaWRlIGltYWdlIHNob3duIGF0IHRoZSB0b3Agb2YgdGhlIGNhdGVnb3J5IHBhZ2UuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3AgdG9rcmktdXBsb2FkLWRyb3Atd2lkZVwiPlxuICAgICAgICAgIHtkaXNwbGF5ZWRCYW5uZXJVcmwgPyAoXG4gICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkQmFubmVyVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgYmFubmVyJ30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPHNwYW4+Q2xpY2sgdG8gdXBsb2FkIGEgd2lkZSBiYW5uZXIgKDE2MDDDlzQwMCByZWNvbW1lbmRlZCk8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRUbyhcbiAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAnYmFubmVySW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyUHJldmlld1VybCxcbiAgICAgICAgICAgICAgICAgIHNldEJhbm5lclVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICdCYW5uZXIgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkRlc2NyaXB0aW9uPC9oND5cbiAgICAgICAge2Rlc2NyaXB0aW9uUHJvcGVydHkgPyAoXG4gICAgICAgICAgPEJveCBzdHlsZT17eyBtaW5IZWlnaHQ6IDIyMCB9fT5cbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtkZXNjcmlwdGlvblByb3BlcnR5fVxuICAgICAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7cmVzb3VyY2UuZWRpdFByb3BlcnRpZXNcbiAgICAgICAgICAuZmlsdGVyKChwcm9wZXJ0eSkgPT4gWydpbWFnZScsICdiYW5uZXJJbWFnZSddLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCkpXG4gICAgICAgICAgLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyB8fCBiYW5uZXJVcGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjYXRlZ29yeVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBJY29uLCBJbnB1dCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQge1xuICBSZWNvcmRzVGFibGUsXG4gIHVzZVF1ZXJ5UGFyYW1zLFxuICB1c2VSZWNvcmRzLFxuICB1c2VTZWxlY3RlZFJlY29yZHMsXG59IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBMb2NhbFNlbGVjdCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IFBFUl9QQUdFX09QVElPTlMgPSBbMTAsIDI1LCA1MF1cblxuY29uc3QgQ21zTGlzdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlUHJvcCA9IHJlc291cmNlLnRpdGxlUHJvcGVydHk/Lm5hbWUgfHwgcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ucHJvcGVydHlQYXRoIHx8ICdpZCdcblxuICBjb25zdCB7IHN0b3JlUGFyYW1zLCBmaWx0ZXJzIH0gPSB1c2VRdWVyeVBhcmFtcygpXG4gIGNvbnN0IHtcbiAgICByZWNvcmRzLFxuICAgIGxvYWRpbmcsXG4gICAgZGlyZWN0aW9uLFxuICAgIHNvcnRCeSxcbiAgICBwYWdlLFxuICAgIHRvdGFsLFxuICAgIGZldGNoRGF0YSxcbiAgICBwZXJQYWdlLFxuICB9ID0gdXNlUmVjb3JkcyhyZXNvdXJjZS5pZClcbiAgY29uc3Qge1xuICAgIHNlbGVjdGVkUmVjb3JkcyxcbiAgICBoYW5kbGVTZWxlY3QsXG4gICAgaGFuZGxlU2VsZWN0QWxsLFxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyxcbiAgfSA9IHVzZVNlbGVjdGVkUmVjb3JkcyhyZWNvcmRzKVxuXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoKCkgPT4gU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgY29uc3QgZGVib3VuY2VSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3Qgc3RvcmVQYXJhbXNSZWYgPSB1c2VSZWYoc3RvcmVQYXJhbXMpXG4gIHN0b3JlUGFyYW1zUmVmLmN1cnJlbnQgPSBzdG9yZVBhcmFtc1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0UXVlcnkoU3RyaW5nKGZpbHRlcnM/Llt0aXRsZVByb3BdIHx8ICcnKSlcbiAgICBzZXRTZWxlY3RlZFJlY29yZHMoW10pXG4gIH0sIFtyZXNvdXJjZS5pZCwgdGl0bGVQcm9wLCBzZXRTZWxlY3RlZFJlY29yZHNdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNldFRhZykgc2V0VGFnKHRvdGFsLnRvU3RyaW5nKCkpXG4gIH0sIFt0b3RhbCwgc2V0VGFnXSlcblxuICBjb25zdCBoYW5kbGVRdWVyeUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgc2V0UXVlcnkodmFsdWUpXG5cbiAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgZGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKVxuICAgICAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCh7XG4gICAgICAgIHBhZ2U6ICcxJyxcbiAgICAgICAgZmlsdGVyczogdHJpbW1lZCA/IHsgW3RpdGxlUHJvcF06IHRyaW1tZWQgfSA6IHt9LFxuICAgICAgfSlcbiAgICB9LCAzMDApXG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoZGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KGRlYm91bmNlUmVmLmN1cnJlbnQpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVBY3Rpb25QZXJmb3JtZWQgPSAoKSA9PiBmZXRjaERhdGEoKVxuXG4gIGNvbnN0IGN1cnJlbnRQYWdlID0gTnVtYmVyKHBhZ2UpIHx8IDFcbiAgY29uc3Qgcm93c1BlclBhZ2UgPSBOdW1iZXIocGVyUGFnZSkgfHwgMTBcbiAgY29uc3QgdG90YWxSb3dzID0gTnVtYmVyKHRvdGFsKSB8fCAwXG4gIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwodG90YWxSb3dzIC8gcm93c1BlclBhZ2UpIHx8IDEpXG4gIGNvbnN0IGZyb20gPSB0b3RhbFJvd3MgPT09IDAgPyAwIDogKGN1cnJlbnRQYWdlIC0gMSkgKiByb3dzUGVyUGFnZSArIDFcbiAgY29uc3QgdG8gPSBNYXRoLm1pbihjdXJyZW50UGFnZSAqIHJvd3NQZXJQYWdlLCB0b3RhbFJvd3MpXG5cbiAgY29uc3QgZ29Ub1BhZ2UgPSAobmV4dFBhZ2UpID0+IHtcbiAgICBjb25zdCBzYWZlID0gTWF0aC5taW4oTWF0aC5tYXgoMSwgbmV4dFBhZ2UpLCB0b3RhbFBhZ2VzKVxuICAgIHN0b3JlUGFyYW1zKHsgcGFnZTogU3RyaW5nKHNhZmUpIH0pXG4gIH1cblxuICBjb25zdCBjaGFuZ2VQZXJQYWdlID0gKG5leHQpID0+IHtcbiAgICBzdG9yZVBhcmFtcyh7IHBhZ2U6ICcxJywgcGVyUGFnZTogU3RyaW5nKG5leHQpIH0pXG4gIH1cblxuICBjb25zdCBwYWdlTnVtYmVycyA9IFtdXG4gIGNvbnN0IHdpbmRvd1NpemUgPSA1XG4gIGxldCBzdGFydCA9IE1hdGgubWF4KDEsIGN1cnJlbnRQYWdlIC0gTWF0aC5mbG9vcih3aW5kb3dTaXplIC8gMikpXG4gIGxldCBlbmQgPSBNYXRoLm1pbih0b3RhbFBhZ2VzLCBzdGFydCArIHdpbmRvd1NpemUgLSAxKVxuICBzdGFydCA9IE1hdGgubWF4KDEsIGVuZCAtIHdpbmRvd1NpemUgKyAxKVxuICBmb3IgKGxldCBudW1iZXIgPSBzdGFydDsgbnVtYmVyIDw9IGVuZDsgbnVtYmVyICs9IDEpIHBhZ2VOdW1iZXJzLnB1c2gobnVtYmVyKVxuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiPlxuICAgICAgPEJveCBtYj1cImxnXCIgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIG1heFdpZHRoOiA0MjAgfX0+XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgbGVmdDogMTIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEljb24gaWNvbj1cIlNlYXJjaFwiIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17cXVlcnl9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVF1ZXJ5Q2hhbmdlfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtgU2VhcmNoICR7cmVzb3VyY2UubmFtZX0uLi5gfVxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmdMZWZ0OiAzNiB9fVxuICAgICAgICAvPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggdmFyaWFudD1cImNvbnRhaW5lclwiPlxuICAgICAgICA8UmVjb3Jkc1RhYmxlXG4gICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgIHJlY29yZHM9e3JlY29yZHN9XG4gICAgICAgICAgYWN0aW9uUGVyZm9ybWVkPXtoYW5kbGVBY3Rpb25QZXJmb3JtZWR9XG4gICAgICAgICAgb25TZWxlY3Q9e2hhbmRsZVNlbGVjdH1cbiAgICAgICAgICBvblNlbGVjdEFsbD17aGFuZGxlU2VsZWN0QWxsfVxuICAgICAgICAgIHNlbGVjdGVkUmVjb3Jkcz17c2VsZWN0ZWRSZWNvcmRzfVxuICAgICAgICAgIGRpcmVjdGlvbj17ZGlyZWN0aW9ufVxuICAgICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICAgIGlzTG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvblwiPlxuICAgICAgICAgIDxUZXh0IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1zdW1tYXJ5XCI+XG4gICAgICAgICAgICB7dG90YWxSb3dzID09PSAwID8gJ05vIHJlY29yZHMnIDogYFNob3dpbmcgJHtmcm9tfeKAkyR7dG99IG9mICR7dG90YWxSb3dzfWB9XG4gICAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tc2l6ZVwiPlxuICAgICAgICAgICAgPHNwYW4+Um93czwvc3Bhbj5cbiAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17U3RyaW5nKHJvd3NQZXJQYWdlKX1cbiAgICAgICAgICAgICAgb3B0aW9ucz17UEVSX1BBR0VfT1BUSU9OUy5tYXAoKG9wdGlvbikgPT4gKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogU3RyaW5nKG9wdGlvbiksXG4gICAgICAgICAgICAgICAgbGFiZWw6IFN0cmluZyhvcHRpb24pLFxuICAgICAgICAgICAgICB9KSl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gY2hhbmdlUGVyUGFnZShOdW1iZXIobmV4dCkpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXBhZ2VzXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD17Y3VycmVudFBhZ2UgPD0gMX0gb25DbGljaz17KCkgPT4gZ29Ub1BhZ2UoY3VycmVudFBhZ2UgLSAxKX0+XG4gICAgICAgICAgICAgIFByZXZcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAge3BhZ2VOdW1iZXJzLm1hcCgobnVtYmVyKSA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBrZXk9e251bWJlcn1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e251bWJlciA9PT0gY3VycmVudFBhZ2UgPyAnaXMtY3VycmVudCcgOiAnJ31cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnb1RvUGFnZShudW1iZXIpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge251bWJlcn1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtjdXJyZW50UGFnZSA+PSB0b3RhbFBhZ2VzfSBvbkNsaWNrPXsoKSA9PiBnb1RvUGFnZShjdXJyZW50UGFnZSArIDEpfT5cbiAgICAgICAgICAgICAgTmV4dFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ21zTGlzdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0LCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcmVzb2x2ZUltYWdlVXJsKHBhdGgsIGFwcFVybCkge1xuICBpZiAoIXBhdGgpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGF0aCkpIHJldHVybiBwYXRoXG4gIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChhcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXRofWBcbn1cblxuZnVuY3Rpb24gRmllbGRFcnJvcih7IGVycm9yIH0pIHtcbiAgaWYgKCFlcnJvcj8ubWVzc2FnZSkgcmV0dXJuIG51bGxcbiAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9yLm1lc3NhZ2V9PC9zcGFuPlxufVxuXG5jb25zdCBSZXZpZXdFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzTmV3ID0gYWN0aW9uPy5uYW1lID09PSAnbmV3JyB8fCAhcmVjb3JkPy5pZFxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCByYXRpbmcgPSBNYXRoLm1pbig1LCBNYXRoLm1heCgxLCBOdW1iZXIocGFyYW1zLnJhdGluZykgfHwgNSkpXG4gIGNvbnN0IGlzQXBwcm92ZWQgPVxuICAgIGlzTmV3ICYmIChwYXJhbXMuaXNBcHByb3ZlZCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FwcHJvdmVkID09PSAnJylcbiAgICAgID8gdHJ1ZVxuICAgICAgOiBpc0ZsYWdPbihwYXJhbXMuaXNBcHByb3ZlZClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmlzQXBwcm92ZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBcHByb3ZlZCA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ2lzQXBwcm92ZWQnLCB0cnVlKVxuICAgIH1cbiAgICBpZiAoaXNOZXcgJiYgIXBhcmFtcy5yYXRpbmcpIGhhbmRsZUNoYW5nZSgncmF0aW5nJywgNSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc05ld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwocHJldmlld1VybClcbiAgICB9XG4gIH0sIFtwcmV2aWV3VXJsXSlcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5pbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaW1hZ2VdLFxuICApXG4gIGNvbnN0IGRpc3BsYXllZEltYWdlVXJsID0gcHJldmlld1VybCB8fCBpbWFnZVVybFxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncmV2aWV3cycpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICBjb25zdCBsb2NhbFByZXZpZXdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXG4gICAgc2V0UHJldmlld1VybChsb2NhbFByZXZpZXdVcmwpXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBzZXRGaWVsZCgnaW1hZ2UnLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0UHJldmlld1VybChyZXNvbHZlSW1hZ2VVcmwobWVkaWEucGF0aCwgYXBwVXJsKSlcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdQaG90byB1cGxvYWRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSByZXZpZXcnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogaXNOZXcgPyAnUmV2aWV3IGNyZWF0ZWQnIDogJ1JldmlldyB1cGRhdGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHJldmlldy4gUGxlYXNlIHRyeSBhZ2Fpbi4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e2lzTmV3ID8gJ0FkZCBob21lcGFnZSByZXZpZXcnIDogcGFyYW1zLnRpdGxlIHx8ICdSZXZpZXcnfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBBcHByb3ZlZCByZXZpZXdzIGFwcGVhciBvbiB0aGUgd2Vic2l0ZSBob21lcGFnZS4gSGlkZGVuIHJldmlld3Mgc3RheSBpbiBDTVMgb25seS5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+V2Vic2l0ZSB2aXNpYmlsaXR5PC9oND5cbiAgICAgICAgICA8cD5UdXJuIHRoaXMgb2ZmIHRvIGhpZGUgdGhlIHJldmlldyB3aXRob3V0IGRlbGV0aW5nIGl0LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FwcHJvdmVkfVxuICAgICAgICAgICAgb25MYWJlbD1cIkFwcHJvdmVkXCJcbiAgICAgICAgICAgIG9mZkxhYmVsPVwiSGlkZGVuXCJcbiAgICAgICAgICAgIHRpdGxlPXtpc0FwcHJvdmVkID8gJ0FwcHJvdmVkJyA6ICdIaWRkZW4nfVxuICAgICAgICAgICAgaGludD17aXNBcHByb3ZlZCA/ICdWaXNpYmxlIG9uIHRoZSBob21lcGFnZScgOiAnSGlkZGVuIHVudGlsIHlvdSBhcHByb3ZlIGl0J31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQXBwcm92ZWQnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UmF0aW5nPC9oND5cbiAgICAgICAgICA8cD5TaG93biBhcyBzdGFycyBvbiB0aGUgaG9tZXBhZ2UgcmV2aWV3IGNhcmQuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXJzXG4gICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3JhdGluZ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17WzUsIDQsIDMsIDIsIDFdLm1hcCgodmFsdWUpID0+ICh7XG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGAke3ZhbHVlfSBzdGFyJHt2YWx1ZSA9PT0gMSA/ICcnIDogJ3MnfWAsXG4gICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgncmF0aW5nJywgTnVtYmVyKG5leHQpKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5SZXZpZXcgdGV4dDwvaDQ+XG4gICAgICAgIDxwPktlZXAgaXQgc2hvcnQuIFRoaXMgaXMgd2hhdCBjdXN0b21lcnMgcmVhZCBvbiB0aGUgaG9tZXBhZ2UuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBUaXRsZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudGl0bGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU3VwZXIgZnJlc2ggZnJ1aXRzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnRpdGxlfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUmV2aWV3ZXIgbmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlByaXlhIFNoYXJtYVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5uYW1lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgUmV2aWV3XG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgcm93cz17NH1cbiAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNvbnRlbnQgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY29udGVudCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFsd2F5cyBmcmVzaCBhbmQgZGVsaXZlcmVkIHJpZ2h0IG9uIHRpbWUuXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuY29udGVudH0gLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlJldmlld2VyIHBob3RvPC9oND5cbiAgICAgICAgPHA+T3B0aW9uYWwuIElmIGVtcHR5LCB0aGUgd2Vic2l0ZSBzaG93cyBpbml0aWFscyBpbnN0ZWFkLjwvcD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFBob3RvXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3AgdG9rcmktdXBsb2FkLWRyb3Atcm91bmRcIj5cbiAgICAgICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfSBhbHQ9e3BhcmFtcy5uYW1lIHx8ICdSZXZpZXdlcid9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj57dXBsb2FkaW5nID8gJ1VwbG9hZGluZ+KApicgOiAnQ2xpY2sgdG8gdXBsb2FkIGEgcGhvdG8nfTwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17dXBsb2FkSW1hZ2V9IC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5KUEcsIFBORywgR0lGLCBvciBXZWJQIHVwIHRvIDVNQjwvc3Bhbj5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyB8fCB1cGxvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAge2lzTmV3ID8gJ0NyZWF0ZSByZXZpZXcnIDogJ1NhdmUgcmV2aWV3J31cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXZpZXdFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRHJhd2VyQ29udGVudCxcbiAgRHJhd2VyRm9vdGVyLFxuICBINCxcbiAgSWNvbixcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlUmVjb3JkLCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU2VhcmNoYWJsZU11bHRpU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgVEFCUyA9IFtcbiAge1xuICAgIGlkOiAnZ2VuZXJhbCcsXG4gICAgbGFiZWw6ICdHZW5lcmFsJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdzdG9yZU5hbWUnLFxuICAgICAgJ3N0b3JlVGFnbGluZScsXG4gICAgICAnc3RvcmVFbWFpbCcsXG4gICAgICAnc3RvcmVQaG9uZTEnLFxuICAgICAgJ3N0b3JlUGhvbmUyJyxcbiAgICAgICdzdG9yZUFkZHJlc3MnLFxuICAgICAgJ3Byb21vQmFubmVyJyxcbiAgICAgICdlYXJseURlbGl2ZXJ5JyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdjaGFyZ2VzJyxcbiAgICBsYWJlbDogJ0NoYXJnZXMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ21vcm5pbmdEZWxpdmVyeVRpdGxlJyxcbiAgICAgICdtb3JuaW5nRGVsaXZlcnlTdWJ0aXRsZScsXG4gICAgICAnbW9ybmluZ1NoaXBwaW5nRmVlJyxcbiAgICAgICdtb3JuaW5nRnJlZUFib3ZlJyxcbiAgICAgICdleHByZXNzRGVsaXZlcnlUaXRsZScsXG4gICAgICAnZXhwcmVzc0RlbGl2ZXJ5U3VidGl0bGUnLFxuICAgICAgJ2V4cHJlc3NTaGlwcGluZ0ZlZScsXG4gICAgICAnZXhwcmVzc0ZyZWVBYm92ZScsXG4gICAgICAnaGFuZGxpbmdGZWUnLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2hvbWVwYWdlJyxcbiAgICBsYWJlbDogJ0hvbWVwYWdlJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdob21lQmFubmVySW1hZ2UnLFxuICAgICAgJ2hvbWVNb2JpbGVCYW5uZXJJbWFnZScsXG4gICAgICAnaG9tZUhpZ2hsaWdodEltYWdlJyxcbiAgICAgICdob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzJyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYXltZW50cycsXG4gICAgbGFiZWw6ICdQYXltZW50cycsXG4gICAgZmllbGRzOiBbJ3Jhem9ycGF5RW5hYmxlZCcsICdyYXpvcnBheUtleUlkJywgJ3Jhem9ycGF5S2V5U2VjcmV0JywgJ2NvZEVuYWJsZWQnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnbm90aWZpY2F0aW9ucycsXG4gICAgbGFiZWw6ICdOb3RpZmljYXRpb25zJyxcbiAgICBmaWVsZHM6IFtcbiAgICAgICdtc2c5MUVuYWJsZWQnLFxuICAgICAgJ21zZzkxQXV0aEtleScsXG4gICAgICAnbXNnOTFTZW5kZXJJZCcsXG4gICAgICAnbXNnOTFPdHBUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MU9yZGVyVGVtcGxhdGVJZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcEVuYWJsZWQnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBOdW1iZXInLFxuICAgICAgJ21zZzkxV2hhdHNhcHBPdHBUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE9yZGVyVGVtcGxhdGUnLFxuICAgICAgJ21zZzkxV2hhdHNhcHBMYW5ndWFnZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE5hbWVzcGFjZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cEJ1dHRvbicsXG4gICAgXSxcbiAgfSxcbl1cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVJbWFnZVVybChwYXRoLCBhcHBVcmwpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhdGgpKSByZXR1cm4gcGF0aFxuICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGF0aH1gXG59XG5cbmZ1bmN0aW9uIEltYWdlVXBsb2FkZXIoe1xuICBsYWJlbCxcbiAgaGludCxcbiAgdmFsdWUsXG4gIHByZXZpZXdVcmwsXG4gIHVwbG9hZGluZyxcbiAgZmlsZVJlZixcbiAgb25VcGxvYWQsXG4gIHdpZGUsXG59KSB7XG4gIGNvbnN0IGRpc3BsYXllZCA9IHByZXZpZXdVcmwgfHwgdmFsdWVcblxuICByZXR1cm4gKFxuICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgIHtsYWJlbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLXVwbG9hZC1kcm9wJHt3aWRlID8gJyB0b2tyaS11cGxvYWQtZHJvcC13aWRlJyA6ICcnfWB9PlxuICAgICAgICB7ZGlzcGxheWVkID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWR9IGFsdD17YCR7bGFiZWx9IHByZXZpZXdgfSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayB0byB1cGxvYWQgYW4gaW1hZ2UnfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPGlucHV0IHJlZj17ZmlsZVJlZn0gdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e29uVXBsb2FkfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPntoaW50fTwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmNvbnN0IFNldHRpbmdzRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZSgnZ2VuZXJhbCcpXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IG1vYmlsZUJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgaGlnaGxpZ2h0RmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbYmFubmVyUHJldmlldywgc2V0QmFubmVyUHJldmlld10gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW21vYmlsZUJhbm5lclByZXZpZXcsIHNldE1vYmlsZUJhbm5lclByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtoaWdobGlnaHRQcmV2aWV3LCBzZXRIaWdobGlnaHRQcmV2aWV3XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyVXBsb2FkaW5nLCBzZXRCYW5uZXJVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttb2JpbGVCYW5uZXJVcGxvYWRpbmcsIHNldE1vYmlsZUJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2hpZ2hsaWdodFVwbG9hZGluZywgc2V0SGlnaGxpZ2h0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCBzZWxlY3RlZENhdGVnb3J5U2x1Z3MgPSBwYXJzZVNsdWdzKHBhcmFtcy5ob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzKVxuXG4gIGNvbnN0IGJhbm5lckltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmhvbWVCYW5uZXJJbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaG9tZUJhbm5lckltYWdlXSxcbiAgKVxuICBjb25zdCBtb2JpbGVCYW5uZXJJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lTW9iaWxlQmFubmVySW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVNb2JpbGVCYW5uZXJJbWFnZV0sXG4gIClcbiAgY29uc3QgaGlnaGxpZ2h0SW1hZ2VVcmwgPSB1c2VNZW1vKFxuICAgICgpID0+IHJlc29sdmVJbWFnZVVybChwYXJhbXMuaG9tZUhpZ2hsaWdodEltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2VdLFxuICApXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKVxuICAgIGlmIChoYXNoID09PSAnYXBwZWFyYW5jZScpIHtcbiAgICAgIHNldEFjdGl2ZVRhYignY2hhcmdlcycpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGhhc2ggJiYgVEFCUy5zb21lKCh0YWIpID0+IHRhYi5pZCA9PT0gaGFzaCkpIHtcbiAgICAgIHNldEFjdGl2ZVRhYihoYXNoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIGAjJHthY3RpdmVUYWJ9YClcbiAgfSwgW2FjdGl2ZVRhYl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGJhbm5lclByZXZpZXc/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoYmFubmVyUHJldmlldylcbiAgICB9XG4gIH0sIFtiYW5uZXJQcmV2aWV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAobW9iaWxlQmFubmVyUHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChtb2JpbGVCYW5uZXJQcmV2aWV3KVxuICAgIH1cbiAgfSwgW21vYmlsZUJhbm5lclByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChoaWdobGlnaHRQcmV2aWV3Py5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKGhpZ2hsaWdodFByZXZpZXcpXG4gICAgfVxuICB9LCBbaGlnaGxpZ2h0UHJldmlld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBmZXRjaChgJHthcGlCYXNlVXJsfS9jYXRlZ29yaWVzYClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhbXSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCwgZmllbGQsIHNldFByZXZpZXcsIHNldEJ1c3ksIGZpbGVSZWYsIHN1Y2Nlc3NNZXNzYWdlKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdnZW5lcmFsJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3KGxvY2FsUHJldmlld1VybClcbiAgICBzZXRCdXN5KHRydWUpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBoYW5kbGVDaGFuZ2UoZmllbGQsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3KHJlc29sdmVJbWFnZVVybChtZWRpYS5wYXRoLCBhcHBVcmwpKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogc3VjY2Vzc01lc3NhZ2UsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ3N1Y2Nlc3MnIHx8IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogJ1NldHRpbmdzIHNhdmVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgICAgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzJyxcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHNldHRpbmdzLiBQbGVhc2UgdHJ5IGFnYWluLicsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBmbGV4IGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIiBjbGFzc05hbWU9XCJ0b2tyaS1zZXR0aW5ncy1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXRhYnNcIiBtYj1cInhsXCI+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNldHRpbmdzLXRhYiR7YWN0aXZlVGFiID09PSB0YWIuaWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKHRhYi5pZCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RhYi5sYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPERyYXdlckNvbnRlbnQ+XG4gICAgICAgIHtUQUJTLm1hcCgodGFiKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbHRlcigocHJvcGVydHkpID0+XG4gICAgICAgICAgICB0YWIuZmllbGRzLmluY2x1ZGVzKHByb3BlcnR5LnByb3BlcnR5UGF0aCksXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAga2V5PXt0YWIuaWR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLXBhbmVsXCJcbiAgICAgICAgICAgICAgcD1cInhsXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogYWN0aXZlVGFiID09PSB0YWIuaWQgPyAnYmxvY2snIDogJ25vbmUnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxINCBtYj1cInNtXCI+e3RhYi5sYWJlbH08L0g0PlxuICAgICAgICAgICAgICA8VGV4dCBtYj1cInhsXCIgb3BhY2l0eT17MC43NX0+XG4gICAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnXG4gICAgICAgICAgICAgICAgICA/ICdTZXQgY29weSBhbmQgcHJpY2VzIGZvciBNb3JuaW5nIGFuZCA5MC1NaW51dGUgZGVsaXZlcnkuIEhhbmRsaW5nIGZlZSBpcyBhZGRlZCB0byBldmVyeSBvcmRlci4nXG4gICAgICAgICAgICAgICAgICA6IHRhYi5pZCA9PT0gJ2hvbWVwYWdlJ1xuICAgICAgICAgICAgICAgICAgICA/ICdUaGVzZSBpbWFnZXMgYW5kIGNhdGVnb3JpZXMgYXBwZWFyIG9uIHRoZSB3ZWJzaXRlIGhvbWVwYWdlLiBDbGljayBTYXZlIGNoYW5nZXMgYWZ0ZXIgdXBsb2FkaW5nLidcbiAgICAgICAgICAgICAgICAgICAgOiAnVXBkYXRlIHlvdXIgc3RvcmUgc2V0dGluZ3MgYW5kIGNsaWNrIFNhdmUgY2hhbmdlcyBiZWxvdy4nfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICAgIHt0YWIuaWQgPT09ICdjaGFyZ2VzJyA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNoYXJnZXMtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+TW9ybmluZyBkZWxpdmVyeTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxwPlNob3duIGF0IGNoZWNrb3V0IHdoZW4gdGhpcyBvcHRpb24gaXMgb24gZm9yIHRoZSBwaW5jb2RlLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5tb3JuaW5nRGVsaXZlcnlUaXRsZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnbW9ybmluZ0RlbGl2ZXJ5VGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGbGF3bGVzcyBNb3JuaW5nIERlbGl2ZXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgU3VidGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/Lm1vcm5pbmdEZWxpdmVyeVN1YnRpdGxlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRGVsaXZlcnlTdWJ0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNobmVzcyBHdWFyYW50ZWVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBTaGlwcGluZyBmZWUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5tb3JuaW5nU2hpcHBpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnbW9ybmluZ1NoaXBwaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBGcmVlIGFib3ZlICjigrkpXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8ubW9ybmluZ0ZyZWVBYm92ZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRnJlZUFib3ZlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+MCBtZWFucyBubyBmcmVlIGRlbGl2ZXJ5PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0PjkwLU1pbnV0ZSBkZWxpdmVyeTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxwPlNob3duIGF0IGNoZWNrb3V0LiBEaXNhYmxlZCBwaW5jb2RlcyBzdGlsbCBzZWUgdGhpcyBhcyBjb21pbmcgc29vbi48L3A+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICBUaXRsZVxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uZXhwcmVzc0RlbGl2ZXJ5VGl0bGUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2V4cHJlc3NEZWxpdmVyeVRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiOTAtTWludXRlIEVtZXJnZW5jeSBEcm9wc1wiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFN1YnRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzRGVsaXZlcnlTdWJ0aXRsZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnZXhwcmVzc0RlbGl2ZXJ5U3VidGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJPbi1EZW1hbmQgTHV4dXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBTaGlwcGluZyBmZWUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzU2hpcHBpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnZXhwcmVzc1NoaXBwaW5nRmVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBGcmVlIGFib3ZlICjigrkpXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uZXhwcmVzc0ZyZWVBYm92ZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdleHByZXNzRnJlZUFib3ZlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+MCBtZWFucyBubyBmcmVlIGRlbGl2ZXJ5PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbCB0b2tyaS1jaGFyZ2VzLWhhbmRsaW5nXCI+XG4gICAgICAgICAgICAgICAgICAgIEhhbmRsaW5nIGNoYXJnZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmhhbmRsaW5nRmVlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnaGFuZGxpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+Q2FydCBoYW5kbGluZyBmZWUgYWRkZWQgdG8gZXZlcnkgb3JkZXI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktaG9tZXBhZ2UtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkhvbWUgYmFubmVyIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIkRlc2t0b3AgLyBsYXJnZS1zY3JlZW4gaGVybyBiYW5uZXIuIEpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtiYW5uZXJJbWFnZVVybH1cbiAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17YmFubmVyUHJldmlld31cbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nPXtiYW5uZXJVcGxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWY9e2Jhbm5lckZpbGVSZWZ9XG4gICAgICAgICAgICAgICAgICAgIHdpZGVcbiAgICAgICAgICAgICAgICAgICAgb25VcGxvYWQ9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hvbWVCYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCYW5uZXJQcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFubmVyRmlsZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICdCYW5uZXIgaW1hZ2UgdXBsb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiSG9tZSBtb2JpbGUgYmFubmVyIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIlNob3duIG9uIHBob25lcy4gSWYgZW1wdHksIHRoZSBkZXNrdG9wIGJhbm5lciBpcyB1c2VkIGluc3RlYWQuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e21vYmlsZUJhbm5lckltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXttb2JpbGVCYW5uZXJQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e21vYmlsZUJhbm5lclVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17bW9iaWxlQmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgb25VcGxvYWQ9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hvbWVNb2JpbGVCYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2JpbGVCYW5uZXJQcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0TW9iaWxlQmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlQmFubmVyRmlsZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICdNb2JpbGUgYmFubmVyIGltYWdlIHVwbG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8SW1hZ2VVcGxvYWRlclxuICAgICAgICAgICAgICAgICAgICBsYWJlbD1cIkZydWl0IGhpZ2hsaWdodCBpbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgIGhpbnQ9XCJSZXBsYWNlcyB0aGUga2l3aSBpbWFnZSBpbiDigJxUaGUgU21hbGwgRnJ1aXQgd2l0aCBhIEJpZyBQdW5jaOKAnSBvbiB0aGUgd2Vic2l0ZS5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aGlnaGxpZ2h0SW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e2hpZ2hsaWdodFByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17aGlnaGxpZ2h0VXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXtoaWdobGlnaHRGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUhpZ2hsaWdodEltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhpZ2hsaWdodFByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRIaWdobGlnaHRVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0hpZ2hsaWdodCBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICBIb21lcGFnZSBjYXRlZ29yaWVzXG4gICAgICAgICAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnNsdWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCB8fCBpdGVtLnRpdGxlIHx8IGl0ZW0uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2F0ZWdvcnlTbHVnc31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHNsdWdzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQ2hhbmdlKCdob21lRmVhdHVyZWRDYXRlZ29yeVNsdWdzJywgSlNPTi5zdHJpbmdpZnkoc2x1Z3MpKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbmQgc2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgVGhlc2UgY2F0ZWdvcmllcyBsb2FkIG9uIHRoZSB3ZWJzaXRlIGFmdGVyIHRoZSBmcnVpdCBoaWdobGlnaHQgc2VjdGlvbiwgb25lIGF0XG4gICAgICAgICAgICAgICAgICAgICAgYSB0aW1lIGFzIHRoZSB2aXNpdG9yIHNjcm9sbHMuXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9EcmF3ZXJDb250ZW50PlxuXG4gICAgICA8RHJhd2VyRm9vdGVyPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY2hhbmdlc1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRHJhd2VyRm9vdGVyPlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gcGFyc2VTbHVncyhyYXcpIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXVxuICBpZiAoQXJyYXkuaXNBcnJheShyYXcpKSByZXR1cm4gcmF3Lm1hcCgoaXRlbSkgPT4gU3RyaW5nKGl0ZW0pLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZVNsdWdzKHBhcnNlZClcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gcmF3XG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgoaXRlbSkgPT4gaXRlbS50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIH1cbiAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHBhZChudW0pIHtcbiAgcmV0dXJuIFN0cmluZyhudW0pLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRldGltZVZhbHVlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0tJHtwYWQoZGF0ZS5nZXRNb250aCgpICsgMSl9LSR7cGFkKGRhdGUuZ2V0RGF0ZSgpKX1UJHtwYWQoZGF0ZS5nZXRIb3VycygpKX06JHtwYWQoZGF0ZS5nZXRNaW51dGVzKCkpfWBcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJydcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXk6ICcyLWRpZ2l0JyxcbiAgICBtb250aDogJ3Nob3J0JyxcbiAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgaG91cjogJzItZGlnaXQnLFxuICAgIG1pbnV0ZTogJzItZGlnaXQnLFxuICB9KVxufVxuXG5mdW5jdGlvbiB1c2VBbmNob3JlZE1lbnUob3Blbikge1xuICBjb25zdCB3cmFwUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtvcGVuVXAsIHNldE9wZW5VcF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3BlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHdyYXBSZWYuY3VycmVudFxuICAgICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBzcGFjZUJlbG93ID0gd2luZG93LmlubmVySGVpZ2h0IC0gcmVjdC5ib3R0b21cbiAgICAgIHNldE9wZW5VcChzcGFjZUJlbG93IDwgMjQwICYmIHJlY3QudG9wID4gc3BhY2VCZWxvdylcbiAgICB9XG5cbiAgICB1cGRhdGUoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHRydWUpXG4gICAgfVxuICB9LCBbb3Blbl0pXG5cbiAgcmV0dXJuIHsgd3JhcFJlZiwgb3BlblVwIH1cbn1cblxuZnVuY3Rpb24gQ2hvaWNlQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIEFuY2hvcmVkU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudCl9PlxuICAgICAgICA8c3Bhbj57c2VsZWN0ZWQ/LmxhYmVsIHx8IHBsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIHtvcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWV9XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2l0ZW0udmFsdWUgPT09IHZhbHVlID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFNlYXJjaGFibGVNdWx0aVNlbGVjdCh7IG9wdGlvbnMsIHNlbGVjdGVkLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHNlYXJjaFBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTZXQgPSB1c2VNZW1vKCgpID0+IG5ldyBTZXQoc2VsZWN0ZWQpLCBbc2VsZWN0ZWRdKVxuICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSBvcHRpb25zLmZpbHRlcigoaXRlbSkgPT4gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpKVxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgY29uc3QgdG9nZ2xlID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHNlbGVjdGVkU2V0Lmhhcyh2YWx1ZSkpIG9uQ2hhbmdlKHNlbGVjdGVkLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gdmFsdWUpKVxuICAgIGVsc2Ugb25DaGFuZ2UoWy4uLnNlbGVjdGVkLCB2YWx1ZV0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKHZhbHVlKSA9PiAhdmFsdWUpfT5cbiAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5sZW5ndGggPyAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcHNcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17aXRlbS52YWx1ZX0gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2hpcFwiPlxuICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICDDl1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyXCI+e3BsYWNlaG9sZGVyfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY2FyZXRcIj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFF1ZXJ5KGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VhcmNoUGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAge2ZpbHRlcmVkLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IHNlbGVjdGVkU2V0LmhhcyhpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9e2B0b2tyaS1tdWx0aXNlbGVjdC1vcHRpb24ke2NoZWNrZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9eygpID0+IHRvZ2dsZShpdGVtLnZhbHVlKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWVtcHR5XCI+Tm8gbWF0Y2hlczwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBEYXRlVGltZVBpY2tlcih7IHZhbHVlLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBwYXJzZWQgPSB2YWx1ZSA/IG5ldyBEYXRlKHZhbHVlKSA6IG51bGxcbiAgY29uc3QgdmFsaWQgPSBwYXJzZWQgJiYgIU51bWJlci5pc05hTihwYXJzZWQuZ2V0VGltZSgpKSA/IHBhcnNlZCA6IG51bGxcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttb250aERhdGUsIHNldE1vbnRoRGF0ZV0gPSB1c2VTdGF0ZSh2YWxpZCB8fCBuZXcgRGF0ZSgpKVxuICBjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlKHZhbGlkID8gcGFkKHZhbGlkLmdldEhvdXJzKCkpIDogJzAwJylcbiAgY29uc3QgW21pbnV0ZXMsIHNldE1pbnV0ZXNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0TWludXRlcygpKSA6ICcwMCcpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXZhbGlkKSByZXR1cm5cbiAgICBzZXRNb250aERhdGUodmFsaWQpXG4gICAgc2V0SG91cnMocGFkKHZhbGlkLmdldEhvdXJzKCkpKVxuICAgIHNldE1pbnV0ZXMocGFkKHZhbGlkLmdldE1pbnV0ZXMoKSkpXG4gIH0sIFt2YWx1ZV0pXG5cbiAgY29uc3QgeWVhciA9IG1vbnRoRGF0ZS5nZXRGdWxsWWVhcigpXG4gIGNvbnN0IG1vbnRoID0gbW9udGhEYXRlLmdldE1vbnRoKClcbiAgY29uc3QgZmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSkuZ2V0RGF5KClcbiAgY29uc3QgdG90YWxEYXlzID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKS5nZXREYXRlKClcbiAgY29uc3QgY2VsbHMgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0RGF5OyBpICs9IDEpIGNlbGxzLnB1c2gobnVsbClcbiAgZm9yIChsZXQgZGF5ID0gMTsgZGF5IDw9IHRvdGFsRGF5czsgZGF5ICs9IDEpIGNlbGxzLnB1c2goZGF5KVxuXG4gIGNvbnN0IGFwcGx5ID0gKGRheSwgbmV4dEhvdXJzID0gaG91cnMsIG5leHRNaW51dGVzID0gbWludXRlcykgPT4ge1xuICAgIGNvbnN0IG5leHQgPSBgJHt5ZWFyfS0ke3BhZChtb250aCArIDEpfS0ke3BhZChkYXkpfVQke3BhZChOdW1iZXIobmV4dEhvdXJzKSB8fCAwKX06JHtwYWQoTnVtYmVyKG5leHRNaW51dGVzKSB8fCAwKX1gXG4gICAgb25DaGFuZ2UobmV4dClcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkRGF5ID1cbiAgICB2YWxpZCAmJiB2YWxpZC5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmIHZhbGlkLmdldE1vbnRoKCkgPT09IG1vbnRoID8gdmFsaWQuZ2V0RGF0ZSgpIDogbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyXCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPnt2YWxpZCA/IGZvcm1hdERhdGV0aW1lTGFiZWwodmFsaWQpIDogcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3Bhbj7wn5OFPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1kYXRlcGlja2VyLXBvcCR7b3BlblVwID8gJyBpcy11cCcgOiAnJ31gfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItbmF2XCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHN0cm9uZz5cbiAgICAgICAgICAgICAge21vbnRoRGF0ZS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1vbnRoOiAnbG9uZycsIHllYXI6ICdudW1lcmljJyB9KX1cbiAgICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0TW9udGhEYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSkpfT5cbiAgICAgICAgICAgICAg4oC6XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItd2Vla1wiPlxuICAgICAgICAgICAge1snU3UnLCAnTW8nLCAnVHUnLCAnV2UnLCAnVGgnLCAnRnInLCAnU2EnXS5tYXAoKGxhYmVsKSA9PiAoXG4gICAgICAgICAgICAgIDxzcGFuIGtleT17bGFiZWx9PntsYWJlbH08L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItZ3JpZFwiPlxuICAgICAgICAgICAge2NlbGxzLm1hcCgoZGF5LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgZGF5ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGtleT17YCR7eWVhcn0tJHttb250aH0tJHtkYXl9YH1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzZWxlY3RlZERheSA9PT0gZGF5ID8gJ2lzLXNlbGVjdGVkJyA6ICcnfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gYXBwbHkoZGF5KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7ZGF5fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT17YGVtcHR5LSR7aW5kZXh9YH0gLz5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLXRpbWVcIj5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgSG91clxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCIyM1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2hvdXJzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oMjMsIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldEhvdXJzKG5leHQpXG4gICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWREYXkpIGFwcGx5KHNlbGVjdGVkRGF5LCBuZXh0LCBtaW51dGVzKVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBNaW51dGVcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiNTlcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXttaW51dGVzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBwYWQoTWF0aC5taW4oNTksIE1hdGgubWF4KDAsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApKSlcbiAgICAgICAgICAgICAgICAgIHNldE1pbnV0ZXMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIGhvdXJzLCBuZXh0KVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jbGVhclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZSgnJylcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDbGVhclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgQ291cG9uRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG5cbiAgY29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSlcbiAgY29uc3QgW2NhdGVnb3JpZXMsIHNldENhdGVnb3JpZXNdID0gdXNlU3RhdGUoW10pXG5cbiAgY29uc3Qgc2VsZWN0ZWRTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLnRhcmdldFNsdWdzKVxuICBjb25zdCB0YXJnZXRUeXBlID0gcGFyYW1zLnRhcmdldFR5cGUgfHwgJ2FsbCdcbiAgY29uc3QgYXBwbHlPbiA9IHBhcmFtcy5hcHBseU9uIHx8ICdjYXJ0J1xuICBjb25zdCB1c2FnZVR5cGUgPSBwYXJhbXMudXNhZ2VUeXBlIHx8ICd1bmxpbWl0ZWQnXG4gIGNvbnN0IGNvdXBvblR5cGUgPSBwYXJhbXMudHlwZSB8fCAncGVyY2VudCdcbiAgY29uc3QgaXNBY3RpdmUgPSBwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG5cbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkQ2F0YWxvZygpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5RGF0YSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICBjb25zdCBhbGxQcm9kdWN0cyA9IFtdXG4gICAgICAgIGxldCBwYWdlID0gMVxuICAgICAgICBsZXQgaGFzTW9yZSA9IHRydWVcbiAgICAgICAgd2hpbGUgKGhhc01vcmUgJiYgcGFnZSA8PSAyMCkge1xuICAgICAgICAgIGNvbnN0IHByb2R1Y3REYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vcHJvZHVjdHM/cGFnZT0ke3BhZ2V9JmxpbWl0PTEwMGApLnRoZW4oKHJlc3BvbnNlKSA9PlxuICAgICAgICAgICAgcmVzcG9uc2UuanNvbigpLFxuICAgICAgICAgIClcbiAgICAgICAgICBhbGxQcm9kdWN0cy5wdXNoKC4uLihwcm9kdWN0RGF0YS5wcm9kdWN0cyB8fCBbXSkpXG4gICAgICAgICAgaGFzTW9yZSA9IEJvb2xlYW4ocHJvZHVjdERhdGEuaGFzTW9yZSlcbiAgICAgICAgICBwYWdlICs9IDFcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgc2V0UHJvZHVjdHMoYWxsUHJvZHVjdHMpXG4gICAgICAgIHNldENhdGVnb3JpZXMoQXJyYXkuaXNBcnJheShjYXRlZ29yeURhdGEpID8gY2F0ZWdvcnlEYXRhIDogW10pXG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHtcbiAgICAgICAgICBzZXRQcm9kdWN0cyhbXSlcbiAgICAgICAgICBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9hZENhdGFsb2coKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgc2V0U2VsZWN0ZWRTbHVncyA9IChuZXh0KSA9PiBzZXRGaWVsZCgndGFyZ2V0U2x1Z3MnLCBKU09OLnN0cmluZ2lmeShuZXh0KSlcblxuICBjb25zdCBwcm9kdWN0T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcHJvZHVjdHMubWFwKChpdGVtKSA9PiAoeyB2YWx1ZTogaXRlbS5zbHVnLCBsYWJlbDogaXRlbS5uYW1lIH0pKSxcbiAgICBbcHJvZHVjdHNdLFxuICApXG4gIGNvbnN0IGNhdGVnb3J5T3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gY2F0ZWdvcmllcy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLmxhYmVsIH0pKSxcbiAgICBbY2F0ZWdvcmllc10sXG4gIClcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY291cG9uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3Vwb24gc2F2ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY291cG9uLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj5DcmVhdGUgYSBzdG9yZSBjb3Vwb248L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgU2V0IHdobyBnZXRzIHRoZSBkaXNjb3VudCwgd2hlcmUgaXQgYXBwbGllcywgYW5kIGhvdyBtYW55IHRpbWVzIGl0IGNhbiBiZSB1c2VkLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Db3Vwb24gY29kZTwvaDQ+XG4gICAgICAgICAgPHA+Q3VzdG9tZXJzIHdpbGwgdHlwZSB0aGlzIGF0IGNoZWNrb3V0IG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9wPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLWNvdXBvbi1jb2RlXCJcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJXRUxDT01FMTBcIlxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdG9nZ2xlXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIGV2ZW50LnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICBDb3Vwb24gaXMgYWN0aXZlXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkRpc2NvdW50PC9oND5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAncGVyY2VudCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiUGVyY2VudCBvZmZcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiAxMCUgb2ZmXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3R5cGUnLCAncGVyY2VudCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtjb3Vwb25UeXBlID09PSAnZmxhdCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiRmxhdCBhbW91bnRcIlxuICAgICAgICAgICAgICBoaW50PVwiZS5nLiDigrk1MCBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdmbGF0Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIHtjb3Vwb25UeXBlID09PSAncGVyY2VudCcgPyAnUGVyY2VudCB2YWx1ZScgOiAnQW1vdW50ICjigrkpJ31cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy52YWx1ZSA/PyAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWluIGNhcnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5taW5DYXJ0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdtaW5DYXJ0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjBcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTWF4IGRpc2NvdW50ICjigrkpXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubWF4RGlzY291bnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21heERpc2NvdW50JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk5vIGNhcFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkFwcGx5IGRpc2NvdW50IG9uPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnY2FydCd9XG4gICAgICAgICAgICB0aXRsZT1cIkNhcnQgdG90YWxcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSB0aGUgaXRlbXMgc3VidG90YWxcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnY2FydCcpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXthcHBseU9uID09PSAnc2hpcHBpbmcnfVxuICAgICAgICAgICAgdGl0bGU9XCJTaGlwcGluZyBmZWVcIlxuICAgICAgICAgICAgaGludD1cIlJlZHVjZSBkZWxpdmVyeSBjaGFyZ2VzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdhcHBseU9uJywgJ3NoaXBwaW5nJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5XaG8gY2FuIGdldCB0aGlzIGRpc2NvdW50PC9oND5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIEFwcGx5IHRvXG4gICAgICAgICAgPEFuY2hvcmVkU2VsZWN0XG4gICAgICAgICAgICB2YWx1ZT17dGFyZ2V0VHlwZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIHdobyB0aGlzIGNvdXBvbiBhcHBsaWVzIHRvXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICBzZXRGaWVsZCgndGFyZ2V0VHlwZScsIG5leHQpXG4gICAgICAgICAgICAgIHNldFNlbGVjdGVkU2x1Z3MoW10pXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb3B0aW9ucz17W1xuICAgICAgICAgICAgICB7IHZhbHVlOiAnYWxsJywgbGFiZWw6ICdBbGwgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdwcm9kdWN0cycsIGxhYmVsOiAnU2VsZWN0ZWQgcHJvZHVjdHMnIH0sXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdjYXRlZ29yaWVzJywgbGFiZWw6ICdTZWxlY3RlZCBjYXRlZ29yaWVzJyB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAncHJvZHVjdHMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFByb2R1Y3RzXG4gICAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3Byb2R1Y3RPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHByb2R1Y3RzXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcHJvZHVjdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7dGFyZ2V0VHlwZSA9PT0gJ2NhdGVnb3JpZXMnID8gKFxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENhdGVnb3JpZXNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17Y2F0ZWdvcnlPcHRpb25zfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldFNlbGVjdGVkU2x1Z3N9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBjYXRlZ29yaWVzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+VXNhZ2U8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3VubGltaXRlZCd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiVW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgaGludD1cIkN1c3RvbWVycyBjYW4gcmV1c2UgaXRcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3VubGltaXRlZCcpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaG9pY2VDYXJkXG4gICAgICAgICAgICAgIHNlbGVjdGVkPXt1c2FnZVR5cGUgPT09ICdzaW5nbGUnfVxuICAgICAgICAgICAgICB0aXRsZT1cIlNpbmdsZSB1c2VcIlxuICAgICAgICAgICAgICBoaW50PVwiT25lIHVzZSBwZXIgY3VzdG9tZXJcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndXNhZ2VUeXBlJywgJ3NpbmdsZScpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJyA/IChcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgT3B0aW9uYWwgZ2xvYmFsIGNhcFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudXNhZ2VMaW1pdCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndXNhZ2VMaW1pdCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJMZWF2ZSBibGFuayBmb3IgdW5saW1pdGVkXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0PkVhY2ggbG9nZ2VkLWluIGN1c3RvbWVyIGNhbiB1c2UgdGhpcyBjb3Vwb24gb25jZS48L1RleHQ+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7cGFyYW1zLnVzZWRDb3VudCA/IDxUZXh0IG10PVwiZGVmYXVsdFwiPlVzZWQge3BhcmFtcy51c2VkQ291bnR9IHRpbWUocykgc28gZmFyLjwvVGV4dD4gOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+U2NoZWR1bGU8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFN0YXJ0cyBhdFxuICAgICAgICAgICAgPERhdGVUaW1lUGlja2VyXG4gICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGV0aW1lVmFsdWUocGFyYW1zLnN0YXJ0c0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnc3RhcnRzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBzdGFydCBkYXRlIGFuZCB0aW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBFeHBpcmVzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuZXhwaXJlc0F0KX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnZXhwaXJlc0F0JywgbmV4dCB8fCBudWxsKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgZXhwaXJ5IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY291cG9uXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ291cG9uRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFNlYXJjaGFibGVTZWxlY3QsIHVzZUFuY2hvcmVkTWVudSB9IGZyb20gJy4vZm9ybS1jb250cm9scydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IEZVTEZJTExNRU5UID0gW1xuICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnV2FpdGluZyBmb3IgZnVsZmlsbG1lbnQnIH0sXG4gIHsgdmFsdWU6ICdwYWlkJywgbGFiZWw6ICdQcm9jZXNzaW5nJyB9LFxuICB7IHZhbHVlOiAncGFja2VkJywgbGFiZWw6ICdQYWNrZWQnIH0sXG4gIHsgdmFsdWU6ICdzaGlwcGVkJywgbGFiZWw6ICdTaGlwcGVkJyB9LFxuICB7IHZhbHVlOiAnZGVsaXZlcmVkJywgbGFiZWw6ICdEZWxpdmVyZWQnIH0sXG4gIHsgdmFsdWU6ICdjYW5jZWxsZWQnLCBsYWJlbDogJ0NhbmNlbGxlZCcgfSxcbl1cblxuY29uc3QgUEFZTUVOVF9PUFRJT05TID0gW1xuICB7IHZhbHVlOiAncGVuZGluZycsIGxhYmVsOiAnUGVuZGluZycgfSxcbiAgeyB2YWx1ZTogJ3BhaWQnLCBsYWJlbDogJ1BhaWQnIH0sXG4gIHsgdmFsdWU6ICdmYWlsZWQnLCBsYWJlbDogJ0ZhaWxlZCcgfSxcbiAgeyB2YWx1ZTogJ3JlZnVuZGVkJywgbGFiZWw6ICdSZWZ1bmRlZCcgfSxcbl1cblxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGFtb3VudCkpIHJldHVybiAn4oK5MCdcbiAgcmV0dXJuIGDigrkke2Ftb3VudC50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KX1gXG59XG5cbmNvbnN0IGZvcm1hdERhdGVUaW1lID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICByZXR1cm4gbmV3IERhdGUodmFsdWUpLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHtcbiAgICBkYXRlU3R5bGU6ICdtZWRpdW0nLFxuICAgIHRpbWVTdHlsZTogJ3Nob3J0JyxcbiAgfSlcbn1cblxuY29uc3QgcmVzb2x2ZUltYWdlID0gKHZhbHVlKSA9PiB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QodmFsdWUpKSByZXR1cm4gdmFsdWVcbiAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJy8nKSkgcmV0dXJuIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHt2YWx1ZX1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBNb3JlTWVudSh7IHVucGFpZCwgYnVzeSwgb25DYXNoLCBvblFyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghd3JhcFJlZi5jdXJyZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSBzZXRPcGVuKGZhbHNlKVxuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKVxuICB9LCBbd3JhcFJlZl0pXG5cbiAgaWYgKCF1bnBhaWQpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1vcmVcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICBNb3JlIGFjdGlvbnNcbiAgICAgICAgPHNwYW4+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItbW9yZS1tZW51JHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4oYnVzeSl9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIG9uQ2FzaCgpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtidXN5ID09PSAnY29sbGVjdENhc2gnID8gJ1NhdmluZ+KApicgOiAnTWFyayBjYXNoIGNvbGxlY3RlZCd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihidXN5KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgb25RcigpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtidXN5ID09PSAnZ2VuZXJhdGVRcicgPyAnQ3JlYXRpbmfigKYnIDogJ0dlbmVyYXRlIHBheW1lbnQgUVInfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIHNuYXBzaG90KHBhcmFtcyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzIHx8ICcnLFxuICAgIHBheW1lbnRTdGF0dXM6IHBhcmFtcy5wYXltZW50U3RhdHVzIHx8ICcnLFxuICAgIGRlbGl2ZXJ5UGFydG5lcklkOiBwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJycsXG4gICAgY29udGFjdE5hbWU6IHBhcmFtcy5jb250YWN0TmFtZSB8fCAnJyxcbiAgICBjb250YWN0UGhvbmU6IHBhcmFtcy5jb250YWN0UGhvbmUgfHwgJycsXG4gICAgYWRkcmVzc0xpbmUxOiBwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnLFxuICAgIGFkZHJlc3NMaW5lMjogcGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJyxcbiAgICBhZGRyZXNzQ2l0eTogcGFyYW1zLmFkZHJlc3NDaXR5IHx8ICcnLFxuICAgIGFkZHJlc3NTdGF0ZTogcGFyYW1zLmFkZHJlc3NTdGF0ZSB8fCAnJyxcbiAgICBhZGRyZXNzUGluY29kZTogcGFyYW1zLmFkZHJlc3NQaW5jb2RlIHx8ICcnLFxuICAgIGFkZHJlc3NMYW5kbWFyazogcGFyYW1zLmFkZHJlc3NMYW5kbWFyayB8fCAnJyxcbiAgfVxufVxuXG5jb25zdCBPcmRlckRldGFpbCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0LCBsb2FkaW5nLCBzZXRSZWNvcmQgfSA9IHVzZVJlY29yZChpbml0aWFsUmVjb3JkLCByZXNvdXJjZS5pZClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYWN0aW9uQnVzeSwgc2V0QWN0aW9uQnVzeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfV0pXG4gIGNvbnN0IFtiYXNlbGluZSwgc2V0QmFzZWxpbmVdID0gdXNlU3RhdGUoKCkgPT4gc25hcHNob3QoaW5pdGlhbFJlY29yZD8ucGFyYW1zKSlcbiAgY29uc3QgW2VkaXRDb250YWN0LCBzZXRFZGl0Q29udGFjdF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2VkaXRBZGRyZXNzLCBzZXRFZGl0QWRkcmVzc10gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhY3Rpb24/Lm5hbWUgIT09ICdzaG93JykgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGNvbnN0IG5leHQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvc2hvd1xcLz8kLywgJy9lZGl0JylcbiAgICBpZiAobmV4dCAhPT0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShuZXh0KVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSwgW2FjdGlvbj8ubmFtZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhbXG4gICAgICAgICAgeyB2YWx1ZTogJycsIGxhYmVsOiAnVW5hc3NpZ25lZCcgfSxcbiAgICAgICAgICAuLi5yZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLnBhcmFtcz8uaXNBY3RpdmUgPT09IGZhbHNlXG4gICAgICAgICAgICAgID8gYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYFxuICAgICAgICAgICAgICA6IGl0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJyxcbiAgICAgICAgICB9KSksXG4gICAgICAgIF0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldFBhcnRuZXJzKFt7IHZhbHVlOiAnJywgbGFiZWw6ICdVbmFzc2lnbmVkJyB9XSlcbiAgICAgIH0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGl0ZW1zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocGFyYW1zLml0ZW1zSnNvbiB8fCAnW10nKVxuICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+ICh7IC4uLml0ZW0sIGltYWdlOiByZXNvbHZlSW1hZ2UoaXRlbS5pbWFnZSkgfSkpXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH0sIFtwYXJhbXMuaXRlbXNKc29uXSlcblxuICBjb25zdCBjdXJyZW50ID0gc25hcHNob3QocGFyYW1zKVxuICBjb25zdCBkaXJ0eSA9IE9iamVjdC5rZXlzKGN1cnJlbnQpLnNvbWUoKGtleSkgPT4gY3VycmVudFtrZXldICE9PSBiYXNlbGluZVtrZXldKVxuICBjb25zdCBsaXN0VXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL3JlY29yZHNcXC8uKiQvLCAnJylcbiAgY29uc3QgdW5wYWlkID0gcGFyYW1zLnBheW1lbnRTdGF0dXMgIT09ICdwYWlkJ1xuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgcGhvbmUgPSBTdHJpbmcocGFyYW1zLmNvbnRhY3RQaG9uZSB8fCAnJykucmVwbGFjZSgvXFxEL2csICcnKVxuICAgIGNvbnN0IHBpbiA9IFN0cmluZyhwYXJhbXMuYWRkcmVzc1BpbmNvZGUgfHwgJycpLnJlcGxhY2UoL1xcRC9nLCAnJylcbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuY29udGFjdE5hbWUgfHwgJycpLnRyaW0oKSB8fCBwaG9uZS5sZW5ndGggPCAxMCkge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0VudGVyIHRoZSBjdXN0b21lciBuYW1lIGFuZCBhIDEwLWRpZ2l0IGNvbnRhY3QgbnVtYmVyLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIVN0cmluZyhwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnKS50cmltKCkgfHwgIVN0cmluZyhwYXJhbXMuYWRkcmVzc0NpdHkgfHwgJycpLnRyaW0oKSB8fCAhU3RyaW5nKHBhcmFtcy5hZGRyZXNzU3RhdGUgfHwgJycpLnRyaW0oKSB8fCBwaW4ubGVuZ3RoICE9PSA2KSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnRW50ZXIgdGhlIGhvdXNlLCBjaXR5LCBzdGF0ZSwgYW5kIGEgNi1kaWdpdCBwaW5jb2RlLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzdWJtaXQoKVxuICAgICAgY29uc3QgbmV4dCA9IHJlc3BvbnNlPy5kYXRhPy5yZWNvcmQ/LnBhcmFtc1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QobmV4dCkpXG4gICAgICAgIHNldEVkaXRDb250YWN0KGZhbHNlKVxuICAgICAgICBzZXRFZGl0QWRkcmVzcyhmYWxzZSlcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJ1blBheW1lbnRBY3Rpb24gPSBhc3luYyAoYWN0aW9uTmFtZSkgPT4ge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnY29sbGVjdENhc2gnICYmICF3aW5kb3cuY29uZmlybSgnTWFyayB0aGlzIG9yZGVyIGFzIHBhaWQgaW4gY2FzaD8nKSkgcmV0dXJuXG4gICAgc2V0QWN0aW9uQnVzeShhY3Rpb25OYW1lKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZSxcbiAgICAgIH0pXG4gICAgICBpZiAocmVzcG9uc2UuZGF0YT8ucmVjb3JkKSB7XG4gICAgICAgIHNldFJlY29yZChyZXNwb25zZS5kYXRhLnJlY29yZClcbiAgICAgICAgc2V0QmFzZWxpbmUoc25hcHNob3QocmVzcG9uc2UuZGF0YS5yZWNvcmQucGFyYW1zKSlcbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZShyZXNwb25zZS5kYXRhPy5ub3RpY2UgfHwgeyBtZXNzYWdlOiAnVXBkYXRlZC4nLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwZGF0ZSBwYXltZW50LicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QWN0aW9uQnVzeSgnJylcbiAgICB9XG4gIH1cblxuICBpZiAoYWN0aW9uPy5uYW1lID09PSAnc2hvdycpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc3RhdHVzTGFiZWwgPSBGVUxGSUxMTUVOVC5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSBwYXJhbXMuc3RhdHVzKT8ubGFiZWwgfHwgJ1dhaXRpbmcgZm9yIGZ1bGZpbGxtZW50J1xuICBjb25zdCByZXN0b3JlRmllbGRzID0gKGtleXMsIGNsb3NlKSA9PiB7XG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IGhhbmRsZUNoYW5nZShrZXksIGJhc2VsaW5lW2tleV0gfHwgJycpKVxuICAgIGNsb3NlKGZhbHNlKVxuICB9XG4gIGNvbnN0IGFkZHJlc3NUZXh0ID0gW1xuICAgIHBhcmFtcy5hZGRyZXNzTGluZTEsXG4gICAgcGFyYW1zLmFkZHJlc3NMaW5lMixcbiAgICBbcGFyYW1zLmFkZHJlc3NDaXR5LCBwYXJhbXMuYWRkcmVzc1N0YXRlLCBwYXJhbXMuYWRkcmVzc1BpbmNvZGVdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpLFxuICAgIHBhcmFtcy5hZGRyZXNzTGFuZG1hcmsgPyBgTGFuZG1hcms6ICR7cGFyYW1zLmFkZHJlc3NMYW5kbWFya31gIDogJycsXG4gIF0uZmlsdGVyKEJvb2xlYW4pXG4gIGNvbnN0IHBheW1lbnRMYWJlbCA9IFBBWU1FTlRfT1BUSU9OUy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSBwYXJhbXMucGF5bWVudFN0YXR1cyk/LmxhYmVsIHx8ICdQZW5kaW5nJ1xuICBjb25zdCBwYXJ0bmVyTmFtZSA9IHBhcmFtcy5kZWxpdmVyeVBhcnRuZXJOYW1lXG4gICAgPyBgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyTmFtZX0ke3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJQaG9uZSA/IGAgwrcgJHtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVyUGhvbmV9YCA6ICcnfWBcbiAgICA6ICdObyBkZWxpdmVyeSBwYXJ0bmVyIHlldCdcbiAgY29uc3QgaXRlbUNvdW50ID0gaXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIE51bWJlcihpdGVtLnF1YW50aXR5IHx8IDApLCAwKVxuXG4gIHJldHVybiAoXG4gICAgPGZvcm0gY2xhc3NOYW1lPVwidG9rcmktb3JkZXJcIiBvblN1Ym1pdD17aGFuZGxlU2F2ZX0+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRpdGxlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYmFja1wiIGhyZWY9e2xpc3RVcmx9IGFyaWEtbGFiZWw9XCJCYWNrIHRvIG9yZGVyc1wiPuKGkDwvYT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci10aXRsZS1yb3dcIj5cbiAgICAgICAgICAgICAgPGgyPiN7cGFyYW1zLm9yZGVyTm99PC9oMj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31gfT57cGF5bWVudExhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItcGlsbCBpcy0ke3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfWB9PntzdGF0dXNMYWJlbH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwPntmb3JtYXREYXRlVGltZShwYXJhbXMuY3JlYXRlZEF0KX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWFjdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNhdmVcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9eyFkaXJ0eSB8fCBsb2FkaW5nIHx8IHNhdmluZ30+XG4gICAgICAgICAgICB7c2F2aW5nID8gJ1NhdmluZ+KApicgOiAnU2F2ZSd9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPE1vcmVNZW51XG4gICAgICAgICAgICB1bnBhaWQ9e3VucGFpZH1cbiAgICAgICAgICAgIGJ1c3k9e2FjdGlvbkJ1c3l9XG4gICAgICAgICAgICBvbkNhc2g9eygpID0+IHJ1blBheW1lbnRBY3Rpb24oJ2NvbGxlY3RDYXNoJyl9XG4gICAgICAgICAgICBvblFyPXsoKSA9PiBydW5QYXltZW50QWN0aW9uKCdnZW5lcmF0ZVFyJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1sYXlvdXRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tYWluXCI+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkLWhlYWRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItbWFyayBpcy0ke3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfWB9IC8+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57c3RhdHVzTGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2l0ZW1Db3VudH0ge2l0ZW1Db3VudCA9PT0gMSA/ICdpdGVtJyA6ICdpdGVtcyd9IMK3IHtwYXJ0bmVyTmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0dXMgfHwgJ3BlbmRpbmcnfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17RlVMRklMTE1FTlR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ3N0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2l0ZW1zLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZW1wdHlcIj5ObyBpdGVtcyBvbiB0aGlzIG9yZGVyLjwvcD5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaXRlbXNcIj5cbiAgICAgICAgICAgICAgICB7aXRlbXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2l0ZW0uaWR9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iLXdyYXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5pbWFnZSA/IDxpbWcgc3JjPXtpdGVtLmltYWdlfSBhbHQ9XCJcIiAvPiA6IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRodW1iXCIgLz59XG4gICAgICAgICAgICAgICAgICAgICAgPGVtPntpdGVtLnF1YW50aXR5fTwvZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2l0ZW0ubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS53ZWlnaHQgPyA8c3Bhbj57aXRlbS53ZWlnaHR9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xdHlcIj57Zm9ybWF0TW9uZXkoaXRlbS5wcmljZVZhbHVlKX0gw5cge2l0ZW0ucXVhbnRpdHl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8Yj57Zm9ybWF0TW9uZXkoaXRlbS5saW5lVG90YWwpfTwvYj5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZC1oZWFkXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRva3JpLW9yZGVyLW1hcmsgaXMtJHtwYXJhbXMucGF5bWVudFN0YXR1cyB8fCAncGVuZGluZyd9YH0gLz5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXltZW50TGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+e3BhcmFtcy5wYXltZW50TWV0aG9kIHx8ICdDYXNoIG9uIGRlbGl2ZXJ5J308L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1BBWU1FTlRfT1BUSU9OU31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGhhbmRsZUNoYW5nZSgncGF5bWVudFN0YXR1cycsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRvdGFsc1wiPlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5TdWJ0b3RhbDwvZHQ+PGRkPntpdGVtQ291bnR9IHtpdGVtQ291bnQgPT09IDEgPyAnaXRlbScgOiAnaXRlbXMnfTwvZGQ+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaXRlbXNUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZHQ+RGVsaXZlcnl7cGFyYW1zLmRlbGl2ZXJ5T3B0aW9uID8gYCDCtyAke3BhcmFtcy5kZWxpdmVyeU9wdGlvbiA9PT0gJ2V4cHJlc3MnID8gJzkwLW1pbnV0ZScgOiAnTW9ybmluZyd9YCA6ICcnfTwvZHQ+XG4gICAgICAgICAgICAgICAgPGRkIC8+XG4gICAgICAgICAgICAgICAgPGRkPntmb3JtYXRNb25leShwYXJhbXMuZGVsaXZlcnlDaGFyZ2UpfTwvZGQ+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PjxkdD5IYW5kbGluZzwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuaGFuZGxpbmdDaGFyZ2UpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLnNtYWxsQ2FydENoYXJnZSkgPiAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXY+PGR0PlNtYWxsIGNhcnQ8L2R0PjxkZCAvPjxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLnNtYWxsQ2FydENoYXJnZSl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtOdW1iZXIocGFyYW1zLmRpc2NvdW50KSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj48ZHQ+RGlzY291bnR7cGFyYW1zLmNvdXBvbkNvZGUgPyBgIMK3ICR7cGFyYW1zLmNvdXBvbkNvZGV9YCA6ICcnfTwvZHQ+PGRkIC8+PGRkPi17Zm9ybWF0TW9uZXkocGFyYW1zLmRpc2NvdW50KX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpcy10b3RhbFwiPjxkdD5Ub3RhbDwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNvbGxlY3RlZFwiPlxuICAgICAgICAgICAgICA8c3Bhbj57cGFyYW1zLnBheW1lbnRTdGF0dXMgPT09ICdwYWlkJyA/ICdQYWlkIGJ5IGN1c3RvbWVyJyA6ICdTdGlsbCB0byBjb2xsZWN0J308L3NwYW4+XG4gICAgICAgICAgICAgIDxiPntmb3JtYXRNb25leShwYXJhbXMuZ3JhbmRUb3RhbCl9PC9iPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7cGFyYW1zLnBheW1lbnRDb2xsZWN0ZWRBcyA/IDxwIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1ldGFcIj5Db2xsZWN0ZWQgYXMge3BhcmFtcy5wYXltZW50Q29sbGVjdGVkQXN9PC9wPiA6IG51bGx9XG4gICAgICAgICAgICB7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkID8gPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbWV0YVwiPlBheW1lbnQgSUQge3BhcmFtcy5yYXpvcnBheVBheW1lbnRJZH08L3A+IDogbnVsbH1cbiAgICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlRclVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1xclwiIHNyYz17cGFyYW1zLnJhem9ycGF5UXJVcmx9IGFsdD1cIkRvb3JzdGVwIHBheW1lbnQgUVJcIiAvPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8YXNpZGUgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2lkZVwiPlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoMz5DdXN0b21lcjwvaDM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5Db250YWN0PC9oND5cbiAgICAgICAgICAgICAge2VkaXRDb250YWN0ID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFsnY29udGFjdE5hbWUnLCAnY29udGFjdFBob25lJ10sIHNldEVkaXRDb250YWN0KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCIgb25DbGljaz17KCkgPT4gc2V0RWRpdENvbnRhY3QodHJ1ZSl9PlxuICAgICAgICAgICAgICAgICAgRWRpdFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ZWRpdENvbnRhY3QgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdC1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGFjdE5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdE5hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgUGhvbmUgbnVtYmVyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb250YWN0UGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnY29udGFjdFBob25lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXJlYWRcIj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntwYXJhbXMuY29udGFjdE5hbWUgfHwgJ+KAlCd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHA+e3BhcmFtcy5jb250YWN0UGhvbmUgPyBgKzkxICR7cGFyYW1zLmNvbnRhY3RQaG9uZX1gIDogJ+KAlCd9PC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgICAgIDxoND5TaGlwcGluZyBhZGRyZXNzPC9oND5cbiAgICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZXN0b3JlRmllbGRzKFxuICAgICAgICAgICAgICAgICAgICBbJ2FkZHJlc3NMaW5lMScsICdhZGRyZXNzTGluZTInLCAnYWRkcmVzc0NpdHknLCAnYWRkcmVzc1N0YXRlJywgJ2FkZHJlc3NQaW5jb2RlJywgJ2FkZHJlc3NMYW5kbWFyayddLFxuICAgICAgICAgICAgICAgICAgICBzZXRFZGl0QWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdFwiIG9uQ2xpY2s9eygpID0+IHNldEVkaXRBZGRyZXNzKHRydWUpfT5cbiAgICAgICAgICAgICAgICAgIEVkaXRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2VkaXRBZGRyZXNzID8gKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXQtZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBIb3VzZSAvIGZsYXRcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NMaW5lMScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBTdHJlZXQgLyBhcmVhXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYWRkcmVzcy1ncmlkXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzQ2l0eSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NDaXR5JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgU3RhdGVcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc1N0YXRlIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc1N0YXRlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzUGluY29kZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NQaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgTGFuZG1hcmtcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xhbmRtYXJrIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0xhbmRtYXJrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1yZWFkXCI+XG4gICAgICAgICAgICAgICAge2FkZHJlc3NUZXh0Lmxlbmd0aCA/IGFkZHJlc3NUZXh0Lm1hcCgobGluZSkgPT4gPHAga2V5PXtsaW5lfT57bGluZX08L3A+KSA6IDxwPuKAlDwvcD59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxoND5EZWxpdmVyeSBwYXJ0bmVyPC9oND5cbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZGVsaXZlcnlQYXJ0bmVySWQgfHwgJyd9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e3BhcnRuZXJzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2UoJ2RlbGl2ZXJ5UGFydG5lcklkJywgdmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlVuYXNzaWduZWRcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwYXJ0bmVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9hc2lkZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBPcmRlckRldGFpbFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIElucHV0LCBMYWJlbCwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBFeWVJY29uID0gKHsgaGlkZGVuIH0pID0+XG4gIGhpZGRlbiA/IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgPHBhdGggZD1cIk05LjkgNC4yQTEwLjcgMTAuNyAwIDAgMSAxMiA0YzUgMCA5IDQuNSAxMCA4YTEyLjggMTIuOCAwIDAgMS0yLjEgMy42XCIgLz5cbiAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgPC9zdmc+XG4gICkgOiAoXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICA8cGF0aCBkPVwiTTIgMTJzNC03IDEwLTcgMTAgNyAxMCA3LTQgNy0xMCA3UzIgMTIgMiAxMnpcIiAvPlxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICA8L3N2Zz5cbiAgKVxuXG5mdW5jdGlvbiBQYXNzd29yZEZpZWxkKHsgaWQsIGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIHZpc2libGUsIG9uVG9nZ2xlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgIDxMYWJlbCBodG1sRm9yPXtpZH0gcmVxdWlyZWQ+e2xhYmVsfTwvTGFiZWw+XG4gICAgICA8Qm94IHBvc2l0aW9uPVwicmVsYXRpdmVcIiB3aWR0aD1cIjEwMCVcIj5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgIHR5cGU9e3Zpc2libGUgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEV5ZUljb24gaGlkZGVuPXt2aXNpYmxlfSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmNvbnN0IENoYW5nZVBhc3N3b3JkID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2NvbmZpcm1QYXNzd29yZCwgc2V0Q29uZmlybVBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93Q29uZmlybSwgc2V0U2hvd0NvbmZpcm1dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBjbG9zZSA9ICgpID0+IHtcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2V0RXJyb3IoJycpXG4gICAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCA2KSB7XG4gICAgICBzZXRFcnJvcignUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMuJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgc2V0RXJyb3IoJ05ldyBwYXNzd29yZCBhbmQgY29uZmlybSBwYXNzd29yZCBtdXN0IGJlIHRoZSBzYW1lLicpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRTYXZpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWU6ICdjaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IHBhc3N3b3JkLCBjb25maXJtUGFzc3dvcmQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZS5kYXRhPy5ub3RpY2VcbiAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgc2V0RXJyb3Iobm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKG5vdGljZSkgYWRkTm90aWNlKG5vdGljZSlcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gcmVzcG9uc2UuZGF0YT8ucmVkaXJlY3RVcmxcbiAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlZGlyZWN0VXJsXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2xvc2UoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHBhc3N3b3JkLicpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFNhdmluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICBpbnNldDogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMiwgMTIsIDgsIDAuNjIpJyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB6SW5kZXg6IDgwLFxuICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBhcz1cImZvcm1cIlxuICAgICAgICBvblN1Ym1pdD17c2F2ZX1cbiAgICAgICAgYmc9XCJ3aGl0ZVwiXG4gICAgICAgIHdpZHRoPXtbJzEwMCUnLCAnNDIwcHgnXX1cbiAgICAgICAgcD1cInhsXCJcbiAgICAgICAgc3R5bGU9e3sgYm9yZGVyUmFkaXVzOiAxNiwgYm94U2hhZG93OiAnMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMjgpJyB9fVxuICAgICAgPlxuICAgICAgICA8SDMgbWI9XCJzbVwiPkNoYW5nZSBwYXNzd29yZDwvSDM+XG4gICAgICAgIDxUZXh0IG1iPVwieGxcIiBjb2xvcj1cIiM2NDc0OGJcIj5cbiAgICAgICAgICBTZXQgYSBuZXcgcGFzc3dvcmQgZm9yIHtyZWNvcmQ/LnBhcmFtcz8ubmFtZSB8fCByZWNvcmQ/LnBhcmFtcz8uZW1haWwgfHwgJ3RoaXMgdXNlcid9LlxuICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICBpZD1cIm5ldy1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJOZXcgcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0UGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd1Bhc3N3b3JkfVxuICAgICAgICAgIG9uVG9nZ2xlPXsoKSA9PiBzZXRTaG93UGFzc3dvcmQoKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwiY29uZmlybS1wYXNzd29yZFwiXG4gICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICB2YWx1ZT17Y29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRDb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgdmlzaWJsZT17c2hvd0NvbmZpcm19XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dDb25maXJtKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7ZXJyb3IgPyAoXG4gICAgICAgICAgPFRleHQgbWI9XCJsZ1wiIGNvbG9yPVwiI2RjMjYyNlwiPntlcnJvcn08L1RleHQ+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCIgc3R5bGU9e3sgZ2FwOiAxMCB9fT5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJidXR0b25cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9e2Nsb3NlfSBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIHZhcmlhbnQ9XCJjb250YWluZWRcIiBkaXNhYmxlZD17c2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlIHBhc3N3b3JkJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VQYXNzd29yZFxuIiwiLyoqIElTTyAzMTY2LTI6SU4gY29kZXMuIEtlcHQgbmV4dCB0byB0aGUgQWRtaW5KUyBmb3JtIHNvIHRoZSBkcm9wZG93biBhbHdheXMgaGFzIGV2ZXJ5IHN0YXRlLiAqL1xuZXhwb3J0IGNvbnN0IElORElBX1NUQVRFUyA9IFtcbiAgeyBjb2RlOiAnQU4nLCBuYW1lOiAnQW5kYW1hbiBhbmQgTmljb2JhciBJc2xhbmRzJyB9LFxuICB7IGNvZGU6ICdBUCcsIG5hbWU6ICdBbmRocmEgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnQVInLCBuYW1lOiAnQXJ1bmFjaGFsIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ0FTJywgbmFtZTogJ0Fzc2FtJyB9LFxuICB7IGNvZGU6ICdCUicsIG5hbWU6ICdCaWhhcicgfSxcbiAgeyBjb2RlOiAnQ0gnLCBuYW1lOiAnQ2hhbmRpZ2FyaCcgfSxcbiAgeyBjb2RlOiAnQ1QnLCBuYW1lOiAnQ2hoYXR0aXNnYXJoJyB9LFxuICB7IGNvZGU6ICdESCcsIG5hbWU6ICdEYWRyYSBhbmQgTmFnYXIgSGF2ZWxpIGFuZCBEYW1hbiBhbmQgRGl1JyB9LFxuICB7IGNvZGU6ICdETCcsIG5hbWU6ICdEZWxoaScgfSxcbiAgeyBjb2RlOiAnR0EnLCBuYW1lOiAnR29hJyB9LFxuICB7IGNvZGU6ICdHSicsIG5hbWU6ICdHdWphcmF0JyB9LFxuICB7IGNvZGU6ICdIUicsIG5hbWU6ICdIYXJ5YW5hJyB9LFxuICB7IGNvZGU6ICdIUCcsIG5hbWU6ICdIaW1hY2hhbCBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdKSycsIG5hbWU6ICdKYW1tdSBhbmQgS2FzaG1pcicgfSxcbiAgeyBjb2RlOiAnSkgnLCBuYW1lOiAnSmhhcmtoYW5kJyB9LFxuICB7IGNvZGU6ICdLQScsIG5hbWU6ICdLYXJuYXRha2EnIH0sXG4gIHsgY29kZTogJ0tMJywgbmFtZTogJ0tlcmFsYScgfSxcbiAgeyBjb2RlOiAnTEEnLCBuYW1lOiAnTGFkYWtoJyB9LFxuICB7IGNvZGU6ICdMRCcsIG5hbWU6ICdMYWtzaGFkd2VlcCcgfSxcbiAgeyBjb2RlOiAnTVAnLCBuYW1lOiAnTWFkaHlhIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ01IJywgbmFtZTogJ01haGFyYXNodHJhJyB9LFxuICB7IGNvZGU6ICdNTicsIG5hbWU6ICdNYW5pcHVyJyB9LFxuICB7IGNvZGU6ICdNTCcsIG5hbWU6ICdNZWdoYWxheWEnIH0sXG4gIHsgY29kZTogJ01aJywgbmFtZTogJ01pem9yYW0nIH0sXG4gIHsgY29kZTogJ05MJywgbmFtZTogJ05hZ2FsYW5kJyB9LFxuICB7IGNvZGU6ICdPUicsIG5hbWU6ICdPZGlzaGEnIH0sXG4gIHsgY29kZTogJ1BZJywgbmFtZTogJ1B1ZHVjaGVycnknIH0sXG4gIHsgY29kZTogJ1BCJywgbmFtZTogJ1B1bmphYicgfSxcbiAgeyBjb2RlOiAnUkonLCBuYW1lOiAnUmFqYXN0aGFuJyB9LFxuICB7IGNvZGU6ICdTSycsIG5hbWU6ICdTaWtraW0nIH0sXG4gIHsgY29kZTogJ1ROJywgbmFtZTogJ1RhbWlsIE5hZHUnIH0sXG4gIHsgY29kZTogJ1RHJywgbmFtZTogJ1RlbGFuZ2FuYScgfSxcbiAgeyBjb2RlOiAnVFInLCBuYW1lOiAnVHJpcHVyYScgfSxcbiAgeyBjb2RlOiAnVVAnLCBuYW1lOiAnVXR0YXIgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnVVQnLCBuYW1lOiAnVXR0YXJha2hhbmQnIH0sXG4gIHsgY29kZTogJ1dCJywgbmFtZTogJ1dlc3QgQmVuZ2FsJyB9LFxuXVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0LCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcbmltcG9ydCB7IElORElBX1NUQVRFUyB9IGZyb20gJy4vaW5kaWEtc3RhdGVzLmpzJ1xuXG5jb25zdCBWRUhJQ0xFX1RZUEVTID0gW1xuICB7IHZhbHVlOiAnQmlrZScsIGxhYmVsOiAnQmlrZScgfSxcbiAgeyB2YWx1ZTogJ1Njb290ZXInLCBsYWJlbDogJ1Njb290ZXInIH0sXG4gIHsgdmFsdWU6ICdFbGVjdHJpYyBiaWtlJywgbGFiZWw6ICdFbGVjdHJpYyBiaWtlJyB9LFxuICB7IHZhbHVlOiAnQ3ljbGUnLCBsYWJlbDogJ0N5Y2xlJyB9LFxuICB7IHZhbHVlOiAnVmFuJywgbGFiZWw6ICdWYW4nIH0sXG4gIHsgdmFsdWU6ICdPdGhlcicsIGxhYmVsOiAnT3RoZXInIH0sXG5dXG5cbmNvbnN0IFNUQVRFX09QVElPTlMgPSBJTkRJQV9TVEFURVMubWFwKChpdGVtKSA9PiAoe1xuICB2YWx1ZTogaXRlbS5uYW1lLFxuICBsYWJlbDogaXRlbS5uYW1lLFxufSkpXG5cbmZ1bmN0aW9uIEZpZWxkRXJyb3IoeyBlcnJvciB9KSB7XG4gIGlmICghZXJyb3I/Lm1lc3NhZ2UpIHJldHVybiBudWxsXG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvci5tZXNzYWdlfTwvc3Bhbj5cbn1cblxuY29uc3QgUGFydG5lckVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc05ldyA9IGFjdGlvbj8ubmFtZSA9PT0gJ25ldycgfHwgIXJlY29yZD8uaWRcbiAgY29uc3QgcmVhZE9ubHkgPSBhY3Rpb24/Lm5hbWUgPT09ICdzaG93J1xuICBjb25zdCBoYXNQYXNzd29yZCA9IEJvb2xlYW4ocGFyYW1zLmhhc1Bhc3N3b3JkKVxuICBjb25zdCBpc0FjdGl2ZSA9IGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFydG5lcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3XG4gICAgICAgICAgICA/ICdQYXJ0bmVyIHNhdmVkLiBBIHBhc3N3b3JkIGVtYWlsIHdpbGwgYmUgc2VudCBpZiB0aGV5IGRvIG5vdCBoYXZlIGEgcGFzc3dvcmQgeWV0LidcbiAgICAgICAgICAgIDogJ1BhcnRuZXIgdXBkYXRlZCcsXG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwYXJ0bmVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGRlbGl2ZXJ5IHBhcnRuZXInIDogcGFyYW1zLm5hbWUgfHwgJ0RlbGl2ZXJ5IHBhcnRuZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBDb2xsZWN0IGZ1bGwgS1lDIGFuZCBjb250YWN0IGRldGFpbHMuIFRoZXkgbG9nIGluIHRvIHRoZSBUb2tyaWlpIFBhcnRuZXIgYXBwIHdpdGggdGhpcyBlbWFpbFxuICAgICAgICAgIGFmdGVyIHNldHRpbmcgYSBwYXNzd29yZCBmcm9tIHRoZSBpbnZpdGUgbWFpbC5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPkluYWN0aXZlIHBhcnRuZXJzIGNhbm5vdCBsb2cgaW4sIGV2ZW4gaWYgdGhleSBhbHJlYWR5IHNldCBhIHBhc3N3b3JkLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBzaWduIGluIHRvIHRoZSBwYXJ0bmVyIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7IWlzTmV3ID8gKFxuICAgICAgICAgICAgPFRleHQgbXQ9XCJsZ1wiIG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgIHtoYXNQYXNzd29yZCA/ICdQYXNzd29yZCBpcyBhbHJlYWR5IHNldC4nIDogJ05vIHBhc3N3b3JkIHlldCDigJQgc2VuZCB0aGUgaW52aXRlIGVtYWlsIGFmdGVyIHNhdmluZy4nfVxuICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+TG9naW4gZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+RW1haWwgaXMgdXNlZCB0byBjcmVhdGUgYW5kIHJlc2V0IHRoZSBwYXJ0bmVyIHBhc3N3b3JkLiBObyBTTVMgaXMgc2VudC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRW1haWxcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZW1haWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWFpbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwicGFydG5lckBleGFtcGxlLmNvbVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5lbWFpbCA/IDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1haWx9IC8+IDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+UGFzc3dvcmQgbGluayBpcyBzZW50IHRvIHRoaXMgaW5ib3g8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTW9iaWxlIG51bWJlclxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEwfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaG9uZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDEwKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMTAtZGlnaXQgbnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnBob25lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UGVyc29uYWwgZGV0YWlsczwvaDQ+XG4gICAgICAgIDxwPk5hbWUgaXMgc2hvd24gb24gb3JkZXJzLiBGYXRoZXImYXBvcztzIG5hbWUgYW5kIERPQiBoZWxwIHdpdGggS1lDIHJlY29yZHMuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGdWxsIG5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBhcnRuZXIgZnVsbCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLm5hbWV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBGYXRoZXImYXBvcztzIC8gZ3VhcmRpYW4gbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmZhdGhlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdmYXRoZXJOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBcyBvbiBBYWRoYWFyIC8gZG9jdW1lbnRzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBEYXRlIG9mIGJpcnRoIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmRhdGVPZkJpcnRoIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2RhdGVPZkJpcnRoJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+S1lDIGRvY3VtZW50czwvaDQ+XG4gICAgICAgIDxwPlBBTiBhbmQgQWFkaGFhciBhcmUgcmVxdWlyZWQgZm9yIHBhcnRuZXIgb25ib2FyZGluZy48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBBTiBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGFuTnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYW5OdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bXkEtWjAtOV0vZywgJycpLnNsaWNlKDAsIDEwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFCQ0RFMTIzNEZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGFuTnVtYmVyfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWFkaGFhciBudW1iZXJcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezEyfVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFhZGhhYXJOdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ2FhZGhhYXJOdW1iZXInLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMikpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMi1kaWdpdCBBYWRoYWFyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmFhZGhhYXJOdW1iZXJ9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5DdXJyZW50IGFkZHJlc3M8L2g0PlxuICAgICAgICA8cD5XaGVyZSB0aGUgcGFydG5lciBjdXJyZW50bHkgbGl2ZXMgLyBvcGVyYXRlcyBmcm9tLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDFcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUxIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWRkcmVzc0xpbmUxJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSAvIHN0cmVldCAvIGFyZWFcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuYWRkcmVzc0xpbmUxfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWRkcmVzcyBsaW5lIDIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhZGRyZXNzTGluZTInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxhbmRtYXJrLCBjb2xvbnlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jaXR5IHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2l0eVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5jaXR5fSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17Nn1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5waW5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGluY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDYpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI2LWRpZ2l0IHBpbmNvZGVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGluY29kZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFN0YXRlXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCBzdGF0ZScgfSwgLi4uU1RBVEVfT1BUSU9OU119XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ3N0YXRlJywgbmV4dCl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5zdGF0ZX0gLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIFBlcm1hbmVudCBhZGRyZXNzIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dCB0b2tyaS10ZXh0YXJlYVwiXG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wZXJtYW5lbnRBZGRyZXNzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3Blcm1hbmVudEFkZHJlc3MnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJJZiBkaWZmZXJlbnQgZnJvbSBjdXJyZW50IGFkZHJlc3NcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RW1lcmdlbmN5IGNvbnRhY3Q8L2g0PlxuICAgICAgICAgIDxwPlNvbWVvbmUgd2UgY2FuIGNhbGwgaWYgdGhlIHBhcnRuZXIgaXMgdW5yZWFjaGFibGUuPC9wPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENvbnRhY3QgbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtZXJnZW5jeU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdlbWVyZ2VuY3lOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJSZWxhdGl2ZSAvIGZyaWVuZCBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDb250YWN0IG1vYmlsZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5lbWVyZ2VuY3lQaG9uZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnZW1lcmdlbmN5UGhvbmUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCAxMCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMC1kaWdpdCBudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1lcmdlbmN5UGhvbmV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlZlaGljbGUgZGV0YWlsczwvaDQ+XG4gICAgICAgICAgPHA+VXNlZCBmb3IgZGVsaXZlcnkgYXNzaWdubWVudCBhbmQgc3VwcG9ydC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgVmVoaWNsZSB0eXBlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiA2IH19PlxuICAgICAgICAgICAgICA8TG9jYWxTZWxlY3RcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZlaGljbGVUeXBlIHx8ICcnfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdTZWxlY3QgdmVoaWNsZScgfSwgLi4uVkVISUNMRV9UWVBFU119XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgndmVoaWNsZVR5cGUnLCBuZXh0KX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFZlaGljbGUgbnVtYmVyIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudmVoaWNsZU51bWJlciB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgndmVoaWNsZU51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnNsaWNlKDAsIDIwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gTUgxMkFCMTIzNFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QmFuayBkZXRhaWxzPC9oND5cbiAgICAgICAgPHA+Rm9yIHBheW91dHMgYW5kIHJlaW1idXJzZW1lbnRzLiBPcHRpb25hbCBmb3Igbm93LCBidXQgcmVjb21tZW5kZWQuPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBY2NvdW50IGhvbGRlciBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWNjb3VudEhvbGRlck5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhY2NvdW50SG9sZGVyTmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXMgcGVyIGJhbmsgYWNjb3VudFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQWNjb3VudCBudW1iZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hY2NvdW50TnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnYWNjb3VudE51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQmFuayBhY2NvdW50IG51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgSUZTQyBjb2RlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICBtYXhMZW5ndGg9ezExfVxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5pZnNjQ29kZSB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgIHNldEZpZWxkKCdpZnNjQ29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1teQS1aMC05XS9nLCAnJykuc2xpY2UoMCwgMTEpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTQklOMDAwMTIzNFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmlmc2NDb2RlfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+SW50ZXJuYWwgbm90ZXM8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgTm90ZXMgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLXRleHRhcmVhXCJcbiAgICAgICAgICAgIHJvd3M9ezR9XG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5vdGVzIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25vdGVzJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2hpZnQgdGltaW5nLCBodWIsIG9yIGFueXRoaW5nIHlvdXIgdGVhbSBzaG91bGQgcmVtZW1iZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyZWFkT25seSA/IG51bGwgOiAoXG4gICAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHBhcnRuZXInIDogJ1NhdmUgcGFydG5lcid9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0bmVyRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IFNlYXJjaGFibGVTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuaW1wb3J0IHsgSU5ESUFfU1RBVEVTIH0gZnJvbSAnLi9pbmRpYS1zdGF0ZXMuanMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTVEFURV9PUFRJT05TID0gSU5ESUFfU1RBVEVTLm1hcCgoaXRlbSkgPT4gKHtcbiAgdmFsdWU6IGl0ZW0uY29kZSxcbiAgbGFiZWw6IGAke2l0ZW0ubmFtZX0gKCR7aXRlbS5jb2RlfSlgLFxufSkpXG5cbmNvbnN0IFBpbmNvZGVFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IHJlYWRPbmx5ID0gYWN0aW9uPy5uYW1lID09PSAnc2hvdydcbiAgY29uc3QgaXNBY3RpdmUgPSBpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgbW9ybmluZ0VuYWJsZWQgPSBpc05ldyAmJiAocGFyYW1zLm1vcm5pbmdFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1vcm5pbmdFbmFibGVkID09PSAnJylcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5tb3JuaW5nRW5hYmxlZClcbiAgY29uc3QgZXhwcmVzc0VuYWJsZWQgPSBpc05ldyAmJiAocGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSAnJylcbiAgICA/IGZhbHNlXG4gICAgOiBpc0ZsYWdPbihwYXJhbXMuZXhwcmVzc0VuYWJsZWQpXG4gIGNvbnN0IFtwYXJ0bmVycywgc2V0UGFydG5lcnNdID0gdXNlU3RhdGUoW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ2lzQWN0aXZlJywgdHJ1ZSlcbiAgICB9XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRW5hYmxlZCcsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmV4cHJlc3NFbmFibGVkID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnZXhwcmVzc0VuYWJsZWQnLCBmYWxzZSlcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNOZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgYXBpXG4gICAgICAucmVzb3VyY2VBY3Rpb24oeyByZXNvdXJjZUlkOiAnRGVsaXZlcnlQYXJ0bmVyJywgYWN0aW9uTmFtZTogJ2xpc3QnLCBwYXJhbXM6IHsgcGVyUGFnZTogMjAwIH0gfSlcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoaWdub3JlKSByZXR1cm5cbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IHJlc3BvbnNlLmRhdGE/LnJlY29yZHMgfHwgW11cbiAgICAgICAgc2V0UGFydG5lcnMoXG4gICAgICAgICAgcmVjb3Jkcy5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5pZCB8fCBpdGVtLnBhcmFtcz8uaWQsXG4gICAgICAgICAgICBsYWJlbDogaXNGbGFnT24oaXRlbS5wYXJhbXM/LmlzQWN0aXZlKVxuICAgICAgICAgICAgICA/IGl0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJ1xuICAgICAgICAgICAgICA6IGAke2l0ZW0ucGFyYW1zPy5uYW1lIHx8ICdQYXJ0bmVyJ30gKGluYWN0aXZlKWAsXG4gICAgICAgICAgfSkpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldFBhcnRuZXJzKFtdKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgZXJyb3JzID0gdXNlTWVtbygoKSA9PiByZWNvcmQ/LmVycm9ycyB8fCB7fSwgW3JlY29yZD8uZXJyb3JzXSlcbiAgY29uc3QgcGFydG5lcklkID0gcGFyYW1zLnBhcnRuZXJJZCB8fCBwYXJhbXMucGFydG5lciB8fCAnJ1xuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGluY29kZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBpc05ldyA/ICdQaW5jb2RlIGFkZGVkJyA6ICdQaW5jb2RlIHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcGluY29kZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e2lzTmV3ID8gJ0FkZCBzZXJ2aWNlYWJsZSBwaW5jb2RlJyA6IGBQSU4gJHtwYXJhbXMucGluY29kZSB8fCAnJ31gfTwvSDM+XG4gICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgY29sb3I6ICcjZmZmJywgb3BhY2l0eTogMC45IH19PlxuICAgICAgICAgIEN1c3RvbWVycyBjYW4gc2F2ZSBhbiBhZGRyZXNzIGFuZCBjaGVjayBvdXQgb25seSB3aGVuIHRoaXMgcGluY29kZSBpcyBhY3RpdmUuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkRlbGl2ZXJ5IGNvdmVyYWdlPC9oND5cbiAgICAgICAgICA8cD5UdXJuIHRoaXMgb2ZmIHRvIHN0b3AgdGFraW5nIG9yZGVycyBmb3IgdGhpcyBQSU4gd2l0aG91dCBkZWxldGluZyBpdC48L3A+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICB0aXRsZT17aXNBY3RpdmUgPyAnV2UgZGVsaXZlciBoZXJlJyA6ICdOb3QgZGVsaXZlcmluZyd9XG4gICAgICAgICAgICBoaW50PXtpc0FjdGl2ZSA/ICdBZGRyZXNzIHNhdmUgYW5kIGNoZWNrb3V0IGFyZSBhbGxvd2VkJyA6ICdDdXN0b21lcnMgd2lsbCBzZWUgdGhhdCB0aGlzIFBJTiBpcyBub3Qgc2VydmljZWFibGUnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGVsaXZlcnkgb3B0aW9uczwvaDQ+XG4gICAgICAgICAgPHA+VHVybiBhbiBvcHRpb24gb2ZmIHRvIHNob3cgaXQgYXMgY29taW5nIHNvb24gYXQgY2hlY2tvdXQuIElmIGJvdGggYXJlIG9mZiwgdGhpcyBQSU4gaXMgbm90IGRlbGl2ZXJhYmxlLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXttb3JuaW5nRW5hYmxlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIG9uTGFiZWw9XCJPblwiXG4gICAgICAgICAgICBvZmZMYWJlbD1cIk9mZlwiXG4gICAgICAgICAgICB0aXRsZT1cIk1vcm5pbmcgZGVsaXZlcnlcIlxuICAgICAgICAgICAgaGludD17bW9ybmluZ0VuYWJsZWQgPyAnU2hvcHBlcnMgY2FuIGNob29zZSBtb3JuaW5nIGRlbGl2ZXJ5JyA6ICdTaG93biBhcyBjb21pbmcgc29vbid9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdtb3JuaW5nRW5hYmxlZCcsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17ZXhwcmVzc0VuYWJsZWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICBvbkxhYmVsPVwiT25cIlxuICAgICAgICAgICAgb2ZmTGFiZWw9XCJPZmZcIlxuICAgICAgICAgICAgdGl0bGU9XCI5MC1NaW51dGUgZGVsaXZlcnlcIlxuICAgICAgICAgICAgaGludD17ZXhwcmVzc0VuYWJsZWQgPyAnU2hvcHBlcnMgY2FuIGNob29zZSA5MC1taW51dGUgZGVsaXZlcnknIDogJ1Nob3duIGFzIGNvbWluZyBzb29uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2V4cHJlc3NFbmFibGVkJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkFzc2lnbmVkIHBhcnRuZXI8L2g0PlxuICAgICAgICAgIDxwPk5ldyBvcmRlcnMgaW4gdGhpcyBQSU4gYXJlIGF1dG8tYXNzaWduZWQgdG8gdGhpcyBwYXJ0bmVyLiBZb3UgY2FuIHJlYXNzaWduIGxhdGVyIG9uIHRoZSBvcmRlci48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRGVsaXZlcnkgcGFydG5lciA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8U2VhcmNoYWJsZVNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFydG5lcklkfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbeyB2YWx1ZTogJycsIGxhYmVsOiAnTm8gcGFydG5lciBhc3NpZ25lZCcgfSwgLi4ucGFydG5lcnNdfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYXJ0bmVySWQnLCBuZXh0KVxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdwYXJ0bmVyJywgbmV4dClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgYSBwYXJ0bmVyXCJcbiAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggcGFydG5lcnNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkxvY2F0aW9uPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUGluY29kZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICBtYXhMZW5ndGg9ezZ9XG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seSB8fCAhaXNOZXd9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMucGluY29kZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3BpbmNvZGUnLCBldmVudC50YXJnZXQudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKS5zbGljZSgwLCA2KSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiNi1kaWdpdCBQSU5cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMucGluY29kZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5waW5jb2RlLm1lc3NhZ2V9PC9zcGFuPiA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkluZGlhIFBJTiBjb2RlLCA2IGRpZ2l0czwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBcmVhIG5hbWUgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hcmVhTGFiZWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhcmVhTGFiZWwnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFuZGhlcmkgV2VzdCwgQmFuZHJhLCDigKZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2l0eVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jaXR5IHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnY2l0eScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTXVtYmFpXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLmNpdHkgPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMuY2l0eS5tZXNzYWdlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhdGVcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuc3RhdGVDb2RlIHx8IHBhcmFtcy5zdGF0ZSB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCBzdGF0ZScgfSwgLi4uU1RBVEVfT1BUSU9OU119XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3N0YXRlQ29kZScsIG5leHQpXG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3N0YXRlJywgbmV4dClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3Qgc3RhdGVcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBzdGF0ZXNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMuc3RhdGUgfHwgZXJyb3JzLnN0YXRlQ29kZSA/IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj5cbiAgICAgICAgICAgICAgICB7KGVycm9ycy5zdGF0ZSB8fCBlcnJvcnMuc3RhdGVDb2RlKS5tZXNzYWdlfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+QWxsIEluZGlhbiBzdGF0ZXMgYW5kIHVuaW9uIHRlcnJpdG9yaWVzPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAge3JlYWRPbmx5ID8gbnVsbCA6IChcbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICAgIHtpc05ldyA/ICdBZGQgcGluY29kZScgOiAnU2F2ZSBwaW5jb2RlJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpbmNvZGVFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU3RhdHVzU3dpdGNoLCBpc0ZsYWdPbiB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuXG5jb25zdCBTdGF0dXNUb2dnbGUgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlLCBwcm9wZXJ0eSwgd2hlcmUsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBmaWVsZCA9IHByb3BlcnR5Py5wYXRoIHx8ICdpc0FjdGl2ZSdcbiAgY29uc3QgYWN0aW9uTmFtZSA9IHByb3BlcnR5Py5jdXN0b20/LmFjdGlvbk5hbWUgfHwgJ3RvZ2dsZUFjdGl2ZSdcbiAgY29uc3Qgb25MYWJlbCA9IHByb3BlcnR5Py5jdXN0b20/Lm9uTGFiZWwgfHwgJ0FjdGl2ZSdcbiAgY29uc3Qgb2ZmTGFiZWwgPSBwcm9wZXJ0eT8uY3VzdG9tPy5vZmZMYWJlbCB8fCAnSW5hY3RpdmUnXG4gIGNvbnN0IHJhdyA9IHJlY29yZD8ucGFyYW1zPy5bZmllbGRdXG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlKGlzRmxhZ09uKHJhdykpXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q2hlY2tlZChpc0ZsYWdPbihyYXcpKVxuICB9LCBbcmF3LCByZWNvcmQ/LmlkXSlcblxuICBjb25zdCBwZXJzaXN0ID0gYXN5bmMgKG5leHQpID0+IHtcbiAgICBpZiAoIXJlY29yZD8uaWQpIHJldHVyblxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVjb3JkQWN0aW9uKHtcbiAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UuaWQsXG4gICAgICAgIHJlY29yZElkOiByZWNvcmQuaWQsXG4gICAgICAgIGFjdGlvbk5hbWUsXG4gICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiB7IFtmaWVsZF06IG5leHQgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBzYXZlZCA9IHJlc3BvbnNlLmRhdGE/LnJlY29yZD8ucGFyYW1zPy5bZmllbGRdXG4gICAgICBzZXRDaGVja2VkKHNhdmVkID09PSB1bmRlZmluZWQgPyBuZXh0IDogaXNGbGFnT24oc2F2ZWQpKVxuICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2UuZGF0YT8ubm90aWNlXG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBub3RpY2U/Lm1lc3NhZ2UgfHwgKG5leHQgPyBgTWFya2VkICR7b25MYWJlbC50b0xvd2VyQ2FzZSgpfWAgOiBgTWFya2VkICR7b2ZmTGFiZWwudG9Mb3dlckNhc2UoKX1gKSxcbiAgICAgICAgdHlwZTogbm90aWNlPy50eXBlIHx8ICdzdWNjZXNzJyxcbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGRhdGUgc3RhdHVzLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAobmV4dCkgPT4ge1xuICAgIGlmICh3aGVyZSA9PT0gJ2VkaXQnICYmIHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0Q2hlY2tlZChuZXh0KVxuICAgICAgb25DaGFuZ2UoZmllbGQsIG5leHQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGVyc2lzdChuZXh0KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhdHVzU3dpdGNoXG4gICAgICBjb21wYWN0PXt3aGVyZSAhPT0gJ2VkaXQnfVxuICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgIGRpc2FibGVkPXtidXN5fVxuICAgICAgb25MYWJlbD17b25MYWJlbH1cbiAgICAgIG9mZkxhYmVsPXtvZmZMYWJlbH1cbiAgICAgIHRpdGxlPXt3aGVyZSA9PT0gJ2VkaXQnID8gKGNoZWNrZWQgPyBvbkxhYmVsIDogb2ZmTGFiZWwpIDogdW5kZWZpbmVkfVxuICAgICAgaGludD17d2hlcmUgPT09ICdlZGl0JyA/IHByb3BlcnR5Py5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZH1cbiAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNUb2dnbGVcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU3RhdHVzU3dpdGNoLCBpc0ZsYWdPbiB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmZ1bmN0aW9uIHBhZCh2YWx1ZSkge1xuICByZXR1cm4gU3RyaW5nKHZhbHVlKS5wYWRTdGFydCgyLCAnMCcpXG59XG5cbmZ1bmN0aW9uIHRvRGF0ZUlucHV0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCB0ZXh0ID0gU3RyaW5nKHZhbHVlKVxuICBpZiAoL15cXGR7NH0tXFxkezJ9LVxcZHsyfS8udGVzdCh0ZXh0KSkgcmV0dXJuIHRleHQuc2xpY2UoMCwgMTApXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke3BhZChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtwYWQoZGF0ZS5nZXREYXRlKCkpfWBcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2hlbih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gJ+KAlCdcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICfigJQnXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgZGF0ZVN0eWxlOiAnbWVkaXVtJywgdGltZVN0eWxlOiAnc2hvcnQnIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlQWRkcmVzc2VzKHBhcmFtcykge1xuICBjb25zdCByYXcgPSBwYXJhbXMuYWRkcmVzc2VzXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcuZmlsdGVyKEJvb2xlYW4pXG4gIGlmIChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gJ29iamVjdCcpIHJldHVybiBbcmF3XVxuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycgJiYgcmF3LnRyaW0oKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHJldHVybiBwYXJzZWQuZmlsdGVyKEJvb2xlYW4pXG4gICAgICBpZiAocGFyc2VkICYmIHR5cGVvZiBwYXJzZWQgPT09ICdvYmplY3QnKSByZXR1cm4gW3BhcnNlZF1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGZsYXR0ZW5lZCBBZG1pbkpTIHBhcmFtcyBiZWxvd1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdyb3VwZWQgPSB7fVxuICBPYmplY3QuZW50cmllcyhwYXJhbXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IG1hdGNoID0ga2V5Lm1hdGNoKC9eYWRkcmVzc2VzXFwuKFxcZCspXFwuKC4rKSQvKVxuICAgIGlmICghbWF0Y2ggfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHJldHVyblxuICAgIGNvbnN0IFssIGluZGV4LCBmaWVsZF0gPSBtYXRjaFxuICAgIGdyb3VwZWRbaW5kZXhdID0gZ3JvdXBlZFtpbmRleF0gfHwge31cbiAgICBncm91cGVkW2luZGV4XVtmaWVsZF0gPSB2YWx1ZVxuICB9KVxuICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBlZClcbiAgICAuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuICAgIC5tYXAoKGtleSkgPT4gZ3JvdXBlZFtrZXldKVxufVxuXG5mdW5jdGlvbiBhZGRyZXNzTGluZXMoYWRkcmVzcykge1xuICByZXR1cm4gW1xuICAgIGFkZHJlc3MubGluZTEsXG4gICAgYWRkcmVzcy5saW5lMixcbiAgICBbYWRkcmVzcy5jaXR5LCBhZGRyZXNzLnN0YXRlLCBhZGRyZXNzLnBpbmNvZGVdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpLFxuICAgIGFkZHJlc3MubGFuZG1hcmsgPyBgTGFuZG1hcms6ICR7YWRkcmVzcy5sYW5kbWFya31gIDogJycsXG4gIF0uZmlsdGVyKEJvb2xlYW4pXG59XG5cbmNvbnN0IEN1c3RvbWVyRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc0FjdGl2ZSA9IHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJydcbiAgICA/IHRydWVcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FjdGl2ZSlcbiAgY29uc3QgYWRkcmVzc2VzID0gdXNlTWVtbygoKSA9PiBwYXJzZUFkZHJlc3NlcyhwYXJhbXMpLCBbcGFyYW1zXSlcbiAgY29uc3QgZXJyb3JzID0gdXNlTWVtbygoKSA9PiByZWNvcmQ/LmVycm9ycyB8fCB7fSwgW3JlY29yZD8uZXJyb3JzXSlcbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIGN1c3RvbWVyJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDdXN0b21lciB1cGRhdGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIGN1c3RvbWVyLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ0N1c3RvbWVyJ308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgKzkxIHtwYXJhbXMucGhvbmUgfHwgJ+KAlCd9IMK3IGpvaW5lZCB7Zm9ybWF0V2hlbihwYXJhbXMuY3JlYXRlZEF0KX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPkluYWN0aXZlIGN1c3RvbWVycyBjYW5ub3Qgc2lnbiBpbiB3aXRoIHRoaXMgbW9iaWxlIG51bWJlci48L3A+XG4gICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17aXNBY3RpdmV9XG4gICAgICAgICAgICB0aXRsZT17aXNBY3RpdmUgPyAnQWN0aXZlJyA6ICdJbmFjdGl2ZSd9XG4gICAgICAgICAgICBoaW50PXtpc0FjdGl2ZSA/ICdDYW4gbG9nIGluIG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAnIDogJ0xvZ2luIGlzIGJsb2NrZWQgdW50aWwgeW91IHR1cm4gdGhpcyBvbid9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9maWxlPC9oND5cbiAgICAgICAgICA8cD5QaG9uZSBjb21lcyBmcm9tIE9UUCBsb2dpbiBhbmQgc3RheXMgYXMgdGhlIGN1c3RvbWVy4oCZcyBsb2dpbiBpZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkN1c3RvbWVyIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMubmFtZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5uYW1lLm1lc3NhZ2V9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgTW9iaWxlXG4gICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIiB2YWx1ZT17cGFyYW1zLnBob25lIHx8ICcnfSByZWFkT25seSAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgRGF0ZSBvZiBiaXJ0aFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRlSW5wdXQocGFyYW1zLmRhdGVPZkJpcnRoKX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZGF0ZU9mQmlydGgnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICB7ZXJyb3JzLmRhdGVPZkJpcnRoID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLmRhdGVPZkJpcnRoLm1lc3NhZ2V9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlNhdmVkIGFkZHJlc3NlczwvaDQ+XG4gICAgICAgIDxwPlxuICAgICAgICAgIHthZGRyZXNzZXMubGVuZ3RoXG4gICAgICAgICAgICA/IGAke2FkZHJlc3Nlcy5sZW5ndGh9IGFkZHJlc3Mke2FkZHJlc3Nlcy5sZW5ndGggPT09IDEgPyAnJyA6ICdlcyd9IHNhdmVkIGluIHRoZSBjdXN0b21lciBhY2NvdW50LmBcbiAgICAgICAgICAgIDogJ1RoaXMgY3VzdG9tZXIgaGFzIG5vdCBzYXZlZCBhIGRlbGl2ZXJ5IGFkZHJlc3MgeWV0Lid9XG4gICAgICAgIDwvcD5cbiAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGggPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hZGRyZXNzLWdyaWRcIj5cbiAgICAgICAgICAgIHthZGRyZXNzZXMubWFwKChhZGRyZXNzLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2FkZHJlc3MuaWQgfHwgYCR7YWRkcmVzcy5waW5jb2RlfS0ke2luZGV4fWB9IGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtY2FyZFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy10b3BcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtbGFiZWxcIj57YWRkcmVzcy5sYWJlbCB8fCAnQWRkcmVzcyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAge2FkZHJlc3MucGluY29kZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtcGluXCI+e2FkZHJlc3MucGluY29kZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPnthZGRyZXNzLm5hbWUgfHwgcGFyYW1zLm5hbWUgfHwgJ0N1c3RvbWVyJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICB7YWRkcmVzcy5waG9uZSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtcGhvbmVcIj4rOTEge2FkZHJlc3MucGhvbmV9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgICAgICAge2FkZHJlc3NMaW5lcyhhZGRyZXNzKS5tYXAoKGxpbmUpID0+IChcbiAgICAgICAgICAgICAgICAgIDxwIGtleT17bGluZX0+e2xpbmV9PC9wPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGN1c3RvbWVyXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tZXJFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgUk9MRVMgPSBbXG4gIHsgdmFsdWU6ICdzdGFmZicsIHRpdGxlOiAnU3RhZmYnLCBoaW50OiAnQWNjZXNzIG9ubHkgdGhlIGFyZWFzIHlvdSB0aWNrIGJlbG93JyB9LFxuICB7IHZhbHVlOiAnYWRtaW4nLCB0aXRsZTogJ0FkbWluJywgaGludDogJ0Z1bGwgYWNjZXNzIHRvIHRoZSBDTVMnIH0sXG4gIHsgdmFsdWU6ICdzdXBlcl9hZG1pbicsIHRpdGxlOiAnU3VwZXIgYWRtaW4nLCBoaW50OiAnRnVsbCBhY2Nlc3MsIHNhbWUgYXMgYWRtaW4nIH0sXG5dXG5cbmNvbnN0IFBFUk1JU1NJT05TID0gW1xuICB7IGtleTogJ21hbmFnZVByb2R1Y3RzJywgbGFiZWw6ICdQcm9kdWN0cycsIGhpbnQ6ICdBZGQgYW5kIGVkaXQgcHJvZHVjdHMnIH0sXG4gIHsga2V5OiAnbWFuYWdlQ2F0YWxvZycsIGxhYmVsOiAnQ2F0YWxvZycsIGhpbnQ6ICdDYXRlZ29yaWVzIGFuZCBjb2xsZWN0aW9ucycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VNZWRpYScsIGxhYmVsOiAnTWVkaWEnLCBoaW50OiAnVXBsb2FkIGFuZCByZXBsYWNlIGltYWdlcycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VPcmRlcnMnLCBsYWJlbDogJ09yZGVycycsIGhpbnQ6ICdWaWV3IGFuZCB1cGRhdGUgb3JkZXJzJyB9LFxuICB7IGtleTogJ21hbmFnZUNvdXBvbnMnLCBsYWJlbDogJ0NvdXBvbnMnLCBoaW50OiAnQ3JlYXRlIGRpc2NvdW50IGNvZGVzJyB9LFxuICB7IGtleTogJ21hbmFnZUNvbnRlbnQnLCBsYWJlbDogJ0NvbnRlbnQnLCBoaW50OiAnUGFnZXMgYW5kIHJldmlld3MnIH0sXG4gIHsga2V5OiAnbWFuYWdlU2V0dGluZ3MnLCBsYWJlbDogJ1NldHRpbmdzJywgaGludDogJ1N0b3JlIGFuZCBob21lcGFnZSBzZXR0aW5ncycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VVc2VycycsIGxhYmVsOiAnVGVhbScsIGhpbnQ6ICdDcmVhdGUgdXNlcnMgYW5kIGNoYW5nZSBhY2Nlc3MnIH0sXG5dXG5cbmZ1bmN0aW9uIEZpZWxkRXJyb3IoeyBlcnJvciB9KSB7XG4gIGlmICghZXJyb3I/Lm1lc3NhZ2UpIHJldHVybiBudWxsXG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvci5tZXNzYWdlfTwvc3Bhbj5cbn1cblxuZnVuY3Rpb24gUGFzc3dvcmRGaWVsZCh7IGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIGVycm9yLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IFt2aXNpYmxlLCBzZXRWaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICByZXR1cm4gKFxuICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgIHtsYWJlbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXBhc3N3b3JkLXdyYXBcIj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICB0eXBlPXt2aXNpYmxlID8gJ3RleHQnIDogJ3Bhc3N3b3JkJ31cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgYXV0b0NvbXBsZXRlPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLXBhc3N3b3JkLXRvZ2dsZVwiXG4gICAgICAgICAgYXJpYS1sYWJlbD17dmlzaWJsZSA/ICdIaWRlIHBhc3N3b3JkJyA6ICdTaG93IHBhc3N3b3JkJ31cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRWaXNpYmxlKChjdXJyZW50KSA9PiAhY3VycmVudCl9XG4gICAgICAgID5cbiAgICAgICAgICB7dmlzaWJsZSA/ICdIaWRlJyA6ICdTaG93J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3NwYW4+XG4gICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3J9IC8+XG4gICAgPC9sYWJlbD5cbiAgKVxufVxuXG5jb25zdCBUZWFtRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzTmV3ID0gYWN0aW9uPy5uYW1lID09PSAnbmV3JyB8fCAhcmVjb3JkPy5pZFxuICBjb25zdCByb2xlID0gcGFyYW1zLnJvbGUgfHwgJ3N0YWZmJ1xuICBjb25zdCBpc0FjdGl2ZSA9XG4gICAgaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpXG4gICAgICA/IHRydWVcbiAgICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdpc0FjdGl2ZScsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAhcGFyYW1zLnJvbGUpIGhhbmRsZUNoYW5nZSgncm9sZScsICdzdGFmZicpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNOZXddKVxuXG4gIGNvbnN0IGVycm9ycyA9IHVzZU1lbW8oKCkgPT4gcmVjb3JkPy5lcnJvcnMgfHwge30sIFtyZWNvcmQ/LmVycm9yc10pXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuICBjb25zdCBwZXJtaXNzaW9uT24gPSAoa2V5KSA9PiBpc0ZsYWdPbihwYXJhbXNbYHBlcm1pc3Npb25zLiR7a2V5fWBdKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSB0ZWFtIG1lbWJlcicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6IGlzTmV3ID8gJ1RlYW0gbWVtYmVyIGNyZWF0ZWQnIDogJ1RlYW0gbWVtYmVyIHVwZGF0ZWQnLFxuICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgdGVhbSBtZW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntpc05ldyA/ICdBZGQgdGVhbSBtZW1iZXInIDogcGFyYW1zLm5hbWUgfHwgJ1RlYW0gbWVtYmVyJ308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgVGhleSBzaWduIGluIHRvIFRva3JpaWkgQ01TIHdpdGggdXNlcm5hbWUgb3IgZW1haWwuIEluYWN0aXZlIHVzZXJzIGNhbm5vdCBsb2cgaW4uXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkFjY291bnQgc3RhdHVzPC9oND5cbiAgICAgICAgICA8cD5UdXJuIHRoaXMgb2ZmIHRvIGJsb2NrIENNUyBsb2dpbiB3aXRob3V0IGRlbGV0aW5nIHRoZSBhY2NvdW50LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBzaWduIGluIHRvIHRoZSBhZG1pbiBwYW5lbCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlJvbGU8L2g0PlxuICAgICAgICAgIDxwPkFkbWluIGFuZCBzdXBlciBhZG1pbiBnZXQgZnVsbCBhY2Nlc3MuIFN0YWZmIG9ubHkgZ2V0cyB0aGUgcGVybWlzc2lvbnMgeW91IGVuYWJsZS48L3A+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICB7Uk9MRVMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZD17cm9sZSA9PT0gaXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXRlbS50aXRsZX1cbiAgICAgICAgICAgICAgICBoaW50PXtpdGVtLmhpbnR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ3JvbGUnLCBpdGVtLnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkxvZ2luIGRldGFpbHM8L2g0PlxuICAgICAgICA8cD5Vc2VybmFtZSBvciBlbWFpbCBjYW4gYmUgdXNlZCBvbiB0aGUgQ01TIGxvZ2luIHNjcmVlbi48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEZ1bGwgbmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRlYW0gbWVtYmVyIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMubmFtZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFVzZXJuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy51c2VybmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3VzZXJuYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiByYXZpLmNtc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy51c2VybmFtZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIEVtYWlsXG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtYWlsIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2VtYWlsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwibmFtZUB0b2tyaWlpLmNvbVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmVtYWlsfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICB7aXNOZXcgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYXNzd29yZCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gc2V0RmllbGQoJ3Bhc3N3b3JkJywgdmFsdWUpfVxuICAgICAgICAgICAgICBlcnJvcj17ZXJyb3JzLnBhc3N3b3JkfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkF0IGxlYXN0IDYgY2hhcmFjdGVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFBhc3N3b3JkRmllbGRcbiAgICAgICAgICAgICAgbGFiZWw9XCJDb25maXJtIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb25maXJtUGFzc3dvcmQgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IHNldEZpZWxkKCdjb25maXJtUGFzc3dvcmQnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgIGVycm9yPXtlcnJvcnMuY29uZmlybVBhc3N3b3JkfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgcGFzc3dvcmQgYWdhaW5cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+VXNlIENoYW5nZSBwYXNzd29yZCBmcm9tIHRoZSB0ZWFtIGxpc3QgdG8gcmVzZXQgbG9naW4uPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICB7cm9sZSA9PT0gJ3N0YWZmJyA/IChcbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UGVybWlzc2lvbnM8L2g0PlxuICAgICAgICAgIDxwPk9ubHkgdXNlZCBmb3Igc3RhZmYuIFRvZ2dsZSB3aGF0IHRoaXMgcGVyc29uIGNhbiBvcGVuIGluIHRoZSBDTVMuPC9wPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktcGVybS1saXN0XCI+XG4gICAgICAgICAgICB7UEVSTUlTU0lPTlMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmtleX0gY2xhc3NOYW1lPVwidG9rcmktcGVybS1yb3dcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2l0ZW0ubGFiZWx9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5oaW50fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFN0YXR1c1N3aXRjaFxuICAgICAgICAgICAgICAgICAgY29tcGFjdFxuICAgICAgICAgICAgICAgICAgY2hlY2tlZD17cGVybWlzc2lvbk9uKGl0ZW0ua2V5KX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoYHBlcm1pc3Npb25zLiR7aXRlbS5rZXl9YCwgbmV4dCl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgKSA6IG51bGx9XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHRlYW0gbWVtYmVyJyA6ICdTYXZlIHRlYW0gbWVtYmVyJ31cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZWFtRWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZU5vdGljZSwgdXNlUXVlcnlQYXJhbXMsIHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJ1xuY29uc3QgRk9MREVSUyA9IFsnYWxsJywgJ3Byb2R1Y3RzJywgJ2NhdGVnb3JpZXMnLCAncmV2aWV3cycsICdwYWdlcycsICdnZW5lcmFsJ11cblxuY29uc3Qgd2l0aG91dFRyYWlsaW5nU2xhc2ggPSAodmFsdWUpID0+IFN0cmluZyh2YWx1ZSB8fCAnJykucmVwbGFjZSgvXFwvKyQvLCAnJylcblxuZnVuY3Rpb24gZm9ybWF0U2l6ZShieXRlcykge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGJ5dGVzKSB8fCAwXG4gIGlmIChzaXplIDwgMTAyNCkgcmV0dXJuIGAke3NpemV9IEJgXG4gIGlmIChzaXplIDwgMTAyNCAqIDEwMjQpIHJldHVybiBgJHtNYXRoLnJvdW5kKHNpemUgLyAxMDI0KX0gS0JgXG4gIHJldHVybiBgJHsoc2l6ZSAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMSl9IE1CYFxufVxuXG5mdW5jdGlvbiBmb3JtYXRXaGVuKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCB5ZWFyOiAnbnVtZXJpYycgfSlcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVVybChwYXRoLCBhcHBVcmwpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4gJydcbiAgaWYgKC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KHBhdGgpKSByZXR1cm4gcGF0aFxuICByZXR1cm4gYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGF0aH1gXG59XG5cbmNvbnN0IE1lZGlhTGlicmFyeSA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlc291cmNlLCBzZXRUYWcgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgc3RvcmVQYXJhbXMsIGZpbHRlcnMgfSA9IHVzZVF1ZXJ5UGFyYW1zKClcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBmZXRjaERhdGEsIHRvdGFsLCBwZXJQYWdlIH0gPSB1c2VSZWNvcmRzKHJlc291cmNlLmlkKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2J1c3lJZCwgc2V0QnVzeUlkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBmb2xkZXIgPSBTdHJpbmcoZmlsdGVycz8uZm9sZGVyIHx8ICdhbGwnKVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGFwcFVybCA9IGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpblxuICBjb25zdCB1cGxvYWRGb2xkZXIgPSBmb2xkZXIgPT09ICdhbGwnID8gJ2dlbmVyYWwnIDogZm9sZGVyXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2V0VGFnKSBzZXRUYWcoU3RyaW5nKHRvdGFsIHx8IDApKVxuICB9LCBbdG90YWwsIHNldFRhZ10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoTnVtYmVyKHBlclBhZ2UpIDwgNTApIHN0b3JlUGFyYW1zKHsgcGVyUGFnZTogJzUwJyB9KVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW10pXG5cbiAgY29uc3QgaXRlbXMgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICAocmVjb3JkcyB8fCBbXSkubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgbmFtZTogaXRlbS5wYXJhbXM/Lm9yaWdpbmFsTmFtZSB8fCBpdGVtLnBhcmFtcz8uZmlsZW5hbWUgfHwgJ0ltYWdlJyxcbiAgICAgICAgZm9sZGVyOiBpdGVtLnBhcmFtcz8uZm9sZGVyIHx8ICdnZW5lcmFsJyxcbiAgICAgICAgcGF0aDogaXRlbS5wYXJhbXM/LnBhdGggfHwgJycsXG4gICAgICAgIHNpemU6IGl0ZW0ucGFyYW1zPy5zaXplLFxuICAgICAgICBjcmVhdGVkQXQ6IGl0ZW0ucGFyYW1zPy5jcmVhdGVkQXQsXG4gICAgICAgIHVybDogcmVzb2x2ZVVybChpdGVtLnBhcmFtcz8ucGF0aCwgYXBwVXJsKSxcbiAgICAgIH0pKSxcbiAgICBbYXBwVXJsLCByZWNvcmRzXSxcbiAgKVxuXG4gIGNvbnN0IHNldEZvbGRlciA9IChuZXh0KSA9PiB7XG4gICAgc3RvcmVQYXJhbXMoe1xuICAgICAgcGFnZTogJzEnLFxuICAgICAgZmlsdGVyczogbmV4dCA9PT0gJ2FsbCcgPyB7fSA6IHsgZm9sZGVyOiBuZXh0IH0sXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHVwbG9hZEZpbGVzID0gYXN5bmMgKGZpbGVzKSA9PiB7XG4gICAgY29uc3QgbGlzdCA9IFsuLi5maWxlc10uZmlsdGVyKChmaWxlKSA9PiBmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpXG4gICAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBsaXN0KSB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCB1cGxvYWRGb2xkZXIpXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICB9KVxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCBgQ291bGQgbm90IHVwbG9hZCAke2ZpbGUubmFtZX1gKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGROb3RpY2Uoe1xuICAgICAgICBtZXNzYWdlOiBsaXN0Lmxlbmd0aCA9PT0gMSA/ICdJbWFnZSB1cGxvYWRlZCcgOiBgJHtsaXN0Lmxlbmd0aH0gaW1hZ2VzIHVwbG9hZGVkYCxcbiAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgfSlcbiAgICAgIGZldGNoRGF0YSgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ1VwbG9hZCBmYWlsZWQnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3QgY29weVBhdGggPSBhc3luYyAocGF0aCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwYXRoKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ZpbGUgcGF0aCBjb3BpZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IHBhdGgsIHR5cGU6ICdpbmZvJyB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZSA9IGFzeW5jIChpZCwgbmFtZSkgPT4ge1xuICAgIGlmICghd2luZG93LmNvbmZpcm0oYERlbGV0ZSDigJwke25hbWV94oCdPyBUaGlzIGNhbm5vdCBiZSB1bmRvbmUuYCkpIHJldHVyblxuICAgIHNldEJ1c3lJZChpZClcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS8ke2lkfWAsIHsgbWV0aG9kOiAnREVMRVRFJyB9KVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8ICdDb3VsZCBub3QgZGVsZXRlIGltYWdlJylcbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGRhdGEubWVzc2FnZSB8fCAnSW1hZ2UgZGVsZXRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgZmV0Y2hEYXRhKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IGRlbGV0ZSBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeUlkKCcnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPk1lZGlhIGxpYnJhcnk8L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+XG4gICAgICAgICAgVXBsb2FkIGltYWdlcyB1c2VkIG9uIHByb2R1Y3RzLCBjYXRlZ29yaWVzLCByZXZpZXdzLCBhbmQgdGhlIGhvbWVwYWdlLiBGaWxlcyBzdGF5IG9uIHRoaXMgc2VydmVyLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlVwbG9hZDwvaDQ+XG4gICAgICAgIDxwPlxuICAgICAgICAgIEZpbGVzIGdvIGludG8gdGhlIDxzdHJvbmc+e3VwbG9hZEZvbGRlcn08L3N0cm9uZz4gZm9sZGVyXG4gICAgICAgICAge2ZvbGRlciA9PT0gJ2FsbCcgPyAnIChzZWxlY3QgYSBmb2xkZXIgYmVsb3cgdG8gY2hhbmdlIHRoaXMpLicgOiAnLid9XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGxhYmVsXG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3BcIlxuICAgICAgICAgIG9uRHJhZ092ZXI9eyhldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKX1cbiAgICAgICAgICBvbkRyb3A9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgdXBsb2FkRmlsZXMoZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKVxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj57dXBsb2FkaW5nID8gJ1VwbG9hZGluZ+KApicgOiAnQ2xpY2sgb3IgZHJvcCBpbWFnZXMgaGVyZSd9PC9zcGFuPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZGluZ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwbG9hZEZpbGVzKGV2ZW50LnRhcmdldC5maWxlcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CIGVhY2g8L3NwYW4+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5MaWJyYXJ5PC9oND5cbiAgICAgICAgPHA+e3RvdGFsIHx8IDB9IGZpbGV7KHRvdGFsIHx8IDApID09PSAxID8gJycgOiAncyd9e2ZvbGRlciAhPT0gJ2FsbCcgPyBgIGluICR7Zm9sZGVyfWAgOiAnJ30uPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWZvbGRlci1jaGlwc1wiPlxuICAgICAgICAgIHtGT0xERVJTLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0ZW19XG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1mb2xkZXItY2hpcCR7Zm9sZGVyID09PSBpdGVtID8gJyBpcy1vbicgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGb2xkZXIoaXRlbSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtID09PSAnYWxsJyA/ICdBbGwgZm9sZGVycycgOiBpdGVtfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxUZXh0IG10PVwieGxcIj5Mb2FkaW5nIGltYWdlc+KApjwvVGV4dD5cbiAgICAgICAgKSA6IGl0ZW1zLmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLWdyaWRcIj5cbiAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9XCJ0b2tyaS1tZWRpYS1jYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tZWRpYS10aHVtYlwiPlxuICAgICAgICAgICAgICAgICAge2l0ZW0udXJsID8gPGltZyBzcmM9e2l0ZW0udXJsfSBhbHQ9e2l0ZW0ubmFtZX0gLz4gOiA8c3Bhbj5ObyBwcmV2aWV3PC9zcGFuPn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nIHRpdGxlPXtpdGVtLm5hbWV9PntpdGVtLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICB7aXRlbS5mb2xkZXJ9IMK3IHtmb3JtYXRTaXplKGl0ZW0uc2l6ZSl9XG4gICAgICAgICAgICAgICAgICB7aXRlbS5jcmVhdGVkQXQgPyBgIMK3ICR7Zm9ybWF0V2hlbihpdGVtLmNyZWF0ZWRBdCl9YCA6ICcnfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gc2l6ZT1cInNtXCIgdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXsoKSA9PiBjb3B5UGF0aChpdGVtLnBhdGgpfT5cbiAgICAgICAgICAgICAgICAgICAgQ29weSBwYXRoXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImRhbmdlclwiXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtidXN5SWQgPT09IGl0ZW0uaWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZShpdGVtLmlkLCBpdGVtLm5hbWUpfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7YnVzeUlkID09PSBpdGVtLmlkID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICBEZWxldGVcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VGV4dCBtdD1cInhsXCI+Tm8gaW1hZ2VzIGluIHRoaXMgZm9sZGVyIHlldC48L1RleHQ+XG4gICAgICAgICl9XG4gICAgICA8L3NlY3Rpb24+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVkaWFMaWJyYXJ5XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIEZvcm1Hcm91cCxcbiAgSDIsXG4gIElucHV0LFxuICBMYWJlbCxcbiAgTWVzc2FnZUJveCxcbiAgVGV4dCxcbn0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgUkVNRU1CRVJFRF9MT0dJTl9LRVkgPSAndG9rcmlfYWRtaW5fbG9naW4nXG5cbmNvbnN0IExvZ2luID0gKCkgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgZXJyb3JNZXNzYWdlIH0gPSB3aW5kb3cuX19BUFBfU1RBVEVfXyB8fCB7fVxuICBjb25zdCB7IHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgYWRtaW5Sb290ID0gYWN0aW9uPy5yZXBsYWNlKC9cXC9sb2dpbiQvLCAnJykgfHwgJydcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRVcmwgPSBgJHthZG1pblJvb3R9L2ZvcmdvdC1wYXNzd29yZGBcbiAgY29uc3QgW2lkZW50aWZpZXIsIHNldElkZW50aWZpZXJdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtyZW1lbWJlckxvZ2luLCBzZXRSZW1lbWJlckxvZ2luXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd1Bhc3N3b3JkLCBzZXRTaG93UGFzc3dvcmRdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZW1lbWJlcmVkTG9naW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgaWYgKHJlbWVtYmVyZWRMb2dpbikge1xuICAgICAgc2V0SWRlbnRpZmllcihyZW1lbWJlcmVkTG9naW4pXG4gICAgICBzZXRSZW1lbWJlckxvZ2luKHRydWUpXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmb3JtID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBmb3JtLmVsZW1lbnRzLm5hbWVkSXRlbSgnZW1haWwnKVxuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIChlbWFpbElucHV0ICYmICd2YWx1ZScgaW4gZW1haWxJbnB1dCA/IFN0cmluZyhlbWFpbElucHV0LnZhbHVlKSA6IGlkZW50aWZpZXIpLnRyaW0oKVxuXG4gICAgaWYgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0KSB7XG4gICAgICBlbWFpbElucHV0LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBpZiAocmVtZW1iZXJMb2dpbiAmJiB2YWx1ZSkge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFJFTUVNQkVSRURfTE9HSU5fS0VZKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgZmxleFxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICBtaW5IZWlnaHQ9XCIxMDB2aFwiXG4gICAgICBiZz1cImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwMjJjMjIsICMwNDc4NTcpXCJcbiAgICAgIHA9XCJ4bFwiXG4gICAgPlxuICAgICAgPEJveFxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0NDBweCddfVxuICAgICAgICBib3JkZXJSYWRpdXM9XCIxOHB4XCJcbiAgICAgICAgYm94U2hhZG93PVwiMCAyNHB4IDcwcHggcmdiYSgyLCA0NCwgMzQsIDAuMzUpXCJcbiAgICAgICAgcD1cIngzXCJcbiAgICAgID5cbiAgICAgICAgPEgyIGNvbG9yPVwiIzAyMmMyMlwiIG1iPVwic21cIj5Ub2tyaWlpIENNUzwvSDI+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwiIzY0NzQ4YlwiIG1iPVwieGxcIj5cbiAgICAgICAgICBTaWduIGluIHdpdGggeW91ciBhZG1pbiBlbWFpbCBvciB1c2VybmFtZSB0byBtYW5hZ2UgcHJvZHVjdHMsIG9yZGVycywgYW5kIGNvbnRlbnQuXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICB7ZXJyb3JNZXNzYWdlID8gKFxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICBtYj1cImxnXCJcbiAgICAgICAgICAgIG1lc3NhZ2U9e2Vycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSl9XG4gICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICA8Qm94IGFzPVwiZm9ybVwiIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPEZvcm1Hcm91cD5cbiAgICAgICAgICAgIDxMYWJlbCByZXF1aXJlZD5FbWFpbCBvciB1c2VybmFtZTwvTGFiZWw+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXG4gICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpZGVudGlmaWVyfVxuICAgICAgICAgICAgICBrZXk9e2lkZW50aWZpZXIgfHwgJ2xvZ2luLWVtYWlsJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPlBhc3N3b3JkPC9MYWJlbD5cbiAgICAgICAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPXtzaG93UGFzc3dvcmQgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwiY3VycmVudC1wYXNzd29yZFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ1JpZ2h0OiA0MiB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17c2hvd1Bhc3N3b3JkID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgcmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDQ3ODU3JyxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDI2LFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzaG93UGFzc3dvcmQgPyAoXG4gICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgM2wxOCAxOFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuNiAxMC42QTIgMiAwIDAgMCAxMy40IDEzLjRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYuNiA2LjZDNC4zIDggMi43IDEwLjIgMiAxMmMxIDMuNSA1IDggMTAgOCAxLjUgMCAyLjktLjQgNC4xLTFcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvRm9ybUdyb3VwPlxuXG4gICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cImxnXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgaWQ9XCJyZW1lbWJlci1sb2dpblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGNoZWNrZWQ9e3JlbWVtYmVyTG9naW59XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFJlbWVtYmVyTG9naW4oZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5SaWdodDogOCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicmVtZW1iZXItbG9naW5cIiBzdHlsZT17eyBjb2xvcjogJyM0NzU1NjknLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgIFJlbWVtYmVyIG15IGVtYWlsIG9yIHVzZXJuYW1lIG9uIHRoaXMgZGV2aWNlXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIHdpZHRoPVwiMTAwJVwiIG10PVwibGdcIj5cbiAgICAgICAgICAgIFNpZ24gaW5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgPFRleHQgbXQ9XCJ4bFwiIHRleHRBbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxhIGhyZWY9e2ZvcmdvdFBhc3N3b3JkVXJsfSBzdHlsZT17eyBjb2xvcjogJyMwNDc4NTcnLCBmb250V2VpZ2h0OiA3MDAgfX0+XG4gICAgICAgICAgICBGb3Jnb3QgcGFzc3dvcmQ/XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpblxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uR3JvdXAsIE1lc3NhZ2VCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlRmlsdGVyRHJhd2VyLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnXG5cbmZ1bmN0aW9uIGFkbWluUm9vdFBhdGgoKSB7XG4gIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9eKC4qKVxcL3Jlc291cmNlc1xcLy8pXG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKSB7XG4gIGlmIChyZXNvdXJjZUlkID09PSAnQ2F0ZWdvcnknKSB7XG4gICAgcmV0dXJuIHsgZXhwb3J0VXJsOiAnY2F0ZWdvcmllcy9leHBvcnQnLCBpbXBvcnRVcmw6ICdjYXRlZ29yaWVzL2ltcG9ydCcgfVxuICB9XG4gIGlmIChyZXNvdXJjZUlkID09PSAnUHJvZHVjdCcpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdwcm9kdWN0cy9leHBvcnQnLCBpbXBvcnRVcmw6ICdwcm9kdWN0cy9pbXBvcnQnIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnMoeyByZXNvdXJjZSwgb25JbXBvcnRlZCB9KSB7XG4gIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uLCB0cmFuc2xhdGVBY3Rpb24gfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyB0b2dnbGVGaWx0ZXIsIGZpbHRlcnNDb3VudCB9ID0gdXNlRmlsdGVyRHJhd2VyKClcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKG51bGwpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcblxuICBjb25zdCByZXNvdXJjZUlkID0gcmVzb3VyY2UuaWRcbiAgY29uc3QgY29uZmlnID0gY2F0YWxvZ0NvbmZpZyhyZXNvdXJjZUlkKVxuICBjb25zdCByb290ID0gYWRtaW5Sb290UGF0aCgpXG5cbiAgY29uc3QgaGFuZGxlSW1wb3J0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJydcbiAgICBpZiAoIWZpbGUgfHwgIWNvbmZpZykgcmV0dXJuXG5cbiAgICBzZXRMb2FkaW5nKHRydWUpXG4gICAgc2V0TWVzc2FnZShudWxsKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5pbXBvcnRVcmx9YCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJylcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JDb3VudCA9IGRhdGEuZXJyb3JzPy5sZW5ndGggfHwgMFxuICAgICAgc2V0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IGVycm9yQ291bnQgPyAnaW5mbycgOiAnc3VjY2VzcycsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgZXJyb3JDb3VudCA+IDBcbiAgICAgICAgICAgID8gYEltcG9ydCBmaW5pc2hlZC4gJHtkYXRhLmNyZWF0ZWR9IGFkZGVkLCAke2RhdGEudXBkYXRlZH0gdXBkYXRlZC4gJHtlcnJvckNvdW50fSByb3cocykgY291bGQgbm90IGJlIGltcG9ydGVkLiBFeGlzdGluZyByb3dzIGFyZSBtYXRjaGVkIGJ5IHNsdWcuYFxuICAgICAgICAgICAgOiBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiBFeGlzdGluZyByb3dzIGFyZSBtYXRjaGVkIGJ5IHNsdWcg4oCUIGtlZXAgc2x1ZyB0aGUgc2FtZSB0byB1cGRhdGUgcHJpY2UuYCxcbiAgICAgIH0pXG4gICAgICBvbkltcG9ydGVkPy4oKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogJ2RhbmdlcicsIHRleHQ6IGVycm9yLm1lc3NhZ2UgfHwgJ0ltcG9ydCBmYWlsZWQuJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1dHRvbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWNvbmZpZykgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQgQ1NWJyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBocmVmOiBgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmV4cG9ydFVybH1gLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQgRXhjZWwnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L2NhdGFsb2cvJHtjb25maWcuZXhwb3J0VXJsfT9mb3JtYXQ9eGxzeGAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogbG9hZGluZyA/ICdJbXBvcnRpbmcuLi4nIDogJ0ltcG9ydCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgb25DbGljazogbG9hZGluZyA/IHVuZGVmaW5lZCA6ICgpID0+IGZpbGVSZWYuY3VycmVudD8uY2xpY2soKSxcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3QgbmV3QWN0aW9uID0gcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zPy5maW5kKChhY3Rpb24pID0+IGFjdGlvbi5uYW1lID09PSAnbmV3JylcbiAgICBpZiAobmV3QWN0aW9uKSB7XG4gICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgaWNvbjogbmV3QWN0aW9uLmljb24sXG4gICAgICAgIGxhYmVsOiB0cmFuc2xhdGVBY3Rpb24obmV3QWN0aW9uLmxhYmVsLCByZXNvdXJjZUlkKSxcbiAgICAgICAgdmFyaWFudDogbmV3QWN0aW9uLnZhcmlhbnQsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L3Jlc291cmNlcy8ke3Jlc291cmNlSWR9L2FjdGlvbnMvbmV3YCxcbiAgICAgICAgJ2RhdGEtY3NzJzogYCR7cmVzb3VyY2VJZH0tbmV3LWJ1dHRvbmAsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlcktleSA9IGZpbHRlcnNDb3VudCA+IDAgPyAnZmlsdGVyQWN0aXZlJyA6ICdmaWx0ZXInXG4gICAgaXRlbXMucHVzaCh7XG4gICAgICBsYWJlbDogdHJhbnNsYXRlQnV0dG9uKGZpbHRlcktleSwgcmVzb3VyY2VJZCwgeyBjb3VudDogZmlsdGVyc0NvdW50IH0pLFxuICAgICAgb25DbGljazogdG9nZ2xlRmlsdGVyLFxuICAgICAgaWNvbjogJ0ZpbHRlcicsXG4gICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1maWx0ZXItYnV0dG9uYCxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGl0ZW1zXG4gIH0sIFtcbiAgICBjb25maWcsXG4gICAgcm9vdCxcbiAgICBsb2FkaW5nLFxuICAgIHJlc291cmNlLnJlc291cmNlQWN0aW9ucyxcbiAgICByZXNvdXJjZUlkLFxuICAgIHRyYW5zbGF0ZUFjdGlvbixcbiAgICB0cmFuc2xhdGVCdXR0b24sXG4gICAgZmlsdGVyc0NvdW50LFxuICAgIHRvZ2dsZUZpbHRlcixcbiAgXSlcblxuICBpZiAoIWNvbmZpZykgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Qm94XG4gICAgICAgIG10PVwieGxcIlxuICAgICAgICBtYj1cImRlZmF1bHRcIlxuICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIlxuICAgICAgICBmbGV4U2hyaW5rPXswfVxuICAgICAgICBweD17WydkZWZhdWx0JywgMF19XG4gICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogJy01MnB4JyB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uR3JvdXAgYnV0dG9ucz17YnV0dG9uc30gLz5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtmaWxlUmVmfVxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBhY2NlcHQ9XCIuY3N2LC54bHN4LHRleHQvY3N2LGFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCJcbiAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlSW1wb3J0fVxuICAgICAgICAvPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIHttZXNzYWdlICYmIChcbiAgICAgICAgPEJveCBtYj1cImRlZmF1bHRcIiBweD17WydkZWZhdWx0JywgMF19PlxuICAgICAgICAgIDxNZXNzYWdlQm94XG4gICAgICAgICAgICB2YXJpYW50PXttZXNzYWdlLnR5cGV9XG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlLnRleHR9XG4gICAgICAgICAgICBvbkNsb3NlQ2xpY2s9eygpID0+IHNldE1lc3NhZ2UobnVsbCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgT3JpZ2luYWxBY3Rpb25IZWFkZXIgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyBmcm9tICcuL2NhdGFsb2ctbGlzdC1oZWFkZXItYWN0aW9ucy5qc3gnXG5cbmNvbnN0IENBVEFMT0dfUkVTT1VSQ0VTID0gbmV3IFNldChbJ1Byb2R1Y3QnLCAnQ2F0ZWdvcnknXSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWN0aW9uSGVhZGVyKHByb3BzKSB7XG4gIGNvbnN0IHsgT3JpZ2luYWxDb21wb25lbnQsIGFjdGlvbiwgcmVzb3VyY2UgfSA9IHByb3BzXG4gIGNvbnN0IEJhc2VIZWFkZXIgPSBPcmlnaW5hbENvbXBvbmVudCB8fCBPcmlnaW5hbEFjdGlvbkhlYWRlclxuICBjb25zdCBpc0NhdGFsb2dMaXN0ID0gYWN0aW9uPy5uYW1lID09PSAnbGlzdCcgJiYgQ0FUQUxPR19SRVNPVVJDRVMuaGFzKHJlc291cmNlPy5pZClcblxuICBpZiAoIWlzQ2F0YWxvZ0xpc3QpIHtcbiAgICByZXR1cm4gPEJhc2VIZWFkZXIgey4uLnByb3BzfSAvPlxuICB9XG5cbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudDogX2lnbm9yZWQsIC4uLmhlYWRlclByb3BzIH0gPSBwcm9wc1xuXG4gIHJldHVybiAoXG4gICAgPEJveD5cbiAgICAgIDxCYXNlSGVhZGVyIHsuLi5oZWFkZXJQcm9wc30gb21pdEFjdGlvbnMgLz5cbiAgICAgIDxDYXRhbG9nTGlzdEhlYWRlckFjdGlvbnNcbiAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICBvbkltcG9ydGVkPXtwcm9wcy5hY3Rpb25QZXJmb3JtZWR9XG4gICAgICAvPlxuICAgIDwvQm94PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgbWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIExhYmVsLCBUaW55TUNFIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbHVnaW5zOiBbXG4gICAgJ2NvZGUnLFxuICAgICdsaW5rJyxcbiAgICAnbGlzdHMnLFxuICAgICdpbWFnZScsXG4gICAgJ3RhYmxlJyxcbiAgICAnYXV0b2xpbmsnLFxuICAgICdwcmV2aWV3JyxcbiAgICAnc2VhcmNocmVwbGFjZScsXG4gICAgJ3dvcmRjb3VudCcsXG4gICAgJ21lZGlhJyxcbiAgICAnY29kZXNhbXBsZScsXG4gIF0sXG4gIHRvb2xiYXI6XG4gICAgJ3VuZG8gcmVkbyB8IGJsb2NrcyB8IGJvbGQgaXRhbGljIHVuZGVybGluZSBzdHJpa2V0aHJvdWdoIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgYWxpZ25qdXN0aWZ5IHwgYnVsbGlzdCBudW1saXN0IG91dGRlbnQgaW5kZW50IHwgbGluayBpbWFnZSB0YWJsZSBjb2Rlc2FtcGxlIHwgY29kZSB8IHJlbW92ZWZvcm1hdCcsXG4gIGhlaWdodDogNDAwLFxufVxuXG5jb25zdCBSaWNodGV4dEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9ID0gcHJvcHNcbiAgY29uc3QgdmFsdWUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkucGF0aF0gPz8gJydcbiAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF1cblxuICBjb25zdCBoYW5kbGVVcGRhdGUgPSB1c2VDYWxsYmFjayhcbiAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5ld1ZhbHVlKVxuICAgIH0sXG4gICAgW29uQ2hhbmdlLCBwcm9wZXJ0eS5wYXRoXSxcbiAgKVxuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLihwcm9wZXJ0eS5wcm9wcyB8fCB7fSksXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxGb3JtR3JvdXAgZXJyb3I9e0Jvb2xlYW4oZXJyb3IpfT5cbiAgICAgIDxMYWJlbCByZXF1aXJlZD17cHJvcGVydHkuaXNSZXF1aXJlZH0+e3Byb3BlcnR5LmxhYmVsfTwvTGFiZWw+XG4gICAgICA8VGlueU1DRSB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtoYW5kbGVVcGRhdGV9IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gICAgICA8Rm9ybU1lc3NhZ2U+e2Vycm9yPy5tZXNzYWdlfTwvRm9ybU1lc3NhZ2U+XG4gICAgPC9Gb3JtR3JvdXA+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSaWNodGV4dEVkaXQpXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IHVzZUxvY2F0aW9uLCB1c2VOYXZpZ2F0ZSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcblxuZnVuY3Rpb24gYWRtaW5Sb290KHBhdGhuYW1lKSB7XG4gIGNvbnN0IGN1dCA9IHBhdGhuYW1lLnNlYXJjaCgvXFwvKHJlc291cmNlc3xwYWdlcykoXFwvfCQpLylcbiAgY29uc3Qgcm9vdCA9IGN1dCA9PT0gLTEgPyBwYXRobmFtZSA6IHBhdGhuYW1lLnNsaWNlKDAsIGN1dClcbiAgcmV0dXJuIHJvb3QucmVwbGFjZSgvXFwvJC8sICcnKSB8fCAnLydcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lkZWJhclJlc291cmNlU2VjdGlvbihwcm9wcykge1xuICBjb25zdCBPcmlnaW5hbCA9IHByb3BzLk9yaWdpbmFsQ29tcG9uZW50XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKVxuICBjb25zdCBuYXZpZ2F0ZSA9IHVzZU5hdmlnYXRlKClcbiAgY29uc3QgaHJlZiA9IGFkbWluUm9vdChsb2NhdGlvbi5wYXRobmFtZSlcbiAgY29uc3Qgc2VsZWN0ZWQgPSBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8kLywgJycpID09PSBocmVmLnJlcGxhY2UoL1xcLyQvLCAnJykgfHwgbG9jYXRpb24ucGF0aG5hbWUgPT09IGAke2hyZWZ9L2BcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8YVxuICAgICAgICBjbGFzc05hbWU9e2B0b2tyaS1zaWRlYmFyLWRhc2hib2FyZCR7c2VsZWN0ZWQgPyAnIGlzLWFjdGl2ZScgOiAnJ31gfVxuICAgICAgICBocmVmPXtocmVmfVxuICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgbmF2aWdhdGUoaHJlZilcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEljb24gaWNvbj1cIkhvbWVcIiAvPlxuICAgICAgICA8c3Bhbj5EYXNoYm9hcmQ8L3NwYW4+XG4gICAgICA8L2E+XG4gICAgICB7T3JpZ2luYWwgPyA8T3JpZ2luYWwgcmVzb3VyY2VzPXtwcm9wcy5yZXNvdXJjZXN9IC8+IDogbnVsbH1cbiAgICA8Lz5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTG9hZGVyLCBUYWJsZSwgVGFibGVCb2R5IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIE5vUmVjb3JkcyxcbiAgUmVjb3JkSW5MaXN0LFxuICBSZWNvcmRzVGFibGVIZWFkZXIsXG4gIFNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgZ2V0UmVzb3VyY2VFbGVtZW50Q3NzID0gKHJlc291cmNlSWQsIHN1ZmZpeCkgPT4gYCR7cmVzb3VyY2VJZH0tJHtzdWZmaXh9YFxuXG4vKipcbiAqIEFkbWluSlMgbWFya3MgdGhlIGhlYWRlciBjaGVja2JveCBjaGVja2VkIHdoZW4gQU5ZIHJvdyBpcyBzZWxlY3RlZC5cbiAqIE92ZXJyaWRlIHNvOiBub25lID0gdW5jaGVja2VkLCBzb21lID0gaW5kZXRlcm1pbmF0ZSwgYWxsID0gY2hlY2tlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVjb3Jkc1RhYmxlKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICByZXNvdXJjZSxcbiAgICByZWNvcmRzLFxuICAgIGFjdGlvblBlcmZvcm1lZCxcbiAgICBzb3J0QnksXG4gICAgZGlyZWN0aW9uLFxuICAgIGlzTG9hZGluZyxcbiAgICBvblNlbGVjdCxcbiAgICBzZWxlY3RlZFJlY29yZHMsXG4gICAgb25TZWxlY3RBbGwsXG4gIH0gPSBwcm9wc1xuXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcbiAgICBpZiAoaXNMb2FkaW5nKSByZXR1cm4gPExvYWRlciAvPlxuICAgIHJldHVybiA8Tm9SZWNvcmRzIHJlc291cmNlPXtyZXNvdXJjZX0gLz5cbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ291bnQgPSBzZWxlY3RlZFJlY29yZHNcbiAgICA/IHJlY29yZHMuZmlsdGVyKChyZWNvcmQpID0+IHNlbGVjdGVkUmVjb3Jkcy5zb21lKChzZWxlY3RlZCkgPT4gc2VsZWN0ZWQuaWQgPT09IHJlY29yZC5pZCkpLmxlbmd0aFxuICAgIDogMFxuICBjb25zdCBzZWxlY3RlZEFsbCA9IHNlbGVjdGVkQ291bnQgPiAwICYmIHNlbGVjdGVkQ291bnQgPT09IHJlY29yZHMubGVuZ3RoXG4gIGNvbnN0IGluZGV0ZXJtaW5hdGUgPSBzZWxlY3RlZENvdW50ID4gMCAmJiBzZWxlY3RlZENvdW50IDwgcmVjb3Jkcy5sZW5ndGhcbiAgY29uc3QgcmVjb3Jkc0hhdmVCdWxrQWN0aW9uID0gISFyZWNvcmRzLmZpbmQoKHJlY29yZCkgPT4gcmVjb3JkLmJ1bGtBY3Rpb25zLmxlbmd0aClcblxuICBjb25zdCBjb250ZW50VGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHJlc291cmNlLmlkLCAndGFibGUnKVxuICBjb25zdCBzZWxlY3RlZFRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyhyZXNvdXJjZS5pZCwgJ3RhYmxlLXNlbGVjdGVkLXJlY29yZHMnKVxuICBjb25zdCBib2R5VGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHJlc291cmNlLmlkLCAndGFibGUtYm9keScpXG5cbiAgcmV0dXJuIChcbiAgICA8VGFibGUgZGF0YS1jc3M9e2NvbnRlbnRUYWd9PlxuICAgICAgPFNlbGVjdGVkUmVjb3Jkc1xuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIHNlbGVjdGVkUmVjb3Jkcz17c2VsZWN0ZWRSZWNvcmRzfVxuICAgICAgICBkYXRhLWNzcz17c2VsZWN0ZWRUYWd9XG4gICAgICAvPlxuICAgICAgPFJlY29yZHNUYWJsZUhlYWRlclxuICAgICAgICBwcm9wZXJ0aWVzPXtyZXNvdXJjZS5saXN0UHJvcGVydGllc31cbiAgICAgICAgdGl0bGVQcm9wZXJ0eT17cmVzb3VyY2UudGl0bGVQcm9wZXJ0eX1cbiAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICBvblNlbGVjdEFsbD17cmVjb3Jkc0hhdmVCdWxrQWN0aW9uID8gb25TZWxlY3RBbGwgOiB1bmRlZmluZWR9XG4gICAgICAgIHNlbGVjdGVkQWxsPXtzZWxlY3RlZEFsbH1cbiAgICAgICAgaW5kZXRlcm1pbmF0ZT17aW5kZXRlcm1pbmF0ZX1cbiAgICAgIC8+XG4gICAgICA8VGFibGVCb2R5IGRhdGEtY3NzPXtib2R5VGFnfT5cbiAgICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IChcbiAgICAgICAgICA8UmVjb3JkSW5MaXN0XG4gICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgIGtleT17cmVjb3JkLmlkfVxuICAgICAgICAgICAgYWN0aW9uUGVyZm9ybWVkPXthY3Rpb25QZXJmb3JtZWR9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e1xuICAgICAgICAgICAgICBzZWxlY3RlZFJlY29yZHMgJiYgISFzZWxlY3RlZFJlY29yZHMuZmluZCgoc2VsZWN0ZWQpID0+IHNlbGVjdGVkLmlkID09PSByZWNvcmQuaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L1RhYmxlQm9keT5cbiAgICA8L1RhYmxlPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFRhYmxlQ2VsbCwgVGFibGVIZWFkLCBUYWJsZVJvdyB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBQcm9wZXJ0eUhlYWRlciB9IGZyb20gJ2FkbWluanMnXG5cbmNvbnN0IGdldFJlc291cmNlRWxlbWVudENzcyA9IChyZXNvdXJjZUlkLCBzdWZmaXgpID0+IGAke3Jlc291cmNlSWR9LSR7c3VmZml4fWBcblxuY29uc3QgZGlzcGxheSA9IChpc1RpdGxlKSA9PiBbXG4gIGlzVGl0bGUgPyAndGFibGUtY2VsbCcgOiAnbm9uZScsXG4gIGlzVGl0bGUgPyAndGFibGUtY2VsbCcgOiAnbm9uZScsXG4gICd0YWJsZS1jZWxsJyxcbiAgJ3RhYmxlLWNlbGwnLFxuXVxuXG5mdW5jdGlvbiBTZWxlY3RBbGxDaGVja0JveCh7IGNoZWNrZWQsIGluZGV0ZXJtaW5hdGUsIG9uQ2hhbmdlIH0pIHtcbiAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWYobnVsbClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LmluZGV0ZXJtaW5hdGUgPSBCb29sZWFuKGluZGV0ZXJtaW5hdGUpXG4gICAgfVxuICB9LCBbaW5kZXRlcm1pbmF0ZSwgY2hlY2tlZF0pXG5cbiAgcmV0dXJuIChcbiAgICA8bGFiZWxcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNlbGVjdC1hbGwke2luZGV0ZXJtaW5hdGUgPyAnIGlzLWluZGV0ZXJtaW5hdGUnIDogJyd9JHtjaGVja2VkID8gJyBpcy1jaGVja2VkJyA6ICcnfWB9XG4gICAgICBzdHlsZT17eyBtYXJnaW5MZWZ0OiA1IH19XG4gICAgPlxuICAgICAgPGlucHV0XG4gICAgICAgIHJlZj17aW5wdXRSZWZ9XG4gICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgIGNoZWNrZWQ9e0Jvb2xlYW4oY2hlY2tlZCl9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgYXJpYS1jaGVja2VkPXtpbmRldGVybWluYXRlID8gJ21peGVkJyA6IGNoZWNrZWQgPyAndHJ1ZScgOiAnZmFsc2UnfVxuICAgICAgLz5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLXNlbGVjdC1hbGwtYm94XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtpbmRldGVybWluYXRlID8gKFxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzTmFtZT1cInRva3JpLXNlbGVjdC1hbGwtaWNvblwiPlxuICAgICAgICAgICAgPGxpbmUgeDE9XCI2XCIgeTE9XCIxMlwiIHgyPVwiMThcIiB5Mj1cIjEyXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgKSA6IGNoZWNrZWQgPyAoXG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgY2xhc3NOYW1lPVwidG9rcmktc2VsZWN0LWFsbC1pY29uXCI+XG4gICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlY29yZHNUYWJsZUhlYWRlcihwcm9wcykge1xuICBjb25zdCB7XG4gICAgdGl0bGVQcm9wZXJ0eSxcbiAgICBwcm9wZXJ0aWVzLFxuICAgIHNvcnRCeSxcbiAgICBkaXJlY3Rpb24sXG4gICAgb25TZWxlY3RBbGwsXG4gICAgc2VsZWN0ZWRBbGwsXG4gICAgaW5kZXRlcm1pbmF0ZSxcbiAgfSA9IHByb3BzXG5cbiAgY29uc3QgY29udGVudFRhZyA9IGdldFJlc291cmNlRWxlbWVudENzcyh0aXRsZVByb3BlcnR5LnJlc291cmNlSWQsICd0YWJsZS1oZWFkJylcbiAgY29uc3Qgcm93VGFnID0gYCR7dGl0bGVQcm9wZXJ0eS5yZXNvdXJjZUlkfS10YWJsZS1oZWFkLXJvd2BcbiAgY29uc3QgY2hlY2tib3hDc3MgPSBgJHt0aXRsZVByb3BlcnR5LnJlc291cmNlSWR9LWNoZWNrYm94LXRhYmxlLWNlbGxgXG5cbiAgcmV0dXJuIChcbiAgICA8VGFibGVIZWFkIGRhdGEtY3NzPXtjb250ZW50VGFnfT5cbiAgICAgIDxUYWJsZVJvdyBkYXRhLWNzcz17cm93VGFnfT5cbiAgICAgICAgPFRhYmxlQ2VsbCBkYXRhLWNzcz17Y2hlY2tib3hDc3N9PlxuICAgICAgICAgIHtvblNlbGVjdEFsbCA/IChcbiAgICAgICAgICAgIDxTZWxlY3RBbGxDaGVja0JveFxuICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25TZWxlY3RBbGwoKX1cbiAgICAgICAgICAgICAgY2hlY2tlZD17Qm9vbGVhbihzZWxlY3RlZEFsbCl9XG4gICAgICAgICAgICAgIGluZGV0ZXJtaW5hdGU9e0Jvb2xlYW4oaW5kZXRlcm1pbmF0ZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAge3Byb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgIDxQcm9wZXJ0eUhlYWRlclxuICAgICAgICAgICAgZGlzcGxheT17ZGlzcGxheShwcm9wZXJ0eS5pc1RpdGxlKX1cbiAgICAgICAgICAgIGtleT17cHJvcGVydHkucHJvcGVydHlQYXRofVxuICAgICAgICAgICAgdGl0bGVQcm9wZXJ0eT17dGl0bGVQcm9wZXJ0eX1cbiAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgIHNvcnRCeT17c29ydEJ5fVxuICAgICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICAgIDxUYWJsZUNlbGwga2V5PVwiYWN0aW9uc1wiIHN0eWxlPXt7IHdpZHRoOiA4MCB9fSAvPlxuICAgICAgPC9UYWJsZVJvdz5cbiAgICA8L1RhYmxlSGVhZD5cbiAgKVxufVxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUHJvZHVjdEVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcHJvZHVjdC1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0RWRpdCA9IFByb2R1Y3RFZGl0XG5pbXBvcnQgQ2F0ZWdvcnlFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NhdGVnb3J5LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdGVnb3J5RWRpdCA9IENhdGVnb3J5RWRpdFxuaW1wb3J0IENtc0xpc3QgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY21zLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNtc0xpc3QgPSBDbXNMaXN0XG5pbXBvcnQgUmV2aWV3RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmV2aWV3RWRpdCA9IFJldmlld0VkaXRcbmltcG9ydCBTZXR0aW5nc0VkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2V0dGluZ3MtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2V0dGluZ3NFZGl0ID0gU2V0dGluZ3NFZGl0XG5pbXBvcnQgQ291cG9uRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jb3Vwb24tZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ291cG9uRWRpdCA9IENvdXBvbkVkaXRcbmltcG9ydCBPcmRlckRldGFpbCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vcmRlci1kZXRhaWwnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyRGV0YWlsID0gT3JkZXJEZXRhaWxcbmltcG9ydCBDaGFuZ2VQYXNzd29yZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNoYW5nZVBhc3N3b3JkID0gQ2hhbmdlUGFzc3dvcmRcbmltcG9ydCBQYXJ0bmVyRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wYXJ0bmVyLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBhcnRuZXJFZGl0ID0gUGFydG5lckVkaXRcbmltcG9ydCBQaW5jb2RlRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9waW5jb2RlLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBpbmNvZGVFZGl0ID0gUGluY29kZUVkaXRcbmltcG9ydCBTdGF0dXNUb2dnbGUgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc3RhdHVzLXRvZ2dsZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU3RhdHVzVG9nZ2xlID0gU3RhdHVzVG9nZ2xlXG5pbXBvcnQgQ3VzdG9tZXJFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkN1c3RvbWVyRWRpdCA9IEN1c3RvbWVyRWRpdFxuaW1wb3J0IFRlYW1FZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3RlYW0tZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVGVhbUVkaXQgPSBUZWFtRWRpdFxuaW1wb3J0IE1lZGlhTGlicmFyeSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9tZWRpYS1saWJyYXJ5J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5NZWRpYUxpYnJhcnkgPSBNZWRpYUxpYnJhcnlcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9sb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IEFjdGlvbkhlYWRlciBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9hY3Rpb24taGVhZGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5BY3Rpb25IZWFkZXIgPSBBY3Rpb25IZWFkZXJcbmltcG9ydCBEZWZhdWx0UmljaHRleHRFZGl0UHJvcGVydHkgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5ID0gRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5XG5pbXBvcnQgU2lkZWJhclJlc291cmNlU2VjdGlvbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2lkZWJhclJlc291cmNlU2VjdGlvbiA9IFNpZGViYXJSZXNvdXJjZVNlY3Rpb25cbmltcG9ydCBSZWNvcmRzVGFibGUgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmVjb3Jkcy10YWJsZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVjb3Jkc1RhYmxlID0gUmVjb3Jkc1RhYmxlXG5pbXBvcnQgUmVjb3Jkc1RhYmxlSGVhZGVyIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUtaGVhZGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWNvcmRzVGFibGVIZWFkZXIgPSBSZWNvcmRzVGFibGVIZWFkZXIiXSwibmFtZXMiOlsidXNlQW5jaG9yZWRNZW51Iiwib3BlbiIsIndyYXBSZWYiLCJ1c2VSZWYiLCJvcGVuVXAiLCJzZXRPcGVuVXAiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVuZGVmaW5lZCIsInVwZGF0ZSIsIm5vZGUiLCJjdXJyZW50IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwYWNlQmVsb3ciLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImJvdHRvbSIsInRvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiU2VhcmNoYWJsZU11bHRpU2VsZWN0Iiwib3B0aW9ucyIsInNlbGVjdGVkIiwib25DaGFuZ2UiLCJwbGFjZWhvbGRlciIsInNlYXJjaFBsYWNlaG9sZGVyIiwic2V0T3BlbiIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJvbkRvY0NsaWNrIiwiZXZlbnQiLCJjb250YWlucyIsInRhcmdldCIsImRvY3VtZW50Iiwic2VsZWN0ZWRTZXQiLCJ1c2VNZW1vIiwiU2V0Iiwic2VsZWN0ZWRPcHRpb25zIiwiZmlsdGVyIiwiaXRlbSIsImhhcyIsInZhbHVlIiwiZmlsdGVyZWQiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJ0cmltIiwidG9nZ2xlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVmIiwidHlwZSIsIm9uQ2xpY2siLCJsZW5ndGgiLCJtYXAiLCJrZXkiLCJyb2xlIiwidGFiSW5kZXgiLCJzdG9wUHJvcGFnYXRpb24iLCJhdXRvRm9jdXMiLCJjaGVja2VkIiwiRmxhZ0NhcmQiLCJ0aXRsZSIsImhpbnQiLCJpc0ZsYWdPbiIsIlN0YXR1c1N3aXRjaCIsImRpc2FibGVkIiwiY29tcGFjdCIsIm9uTGFiZWwiLCJvZmZMYWJlbCIsInByZXZlbnREZWZhdWx0IiwiU2VhcmNoYWJsZVNlbGVjdCIsImZpbmQiLCJhY3RpdmUiLCJMb2NhbFNlbGVjdCIsIlN0cmluZyIsImFwaSIsIkFwaUNsaWVudCIsIlJBTkdFUyIsIldJREdFVFMiLCJpbnIiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsIlJhbmdlU2VsZWN0IiwiYXhpc01heCIsInBhZGRlZCIsIm1hZ25pdHVkZSIsIk1hdGgiLCJmbG9vciIsImxvZzEwIiwibm9ybWFsaXplZCIsIm5pY2UiLCJMaW5lQ2hhcnQiLCJzZXJpZXMiLCJob3ZlciIsInNldEhvdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJwYWRMZWZ0IiwicGFkUmlnaHQiLCJwYWRUb3AiLCJwYWRCb3R0b20iLCJtYXgiLCJwb2ludCIsIm9yZGVyVmFsdWUiLCJwbG90V2lkdGgiLCJwbG90SGVpZ2h0IiwiYmFzZWxpbmUiLCJ5Rm9yIiwic3RlcCIsImNvb3JkcyIsImluZGV4IiwieCIsInkiLCJsaW5lIiwiam9pbiIsImFyZWEiLCJsYWJlbEV2ZXJ5IiwiY2VpbCIsInRpY2tzIiwicmF0aW8iLCJyb3VuZCIsIm9uTW91c2VMZWF2ZSIsInZpZXdCb3giLCJ0aWNrIiwieDEiLCJ4MiIsInkxIiwieTIiLCJ0ZXh0QW5jaG9yIiwiZCIsImZpbGwiLCJvcGFjaXR5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZUxpbmVjYXAiLCJkYXRlIiwiY3giLCJjeSIsInIiLCJvbk1vdXNlRW50ZXIiLCJwb2ludGVyRXZlbnRzIiwic3R5bGUiLCJsZWZ0IiwiUGFnZXIiLCJwYWdlIiwicGFnZVNpemUiLCJ0b3RhbCIsInBhZ2VzIiwibnVtYmVycyIsIm51bWJlciIsInB1c2giLCJEYXNoYm9hcmQiLCJyZXF1ZXN0cyIsInJhbmdlcyIsInNldFJhbmdlcyIsIm9yZGVycyIsImN1c3RvbWVycyIsInByb2R1Y3RzIiwiZGF0YSIsInNldERhdGEiLCJzZXRQYWdlcyIsImJ1c3kiLCJzZXRCdXN5IiwibG9hZFdpZGdldCIsIndpZGdldCIsInJhbmdlIiwidGlja2V0IiwiZ2V0RGFzaGJvYXJkIiwicGFyYW1zIiwidGhlbiIsInJlc3BvbnNlIiwiZmluYWxseSIsImZvckVhY2giLCJjaGFuZ2VSYW5nZSIsImNoYW5nZVBhZ2UiLCJCb3giLCJ2YXJpYW50IiwiSDIiLCJtYiIsIkg1IiwiVGV4dCIsIm9yZGVyQ291bnQiLCJyb3dzIiwicm93IiwiaWQiLCJvcmRlck5vIiwibmFtZSIsImFtb3VudCIsInBsYWNlZEF0IiwicGhvbmUiLCJkYXRlT2ZCaXJ0aCIsInJlZ2lzdGVyZWRBdCIsIm5vcm1hbGl6ZVNsdWdJbnB1dCIsInJlcGxhY2UiLCJ3aXRob3V0VHJhaWxpbmdTbGFzaCIsInBhcnNlU2x1Z3MiLCJyYXciLCJBcnJheSIsImlzQXJyYXkiLCJCb29sZWFuIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwic3BsaXQiLCJQcm9kdWN0RWRpdCIsInByb3BzIiwicmVjb3JkIiwiaW5pdGlhbFJlY29yZCIsInJlc291cmNlIiwiaGFuZGxlQ2hhbmdlIiwic3VibWl0IiwiaGFuZGxlU3VibWl0IiwibG9hZGluZyIsInVzZVJlY29yZCIsImFkZE5vdGljZSIsInVzZU5vdGljZSIsImZpbGVSZWYiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJzbHVnRWRpdGVkIiwic2V0U2x1Z0VkaXRlZCIsInNsdWciLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsImNhdGVnb3JpZXMiLCJzZXRDYXRlZ29yaWVzIiwiY3VzdG9tIiwiYXBpQmFzZVVybCIsInByb2R1Y3RVcmxCYXNlIiwibG9jYXRpb24iLCJvcmlnaW4iLCJzbHVnSW5wdXQiLCJwcmV2aWV3U2x1ZyIsInByb2R1Y3RVcmwiLCJzZWxlY3RlZENhdGVnb3J5U2x1Z3MiLCJjYXRlZ29yeUlkcyIsImltYWdlVXJsIiwiaW1hZ2UiLCJ0ZXN0IiwiYXBwVXJsIiwiZGlzcGxheWVkSW1hZ2VVcmwiLCJzdGFydHNXaXRoIiwiVVJMIiwicmV2b2tlT2JqZWN0VVJMIiwiaWdub3JlIiwiZmV0Y2giLCJqc29uIiwiY2F0Y2giLCJzZXRGaWVsZCIsIm9uUHJvcGVydHlDaGFuZ2UiLCJwcm9wZXJ0eVBhdGgiLCJyZXN0Iiwic2V0U2VsZWN0ZWRDYXRlZ29yaWVzIiwic2x1Z3MiLCJzdHJpbmdpZnkiLCJ1cGxvYWRJbWFnZSIsImZpbGUiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJsb2NhbFByZXZpZXdVcmwiLCJjcmVhdGVPYmplY3RVUkwiLCJtZXRob2QiLCJib2R5Iiwib2siLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsIm1lZGlhIiwicGF0aCIsIm5vdGljZSIsImRlc2NyaXB0aW9uUHJvcGVydHkiLCJlZGl0UHJvcGVydGllcyIsInByb3BlcnR5IiwiYXMiLCJvblN1Ym1pdCIsIkgzIiwiY29sb3IiLCJyZXF1aXJlZCIsIm10IiwiaHJlZiIsInJlbCIsIm1pbiIsInByaWNlVmFsdWUiLCJvbGRQcmljZVZhbHVlIiwid2VpZ2h0IiwiYmFkZ2UiLCJzdG9jayIsInNvcnRPcmRlciIsInNyYyIsImFsdCIsImFjY2VwdCIsImlzQmVzdFNlbGxlciIsImlzSW1wb3J0ZWQiLCJpc0ZlYXR1cmVkIiwiaXNBY3RpdmUiLCJtaW5IZWlnaHQiLCJCYXNlUHJvcGVydHlDb21wb25lbnQiLCJ3aGVyZSIsIkJ1dHRvbiIsIkljb24iLCJpY29uIiwic3BpbiIsIkNhdGVnb3J5RWRpdCIsImJhbm5lckZpbGVSZWYiLCJiYW5uZXJVcGxvYWRpbmciLCJzZXRCYW5uZXJVcGxvYWRpbmciLCJiYW5uZXJQcmV2aWV3VXJsIiwic2V0QmFubmVyUHJldmlld1VybCIsImNhdGVnb3J5VXJsQmFzZSIsImNhdGVnb3J5VXJsIiwiYmFubmVySW1hZ2VVcmwiLCJiYW5uZXJJbWFnZSIsImRpc3BsYXllZEJhbm5lclVybCIsInVwbG9hZFRvIiwiZmllbGQiLCJzZXRMb2NhbFByZXZpZXciLCJzdWNjZXNzTWVzc2FnZSIsInN1YnRpdGxlIiwibWFyZ2luVG9wIiwiZGlzcGxheSIsIlBFUl9QQUdFX09QVElPTlMiLCJDbXNMaXN0Iiwic2V0VGFnIiwidGl0bGVQcm9wIiwidGl0bGVQcm9wZXJ0eSIsInN0b3JlUGFyYW1zIiwiZmlsdGVycyIsInVzZVF1ZXJ5UGFyYW1zIiwicmVjb3JkcyIsImRpcmVjdGlvbiIsInNvcnRCeSIsImZldGNoRGF0YSIsInBlclBhZ2UiLCJ1c2VSZWNvcmRzIiwic2VsZWN0ZWRSZWNvcmRzIiwiaGFuZGxlU2VsZWN0IiwiaGFuZGxlU2VsZWN0QWxsIiwic2V0U2VsZWN0ZWRSZWNvcmRzIiwidXNlU2VsZWN0ZWRSZWNvcmRzIiwiZGVib3VuY2VSZWYiLCJzdG9yZVBhcmFtc1JlZiIsInRvU3RyaW5nIiwiaGFuZGxlUXVlcnlDaGFuZ2UiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidHJpbW1lZCIsImhhbmRsZUFjdGlvblBlcmZvcm1lZCIsImN1cnJlbnRQYWdlIiwicm93c1BlclBhZ2UiLCJ0b3RhbFJvd3MiLCJ0b3RhbFBhZ2VzIiwiZnJvbSIsInRvIiwiZ29Ub1BhZ2UiLCJuZXh0UGFnZSIsInNhZmUiLCJjaGFuZ2VQZXJQYWdlIiwibmV4dCIsInBhZ2VOdW1iZXJzIiwid2luZG93U2l6ZSIsInN0YXJ0IiwiZW5kIiwicG9zaXRpb24iLCJtYXhXaWR0aCIsInRyYW5zZm9ybSIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwib3B0aW9uIiwicmVzb2x2ZUltYWdlVXJsIiwiRmllbGRFcnJvciIsIlJldmlld0VkaXQiLCJhY3Rpb24iLCJpc05ldyIsImVycm9ycyIsInJhdGluZyIsImlzQXBwcm92ZWQiLCJjb250ZW50IiwiVEFCUyIsImZpZWxkcyIsIkltYWdlVXBsb2FkZXIiLCJvblVwbG9hZCIsIndpZGUiLCJkaXNwbGF5ZWQiLCJTZXR0aW5nc0VkaXQiLCJhY3RpdmVUYWIiLCJzZXRBY3RpdmVUYWIiLCJtb2JpbGVCYW5uZXJGaWxlUmVmIiwiaGlnaGxpZ2h0RmlsZVJlZiIsImJhbm5lclByZXZpZXciLCJzZXRCYW5uZXJQcmV2aWV3IiwibW9iaWxlQmFubmVyUHJldmlldyIsInNldE1vYmlsZUJhbm5lclByZXZpZXciLCJoaWdobGlnaHRQcmV2aWV3Iiwic2V0SGlnaGxpZ2h0UHJldmlldyIsIm1vYmlsZUJhbm5lclVwbG9hZGluZyIsInNldE1vYmlsZUJhbm5lclVwbG9hZGluZyIsImhpZ2hsaWdodFVwbG9hZGluZyIsInNldEhpZ2hsaWdodFVwbG9hZGluZyIsImhvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MiLCJob21lQmFubmVySW1hZ2UiLCJtb2JpbGVCYW5uZXJJbWFnZVVybCIsImhvbWVNb2JpbGVCYW5uZXJJbWFnZSIsImhpZ2hsaWdodEltYWdlVXJsIiwiaG9tZUhpZ2hsaWdodEltYWdlIiwiaGFzaCIsInNvbWUiLCJ0YWIiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwic2V0UHJldmlldyIsImZsZXgiLCJmbGV4RGlyZWN0aW9uIiwiRHJhd2VyQ29udGVudCIsInByb3BlcnRpZXMiLCJwIiwiSDQiLCJtb3JuaW5nRGVsaXZlcnlUaXRsZSIsIm1vcm5pbmdEZWxpdmVyeVN1YnRpdGxlIiwibW9ybmluZ1NoaXBwaW5nRmVlIiwibW9ybmluZ0ZyZWVBYm92ZSIsImV4cHJlc3NEZWxpdmVyeVRpdGxlIiwiZXhwcmVzc0RlbGl2ZXJ5U3VidGl0bGUiLCJleHByZXNzU2hpcHBpbmdGZWUiLCJleHByZXNzRnJlZUFib3ZlIiwiaGFuZGxpbmdGZWUiLCJEcmF3ZXJGb290ZXIiLCJwYWQiLCJudW0iLCJwYWRTdGFydCIsInRvRGF0ZXRpbWVWYWx1ZSIsIkRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImZvcm1hdERhdGV0aW1lTGFiZWwiLCJkYXkiLCJtb250aCIsInllYXIiLCJob3VyIiwibWludXRlIiwiQ2hvaWNlQ2FyZCIsIkFuY2hvcmVkU2VsZWN0IiwiRGF0ZVRpbWVQaWNrZXIiLCJ2YWxpZCIsIm1vbnRoRGF0ZSIsInNldE1vbnRoRGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsImZpcnN0RGF5IiwiZ2V0RGF5IiwidG90YWxEYXlzIiwiY2VsbHMiLCJpIiwiYXBwbHkiLCJuZXh0SG91cnMiLCJuZXh0TWludXRlcyIsInNlbGVjdGVkRGF5IiwiQ291cG9uRWRpdCIsInNldFByb2R1Y3RzIiwic2VsZWN0ZWRTbHVncyIsInRhcmdldFNsdWdzIiwidGFyZ2V0VHlwZSIsImFwcGx5T24iLCJ1c2FnZVR5cGUiLCJjb3Vwb25UeXBlIiwibG9hZENhdGFsb2ciLCJjYXRlZ29yeURhdGEiLCJhbGxQcm9kdWN0cyIsImhhc01vcmUiLCJwcm9kdWN0RGF0YSIsInNldFNlbGVjdGVkU2x1Z3MiLCJwcm9kdWN0T3B0aW9ucyIsImNhdGVnb3J5T3B0aW9ucyIsImNvZGUiLCJ0b1VwcGVyQ2FzZSIsIm1pbkNhcnQiLCJtYXhEaXNjb3VudCIsInVzYWdlTGltaXQiLCJ1c2VkQ291bnQiLCJzdGFydHNBdCIsImV4cGlyZXNBdCIsIkZVTEZJTExNRU5UIiwiUEFZTUVOVF9PUFRJT05TIiwiZm9ybWF0TW9uZXkiLCJmb3JtYXREYXRlVGltZSIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsInJlc29sdmVJbWFnZSIsIk1vcmVNZW51IiwidW5wYWlkIiwib25DYXNoIiwib25RciIsInNuYXBzaG90Iiwic3RhdHVzIiwicGF5bWVudFN0YXR1cyIsImRlbGl2ZXJ5UGFydG5lcklkIiwiY29udGFjdE5hbWUiLCJjb250YWN0UGhvbmUiLCJhZGRyZXNzTGluZTEiLCJhZGRyZXNzTGluZTIiLCJhZGRyZXNzQ2l0eSIsImFkZHJlc3NTdGF0ZSIsImFkZHJlc3NQaW5jb2RlIiwiYWRkcmVzc0xhbmRtYXJrIiwiT3JkZXJEZXRhaWwiLCJzZXRSZWNvcmQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJhY3Rpb25CdXN5Iiwic2V0QWN0aW9uQnVzeSIsInBhcnRuZXJzIiwic2V0UGFydG5lcnMiLCJzZXRCYXNlbGluZSIsImVkaXRDb250YWN0Iiwic2V0RWRpdENvbnRhY3QiLCJlZGl0QWRkcmVzcyIsInNldEVkaXRBZGRyZXNzIiwicGF0aG5hbWUiLCJyZXNvdXJjZUFjdGlvbiIsInJlc291cmNlSWQiLCJhY3Rpb25OYW1lIiwiaXRlbXMiLCJpdGVtc0pzb24iLCJkaXJ0eSIsIk9iamVjdCIsImtleXMiLCJsaXN0VXJsIiwiaGFuZGxlU2F2ZSIsInBpbiIsInJ1blBheW1lbnRBY3Rpb24iLCJjb25maXJtIiwicmVjb3JkQWN0aW9uIiwicmVjb3JkSWQiLCJzdGF0dXNMYWJlbCIsInJlc3RvcmVGaWVsZHMiLCJjbG9zZSIsImFkZHJlc3NUZXh0IiwicGF5bWVudExhYmVsIiwicGFydG5lck5hbWUiLCJkZWxpdmVyeVBhcnRuZXJOYW1lIiwiZGVsaXZlcnlQYXJ0bmVyUGhvbmUiLCJpdGVtQ291bnQiLCJyZWR1Y2UiLCJzdW0iLCJxdWFudGl0eSIsImNyZWF0ZWRBdCIsImxpbmVUb3RhbCIsInBheW1lbnRNZXRob2QiLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlPcHRpb24iLCJkZWxpdmVyeUNoYXJnZSIsImhhbmRsaW5nQ2hhcmdlIiwic21hbGxDYXJ0Q2hhcmdlIiwiZGlzY291bnQiLCJjb3Vwb25Db2RlIiwiZ3JhbmRUb3RhbCIsInBheW1lbnRDb2xsZWN0ZWRBcyIsInJhem9ycGF5UGF5bWVudElkIiwicmF6b3JwYXlRclVybCIsImlucHV0TW9kZSIsIkV5ZUljb24iLCJoaWRkZW4iLCJQYXNzd29yZEZpZWxkIiwidmlzaWJsZSIsIm9uVG9nZ2xlIiwiTGFiZWwiLCJodG1sRm9yIiwiYXV0b0NvbXBsZXRlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwiY3Vyc29yIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsIkNoYW5nZVBhc3N3b3JkIiwicGFzc3dvcmQiLCJzZXRQYXNzd29yZCIsImNvbmZpcm1QYXNzd29yZCIsInNldENvbmZpcm1QYXNzd29yZCIsInNob3dQYXNzd29yZCIsInNldFNob3dQYXNzd29yZCIsInNob3dDb25maXJtIiwic2V0U2hvd0NvbmZpcm0iLCJzZXRFcnJvciIsImJhY2siLCJzYXZlIiwicmVkaXJlY3RVcmwiLCJlcnIiLCJpbnNldCIsInpJbmRleCIsImJnIiwiYm9yZGVyUmFkaXVzIiwiYm94U2hhZG93IiwiZW1haWwiLCJnYXAiLCJJTkRJQV9TVEFURVMiLCJWRUhJQ0xFX1RZUEVTIiwiU1RBVEVfT1BUSU9OUyIsIlBhcnRuZXJFZGl0IiwicmVhZE9ubHkiLCJoYXNQYXNzd29yZCIsIm1heExlbmd0aCIsInNsaWNlIiwiZmF0aGVyTmFtZSIsInBhbk51bWJlciIsImFhZGhhYXJOdW1iZXIiLCJjaXR5IiwicGluY29kZSIsInN0YXRlIiwicGVybWFuZW50QWRkcmVzcyIsImVtZXJnZW5jeU5hbWUiLCJlbWVyZ2VuY3lQaG9uZSIsInZlaGljbGVUeXBlIiwidmVoaWNsZU51bWJlciIsImFjY291bnRIb2xkZXJOYW1lIiwiYWNjb3VudE51bWJlciIsImlmc2NDb2RlIiwibm90ZXMiLCJQaW5jb2RlRWRpdCIsIm1vcm5pbmdFbmFibGVkIiwiZXhwcmVzc0VuYWJsZWQiLCJwYXJ0bmVySWQiLCJwYXJ0bmVyIiwibWFyZ2luIiwiYXJlYUxhYmVsIiwic3RhdGVDb2RlIiwiU3RhdHVzVG9nZ2xlIiwic2V0Q2hlY2tlZCIsInBlcnNpc3QiLCJzYXZlZCIsImRlc2NyaXB0aW9uIiwidG9EYXRlSW5wdXQiLCJ0ZXh0IiwiZm9ybWF0V2hlbiIsInBhcnNlQWRkcmVzc2VzIiwiYWRkcmVzc2VzIiwiZ3JvdXBlZCIsImVudHJpZXMiLCJtYXRjaCIsInNvcnQiLCJhIiwiYiIsImFkZHJlc3NMaW5lcyIsImFkZHJlc3MiLCJsaW5lMSIsImxpbmUyIiwibGFuZG1hcmsiLCJDdXN0b21lckVkaXQiLCJST0xFUyIsIlBFUk1JU1NJT05TIiwic2V0VmlzaWJsZSIsIlRlYW1FZGl0IiwicGVybWlzc2lvbk9uIiwidXNlcm5hbWUiLCJGT0xERVJTIiwiZm9ybWF0U2l6ZSIsImJ5dGVzIiwic2l6ZSIsInRvRml4ZWQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJyZXNvbHZlVXJsIiwiTWVkaWFMaWJyYXJ5IiwiYnVzeUlkIiwic2V0QnVzeUlkIiwiZm9sZGVyIiwidXBsb2FkRm9sZGVyIiwib3JpZ2luYWxOYW1lIiwiZmlsZW5hbWUiLCJ1cmwiLCJzZXRGb2xkZXIiLCJ1cGxvYWRGaWxlcyIsImxpc3QiLCJjb3B5UGF0aCIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInJlbW92ZSIsIm9uRHJhZ092ZXIiLCJvbkRyb3AiLCJkYXRhVHJhbnNmZXIiLCJtdWx0aXBsZSIsIlJFTUVNQkVSRURfTE9HSU5fS0VZIiwiTG9naW4iLCJlcnJvck1lc3NhZ2UiLCJfX0FQUF9TVEFURV9fIiwidHJhbnNsYXRlTWVzc2FnZSIsInVzZVRyYW5zbGF0aW9uIiwiYWRtaW5Sb290IiwiZm9yZ290UGFzc3dvcmRVcmwiLCJpZGVudGlmaWVyIiwic2V0SWRlbnRpZmllciIsInJlbWVtYmVyTG9naW4iLCJzZXRSZW1lbWJlckxvZ2luIiwicmVtZW1iZXJlZExvZ2luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImZvcm0iLCJjdXJyZW50VGFyZ2V0IiwiZW1haWxJbnB1dCIsImVsZW1lbnRzIiwibmFtZWRJdGVtIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJNZXNzYWdlQm94IiwiRm9ybUdyb3VwIiwiZGVmYXVsdFZhbHVlIiwibWFyZ2luUmlnaHQiLCJmb250U2l6ZSIsInRleHRBbGlnbiIsImZvbnRXZWlnaHQiLCJhZG1pblJvb3RQYXRoIiwiY2F0YWxvZ0NvbmZpZyIsImV4cG9ydFVybCIsImltcG9ydFVybCIsIkNhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyIsIm9uSW1wb3J0ZWQiLCJ0cmFuc2xhdGVCdXR0b24iLCJ0cmFuc2xhdGVBY3Rpb24iLCJ0b2dnbGVGaWx0ZXIiLCJmaWx0ZXJzQ291bnQiLCJ1c2VGaWx0ZXJEcmF3ZXIiLCJzZXRMb2FkaW5nIiwic2V0TWVzc2FnZSIsImNvbmZpZyIsInJvb3QiLCJoYW5kbGVJbXBvcnQiLCJjcmVkZW50aWFscyIsImVycm9yQ291bnQiLCJjcmVhdGVkIiwidXBkYXRlZCIsImJ1dHRvbnMiLCJjbGljayIsIm5ld0FjdGlvbiIsInJlc291cmNlQWN0aW9ucyIsImZpbHRlcktleSIsImNvdW50IiwiRnJhZ21lbnQiLCJmbGV4U2hyaW5rIiwicHgiLCJCdXR0b25Hcm91cCIsIm9uQ2xvc2VDbGljayIsIkNBVEFMT0dfUkVTT1VSQ0VTIiwiQWN0aW9uSGVhZGVyIiwiT3JpZ2luYWxDb21wb25lbnQiLCJCYXNlSGVhZGVyIiwiT3JpZ2luYWxBY3Rpb25IZWFkZXIiLCJpc0NhdGFsb2dMaXN0IiwiX2lnbm9yZWQiLCJoZWFkZXJQcm9wcyIsIl9leHRlbmRzIiwib21pdEFjdGlvbnMiLCJERUZBVUxUX09QVElPTlMiLCJwbHVnaW5zIiwidG9vbGJhciIsIlJpY2h0ZXh0RWRpdCIsImhhbmRsZVVwZGF0ZSIsInVzZUNhbGxiYWNrIiwibmV3VmFsdWUiLCJpc1JlcXVpcmVkIiwiVGlueU1DRSIsIkZvcm1NZXNzYWdlIiwibWVtbyIsImN1dCIsInNlYXJjaCIsIlNpZGViYXJSZXNvdXJjZVNlY3Rpb24iLCJPcmlnaW5hbCIsInVzZUxvY2F0aW9uIiwibmF2aWdhdGUiLCJ1c2VOYXZpZ2F0ZSIsInJlc291cmNlcyIsImdldFJlc291cmNlRWxlbWVudENzcyIsInN1ZmZpeCIsIkxvYWRlciIsIk5vUmVjb3JkcyIsInNlbGVjdGVkQ291bnQiLCJzZWxlY3RlZEFsbCIsImluZGV0ZXJtaW5hdGUiLCJyZWNvcmRzSGF2ZUJ1bGtBY3Rpb24iLCJidWxrQWN0aW9ucyIsImNvbnRlbnRUYWciLCJzZWxlY3RlZFRhZyIsImJvZHlUYWciLCJUYWJsZSIsIlNlbGVjdGVkUmVjb3JkcyIsIlJlY29yZHNUYWJsZUhlYWRlciIsImxpc3RQcm9wZXJ0aWVzIiwiVGFibGVCb2R5IiwiUmVjb3JkSW5MaXN0IiwiaXNTZWxlY3RlZCIsImlzVGl0bGUiLCJTZWxlY3RBbGxDaGVja0JveCIsImlucHV0UmVmIiwibWFyZ2luTGVmdCIsInBvaW50cyIsInJvd1RhZyIsImNoZWNrYm94Q3NzIiwiVGFibGVIZWFkIiwiVGFibGVSb3ciLCJUYWJsZUNlbGwiLCJQcm9wZXJ0eUhlYWRlciIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIkRlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVPLFNBQVNBLGlCQUFlQSxDQUFDQyxJQUFJLEVBQUU7RUFDcEMsRUFBQSxNQUFNQyxPQUFPLEdBQUdDLFlBQU0sQ0FBQyxJQUFJLENBQUM7SUFDNUIsTUFBTSxDQUFDQyxNQUFNLEVBQUVDLFNBQVMsQ0FBQyxHQUFHQyxjQUFRLENBQUMsS0FBSyxDQUFDO0VBRTNDQyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNkLElBQUEsSUFBSSxDQUFDTixJQUFJLEVBQUUsT0FBT08sU0FBUztNQUUzQixNQUFNQyxNQUFNLEdBQUdBLE1BQU07RUFDbkIsTUFBQSxNQUFNQyxJQUFJLEdBQUdSLE9BQU8sQ0FBQ1MsT0FBTztRQUM1QixJQUFJLENBQUNELElBQUksRUFBRTtFQUNYLE1BQUEsTUFBTUUsSUFBSSxHQUFHRixJQUFJLENBQUNHLHFCQUFxQixFQUFFO1FBQ3pDLE1BQU1DLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxXQUFXLEdBQUdKLElBQUksQ0FBQ0ssTUFBTTtRQUNuRFosU0FBUyxDQUFDUyxVQUFVLEdBQUcsR0FBRyxJQUFJRixJQUFJLENBQUNNLEdBQUcsR0FBR0osVUFBVSxDQUFDO01BQ3RELENBQUM7RUFFREwsSUFBQUEsTUFBTSxFQUFFO0VBQ1JNLElBQUFBLE1BQU0sQ0FBQ0ksZ0JBQWdCLENBQUMs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LEVBQUFBLElBQUksRUFBRTtFQUFvQixDQUFDLEVBQ3pDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQVEsQ0FBQyxFQUM3QjtFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFRLENBQUMsRUFDN0I7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBYSxDQUFDLEVBQ2xDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQWUsQ0FBQyxFQUNwQztFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUEyQyxDQUFDLEVBQ2hFO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQVEsQ0FBQyxFQUM3QjtFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFNLENBQUMsRUFDM0I7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBVSxDQUFDLEVBQy9CO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQVUsQ0FBQyxFQUMvQjtFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFtQixDQUFDLEVBQ3hDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQW9CLENBQUMsRUFDekM7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBWSxDQUFDLEVBQ2pDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQVksQ0FBQyxFQUNqQztFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFTLENBQUMsRUFDOUI7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBUyxDQUFDLEVBQzlCO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQWMsQ0FBQyxFQUNuQztFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFpQixDQUFDLEVBQ3RDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQWMsQ0FBQyxFQUNuQztFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFVLENBQUMsRUFDL0I7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBWSxDQUFDLEVBQ2pDO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQVUsQ0FBQyxFQUMvQjtFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFXLENBQUMsRUFDaEM7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBUyxDQUFDLEVBQzlCO0VBQUU0UyxFQUFBQSxJQUFJLEVBQUUsSUFBSTtFQUFFNVMsRUFBQUEsSUFBSSxFQUFFO0VBQWEsQ0FBQyxFQUNsQztFQUFFNFMsRUFBQUEsSUFBSSxFQUFFLElBQUk7RUFBRTVTLEVBQUFBLElBQUksRUFBRTtFQUFTLENBQUMsRUFDOUI7RUFBRTRTLEVBQUFBLElBQUksRUFBRSxJQUFJO0VBQUU1UyxFQUFBQSxJQUFJLEVBQUU7RUFBWSxDQUFDLEVBQ2pDO0VBQUU0UyxFQUFBQSxJQUFJLEVB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
