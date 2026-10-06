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
      className: "tokri-choice-row",
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: params.isTaxable === true || params.isTaxable === 'true',
      title: "Taxable (Yes)",
      hint: "Charge GST at checkout",
      onClick: () => {
        const next = !(params.isTaxable === true || params.isTaxable === 'true');
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
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Subtotal"), /*#__PURE__*/React__default.default.createElement("dd", null, itemCount, " ", itemCount === 1 ? 'item' : 'items'), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.itemsTotal))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Delivery", params.deliveryOption ? ` · ${params.deliveryOption === 'express' ? '90-minute' : 'Morning'}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, params.freeDeliveryApplied || Number(params.deliveryCharge) === 0 ? 'Free (Welcome offer)' : formatMoney(params.deliveryCharge))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Handling"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.handlingCharge))), Number(params.taxTotal) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Taxes (GST)", params.isInterState ? ' · IGST' : ' · CGST+SGST'), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.taxTotal))) : null, Number(params.smallCartCharge) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Small cart"), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, formatMoney(params.smallCartCharge))) : null, Number(params.discount) > 0 ? /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("dt", null, "Discount", params.couponCode ? ` · ${params.couponCode}` : ''), /*#__PURE__*/React__default.default.createElement("dd", null), /*#__PURE__*/React__default.default.createElement("dd", null, "-", formatMoney(params.discount))) : null, /*#__PURE__*/React__default.default.createElement("div", {
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
    const isTaxableBool = params.isTaxable === true || params.isTaxable === 'true' || params.isTaxable === 1;
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
    }, /*#__PURE__*/React__default.default.createElement("h4", null, "Taxability status"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "tokri-choice-row"
    }, /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: isTaxableBool,
      title: "Taxable (Yes)",
      hint: "Charge GST at checkout",
      onClick: () => handleTaxableToggle(true)
    }), /*#__PURE__*/React__default.default.createElement(FlagCard, {
      selected: !isTaxableBool,
      title: "Non-taxable (No)",
      hint: "0% GST (Fresh fruits)",
      onClick: () => handleTaxableToggle(false)
    }))), /*#__PURE__*/React__default.default.createElement("section", {
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
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.ActionHeader = ActionHeader;
  AdminJS.UserComponents.DefaultRichtextEditProperty = DefaultRichtextEditProperty;
  AdminJS.UserComponents.SidebarResourceSection = SidebarResourceSection;
  AdminJS.UserComponents.RecordsTable = RecordsTable;
  AdminJS.UserComponents.RecordsTableHeader = RecordsTableHeader;

})(React, AdminJS, AdminJSDesignSystem, ReactRouter);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3JtLWNvbnRyb2xzLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXZpZXctZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jaGFuZ2UtcGFzc3dvcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvaW5kaWEtc3RhdGVzLmpzIiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcGFydG5lci1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2N1c3RvbWVyLWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGVhbS1lZGl0LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL21lZGlhLWxpYnJhcnkuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGF4LWVkaXQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4uanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2FjdGlvbi1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmljaHRleHQtZWRpdC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zaWRlYmFyLWRhc2hib2FyZC5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZWNvcmRzLXRhYmxlLmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUtaGVhZGVyLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW29wZW5VcCwgc2V0T3BlblVwXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgc2V0T3BlblVwKHNwYWNlQmVsb3cgPCAyNDAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBvcGVuVXAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGbGFnQ2FyZCh7IHNlbGVjdGVkLCB0aXRsZSwgaGludCwgb25DbGljayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e2B0b2tyaS1jaG9pY2UtY2FyZCR7c2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgID5cbiAgICAgIDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPlxuICAgICAgPHNwYW4+e2hpbnR9PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsYWdPbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJ29uJyB8fCB2YWx1ZSA9PT0gMSB8fCB2YWx1ZSA9PT0gJzEnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdGF0dXNTd2l0Y2goe1xuICBjaGVja2VkLFxuICBvbkNoYW5nZSxcbiAgZGlzYWJsZWQsXG4gIHRpdGxlLFxuICBoaW50LFxuICBjb21wYWN0ID0gZmFsc2UsXG4gIG9uTGFiZWwgPSAnQWN0aXZlJyxcbiAgb2ZmTGFiZWwgPSAnSW5hY3RpdmUnLFxufSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc3dpdGNoJHtjaGVja2VkID8gJyBpcy1vbicgOiAnJ30ke2NvbXBhY3QgPyAnIGlzLWNvbXBhY3QnIDogJyd9YH1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgIGFyaWEtcHJlc3NlZD17Y2hlY2tlZH1cbiAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGlmICghZGlzYWJsZWQpIG9uQ2hhbmdlKCFjaGVja2VkKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtdHJhY2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktc3dpdGNoLXRodW1iXCIgLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIHt0aXRsZSB8fCBoaW50ID8gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1zd2l0Y2gtY29weVwiPlxuICAgICAgICAgIHt0aXRsZSA/IDxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPiA6IG51bGx9XG4gICAgICAgICAge2hpbnQgPyA8c3Bhbj57aGludH08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKSA6IChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktc3RhdHVzLXBpbGwke2NoZWNrZWQgPyAnIGlzLW9uJyA6ICcnfWB9PlxuICAgICAgICAgIHtjaGVja2VkID8gb25MYWJlbCA6IG9mZkxhYmVsfVxuICAgICAgICA8L3NwYW4+XG4gICAgICApfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWFyY2hhYmxlU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIsIGRpc2FibGVkIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBmaWx0ZXJlZCA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PlxuICAgIGAke2l0ZW0ubGFiZWx9ICR7aXRlbS52YWx1ZX1gLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKCkpLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0XCIgcmVmPXt3cmFwUmVmfT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNvbnRyb2xcIlxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBpZiAoIWRpc2FibGVkKSBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudClcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtzZWxlY3RlZCA/ICcnIDogJ3Rva3JpLW11bHRpc2VsZWN0LXBsYWNlaG9sZGVyJ30+XG4gICAgICAgICAge3NlbGVjdGVkPy5sYWJlbCB8fCBwbGFjZWhvbGRlcn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBpdGVtLnZhbHVlID09PSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWUgfHwgJ2VtcHR5J31cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktbXVsdGlzZWxlY3Qtb3B0aW9uJHthY3RpdmUgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgc2V0UXVlcnkoJycpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1lbXB0eVwiPk5vIG1hdGNoZXM8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExvY2FsU2VsZWN0KHsgdmFsdWUsIG9wdGlvbnMsIG9uQ2hhbmdlLCBkaXNhYmxlZCB9KSB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IHdyYXBSZWYsIG9wZW5VcCB9ID0gdXNlQW5jaG9yZWRNZW51KG9wZW4pXG4gIGNvbnN0IHNlbGVjdGVkID0gb3B0aW9ucy5maW5kKChpdGVtKSA9PiBTdHJpbmcoaXRlbS52YWx1ZSkgPT09IFN0cmluZyh2YWx1ZSkpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBvbkRvY0NsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXdyYXBSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgc2V0T3BlbihmYWxzZSlcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljaylcbiAgfSwgW3dyYXBSZWZdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1sb2NhbC1zZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktbG9jYWwtc2VsZWN0LWNvbnRyb2xcIlxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBpZiAoIWRpc2FibGVkKSBzZXRPcGVuKChjdXJyZW50KSA9PiAhY3VycmVudClcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4+e3NlbGVjdGVkPy5sYWJlbCB8fCB2YWx1ZX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW11bHRpc2VsZWN0LWNhcmV0XCI+e29wZW4gPyAn4pa0JyA6ICfilr4nfTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAge29wZW4gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdG9rcmktbG9jYWwtc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAge29wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBrZXk9e2l0ZW0udmFsdWV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7U3RyaW5nKGl0ZW0udmFsdWUpID09PSBTdHJpbmcodmFsdWUpID8gJyBpcy1zZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2UoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgQm94LCBIMiwgSDUsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMnXG5cbmNvbnN0IGFwaSA9IG5ldyBBcGlDbGllbnQoKVxuY29uc3QgUkFOR0VTID0gW1xuICB7IHZhbHVlOiAnN2QnLCBsYWJlbDogJzcgZGF5cycgfSxcbiAgeyB2YWx1ZTogJ3RoaXNNb250aCcsIGxhYmVsOiAnVGhpcyBtb250aCcgfSxcbiAgeyB2YWx1ZTogJ2xhc3RNb250aCcsIGxhYmVsOiAnTGFzdCBtb250aCcgfSxcbiAgeyB2YWx1ZTogJzkwZCcsIGxhYmVsOiAnMyBtb250aHMnIH0sXG5dXG5jb25zdCBXSURHRVRTID0gWydvcmRlclZhbHVlJywgJ29yZGVycycsICdjdXN0b21lcnMnLCAncHJvZHVjdHMnXVxuXG5jb25zdCBpbnIgPSAodmFsdWUpID0+XG4gIGDigrkke051bWJlcih2YWx1ZSB8fCAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMCB9KX1gXG5cbmZ1bmN0aW9uIFJhbmdlU2VsZWN0KHsgdmFsdWUsIG9uQ2hhbmdlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXJhbmdlLXNlbGVjdFwiPlxuICAgICAgPExvY2FsU2VsZWN0IHZhbHVlPXt2YWx1ZX0gb3B0aW9ucz17UkFOR0VTfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gYXhpc01heCh2YWx1ZSkge1xuICBpZiAodmFsdWUgPD0gMCkgcmV0dXJuIDEwMDBcbiAgY29uc3QgcGFkZGVkID0gdmFsdWUgKiAxLjFcbiAgY29uc3QgbWFnbml0dWRlID0gMTAgKiogTWF0aC5mbG9vcihNYXRoLmxvZzEwKHBhZGRlZCkpXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBwYWRkZWQgLyBtYWduaXR1ZGVcbiAgY29uc3QgbmljZSA9IG5vcm1hbGl6ZWQgPD0gMSA/IDEgOiBub3JtYWxpemVkIDw9IDIgPyAyIDogbm9ybWFsaXplZCA8PSA1ID8gNSA6IDEwXG4gIHJldHVybiBuaWNlICogbWFnbml0dWRlXG59XG5cbmZ1bmN0aW9uIExpbmVDaGFydCh7IHNlcmllcyB9KSB7XG4gIGNvbnN0IFtob3Zlciwgc2V0SG92ZXJdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3Qgd2lkdGggPSAxMjAwXG4gIGNvbnN0IGhlaWdodCA9IDMyMFxuICBjb25zdCBwYWRMZWZ0ID0gODZcbiAgY29uc3QgcGFkUmlnaHQgPSAxOFxuICBjb25zdCBwYWRUb3AgPSAxOFxuICBjb25zdCBwYWRCb3R0b20gPSAzNlxuICBjb25zdCBtYXggPSBheGlzTWF4KE1hdGgubWF4KC4uLnNlcmllcy5tYXAoKHBvaW50KSA9PiBwb2ludC5vcmRlclZhbHVlKSwgMCkpXG4gIGNvbnN0IHBsb3RXaWR0aCA9IHdpZHRoIC0gcGFkTGVmdCAtIHBhZFJpZ2h0XG4gIGNvbnN0IHBsb3RIZWlnaHQgPSBoZWlnaHQgLSBwYWRUb3AgLSBwYWRCb3R0b21cbiAgY29uc3QgYmFzZWxpbmUgPSBwYWRUb3AgKyBwbG90SGVpZ2h0XG4gIGNvbnN0IHlGb3IgPSAodmFsdWUpID0+IGJhc2VsaW5lIC0gKHZhbHVlIC8gbWF4KSAqIHBsb3RIZWlnaHRcbiAgY29uc3Qgc3RlcCA9IHNlcmllcy5sZW5ndGggPiAxID8gcGxvdFdpZHRoIC8gKHNlcmllcy5sZW5ndGggLSAxKSA6IHBsb3RXaWR0aFxuICBjb25zdCBjb29yZHMgPSBzZXJpZXMubWFwKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB4ID0gc2VyaWVzLmxlbmd0aCA9PT0gMSA/IHBhZExlZnQgKyBwbG90V2lkdGggLyAyIDogcGFkTGVmdCArIGluZGV4ICogc3RlcFxuICAgIHJldHVybiB7IHgsIHk6IHlGb3IocG9pbnQub3JkZXJWYWx1ZSksIHBvaW50IH1cbiAgfSlcbiAgY29uc3QgbGluZSA9IGNvb3Jkcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiBgJHtpbmRleCA/ICdMJyA6ICdNJ30ke2l0ZW0ueH0sJHtpdGVtLnl9YCkuam9pbignICcpXG4gIGNvbnN0IGFyZWEgPSBjb29yZHMubGVuZ3RoXG4gICAgPyBgJHtsaW5lfSBMJHtjb29yZHNbY29vcmRzLmxlbmd0aCAtIDFdLnh9LCR7YmFzZWxpbmV9IEwke2Nvb3Jkc1swXS54fSwke2Jhc2VsaW5lfSBaYFxuICAgIDogJydcbiAgY29uc3QgbGFiZWxFdmVyeSA9IHNlcmllcy5sZW5ndGggPiAyMCA/IE1hdGguY2VpbChzZXJpZXMubGVuZ3RoIC8gOCkgOiBzZXJpZXMubGVuZ3RoID4gMTAgPyA0IDogMVxuICBjb25zdCB0aWNrcyA9IFswLCAwLjI1LCAwLjUsIDAuNzUsIDFdLm1hcCgocmF0aW8pID0+ICh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQobWF4ICogcmF0aW8pLFxuICAgIHk6IHlGb3IobWF4ICogcmF0aW8pLFxuICB9KSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtcGxvdFwiIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXIobnVsbCl9PlxuICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWB9IGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0XCIgcm9sZT1cImltZ1wiPlxuICAgICAgICB7dGlja3MubWFwKCh0aWNrKSA9PiAoXG4gICAgICAgICAgPGcga2V5PXt0aWNrLnZhbHVlfT5cbiAgICAgICAgICAgIDxsaW5lIHgxPXtwYWRMZWZ0fSB4Mj17d2lkdGggLSBwYWRSaWdodH0geTE9e3RpY2sueX0geTI9e3RpY2sueX0gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtZ3JpZGxpbmVcIiAvPlxuICAgICAgICAgICAgPHRleHQgeD17cGFkTGVmdCAtIDEwfSB5PXt0aWNrLnkgKyA0fSB0ZXh0QW5jaG9yPVwiZW5kXCIgY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtYXhpc1wiPlxuICAgICAgICAgICAgICB7aW5yKHRpY2sudmFsdWUpfVxuICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKSl9XG4gICAgICAgIDxwYXRoIGQ9e2FyZWF9IGZpbGw9XCIjMDQ3ODU3XCIgb3BhY2l0eT1cIjAuMTZcIiAvPlxuICAgICAgICA8cGF0aCBkPXtsaW5lfSBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjNcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICAgICAge2Nvb3Jkcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICA8ZyBrZXk9e2l0ZW0ucG9pbnQuZGF0ZX0+XG4gICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgIGN4PXtpdGVtLnh9XG4gICAgICAgICAgICAgIGN5PXtpdGVtLnl9XG4gICAgICAgICAgICAgIHI9XCIxNFwiXG4gICAgICAgICAgICAgIGZpbGw9XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXIoaXRlbSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGNpcmNsZSBjeD17aXRlbS54fSBjeT17aXRlbS55fSByPVwiNC41XCIgZmlsbD1cIiNmZmZcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIyXCIgcG9pbnRlckV2ZW50cz1cIm5vbmVcIiAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKSl9XG4gICAgICAgIHtjb29yZHMubWFwKChpdGVtLCBpbmRleCkgPT5cbiAgICAgICAgICBpbmRleCAlIGxhYmVsRXZlcnkgPT09IDAgPyAoXG4gICAgICAgICAgICA8dGV4dCBrZXk9e2Ake2l0ZW0ucG9pbnQuZGF0ZX0tbGFiZWxgfSB4PXtpdGVtLnh9IHk9e2hlaWdodCAtIDh9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1sYWJlbFwiPlxuICAgICAgICAgICAgICB7aXRlbS5wb2ludC5sYWJlbH1cbiAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICApIDogbnVsbCxcbiAgICAgICAgKX1cbiAgICAgIDwvc3ZnPlxuICAgICAge2hvdmVyID8gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktY2hhcnQtdGlwJHtob3Zlci55IDwgOTAgPyAnIGlzLWJlbG93JyA6ICcnfWB9XG4gICAgICAgICAgc3R5bGU9e3sgbGVmdDogYCR7KGhvdmVyLnggLyB3aWR0aCkgKiAxMDB9JWAsIHRvcDogYCR7KGhvdmVyLnkgLyBoZWlnaHQpICogMTAwfSVgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj57aG92ZXIucG9pbnQubGFiZWx9PC9zcGFuPlxuICAgICAgICAgIDxzdHJvbmc+e2lucihob3Zlci5wb2ludC5vcmRlclZhbHVlKX08L3N0cm9uZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5mdW5jdGlvbiBQYWdlcih7IHBhZ2UsIHBhZ2VTaXplLCB0b3RhbCwgb25DaGFuZ2UgfSkge1xuICBjb25zdCBwYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbCgodG90YWwgfHwgMCkgLyBwYWdlU2l6ZSkpXG4gIGlmIChwYWdlcyA8PSAxKSByZXR1cm4gbnVsbFxuICBjb25zdCBudW1iZXJzID0gW11cbiAgZm9yIChsZXQgbnVtYmVyID0gMTsgbnVtYmVyIDw9IHBhZ2VzOyBudW1iZXIgKz0gMSkgbnVtYmVycy5wdXNoKG51bWJlcilcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXdpZGdldC1wYWdlc1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tcGFnZXNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e3BhZ2UgPD0gMX0gb25DbGljaz17KCkgPT4gb25DaGFuZ2UocGFnZSAtIDEpfT5cbiAgICAgICAgICBQcmV2XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICB7bnVtYmVycy5tYXAoKG51bWJlcikgPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAga2V5PXtudW1iZXJ9XG4gICAgICAgICAgICBjbGFzc05hbWU9e251bWJlciA9PT0gcGFnZSA/ICdpcy1jdXJyZW50JyA6ICcnfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DaGFuZ2UobnVtYmVyKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bnVtYmVyfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e3BhZ2UgPj0gcGFnZXN9IG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHBhZ2UgKyAxKX0+XG4gICAgICAgICAgTmV4dFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgcmVxdWVzdHMgPSB1c2VSZWYoe30pXG4gIGNvbnN0IFtyYW5nZXMsIHNldFJhbmdlc10gPSB1c2VTdGF0ZSh7XG4gICAgb3JkZXJWYWx1ZTogJzdkJyxcbiAgICBvcmRlcnM6ICc3ZCcsXG4gICAgY3VzdG9tZXJzOiAnN2QnLFxuICAgIHByb2R1Y3RzOiAnN2QnLFxuICB9KVxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7fSlcbiAgY29uc3QgW3BhZ2VzLCBzZXRQYWdlc10gPSB1c2VTdGF0ZSh7IG9yZGVyczogMSwgY3VzdG9tZXJzOiAxIH0pXG4gIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVzZVN0YXRlKHtcbiAgICBvcmRlclZhbHVlOiB0cnVlLFxuICAgIG9yZGVyczogdHJ1ZSxcbiAgICBjdXN0b21lcnM6IHRydWUsXG4gICAgcHJvZHVjdHM6IHRydWUsXG4gIH0pXG5cbiAgY29uc3QgbG9hZFdpZGdldCA9ICh3aWRnZXQsIHJhbmdlLCBwYWdlID0gMSkgPT4ge1xuICAgIGNvbnN0IHRpY2tldCA9IChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gfHwgMCkgKyAxXG4gICAgcmVxdWVzdHMuY3VycmVudFt3aWRnZXRdID0gdGlja2V0XG4gICAgc2V0QnVzeSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgW3dpZGdldF06IHRydWUgfSkpXG4gICAgYXBpXG4gICAgICAuZ2V0RGFzaGJvYXJkKHsgcGFyYW1zOiB7IHdpZGdldCwgcmFuZ2UsIHBhZ2UgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXF1ZXN0cy5jdXJyZW50W3dpZGdldF0gIT09IHRpY2tldCkgcmV0dXJuXG4gICAgICAgIHNldERhdGEoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIC4uLnJlc3BvbnNlLmRhdGEgfSkpXG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdHMuY3VycmVudFt3aWRnZXRdICE9PSB0aWNrZXQpIHJldHVyblxuICAgICAgICBzZXRCdXN5KChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogZmFsc2UgfSkpXG4gICAgICB9KVxuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBXSURHRVRTLmZvckVhY2goKHdpZGdldCkgPT4gbG9hZFdpZGdldCh3aWRnZXQsICc3ZCcpKVxuICB9LCBbXSlcblxuICBjb25zdCBjaGFuZ2VSYW5nZSA9ICh3aWRnZXQsIHJhbmdlKSA9PiB7XG4gICAgc2V0UmFuZ2VzKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogcmFuZ2UgfSkpXG4gICAgaWYgKHdpZGdldCA9PT0gJ29yZGVycycgfHwgd2lkZ2V0ID09PSAnY3VzdG9tZXJzJykge1xuICAgICAgc2V0UGFnZXMoKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIFt3aWRnZXRdOiAxIH0pKVxuICAgIH1cbiAgICBsb2FkV2lkZ2V0KHdpZGdldCwgcmFuZ2UsIDEpXG4gIH1cblxuICBjb25zdCBjaGFuZ2VQYWdlID0gKHdpZGdldCwgcGFnZSkgPT4ge1xuICAgIHNldFBhZ2VzKChjdXJyZW50KSA9PiAoeyAuLi5jdXJyZW50LCBbd2lkZ2V0XTogcGFnZSB9KSlcbiAgICBsb2FkV2lkZ2V0KHdpZGdldCwgcmFuZ2VzW3dpZGdldF0sIHBhZ2UpXG4gIH1cblxuICBjb25zdCBvcmRlclZhbHVlID0gZGF0YS5vcmRlclZhbHVlXG4gIGNvbnN0IG9yZGVycyA9IGRhdGEub3JkZXJzXG4gIGNvbnN0IGN1c3RvbWVycyA9IGRhdGEuY3VzdG9tZXJzXG4gIGNvbnN0IHByb2R1Y3RzID0gZGF0YS5wcm9kdWN0c1xuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwidHJhbnNwYXJlbnRcIiBjbGFzc05hbWU9XCJ0b2tyaS1hbmFseXRpY3NcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktYW5hbHl0aWNzLWhlYWRcIj5cbiAgICAgICAgPEgyIG1iPVwic21cIj5EYXNoYm9hcmQ8L0gyPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNoYXJ0LWNhcmQgdG9rcmktY2hhcnQtY2FyZC13aWRlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPEg1IG1iPVwic21cIj5PcmRlciBWYWx1ZTwvSDU+XG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICB7YnVzeS5vcmRlclZhbHVlICYmICFvcmRlclZhbHVlXG4gICAgICAgICAgICAgICAgPyAnTG9hZGluZ+KApidcbiAgICAgICAgICAgICAgICA6IGAke2lucihvcmRlclZhbHVlPy50b3RhbCl9IGZyb20gJHtvcmRlclZhbHVlPy5vcmRlckNvdW50IHx8IDB9IG9yZGVyc2B9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFJhbmdlU2VsZWN0IHZhbHVlPXtyYW5nZXMub3JkZXJWYWx1ZX0gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ29yZGVyVmFsdWUnLCB2YWx1ZSl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7b3JkZXJWYWx1ZT8uc2VyaWVzPy5sZW5ndGggPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1mcmFtZVwiPlxuICAgICAgICAgICAgPExpbmVDaGFydCBzZXJpZXM9e29yZGVyVmFsdWUuc2VyaWVzfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1zcGxpdFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5PcmRlciBBbW91bnQ8L0g1PlxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICAgIHtidXN5Lm9yZGVycyAmJiAhb3JkZXJzID8gJ0xvYWRpbmfigKYnIDogYCR7b3JkZXJzPy50b3RhbCB8fCAwfSBvcmRlcnNgfVxuICAgICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSYW5nZVNlbGVjdCB2YWx1ZT17cmFuZ2VzLm9yZGVyc30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ29yZGVycycsIHZhbHVlKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7b3JkZXJzPy5yb3dzPy5sZW5ndGggPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLXRhYmxlLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRva3JpLWRhdGEtdGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5PcmRlciBudW1iZXI8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5BbW91bnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+UGxhY2VkPC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICB7b3JkZXJzLnJvd3MubWFwKChyb3cpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17cm93LmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5vcmRlck5vfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aW5yKHJvdy5hbW91bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cucGxhY2VkQXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQgb3BhY2l0eT17MC43fT57YnVzeS5vcmRlcnMgPyAnTG9hZGluZ+KApicgOiAnTm8gb3JkZXJzIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFBhZ2VyXG4gICAgICAgICAgICBwYWdlPXtvcmRlcnM/LnBhZ2UgfHwgcGFnZXMub3JkZXJzfVxuICAgICAgICAgICAgcGFnZVNpemU9e29yZGVycz8ucGFnZVNpemUgfHwgMTB9XG4gICAgICAgICAgICB0b3RhbD17b3JkZXJzPy50b3RhbCB8fCAwfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhwYWdlKSA9PiBjaGFuZ2VQYWdlKCdvcmRlcnMnLCBwYWdlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY2hhcnQtY2FyZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktd2lkZ2V0LWhlYWRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxINSBtYj1cInNtXCI+TmV3IEN1c3RvbWVyczwvSDU+XG4gICAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+XG4gICAgICAgICAgICAgICAge2J1c3kuY3VzdG9tZXJzICYmICFjdXN0b21lcnMgPyAnTG9hZGluZ+KApicgOiBgJHtjdXN0b21lcnM/LnRvdGFsIHx8IDB9IHBlb3BsZSByZWdpc3RlcmVkYH1cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5jdXN0b21lcnN9IG9uQ2hhbmdlPXsodmFsdWUpID0+IGNoYW5nZVJhbmdlKCdjdXN0b21lcnMnLCB2YWx1ZSl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2N1c3RvbWVycz8ucm93cz8ubGVuZ3RoID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS10YWJsZS13cmFwXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0b2tyaS1kYXRhLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5QaG9uZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5EYXRlIG9mIGJpcnRoPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgIHtjdXN0b21lcnMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+KzkxIHtyb3cucGhvbmV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Jvdy5kYXRlT2ZCaXJ0aH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93LnJlZ2lzdGVyZWRBdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PntidXN5LmN1c3RvbWVycyA/ICdMb2FkaW5n4oCmJyA6ICdObyBuZXcgY3VzdG9tZXJzIGluIHRoaXMgcGVyaW9kLid9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFBhZ2VyXG4gICAgICAgICAgICBwYWdlPXtjdXN0b21lcnM/LnBhZ2UgfHwgcGFnZXMuY3VzdG9tZXJzfVxuICAgICAgICAgICAgcGFnZVNpemU9e2N1c3RvbWVycz8ucGFnZVNpemUgfHwgMTB9XG4gICAgICAgICAgICB0b3RhbD17Y3VzdG9tZXJzPy50b3RhbCB8fCAwfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhwYWdlKSA9PiBjaGFuZ2VQYWdlKCdjdXN0b21lcnMnLCBwYWdlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1zcGxpdFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jaGFydC1jYXJkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS13aWRnZXQtaGVhZFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPEg1IG1iPVwic21cIj5CZXN0IFNlbGxpbmcgUHJvZHVjdHM8L0g1PlxuICAgICAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgICAgIHtidXN5LnByb2R1Y3RzICYmICFwcm9kdWN0cyA/ICdMb2FkaW5n4oCmJyA6ICdUb3AgNSBieSBudW1iZXIgb2Ygb3JkZXJzJ31cbiAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8UmFuZ2VTZWxlY3QgdmFsdWU9e3Jhbmdlcy5wcm9kdWN0c30gb25DaGFuZ2U9eyh2YWx1ZSkgPT4gY2hhbmdlUmFuZ2UoJ3Byb2R1Y3RzJywgdmFsdWUpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtwcm9kdWN0cz8ucm93cz8ubGVuZ3RoID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS10YWJsZS13cmFwXCI+XG4gICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0b2tyaS1kYXRhLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+UHJvZHVjdDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5PcmRlcnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+QW1vdW50PC90aD5cbiAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICB7cHJvZHVjdHMucm93cy5tYXAoKHJvdykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtyb3cubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPntyb3cubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57cm93Lm9yZGVyc308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aW5yKHJvdy5hbW91bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxUZXh0IG9wYWNpdHk9ezAuN30+e2J1c3kucHJvZHVjdHMgPyAnTG9hZGluZ+KApicgOiAnTm8gcHJvZHVjdHMgc29sZCBpbiB0aGlzIHBlcmlvZC4nfTwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlDb21wb25lbnQsIHVzZU5vdGljZSwgdXNlUmVjb3JkIH0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IEZsYWdDYXJkLCBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuY29uc3QgUHJvZHVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzbHVnRWRpdGVkLCBzZXRTbHVnRWRpdGVkXSA9IHVzZVN0YXRlKEJvb2xlYW4oaW5pdGlhbFJlY29yZD8ucGFyYW1zPy5zbHVnKSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgcHJvZHVjdFVybEJhc2UgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChcbiAgICBjdXN0b20ucHJvZHVjdFVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcHJvZHVjdGAsXG4gIClcbiAgY29uc3Qgc2x1Z0lucHV0ID0gcGFyYW1zLnNsdWcgPz8gJydcbiAgY29uc3QgcHJldmlld1NsdWcgPSBub3JtYWxpemVTbHVnSW5wdXQoc2x1Z0lucHV0KSB8fCBub3JtYWxpemVTbHVnSW5wdXQocGFyYW1zLm5hbWUpXG4gIGNvbnN0IHByb2R1Y3RVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke3Byb2R1Y3RVcmxCYXNlfS8ke3ByZXZpZXdTbHVnfWAgOiBudWxsXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmNhdGVnb3J5SWRzKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlXG4gICAgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHNldENhdGVnb3JpZXMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbYXBpQmFzZVVybF0pXG5cbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG5cbiAgY29uc3Qgb25Qcm9wZXJ0eUNoYW5nZSA9IChwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ3NsdWcnKSB7XG4gICAgICBzZXRTbHVnRWRpdGVkKHRydWUpXG4gICAgICBoYW5kbGVDaGFuZ2UocHJvcGVydHlQYXRoLCBub3JtYWxpemVTbHVnSW5wdXQodmFsdWUpLCAuLi5yZXN0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIHZhbHVlLCAuLi5yZXN0KVxuICAgIGlmIChwcm9wZXJ0eVBhdGggPT09ICduYW1lJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZXRTZWxlY3RlZENhdGVnb3JpZXMgPSAoc2x1Z3MpID0+IHNldEZpZWxkKCdjYXRlZ29yeUlkcycsIEpTT04uc3RyaW5naWZ5KHNsdWdzKSlcblxuICBjb25zdCB1cGxvYWRJbWFnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmb2xkZXInLCAncHJvZHVjdHMnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXdVcmwobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldFVwbG9hZGluZyh0cnVlKVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vbWVkaWEvdXBsb2FkYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KVxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnSW1hZ2UgdXBsb2FkIGZhaWxlZCcpXG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgICAgaGFuZGxlQ2hhbmdlKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBoYW5kbGVDaGFuZ2UoJ21lZGlhSWQnLCBtZWRpYS5pZClcbiAgICAgIHNldFByZXZpZXdVcmwoXG4gICAgICAgIC9eKGh0dHBzPzp8ZGF0YTp8YmxvYjopLy50ZXN0KG1lZGlhLnBhdGgpXG4gICAgICAgICAgPyBtZWRpYS5wYXRoXG4gICAgICAgICAgOiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7bWVkaWEucGF0aH1gLFxuICAgICAgKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0ltYWdlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBsb2FkIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwcm9kdWN0JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdQcm9kdWN0IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHByb2R1Y3QnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3QgZGVzY3JpcHRpb25Qcm9wZXJ0eSA9IHJlc291cmNlLmVkaXRQcm9wZXJ0aWVzLmZpbmQoXG4gICAgKHByb3BlcnR5KSA9PiBwcm9wZXJ0eS5wcm9wZXJ0eVBhdGggPT09ICdkZXNjcmlwdGlvbicsXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57cGFyYW1zLm5hbWUgfHwgJ05ldyBwcm9kdWN0J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+QWRkIHBob3RvcywgcHJpY2VzLCBhbmQgb25lIG9yIG1vcmUgY2F0ZWdvcmllcyBmb3IgdGhlIHdlYnNpdGUgYW5kIGFwcC48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Qcm9kdWN0IGRldGFpbHM8L2g0PlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIE5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ25hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFscGhvbnNvIE1hbmdvXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTbHVnXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3NsdWdJbnB1dH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gb25Qcm9wZXJ0eUNoYW5nZSgnc2x1ZycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYXV0by1nZW5lcmF0ZWQgZnJvbSBuYW1lXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtwcm9kdWN0VXJsID8gKFxuICAgICAgICAgICAgICA8YSBocmVmPXtwcm9kdWN0VXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAge3Byb2R1Y3RVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBwcm9kdWN0IG5hbWUgd2hlbiBzYXZlZCdcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBQcmljZSAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnByaWNlVmFsdWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3ByaWNlVmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPbGQgcHJpY2UgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5vbGRQcmljZVZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdvbGRQcmljZVZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9wdGlvbmFsXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFdlaWdodFxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMud2VpZ2h0IHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd3ZWlnaHQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMSBrZ1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBCYWRnZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYmFkZ2UgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2JhZGdlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZyZXNoXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFN0b2NrXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdG9jayA/PyAxMDB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3N0b2NrJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlRheCAmIEdTVDwvaDQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAxMiB9fT5cbiAgICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzVGF4YWJsZSA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNUYXhhYmxlID09PSAndHJ1ZSd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiVGF4YWJsZSAoWWVzKVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJDaGFyZ2UgR1NUIGF0IGNoZWNrb3V0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSAhKHBhcmFtcy5pc1RheGFibGUgPT09IHRydWUgfHwgcGFyYW1zLmlzVGF4YWJsZSA9PT0gJ3RydWUnKVxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdpc1RheGFibGUnLCBuZXh0KVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIE51bWJlcihwYXJhbXMuZ3N0UmF0ZSB8fCAwKSA9PT0gMCkgc2V0RmllbGQoJ2dzdFJhdGUnLCA1KVxuICAgICAgICAgICAgICAgIGlmICghbmV4dCkgc2V0RmllbGQoJ2dzdFJhdGUnLCAwKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgSFNOIENvZGVcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmhzbkNvZGUgPz8gJzA4MDgnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdoc25Db2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjA4MDIgb3IgMDgwOFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBHU1QgJVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmdzdFJhdGUgPz8gMH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZ3N0UmF0ZScsIE51bWJlcihldmVudC50YXJnZXQudmFsdWUpIHx8IDApfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiNVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+UHJvZHVjdCBpbWFnZTwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLXVwbG9hZC1kcm9wXCI+XG4gICAgICAgICAgICB7ZGlzcGxheWVkSW1hZ2VVcmwgPyAoXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRJbWFnZVVybH0gYWx0PXtwYXJhbXMubmFtZSB8fCAnUHJvZHVjdCBwcmV2aWV3J30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuPkNsaWNrIHRvIHVwbG9hZCBhIHNxdWFyZSBwcm9kdWN0IHBob3RvPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxUZXh0IG10PVwic21cIiBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkNhdGVnb3JpZXM8L2g0PlxuICAgICAgICA8cD5BIHByb2R1Y3QgY2FuIGFwcGVhciBpbiBtb3JlIHRoYW4gb25lIGNhdGVnb3J5IG9uIHRoZSB3ZWJzaXRlIGFuZCBhcHAuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgU2VsZWN0IGNhdGVnb3JpZXNcbiAgICAgICAgICA8U2VhcmNoYWJsZU11bHRpU2VsZWN0XG4gICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubGFiZWwgfSkpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2F0ZWdvcnlTbHVnc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRTZWxlY3RlZENhdGVnb3JpZXN9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBhbmQgc2VsZWN0IGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY2F0ZWdvcmllc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlN0b3JlIHBsYWNlbWVudDwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0Jlc3RTZWxsZXIgPT09IHRydWUgfHwgcGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJCZXN0c2VsbGVyXCJcbiAgICAgICAgICAgIGhpbnQ9XCJTaG93IGluIGJlc3RzZWxsZXJzXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCdpc0Jlc3RTZWxsZXInLCAhKHBhcmFtcy5pc0Jlc3RTZWxsZXIgPT09IHRydWUgfHwgcGFyYW1zLmlzQmVzdFNlbGxlciA9PT0gJ3RydWUnKSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNJbXBvcnRlZCA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNJbXBvcnRlZCA9PT0gJ3RydWUnfVxuICAgICAgICAgICAgdGl0bGU9XCJJbXBvcnRlZFwiXG4gICAgICAgICAgICBoaW50PVwiU2hvdyBpbiBpbXBvcnRlZCBmcnVpdHNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2lzSW1wb3J0ZWQnLCAhKHBhcmFtcy5pc0ltcG9ydGVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ltcG9ydGVkID09PSAndHJ1ZScpKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGbGFnQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3BhcmFtcy5pc0ZlYXR1cmVkID09PSB0cnVlIHx8IHBhcmFtcy5pc0ZlYXR1cmVkID09PSAndHJ1ZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkZlYXR1cmVkXCJcbiAgICAgICAgICAgIGhpbnQ9XCJIaWdobGlnaHQgdGhpcyBmcnVpdFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnaXNGZWF0dXJlZCcsICEocGFyYW1zLmlzRmVhdHVyZWQgPT09IHRydWUgfHwgcGFyYW1zLmlzRmVhdHVyZWQgPT09ICd0cnVlJykpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17cGFyYW1zLmlzQWN0aXZlICE9PSBmYWxzZSAmJiBwYXJhbXMuaXNBY3RpdmUgIT09ICdmYWxzZSd9XG4gICAgICAgICAgICB0aXRsZT1cIkFjdGl2ZVwiXG4gICAgICAgICAgICBoaW50PVwiVmlzaWJsZSB0byBjdXN0b21lcnNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgc2V0RmllbGQoJ2lzQWN0aXZlJywgIShwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJykpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5EZXNjcmlwdGlvbjwvaDQ+XG4gICAgICAgIHtkZXNjcmlwdGlvblByb3BlcnR5ID8gKFxuICAgICAgICAgIDxCb3ggc3R5bGU9e3sgbWluSGVpZ2h0OiAyMjAgfX0+XG4gICAgICAgICAgICA8QmFzZVByb3BlcnR5Q29tcG9uZW50XG4gICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblByb3BlcnR5Q2hhbmdlfVxuICAgICAgICAgICAgICBwcm9wZXJ0eT17ZGVzY3JpcHRpb25Qcm9wZXJ0eX1cbiAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHByb2R1Y3RcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0RWRpdFxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eUNvbXBvbmVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgRmxhZ0NhcmQgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBub3JtYWxpemVTbHVnSW5wdXQgPSAodmFsdWUpID0+XG4gIFN0cmluZyh2YWx1ZSB8fCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvWydcIl0vZywgJycpXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5jb25zdCBDYXRlZ29yeUVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBiYW5uZXJGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Jhbm5lclVwbG9hZGluZywgc2V0QmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2x1Z0VkaXRlZCwgc2V0U2x1Z0VkaXRlZF0gPSB1c2VTdGF0ZShCb29sZWFuKGluaXRpYWxSZWNvcmQ/LnBhcmFtcz8uc2x1ZykpXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbYmFubmVyUHJldmlld1VybCwgc2V0QmFubmVyUHJldmlld1VybF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBjdXN0b20gPSByZXNvdXJjZT8ub3B0aW9ucz8uY3VzdG9tIHx8IHt9XG4gIGNvbnN0IGFwaUJhc2VVcmwgPSB3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBpQmFzZVVybCB8fCAnL2FwaS92MScpXG4gIGNvbnN0IGNhdGVnb3J5VXJsQmFzZSA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKFxuICAgIGN1c3RvbS5jYXRlZ29yeVVybEJhc2UgfHwgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vY2F0ZWdvcnlgLFxuICApXG4gIGNvbnN0IHNsdWdJbnB1dCA9IHBhcmFtcy5zbHVnID8/ICcnXG4gIGNvbnN0IHByZXZpZXdTbHVnID0gbm9ybWFsaXplU2x1Z0lucHV0KHNsdWdJbnB1dCkgfHwgbm9ybWFsaXplU2x1Z0lucHV0KHBhcmFtcy5sYWJlbClcbiAgY29uc3QgY2F0ZWdvcnlVcmwgPSBwcmV2aWV3U2x1ZyA/IGAke2NhdGVnb3J5VXJsQmFzZX0vJHtwcmV2aWV3U2x1Z31gIDogbnVsbFxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2UpIHJldHVybiAnJ1xuICAgIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXJhbXMuaW1hZ2UpKSByZXR1cm4gcGFyYW1zLmltYWdlXG4gICAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXJhbXMuaW1hZ2V9YFxuICB9LCBbY3VzdG9tLmFwcFVybCwgcGFyYW1zLmltYWdlXSlcblxuICBjb25zdCBkaXNwbGF5ZWRJbWFnZVVybCA9IHByZXZpZXdVcmwgfHwgaW1hZ2VVcmxcblxuICBjb25zdCBiYW5uZXJJbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcGFyYW1zLmJhbm5lckltYWdlKSByZXR1cm4gJydcbiAgICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGFyYW1zLmJhbm5lckltYWdlKSkgcmV0dXJuIHBhcmFtcy5iYW5uZXJJbWFnZVxuICAgIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChjdXN0b20uYXBwVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pfSR7cGFyYW1zLmJhbm5lckltYWdlfWBcbiAgfSwgW2N1c3RvbS5hcHBVcmwsIHBhcmFtcy5iYW5uZXJJbWFnZV0pXG5cbiAgY29uc3QgZGlzcGxheWVkQmFubmVyVXJsID0gYmFubmVyUHJldmlld1VybCB8fCBiYW5uZXJJbWFnZVVybFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChwcmV2aWV3VXJsPy5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKHByZXZpZXdVcmwpXG4gICAgfVxuICB9LCBbcHJldmlld1VybF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGJhbm5lclByZXZpZXdVcmw/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoYmFubmVyUHJldmlld1VybClcbiAgICB9XG4gIH0sIFtiYW5uZXJQcmV2aWV3VXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBvblByb3BlcnR5Q2hhbmdlID0gKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpID0+IHtcbiAgICBpZiAocHJvcGVydHlQYXRoID09PSAnc2x1ZycpIHtcbiAgICAgIHNldFNsdWdFZGl0ZWQodHJ1ZSlcbiAgICAgIGhhbmRsZUNoYW5nZShwcm9wZXJ0eVBhdGgsIG5vcm1hbGl6ZVNsdWdJbnB1dCh2YWx1ZSksIC4uLnJlc3QpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaGFuZGxlQ2hhbmdlKHByb3BlcnR5UGF0aCwgdmFsdWUsIC4uLnJlc3QpXG4gICAgaWYgKHByb3BlcnR5UGF0aCA9PT0gJ2xhYmVsJyAmJiAhc2x1Z0VkaXRlZCkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdzbHVnJywgbm9ybWFsaXplU2x1Z0lucHV0KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBjb25zdCB1cGxvYWRUbyA9IGFzeW5jIChmaWxlLCBmaWVsZCwgc2V0TG9jYWxQcmV2aWV3LCBzZXRCdXN5LCBzdWNjZXNzTWVzc2FnZSkgPT4ge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdjYXRlZ29yaWVzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIHNldExvY2FsUHJldmlldyhVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpKVxuICAgIHNldEJ1c3kodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8ICdJbWFnZSB1cGxvYWQgZmFpbGVkJylcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lZGlhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgICBvblByb3BlcnR5Q2hhbmdlKGZpZWxkLCBtZWRpYS5wYXRoKVxuICAgICAgc2V0TG9jYWxQcmV2aWV3KFxuICAgICAgICAvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChtZWRpYS5wYXRoKVxuICAgICAgICAgID8gbWVkaWEucGF0aFxuICAgICAgICAgIDogYCR7d2l0aG91dFRyYWlsaW5nU2xhc2goY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke21lZGlhLnBhdGh9YCxcbiAgICAgIClcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IHN1Y2Nlc3NNZXNzYWdlLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwbG9hZCBpbWFnZScsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0QnVzeShmYWxzZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY2F0ZWdvcnknLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NhdGVnb3J5IHNhdmVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIGNhdGVnb3J5JywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgfVxuXG4gIGNvbnN0IGRlc2NyaXB0aW9uUHJvcGVydHkgPSByZXNvdXJjZS5lZGl0UHJvcGVydGllcy5maW5kKFxuICAgIChwcm9wZXJ0eSkgPT4gcHJvcGVydHkucHJvcGVydHlQYXRoID09PSAnZGVzY3JpcHRpb24nLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e3BhcmFtcy5sYWJlbCB8fCAnTmV3IGNhdGVnb3J5J308L0gzPlxuICAgICAgICA8VGV4dCBjb2xvcj1cIndoaXRlXCI+Q3JlYXRlIGEgc2hvcCBzZWN0aW9uIHdpdGggYSB0aHVtYm5haWwsIGJhbm5lciwgYW5kIHBhZ2UgY29weS48L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5DYXRlZ29yeSBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBMYWJlbFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubGFiZWwgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uUHJvcGVydHlDaGFuZ2UoJ2xhYmVsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJGcmVzaCBGcnVpdHNcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFBhZ2UgaGVhZGluZ1xuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudGl0bGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2FtZSBhcyBsYWJlbCBpZiBlbXB0eVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3VidGl0bGVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN1YnRpdGxlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnc3VidGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNob3J0IGxpbmUgdW5kZXIgdGhlIGhlYWRpbmdcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFNsdWdcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17c2x1Z0lucHV0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvblByb3BlcnR5Q2hhbmdlKCdzbHVnJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJhdXRvLWdlbmVyYXRlZCBmcm9tIGxhYmVsXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8VGV4dCBtdD1cInNtXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgIFByZXZpZXc6eycgJ31cbiAgICAgICAgICAgIHtjYXRlZ29yeVVybCA/IChcbiAgICAgICAgICAgICAgPGEgaHJlZj17Y2F0ZWdvcnlVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICB7Y2F0ZWdvcnlVcmx9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICdHZW5lcmF0ZWQgZnJvbSBjYXRlZ29yeSBsYWJlbCB3aGVuIHNhdmVkJ1xuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgIFNvcnQgb3JkZXJcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnNvcnRPcmRlciA/PyAwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdzb3J0T3JkZXInLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgU3RhdHVzXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiIHN0eWxlPXt7IG1hcmdpblRvcDogNiB9fT5cbiAgICAgICAgICAgICAgICA8RmxhZ0NhcmRcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJ31cbiAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgIGhpbnQ9XCJTaG93biBvbiB3ZWJzaXRlIGFuZCBhcHBcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgICAgc2V0RmllbGQoJ2lzQWN0aXZlJywgIShwYXJhbXMuaXNBY3RpdmUgIT09IGZhbHNlICYmIHBhcmFtcy5pc0FjdGl2ZSAhPT0gJ2ZhbHNlJykpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Q2F0ZWdvcnkgaW1hZ2U8L2g0PlxuICAgICAgICAgIDxwPlNxdWFyZSB0aHVtYm5haWwgdXNlZCBpbiB0aGUgaG9tZSBjYXRlZ29yeSBncmlkLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktdXBsb2FkLWRyb3BcIj5cbiAgICAgICAgICAgIHtkaXNwbGF5ZWRJbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZEltYWdlVXJsfSBhbHQ9e3BhcmFtcy5sYWJlbCB8fCAnQ2F0ZWdvcnkgcHJldmlldyd9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgY2F0ZWdvcnkgaW1hZ2U8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHJlZj17ZmlsZVJlZn1cbiAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgICAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICB1cGxvYWRUbyhmaWxlLCAnaW1hZ2UnLCBzZXRQcmV2aWV3VXJsLCBzZXRVcGxvYWRpbmcsICdJbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkNhdGVnb3J5IGJhbm5lcjwvaDQ+XG4gICAgICAgIDxwPldpZGUgaW1hZ2Ugc2hvd24gYXQgdGhlIHRvcCBvZiB0aGUgY2F0ZWdvcnkgcGFnZS48L3A+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcCB0b2tyaS11cGxvYWQtZHJvcC13aWRlXCI+XG4gICAgICAgICAge2Rpc3BsYXllZEJhbm5lclVybCA/IChcbiAgICAgICAgICAgIDxpbWcgc3JjPXtkaXNwbGF5ZWRCYW5uZXJVcmx9IGFsdD17cGFyYW1zLmxhYmVsIHx8ICdDYXRlZ29yeSBiYW5uZXInfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c3Bhbj5DbGljayB0byB1cGxvYWQgYSB3aWRlIGJhbm5lciAoMTYwMMOXNDAwIHJlY29tbWVuZGVkKTwvc3Bhbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgcmVmPXtiYW5uZXJGaWxlUmVmfVxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXVxuICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgIHVwbG9hZFRvKFxuICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICdiYW5uZXJJbWFnZScsXG4gICAgICAgICAgICAgICAgICBzZXRCYW5uZXJQcmV2aWV3VXJsLFxuICAgICAgICAgICAgICAgICAgc2V0QmFubmVyVXBsb2FkaW5nLFxuICAgICAgICAgICAgICAgICAgJ0Jhbm5lciB1cGxvYWRlZCBzdWNjZXNzZnVsbHknLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+RGVzY3JpcHRpb248L2g0PlxuICAgICAgICB7ZGVzY3JpcHRpb25Qcm9wZXJ0eSA/IChcbiAgICAgICAgICA8Qm94IHN0eWxlPXt7IG1pbkhlaWdodDogMjIwIH19PlxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICB3aGVyZT1cImVkaXRcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17b25Qcm9wZXJ0eUNoYW5nZX1cbiAgICAgICAgICAgICAgcHJvcGVydHk9e2Rlc2NyaXB0aW9uUHJvcGVydHl9XG4gICAgICAgICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgICAgICAgcmVjb3JkPXtyZWNvcmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHtyZXNvdXJjZS5lZGl0UHJvcGVydGllc1xuICAgICAgICAgIC5maWx0ZXIoKHByb3BlcnR5KSA9PiBbJ2ltYWdlJywgJ2Jhbm5lckltYWdlJ10uaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSlcbiAgICAgICAgICAubWFwKChwcm9wZXJ0eSkgPT4gKFxuICAgICAgICAgICAgPEJhc2VQcm9wZXJ0eUNvbXBvbmVudFxuICAgICAgICAgICAgICBrZXk9e3Byb3BlcnR5LnByb3BlcnR5UGF0aH1cbiAgICAgICAgICAgICAgd2hlcmU9XCJlZGl0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uUHJvcGVydHlDaGFuZ2V9XG4gICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgfHwgdXBsb2FkaW5nIHx8IGJhbm5lclVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIGNhdGVnb3J5XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEljb24sIElucHV0LCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7XG4gIFJlY29yZHNUYWJsZSxcbiAgdXNlUXVlcnlQYXJhbXMsXG4gIHVzZVJlY29yZHMsXG4gIHVzZVNlbGVjdGVkUmVjb3Jkcyxcbn0gZnJvbSAnYWRtaW5qcydcbmltcG9ydCB7IExvY2FsU2VsZWN0IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgUEVSX1BBR0VfT1BUSU9OUyA9IFsxMCwgMjUsIDUwXVxuXG5jb25zdCBDbXNMaXN0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVzb3VyY2UsIHNldFRhZyB9ID0gcHJvcHNcbiAgY29uc3QgdGl0bGVQcm9wID0gcmVzb3VyY2UudGl0bGVQcm9wZXJ0eT8ubmFtZSB8fCByZXNvdXJjZS50aXRsZVByb3BlcnR5Py5wcm9wZXJ0eVBhdGggfHwgJ2lkJ1xuXG4gIGNvbnN0IHsgc3RvcmVQYXJhbXMsIGZpbHRlcnMgfSA9IHVzZVF1ZXJ5UGFyYW1zKClcbiAgY29uc3Qge1xuICAgIHJlY29yZHMsXG4gICAgbG9hZGluZyxcbiAgICBkaXJlY3Rpb24sXG4gICAgc29ydEJ5LFxuICAgIHBhZ2UsXG4gICAgdG90YWwsXG4gICAgZmV0Y2hEYXRhLFxuICAgIHBlclBhZ2UsXG4gIH0gPSB1c2VSZWNvcmRzKHJlc291cmNlLmlkKVxuICBjb25zdCB7XG4gICAgc2VsZWN0ZWRSZWNvcmRzLFxuICAgIGhhbmRsZVNlbGVjdCxcbiAgICBoYW5kbGVTZWxlY3RBbGwsXG4gICAgc2V0U2VsZWN0ZWRSZWNvcmRzLFxuICB9ID0gdXNlU2VsZWN0ZWRSZWNvcmRzKHJlY29yZHMpXG5cbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgoKSA9PiBTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICBjb25zdCBkZWJvdW5jZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBzdG9yZVBhcmFtc1JlZiA9IHVzZVJlZihzdG9yZVBhcmFtcylcbiAgc3RvcmVQYXJhbXNSZWYuY3VycmVudCA9IHN0b3JlUGFyYW1zXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRRdWVyeShTdHJpbmcoZmlsdGVycz8uW3RpdGxlUHJvcF0gfHwgJycpKVxuICAgIHNldFNlbGVjdGVkUmVjb3JkcyhbXSlcbiAgfSwgW3Jlc291cmNlLmlkLCB0aXRsZVByb3AsIHNldFNlbGVjdGVkUmVjb3Jkc10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2V0VGFnKSBzZXRUYWcodG90YWwudG9TdHJpbmcoKSlcbiAgfSwgW3RvdGFsLCBzZXRUYWddKVxuXG4gIGNvbnN0IGhhbmRsZVF1ZXJ5Q2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWVcbiAgICBzZXRRdWVyeSh2YWx1ZSlcblxuICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICBkZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpXG4gICAgICBzdG9yZVBhcmFtc1JlZi5jdXJyZW50KHtcbiAgICAgICAgcGFnZTogJzEnLFxuICAgICAgICBmaWx0ZXJzOiB0cmltbWVkID8geyBbdGl0bGVQcm9wXTogdHJpbW1lZCB9IDoge30sXG4gICAgICB9KVxuICAgIH0sIDMwMClcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChkZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoZGVib3VuY2VSZWYuY3VycmVudClcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUFjdGlvblBlcmZvcm1lZCA9ICgpID0+IGZldGNoRGF0YSgpXG5cbiAgY29uc3QgY3VycmVudFBhZ2UgPSBOdW1iZXIocGFnZSkgfHwgMVxuICBjb25zdCByb3dzUGVyUGFnZSA9IE51bWJlcihwZXJQYWdlKSB8fCAxMFxuICBjb25zdCB0b3RhbFJvd3MgPSBOdW1iZXIodG90YWwpIHx8IDBcbiAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbCh0b3RhbFJvd3MgLyByb3dzUGVyUGFnZSkgfHwgMSlcbiAgY29uc3QgZnJvbSA9IHRvdGFsUm93cyA9PT0gMCA/IDAgOiAoY3VycmVudFBhZ2UgLSAxKSAqIHJvd3NQZXJQYWdlICsgMVxuICBjb25zdCB0byA9IE1hdGgubWluKGN1cnJlbnRQYWdlICogcm93c1BlclBhZ2UsIHRvdGFsUm93cylcblxuICBjb25zdCBnb1RvUGFnZSA9IChuZXh0UGFnZSkgPT4ge1xuICAgIGNvbnN0IHNhZmUgPSBNYXRoLm1pbihNYXRoLm1heCgxLCBuZXh0UGFnZSksIHRvdGFsUGFnZXMpXG4gICAgc3RvcmVQYXJhbXMoeyBwYWdlOiBTdHJpbmcoc2FmZSkgfSlcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVBlclBhZ2UgPSAobmV4dCkgPT4ge1xuICAgIHN0b3JlUGFyYW1zKHsgcGFnZTogJzEnLCBwZXJQYWdlOiBTdHJpbmcobmV4dCkgfSlcbiAgfVxuXG4gIGNvbnN0IHBhZ2VOdW1iZXJzID0gW11cbiAgY29uc3Qgd2luZG93U2l6ZSA9IDVcbiAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMSwgY3VycmVudFBhZ2UgLSBNYXRoLmZsb29yKHdpbmRvd1NpemUgLyAyKSlcbiAgbGV0IGVuZCA9IE1hdGgubWluKHRvdGFsUGFnZXMsIHN0YXJ0ICsgd2luZG93U2l6ZSAtIDEpXG4gIHN0YXJ0ID0gTWF0aC5tYXgoMSwgZW5kIC0gd2luZG93U2l6ZSArIDEpXG4gIGZvciAobGV0IG51bWJlciA9IHN0YXJ0OyBudW1iZXIgPD0gZW5kOyBudW1iZXIgKz0gMSkgcGFnZU51bWJlcnMucHVzaChudW1iZXIpXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJncmV5XCI+XG4gICAgICA8Qm94IG1iPVwibGdcIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbWF4V2lkdGg6IDQyMCB9fT5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICBsZWZ0OiAxMixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8SWNvbiBpY29uPVwiU2VhcmNoXCIgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlUXVlcnlDaGFuZ2V9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2BTZWFyY2ggJHtyZXNvdXJjZS5uYW1lfS4uLmB9XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgcGFkZGluZ0xlZnQ6IDM2IH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCB2YXJpYW50PVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxSZWNvcmRzVGFibGVcbiAgICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgICAgcmVjb3Jkcz17cmVjb3Jkc31cbiAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2hhbmRsZUFjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fVxuICAgICAgICAgIG9uU2VsZWN0QWxsPXtoYW5kbGVTZWxlY3RBbGx9XG4gICAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgICAgZGlyZWN0aW9uPXtkaXJlY3Rpb259XG4gICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgaXNMb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uXCI+XG4gICAgICAgICAgPFRleHQgY2xhc3NOYW1lPVwidG9rcmktbGlzdC1wYWdpbmF0aW9uLXN1bW1hcnlcIj5cbiAgICAgICAgICAgIHt0b3RhbFJvd3MgPT09IDAgPyAnTm8gcmVjb3JkcycgOiBgU2hvd2luZyAke2Zyb2194oCTJHt0b30gb2YgJHt0b3RhbFJvd3N9YH1cbiAgICAgICAgICA8L1RleHQ+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWxpc3QtcGFnaW5hdGlvbi1zaXplXCI+XG4gICAgICAgICAgICA8c3Bhbj5Sb3dzPC9zcGFuPlxuICAgICAgICAgICAgPExvY2FsU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtTdHJpbmcocm93c1BlclBhZ2UpfVxuICAgICAgICAgICAgICBvcHRpb25zPXtQRVJfUEFHRV9PUFRJT05TLm1hcCgob3B0aW9uKSA9PiAoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBTdHJpbmcob3B0aW9uKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogU3RyaW5nKG9wdGlvbiksXG4gICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBjaGFuZ2VQZXJQYWdlKE51bWJlcihuZXh0KSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1saXN0LXBhZ2luYXRpb24tcGFnZXNcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPXtjdXJyZW50UGFnZSA8PSAxfSBvbkNsaWNrPXsoKSA9PiBnb1RvUGFnZShjdXJyZW50UGFnZSAtIDEpfT5cbiAgICAgICAgICAgICAgUHJldlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7cGFnZU51bWJlcnMubWFwKChudW1iZXIpID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGtleT17bnVtYmVyfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17bnVtYmVyID09PSBjdXJyZW50UGFnZSA/ICdpcy1jdXJyZW50JyA6ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKG51bWJlcil9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7bnVtYmVyfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ9e2N1cnJlbnRQYWdlID49IHRvdGFsUGFnZXN9IG9uQ2xpY2s9eygpID0+IGdvVG9QYWdlKGN1cnJlbnRQYWdlICsgMSl9PlxuICAgICAgICAgICAgICBOZXh0XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbXNMaXN0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiByZXNvbHZlSW1hZ2VVcmwocGF0aCwgYXBwVXJsKSB7XG4gIGlmICghcGF0aCkgcmV0dXJuICcnXG4gIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdChwYXRoKSkgcmV0dXJuIHBhdGhcbiAgcmV0dXJuIGAke3dpdGhvdXRUcmFpbGluZ1NsYXNoKGFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKX0ke3BhdGh9YFxufVxuXG5mdW5jdGlvbiBGaWVsZEVycm9yKHsgZXJyb3IgfSkge1xuICBpZiAoIWVycm9yPy5tZXNzYWdlKSByZXR1cm4gbnVsbFxuICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3IubWVzc2FnZX08L3NwYW4+XG59XG5cbmNvbnN0IFJldmlld0VkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBmaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG5cbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgYXBwVXJsID0gY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIGNvbnN0IGVycm9ycyA9IHVzZU1lbW8oKCkgPT4gcmVjb3JkPy5lcnJvcnMgfHwge30sIFtyZWNvcmQ/LmVycm9yc10pXG4gIGNvbnN0IHJhdGluZyA9IE1hdGgubWluKDUsIE1hdGgubWF4KDEsIE51bWJlcihwYXJhbXMucmF0aW5nKSB8fCA1KSlcbiAgY29uc3QgaXNBcHByb3ZlZCA9XG4gICAgaXNOZXcgJiYgKHBhcmFtcy5pc0FwcHJvdmVkID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQXBwcm92ZWQgPT09ICcnKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGlzRmxhZ09uKHBhcmFtcy5pc0FwcHJvdmVkKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuaXNBcHByb3ZlZCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FwcHJvdmVkID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnaXNBcHByb3ZlZCcsIHRydWUpXG4gICAgfVxuICAgIGlmIChpc05ldyAmJiAhcGFyYW1zLnJhdGluZykgaGFuZGxlQ2hhbmdlKCdyYXRpbmcnLCA1KVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2lzTmV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAocHJldmlld1VybD8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChwcmV2aWV3VXJsKVxuICAgIH1cbiAgfSwgW3ByZXZpZXdVcmxdKVxuXG4gIGNvbnN0IGltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5pbWFnZV0sXG4gIClcbiAgY29uc3QgZGlzcGxheWVkSW1hZ2VVcmwgPSBwcmV2aWV3VXJsIHx8IGltYWdlVXJsXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKCFmaWxlKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsICdyZXZpZXdzJylcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuICAgIGNvbnN0IGxvY2FsUHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICBzZXRQcmV2aWV3VXJsKGxvY2FsUHJldmlld1VybClcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIHNldEZpZWxkKCdpbWFnZScsIG1lZGlhLnBhdGgpXG4gICAgICBzZXRQcmV2aWV3VXJsKHJlc29sdmVJbWFnZVVybChtZWRpYS5wYXRoLCBhcHBVcmwpKVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ1Bob3RvIHVwbG9hZGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSlcbiAgICAgIGlmIChmaWxlUmVmLmN1cnJlbnQpIGZpbGVSZWYuY3VycmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHJldmlldycsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBpc05ldyA/ICdSZXZpZXcgY3JlYXRlZCcgOiAnUmV2aWV3IHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgcmV2aWV3LiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIGhvbWVwYWdlIHJldmlldycgOiBwYXJhbXMudGl0bGUgfHwgJ1Jldmlldyd9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPlxuICAgICAgICAgIEFwcHJvdmVkIHJldmlld3MgYXBwZWFyIG9uIHRoZSB3ZWJzaXRlIGhvbWVwYWdlLiBIaWRkZW4gcmV2aWV3cyBzdGF5IGluIENNUyBvbmx5LlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5XZWJzaXRlIHZpc2liaWxpdHk8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gaGlkZSB0aGUgcmV2aWV3IHdpdGhvdXQgZGVsZXRpbmcgaXQuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQXBwcm92ZWR9XG4gICAgICAgICAgICBvbkxhYmVsPVwiQXBwcm92ZWRcIlxuICAgICAgICAgICAgb2ZmTGFiZWw9XCJIaWRkZW5cIlxuICAgICAgICAgICAgdGl0bGU9e2lzQXBwcm92ZWQgPyAnQXBwcm92ZWQnIDogJ0hpZGRlbid9XG4gICAgICAgICAgICBoaW50PXtpc0FwcHJvdmVkID8gJ1Zpc2libGUgb24gdGhlIGhvbWVwYWdlJyA6ICdIaWRkZW4gdW50aWwgeW91IGFwcHJvdmUgaXQnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBcHByb3ZlZCcsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5SYXRpbmc8L2g0PlxuICAgICAgICAgIDxwPlNob3duIGFzIHN0YXJzIG9uIHRoZSBob21lcGFnZSByZXZpZXcgY2FyZC48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhcnNcbiAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cmF0aW5nfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbNSwgNCwgMywgMiwgMV0ubWFwKCh2YWx1ZSkgPT4gKHtcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBsYWJlbDogYCR7dmFsdWV9IHN0YXIke3ZhbHVlID09PSAxID8gJycgOiAncyd9YCxcbiAgICAgICAgICAgICAgfSkpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdyYXRpbmcnLCBOdW1iZXIobmV4dCkpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlJldmlldyB0ZXh0PC9oND5cbiAgICAgICAgPHA+S2VlcCBpdCBzaG9ydC4gVGhpcyBpcyB3aGF0IGN1c3RvbWVycyByZWFkIG9uIHRoZSBob21lcGFnZS48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIFRpdGxlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy50aXRsZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3RpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTdXBlciBmcmVzaCBmcnVpdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMudGl0bGV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBSZXZpZXdlciBuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUHJpeWEgU2hhcm1hXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLm5hbWV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBSZXZpZXdcbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICByb3dzPXs0fVxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuY29udGVudCB8fCAnJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjb250ZW50JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQWx3YXlzIGZyZXNoIGFuZCBkZWxpdmVyZWQgcmlnaHQgb24gdGltZS5cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5jb250ZW50fSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+UmV2aWV3ZXIgcGhvdG88L2g0PlxuICAgICAgICA8cD5PcHRpb25hbC4gSWYgZW1wdHksIHRoZSB3ZWJzaXRlIHNob3dzIGluaXRpYWxzIGluc3RlYWQuPC9wPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgUGhvdG9cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcCB0b2tyaS11cGxvYWQtZHJvcC1yb3VuZFwiPlxuICAgICAgICAgICAge2Rpc3BsYXllZEltYWdlVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIHNyYz17ZGlzcGxheWVkSW1hZ2VVcmx9IGFsdD17cGFyYW1zLm5hbWUgfHwgJ1Jldmlld2VyJ30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayB0byB1cGxvYWQgYSBwaG90byd9PC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxpbnB1dCByZWY9e2ZpbGVSZWZ9IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXt1cGxvYWRJbWFnZX0gLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtaGludFwiPkpQRywgUE5HLCBHSUYsIG9yIFdlYlAgdXAgdG8gNU1CPC9zcGFuPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZyB8fCB1cGxvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nIHx8IHVwbG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICB7aXNOZXcgPyAnQ3JlYXRlIHJldmlldycgOiAnU2F2ZSByZXZpZXcnfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJldmlld0VkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBEcmF3ZXJDb250ZW50LFxuICBEcmF3ZXJGb290ZXIsXG4gIEg0LFxuICBJY29uLFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5Q29tcG9uZW50LCB1c2VSZWNvcmQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTZWFyY2hhYmxlTXVsdGlTZWxlY3QgfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBUQUJTID0gW1xuICB7XG4gICAgaWQ6ICdnZW5lcmFsJyxcbiAgICBsYWJlbDogJ0dlbmVyYWwnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ3N0b3JlTmFtZScsXG4gICAgICAnc3RvcmVUYWdsaW5lJyxcbiAgICAgICdzdG9yZUVtYWlsJyxcbiAgICAgICdzdG9yZVBob25lMScsXG4gICAgICAnc3RvcmVQaG9uZTInLFxuICAgICAgJ3N0b3JlQWRkcmVzcycsXG4gICAgICAncHJvbW9CYW5uZXInLFxuICAgICAgJ2Vhcmx5RGVsaXZlcnknLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2NoYXJnZXMnLFxuICAgIGxhYmVsOiAnQ2hhcmdlcycsXG4gICAgZmllbGRzOiBbXG4gICAgICAnbW9ybmluZ0RlbGl2ZXJ5VGl0bGUnLFxuICAgICAgJ21vcm5pbmdEZWxpdmVyeVN1YnRpdGxlJyxcbiAgICAgICdtb3JuaW5nU2hpcHBpbmdGZWUnLFxuICAgICAgJ21vcm5pbmdGcmVlQWJvdmUnLFxuICAgICAgJ2V4cHJlc3NEZWxpdmVyeVRpdGxlJyxcbiAgICAgICdleHByZXNzRGVsaXZlcnlTdWJ0aXRsZScsXG4gICAgICAnZXhwcmVzc1NoaXBwaW5nRmVlJyxcbiAgICAgICdleHByZXNzRnJlZUFib3ZlJyxcbiAgICAgICdoYW5kbGluZ0ZlZScsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaG9tZXBhZ2UnLFxuICAgIGxhYmVsOiAnSG9tZXBhZ2UnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ2hvbWVCYW5uZXJJbWFnZScsXG4gICAgICAnaG9tZU1vYmlsZUJhbm5lckltYWdlJyxcbiAgICAgICdob21lSGlnaGxpZ2h0SW1hZ2UnLFxuICAgICAgJ2hvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MnLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BheW1lbnRzJyxcbiAgICBsYWJlbDogJ1BheW1lbnRzJyxcbiAgICBmaWVsZHM6IFsncmF6b3JwYXlFbmFibGVkJywgJ3Jhem9ycGF5S2V5SWQnLCAncmF6b3JwYXlLZXlTZWNyZXQnLCAnY29kRW5hYmxlZCddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdub3RpZmljYXRpb25zJyxcbiAgICBsYWJlbDogJ05vdGlmaWNhdGlvbnMnLFxuICAgIGZpZWxkczogW1xuICAgICAgJ21zZzkxRW5hYmxlZCcsXG4gICAgICAnbXNnOTFBdXRoS2V5JyxcbiAgICAgICdtc2c5MVNlbmRlcklkJyxcbiAgICAgICdtc2c5MU90cFRlbXBsYXRlSWQnLFxuICAgICAgJ21zZzkxT3JkZXJUZW1wbGF0ZUlkJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwRW5hYmxlZCcsXG4gICAgICAnbXNnOTFXaGF0c2FwcE51bWJlcicsXG4gICAgICAnbXNnOTFXaGF0c2FwcE90cFRlbXBsYXRlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3JkZXJUZW1wbGF0ZScsXG4gICAgICAnbXNnOTFXaGF0c2FwcExhbmd1YWdlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwTmFtZXNwYWNlJyxcbiAgICAgICdtc2c5MVdoYXRzYXBwT3RwQnV0dG9uJyxcbiAgICBdLFxuICB9LFxuXVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUltYWdlVXJsKHBhdGgsIGFwcFVybCkge1xuICBpZiAoIXBhdGgpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGF0aCkpIHJldHVybiBwYXRoXG4gIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChhcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXRofWBcbn1cblxuZnVuY3Rpb24gSW1hZ2VVcGxvYWRlcih7XG4gIGxhYmVsLFxuICBoaW50LFxuICB2YWx1ZSxcbiAgcHJldmlld1VybCxcbiAgdXBsb2FkaW5nLFxuICBmaWxlUmVmLFxuICBvblVwbG9hZCxcbiAgd2lkZSxcbn0pIHtcbiAgY29uc3QgZGlzcGxheWVkID0gcHJldmlld1VybCB8fCB2YWx1ZVxuXG4gIHJldHVybiAoXG4gICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAge2xhYmVsfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktdXBsb2FkLWRyb3Ake3dpZGUgPyAnIHRva3JpLXVwbG9hZC1kcm9wLXdpZGUnIDogJyd9YH0+XG4gICAgICAgIHtkaXNwbGF5ZWQgPyAoXG4gICAgICAgICAgPGltZyBzcmM9e2Rpc3BsYXllZH0gYWx0PXtgJHtsYWJlbH0gcHJldmlld2B9IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4+e3VwbG9hZGluZyA/ICdVcGxvYWRpbmfigKYnIDogJ0NsaWNrIHRvIHVwbG9hZCBhbiBpbWFnZSd9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8aW5wdXQgcmVmPXtmaWxlUmVmfSB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17b25VcGxvYWR9IC8+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+e2hpbnR9PC9zcGFuPlxuICAgIDwvbGFiZWw+XG4gIClcbn1cblxuY29uc3QgU2V0dGluZ3NFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgW2FjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiXSA9IHVzZVN0YXRlKCdnZW5lcmFsJylcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IGJhbm5lckZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgbW9iaWxlQmFubmVyRmlsZVJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBoaWdobGlnaHRGaWxlUmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IFtiYW5uZXJQcmV2aWV3LCBzZXRCYW5uZXJQcmV2aWV3XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbbW9iaWxlQmFubmVyUHJldmlldywgc2V0TW9iaWxlQmFubmVyUHJldmlld10gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2hpZ2hsaWdodFByZXZpZXcsIHNldEhpZ2hsaWdodFByZXZpZXddID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtiYW5uZXJVcGxvYWRpbmcsIHNldEJhbm5lclVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21vYmlsZUJhbm5lclVwbG9hZGluZywgc2V0TW9iaWxlQmFubmVyVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbaGlnaGxpZ2h0VXBsb2FkaW5nLCBzZXRIaWdobGlnaHRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlKFtdKVxuXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgYXBwVXJsID0gY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlTbHVncyA9IHBhcnNlU2x1Z3MocGFyYW1zLmhvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MpXG5cbiAgY29uc3QgYmFubmVySW1hZ2VVcmwgPSB1c2VNZW1vKFxuICAgICgpID0+IHJlc29sdmVJbWFnZVVybChwYXJhbXMuaG9tZUJhbm5lckltYWdlLCBhcHBVcmwpLFxuICAgIFthcHBVcmwsIHBhcmFtcy5ob21lQmFubmVySW1hZ2VdLFxuICApXG4gIGNvbnN0IG1vYmlsZUJhbm5lckltYWdlVXJsID0gdXNlTWVtbyhcbiAgICAoKSA9PiByZXNvbHZlSW1hZ2VVcmwocGFyYW1zLmhvbWVNb2JpbGVCYW5uZXJJbWFnZSwgYXBwVXJsKSxcbiAgICBbYXBwVXJsLCBwYXJhbXMuaG9tZU1vYmlsZUJhbm5lckltYWdlXSxcbiAgKVxuICBjb25zdCBoaWdobGlnaHRJbWFnZVVybCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gcmVzb2x2ZUltYWdlVXJsKHBhcmFtcy5ob21lSGlnaGxpZ2h0SW1hZ2UsIGFwcFVybCksXG4gICAgW2FwcFVybCwgcGFyYW1zLmhvbWVIaWdobGlnaHRJbWFnZV0sXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpXG4gICAgaWYgKGhhc2ggPT09ICdhcHBlYXJhbmNlJykge1xuICAgICAgc2V0QWN0aXZlVGFiKCdjaGFyZ2VzJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoaGFzaCAmJiBUQUJTLnNvbWUoKHRhYikgPT4gdGFiLmlkID09PSBoYXNoKSkge1xuICAgICAgc2V0QWN0aXZlVGFiKGhhc2gpXG4gICAgfVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgYCMke2FjdGl2ZVRhYn1gKVxuICB9LCBbYWN0aXZlVGFiXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoYmFubmVyUHJldmlldz8uc3RhcnRzV2l0aCgnYmxvYjonKSkgVVJMLnJldm9rZU9iamVjdFVSTChiYW5uZXJQcmV2aWV3KVxuICAgIH1cbiAgfSwgW2Jhbm5lclByZXZpZXddKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChtb2JpbGVCYW5uZXJQcmV2aWV3Py5zdGFydHNXaXRoKCdibG9iOicpKSBVUkwucmV2b2tlT2JqZWN0VVJMKG1vYmlsZUJhbm5lclByZXZpZXcpXG4gICAgfVxuICB9LCBbbW9iaWxlQmFubmVyUHJldmlld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGhpZ2hsaWdodFByZXZpZXc/LnN0YXJ0c1dpdGgoJ2Jsb2I6JykpIFVSTC5yZXZva2VPYmplY3RVUkwoaGlnaGxpZ2h0UHJldmlldylcbiAgICB9XG4gIH0sIFtoaWdobGlnaHRQcmV2aWV3XSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBpZ25vcmUgPSBmYWxzZVxuICAgIGZldGNoKGAke2FwaUJhc2VVcmx9L2NhdGVnb3JpZXNgKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFtdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmICghaWdub3JlKSBzZXRDYXRlZ29yaWVzKFtdKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW2FwaUJhc2VVcmxdKVxuXG4gIGNvbnN0IHVwbG9hZEltYWdlID0gYXN5bmMgKGV2ZW50LCBmaWVsZCwgc2V0UHJldmlldywgc2V0QnVzeSwgZmlsZVJlZiwgc3VjY2Vzc01lc3NhZ2UpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZm9sZGVyJywgJ2dlbmVyYWwnKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpXG4gICAgY29uc3QgbG9jYWxQcmV2aWV3VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxuICAgIHNldFByZXZpZXcobG9jYWxQcmV2aWV3VXJsKVxuICAgIHNldEJ1c3kodHJ1ZSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhL3VwbG9hZGAsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ltYWdlIHVwbG9hZCBmYWlsZWQnKVxuICAgICAgfVxuICAgICAgY29uc3QgbWVkaWEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGhhbmRsZUNoYW5nZShmaWVsZCwgbWVkaWEucGF0aClcbiAgICAgIHNldFByZXZpZXcocmVzb2x2ZUltYWdlVXJsKG1lZGlhLnBhdGgsIGFwcFVybCkpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBzdWNjZXNzTWVzc2FnZSwgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCB1cGxvYWQgaW1hZ2UnLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEJ1c3koZmFsc2UpXG4gICAgICBpZiAoZmlsZVJlZi5jdXJyZW50KSBmaWxlUmVmLmN1cnJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnc3VjY2VzcycgfHwgcmVzcG9uc2U/LmRhdGE/LnJlY29yZCkge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiAnU2V0dGluZ3Mgc2F2ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgICBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MnLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgc2V0dGluZ3MuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGZsZXggZmxleERpcmVjdGlvbj1cImNvbHVtblwiIGNsYXNzTmFtZT1cInRva3JpLXNldHRpbmdzLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtdGFic1wiIG1iPVwieGxcIj5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2V0dGluZ3MtdGFiJHthY3RpdmVUYWIgPT09IHRhYi5pZCA/ICcgaXMtYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIodGFiLmlkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGFiLmxhYmVsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvQm94PlxuXG4gICAgICA8RHJhd2VyQ29udGVudD5cbiAgICAgICAge1RBQlMubWFwKCh0YWIpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcmVzb3VyY2UuZWRpdFByb3BlcnRpZXMuZmlsdGVyKChwcm9wZXJ0eSkgPT5cbiAgICAgICAgICAgIHRhYi5maWVsZHMuaW5jbHVkZXMocHJvcGVydHkucHJvcGVydHlQYXRoKSxcbiAgICAgICAgICApXG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICBrZXk9e3RhYi5pZH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktc2V0dGluZ3MtcGFuZWxcIlxuICAgICAgICAgICAgICBwPVwieGxcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiBhY3RpdmVUYWIgPT09IHRhYi5pZCA/ICdibG9jaycgOiAnbm9uZScgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEg0IG1iPVwic21cIj57dGFiLmxhYmVsfTwvSDQ+XG4gICAgICAgICAgICAgIDxUZXh0IG1iPVwieGxcIiBvcGFjaXR5PXswLjc1fT5cbiAgICAgICAgICAgICAgICB7dGFiLmlkID09PSAnY2hhcmdlcydcbiAgICAgICAgICAgICAgICAgID8gJ1NldCBjb3B5IGFuZCBwcmljZXMgZm9yIE1vcm5pbmcgYW5kIDkwLU1pbnV0ZSBkZWxpdmVyeS4gSGFuZGxpbmcgZmVlIGlzIGFkZGVkIHRvIGV2ZXJ5IG9yZGVyLidcbiAgICAgICAgICAgICAgICAgIDogdGFiLmlkID09PSAnaG9tZXBhZ2UnXG4gICAgICAgICAgICAgICAgICAgID8gJ1RoZXNlIGltYWdlcyBhbmQgY2F0ZWdvcmllcyBhcHBlYXIgb24gdGhlIHdlYnNpdGUgaG9tZXBhZ2UuIENsaWNrIFNhdmUgY2hhbmdlcyBhZnRlciB1cGxvYWRpbmcuJ1xuICAgICAgICAgICAgICAgICAgICA6ICdVcGRhdGUgeW91ciBzdG9yZSBzZXR0aW5ncyBhbmQgY2xpY2sgU2F2ZSBjaGFuZ2VzIGJlbG93Lid9XG4gICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAge3RhYi5pZCA9PT0gJ2NoYXJnZXMnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hhcmdlcy1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5Nb3JuaW5nIGRlbGl2ZXJ5PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHA+U2hvd24gYXQgY2hlY2tvdXQgd2hlbiB0aGlzIG9wdGlvbiBpcyBvbiBmb3IgdGhlIHBpbmNvZGUuPC9wPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgVGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/Lm1vcm5pbmdEZWxpdmVyeVRpdGxlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nRGVsaXZlcnlUaXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkZsYXdsZXNzIE1vcm5pbmcgRGVsaXZlcnlcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICBTdWJ0aXRsZVxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8ubW9ybmluZ0RlbGl2ZXJ5U3VidGl0bGUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ21vcm5pbmdEZWxpdmVyeVN1YnRpdGxlJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRnJlc2huZXNzIEd1YXJhbnRlZWRcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNoaXBwaW5nIGZlZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/Lm1vcm5pbmdTaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdtb3JuaW5nU2hpcHBpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyZWUgYWJvdmUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5tb3JuaW5nRnJlZUFib3ZlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ21vcm5pbmdGcmVlQWJvdmUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj4wIG1lYW5zIG5vIGZyZWUgZGVsaXZlcnk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+OTAtTWludXRlIGRlbGl2ZXJ5PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHA+U2hvd24gYXQgY2hlY2tvdXQuIERpc2FibGVkIHBpbmNvZGVzIHN0aWxsIHNlZSB0aGlzIGFzIGNvbWluZyBzb29uLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFRpdGxlXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzRGVsaXZlcnlUaXRsZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnZXhwcmVzc0RlbGl2ZXJ5VGl0bGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI5MC1NaW51dGUgRW1lcmdlbmN5IERyb3BzXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgU3VidGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmV4cHJlc3NEZWxpdmVyeVN1YnRpdGxlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdleHByZXNzRGVsaXZlcnlTdWJ0aXRsZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk9uLURlbWFuZCBMdXh1cnlcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNoaXBwaW5nIGZlZSAo4oK5KVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmVjb3JkPy5wYXJhbXM/LmV4cHJlc3NTaGlwcGluZ0ZlZSA/PyAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdleHByZXNzU2hpcHBpbmdGZWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEZyZWUgYWJvdmUgKOKCuSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JlY29yZD8ucGFyYW1zPy5leHByZXNzRnJlZUFib3ZlID8/ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2V4cHJlc3NGcmVlQWJvdmUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj4wIG1lYW5zIG5vIGZyZWUgZGVsaXZlcnk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsIHRva3JpLWNoYXJnZXMtaGFuZGxpbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgSGFuZGxpbmcgY2hhcmdlICjigrkpXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyZWNvcmQ/LnBhcmFtcz8uaGFuZGxpbmdGZWUgPz8gJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdoYW5kbGluZ0ZlZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5DYXJ0IGhhbmRsaW5nIGZlZSBhZGRlZCB0byBldmVyeSBvcmRlcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiB0YWIuaWQgPT09ICdob21lcGFnZScgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1ob21lcGFnZS1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiSG9tZSBiYW5uZXIgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBoaW50PVwiRGVza3RvcCAvIGxhcmdlLXNjcmVlbiBoZXJvIGJhbm5lci4gSlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIuXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Jhbm5lckltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3VXJsPXtiYW5uZXJQcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRpbmc9e2Jhbm5lclVwbG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgZmlsZVJlZj17YmFubmVyRmlsZVJlZn1cbiAgICAgICAgICAgICAgICAgICAgd2lkZVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZUJhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJhbm5lclByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5uZXJGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0Jhbm5lciBpbWFnZSB1cGxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEltYWdlVXBsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw9XCJIb21lIG1vYmlsZSBiYW5uZXIgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICBoaW50PVwiU2hvd24gb24gcGhvbmVzLiBJZiBlbXB0eSwgdGhlIGRlc2t0b3AgYmFubmVyIGlzIHVzZWQgaW5zdGVhZC5cIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bW9iaWxlQmFubmVySW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdVcmw9e21vYmlsZUJhbm5lclByZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZGluZz17bW9iaWxlQmFubmVyVXBsb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmPXttb2JpbGVCYW5uZXJGaWxlUmVmfVxuICAgICAgICAgICAgICAgICAgICBvblVwbG9hZD17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEltYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaG9tZU1vYmlsZUJhbm5lckltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldE1vYmlsZUJhbm5lclByZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2JpbGVCYW5uZXJVcGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVCYW5uZXJGaWxlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ01vYmlsZSBiYW5uZXIgaW1hZ2UgdXBsb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVVwbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPVwiRnJ1aXQgaGlnaGxpZ2h0IGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaGludD1cIlJlcGxhY2VzIHRoZSBraXdpIGltYWdlIGluIOKAnFRoZSBTbWFsbCBGcnVpdCB3aXRoIGEgQmlnIFB1bmNo4oCdIG9uIHRoZSB3ZWJzaXRlLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtoaWdobGlnaHRJbWFnZVVybH1cbiAgICAgICAgICAgICAgICAgICAgcHJldmlld1VybD17aGlnaGxpZ2h0UHJldmlld31cbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkaW5nPXtoaWdobGlnaHRVcGxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWY9e2hpZ2hsaWdodEZpbGVSZWZ9XG4gICAgICAgICAgICAgICAgICAgIG9uVXBsb2FkPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgdXBsb2FkSW1hZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdob21lSGlnaGxpZ2h0SW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SGlnaGxpZ2h0UHJldmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEhpZ2hsaWdodFVwbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodEZpbGVSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAnSGlnaGxpZ2h0IGltYWdlIHVwbG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIEhvbWVwYWdlIGNhdGVnb3JpZXNcbiAgICAgICAgICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e2NhdGVnb3JpZXMubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uc2x1ZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsIHx8IGl0ZW0udGl0bGUgfHwgaXRlbS5zbHVnLFxuICAgICAgICAgICAgICAgICAgICAgIH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRDYXRlZ29yeVNsdWdzfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoc2x1Z3MpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoJ2hvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MnLCBKU09OLnN0cmluZ2lmeShzbHVncykpXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIGFuZCBzZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgICAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2ggY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICBUaGVzZSBjYXRlZ29yaWVzIGxvYWQgb24gdGhlIHdlYnNpdGUgYWZ0ZXIgdGhlIGZydWl0IGhpZ2hsaWdodCBzZWN0aW9uLCBvbmUgYXRcbiAgICAgICAgICAgICAgICAgICAgICBhIHRpbWUgYXMgdGhlIHZpc2l0b3Igc2Nyb2xscy5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLm1hcCgocHJvcGVydHkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxCYXNlUHJvcGVydHlDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlPVwiZWRpdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L0RyYXdlckNvbnRlbnQ+XG5cbiAgICAgIDxEcmF3ZXJGb290ZXI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjaGFuZ2VzXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EcmF3ZXJGb290ZXI+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBwYXJzZVNsdWdzKHJhdykge1xuICBpZiAoIXJhdykgcmV0dXJuIFtdXG4gIGlmIChBcnJheS5pc0FycmF5KHJhdykpIHJldHVybiByYXcubWFwKChpdGVtKSA9PiBTdHJpbmcoaXRlbSkudHJpbSgpKS5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHR5cGVvZiByYXcgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlU2x1Z3MocGFyc2VkKVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiByYXdcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKChpdGVtKSA9PiBpdGVtLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgfVxuICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcGFkKG51bSkge1xuICByZXR1cm4gU3RyaW5nKG51bSkucGFkU3RhcnQoMiwgJzAnKVxufVxuXG5mdW5jdGlvbiB0b0RhdGV0aW1lVmFsdWUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke3BhZChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtwYWQoZGF0ZS5nZXREYXRlKCkpfVQke3BhZChkYXRlLmdldEhvdXJzKCkpfToke3BhZChkYXRlLmdldE1pbnV0ZXMoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRldGltZUxhYmVsKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAnJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJydcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRheTogJzItZGlnaXQnLFxuICAgIG1vbnRoOiAnc2hvcnQnLFxuICAgIHllYXI6ICdudW1lcmljJyxcbiAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgbWludXRlOiAnMi1kaWdpdCcsXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHVzZUFuY2hvcmVkTWVudShvcGVuKSB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW29wZW5VcCwgc2V0T3BlblVwXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvcGVuKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gd3JhcFJlZi5jdXJyZW50XG4gICAgICBpZiAoIW5vZGUpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGNvbnN0IHNwYWNlQmVsb3cgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LmJvdHRvbVxuICAgICAgc2V0T3BlblVwKHNwYWNlQmVsb3cgPCAyNDAgJiYgcmVjdC50b3AgPiBzcGFjZUJlbG93KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlLCB0cnVlKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwgdHJ1ZSlcbiAgICB9XG4gIH0sIFtvcGVuXSlcblxuICByZXR1cm4geyB3cmFwUmVmLCBvcGVuVXAgfVxufVxuXG5mdW5jdGlvbiBDaG9pY2VDYXJkKHsgc2VsZWN0ZWQsIHRpdGxlLCBoaW50LCBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT17YHRva3JpLWNob2ljZS1jYXJkJHtzZWxlY3RlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgPlxuICAgICAgPHN0cm9uZz57dGl0bGV9PC9zdHJvbmc+XG4gICAgICA8c3Bhbj57aGludH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZnVuY3Rpb24gQW5jaG9yZWRTZWxlY3QoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UsIHBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgd3JhcFJlZiwgb3BlblVwIH0gPSB1c2VBbmNob3JlZE1lbnUob3BlbilcbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3RcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtY29udHJvbFwiIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oKGN1cnJlbnQpID0+ICFjdXJyZW50KX0+XG4gICAgICAgIDxzcGFuPntzZWxlY3RlZD8ubGFiZWwgfHwgcGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAge29wdGlvbnMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7aXRlbS52YWx1ZSA9PT0gdmFsdWUgPyAnIGlzLXNlbGVjdGVkJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShpdGVtLnZhbHVlKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gU2VhcmNoYWJsZU11bHRpU2VsZWN0KHsgb3B0aW9ucywgc2VsZWN0ZWQsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciwgc2VhcmNoUGxhY2Vob2xkZXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3F1ZXJ5LCBzZXRRdWVyeV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBjb25zdCBzZWxlY3RlZFNldCA9IHVzZU1lbW8oKCkgPT4gbmV3IFNldChzZWxlY3RlZCksIFtzZWxlY3RlZF0pXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IG9wdGlvbnMuZmlsdGVyKChpdGVtKSA9PiBzZWxlY3RlZFNldC5oYXMoaXRlbS52YWx1ZSkpXG4gIGNvbnN0IGZpbHRlcmVkID0gb3B0aW9ucy5maWx0ZXIoKGl0ZW0pID0+XG4gICAgYCR7aXRlbS5sYWJlbH0gJHtpdGVtLnZhbHVlfWAudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeS50cmltKCkudG9Mb3dlckNhc2UoKSksXG4gIClcblxuICBjb25zdCB0b2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc2VsZWN0ZWRTZXQuaGFzKHZhbHVlKSkgb25DaGFuZ2Uoc2VsZWN0ZWQuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSB2YWx1ZSkpXG4gICAgZWxzZSBvbkNoYW5nZShbLi4uc2VsZWN0ZWQsIHZhbHVlXSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdFwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigodmFsdWUpID0+ICF2YWx1ZSl9PlxuICAgICAgICB7c2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA/IChcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwc1wiPlxuICAgICAgICAgICAge3NlbGVjdGVkT3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpdGVtLnZhbHVlfSBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jaGlwXCI+XG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIMOXXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtcGxhY2Vob2xkZXJcIj57cGxhY2Vob2xkZXJ9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1jYXJldFwiPntvcGVuID8gJ+KWtCcgOiAn4pa+J308L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgdmFsdWU9e3F1ZXJ5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzZWFyY2hQbGFjZWhvbGRlcn1cbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1tdWx0aXNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICB7ZmlsdGVyZWQubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBmaWx0ZXJlZC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VkID0gc2VsZWN0ZWRTZXQuaGFzKGl0ZW0udmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e2l0ZW0udmFsdWV9IGNsYXNzTmFtZT17YHRva3JpLW11bHRpc2VsZWN0LW9wdGlvbiR7Y2hlY2tlZCA/ICcgaXMtc2VsZWN0ZWQnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGl0ZW0udmFsdWUpfSAvPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbXVsdGlzZWxlY3QtZW1wdHlcIj5ObyBtYXRjaGVzPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIERhdGVUaW1lUGlja2VyKHsgdmFsdWUsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9KSB7XG4gIGNvbnN0IHBhcnNlZCA9IHZhbHVlID8gbmV3IERhdGUodmFsdWUpIDogbnVsbFxuICBjb25zdCB2YWxpZCA9IHBhcnNlZCAmJiAhTnVtYmVyLmlzTmFOKHBhcnNlZC5nZXRUaW1lKCkpID8gcGFyc2VkIDogbnVsbFxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21vbnRoRGF0ZSwgc2V0TW9udGhEYXRlXSA9IHVzZVN0YXRlKHZhbGlkIHx8IG5ldyBEYXRlKCkpXG4gIGNvbnN0IFtob3Vycywgc2V0SG91cnNdID0gdXNlU3RhdGUodmFsaWQgPyBwYWQodmFsaWQuZ2V0SG91cnMoKSkgOiAnMDAnKVxuICBjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZSh2YWxpZCA/IHBhZCh2YWxpZC5nZXRNaW51dGVzKCkpIDogJzAwJylcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghdmFsaWQpIHJldHVyblxuICAgIHNldE1vbnRoRGF0ZSh2YWxpZClcbiAgICBzZXRIb3VycyhwYWQodmFsaWQuZ2V0SG91cnMoKSkpXG4gICAgc2V0TWludXRlcyhwYWQodmFsaWQuZ2V0TWludXRlcygpKSlcbiAgfSwgW3ZhbHVlXSlcblxuICBjb25zdCB5ZWFyID0gbW9udGhEYXRlLmdldEZ1bGxZZWFyKClcbiAgY29uc3QgbW9udGggPSBtb250aERhdGUuZ2V0TW9udGgoKVxuICBjb25zdCBmaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKS5nZXREYXkoKVxuICBjb25zdCB0b3RhbERheXMgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLmdldERhdGUoKVxuICBjb25zdCBjZWxscyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3REYXk7IGkgKz0gMSkgY2VsbHMucHVzaChudWxsKVxuICBmb3IgKGxldCBkYXkgPSAxOyBkYXkgPD0gdG90YWxEYXlzOyBkYXkgKz0gMSkgY2VsbHMucHVzaChkYXkpXG5cbiAgY29uc3QgYXBwbHkgPSAoZGF5LCBuZXh0SG91cnMgPSBob3VycywgbmV4dE1pbnV0ZXMgPSBtaW51dGVzKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGAke3llYXJ9LSR7cGFkKG1vbnRoICsgMSl9LSR7cGFkKGRheSl9VCR7cGFkKE51bWJlcihuZXh0SG91cnMpIHx8IDApfToke3BhZChOdW1iZXIobmV4dE1pbnV0ZXMpIHx8IDApfWBcbiAgICBvbkNoYW5nZShuZXh0KVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWREYXkgPVxuICAgIHZhbGlkICYmIHZhbGlkLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiYgdmFsaWQuZ2V0TW9udGgoKSA9PT0gbW9udGggPyB2YWxpZC5nZXREYXRlKCkgOiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXJcIiByZWY9e3dyYXBSZWZ9PlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1jb250cm9sXCIgb25DbGljaz17KCkgPT4gc2V0T3BlbigoY3VycmVudCkgPT4gIWN1cnJlbnQpfT5cbiAgICAgICAgPHNwYW4+e3ZhbGlkID8gZm9ybWF0RGF0ZXRpbWVMYWJlbCh2YWxpZCkgOiBwbGFjZWhvbGRlcn08L3NwYW4+XG4gICAgICAgIDxzcGFuPvCfk4U8L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIHtvcGVuID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRva3JpLWRhdGVwaWNrZXItcG9wJHtvcGVuVXAgPyAnIGlzLXVwJyA6ICcnfWB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1uYXZcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldE1vbnRoRGF0ZShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIDEpKX0+XG4gICAgICAgICAgICAgIOKAuVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8c3Ryb25nPlxuICAgICAgICAgICAgICB7bW9udGhEYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbW9udGg6ICdsb25nJywgeWVhcjogJ251bWVyaWMnIH0pfVxuICAgICAgICAgICAgPC9zdHJvbmc+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRNb250aERhdGUobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKSl9PlxuICAgICAgICAgICAgICDigLpcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci13ZWVrXCI+XG4gICAgICAgICAgICB7WydTdScsICdNbycsICdUdScsICdXZScsICdUaCcsICdGcicsICdTYSddLm1hcCgobGFiZWwpID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtsYWJlbH0+e2xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZGF0ZXBpY2tlci1ncmlkXCI+XG4gICAgICAgICAgICB7Y2VsbHMubWFwKChkYXksIGluZGV4KSA9PlxuICAgICAgICAgICAgICBkYXkgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gfVxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3NlbGVjdGVkRGF5ID09PSBkYXkgPyAnaXMtc2VsZWN0ZWQnIDogJyd9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBhcHBseShkYXkpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtkYXl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgZW1wdHktJHtpbmRleH1gfSAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWRhdGVwaWNrZXItdGltZVwiPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBIb3VyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjIzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17aG91cnN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbigyMywgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0SG91cnMobmV4dClcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZERheSkgYXBwbHkoc2VsZWN0ZWREYXksIG5leHQsIG1pbnV0ZXMpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIE1pbnV0ZVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCI1OVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e21pbnV0ZXN9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBhZChNYXRoLm1pbig1OSwgTWF0aC5tYXgoMCwgTnVtYmVyKGV2ZW50LnRhcmdldC52YWx1ZSkgfHwgMCkpKVxuICAgICAgICAgICAgICAgICAgc2V0TWludXRlcyhuZXh0KVxuICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF5KSBhcHBseShzZWxlY3RlZERheSwgaG91cnMsIG5leHQpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1kYXRlcGlja2VyLWNsZWFyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlKCcnKVxuICAgICAgICAgICAgICAgIHNldE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIENsZWFyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBDb3Vwb25FZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcblxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKVxuICBjb25zdCBbY2F0ZWdvcmllcywgc2V0Q2F0ZWdvcmllc10gPSB1c2VTdGF0ZShbXSlcblxuICBjb25zdCBzZWxlY3RlZFNsdWdzID0gcGFyc2VTbHVncyhwYXJhbXMudGFyZ2V0U2x1Z3MpXG4gIGNvbnN0IHRhcmdldFR5cGUgPSBwYXJhbXMudGFyZ2V0VHlwZSB8fCAnYWxsJ1xuICBjb25zdCBhcHBseU9uID0gcGFyYW1zLmFwcGx5T24gfHwgJ2NhcnQnXG4gIGNvbnN0IHVzYWdlVHlwZSA9IHBhcmFtcy51c2FnZVR5cGUgfHwgJ3VubGltaXRlZCdcbiAgY29uc3QgY291cG9uVHlwZSA9IHBhcmFtcy50eXBlIHx8ICdwZXJjZW50J1xuICBjb25zdCBpc0FjdGl2ZSA9IHBhcmFtcy5pc0FjdGl2ZSAhPT0gZmFsc2UgJiYgcGFyYW1zLmlzQWN0aXZlICE9PSAnZmFsc2UnXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRDYXRhbG9nKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlEYXRhID0gYXdhaXQgZmV0Y2goYCR7YXBpQmFzZVVybH0vY2F0ZWdvcmllc2ApLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIGNvbnN0IGFsbFByb2R1Y3RzID0gW11cbiAgICAgICAgbGV0IHBhZ2UgPSAxXG4gICAgICAgIGxldCBoYXNNb3JlID0gdHJ1ZVxuICAgICAgICB3aGlsZSAoaGFzTW9yZSAmJiBwYWdlIDw9IDIwKSB7XG4gICAgICAgICAgY29uc3QgcHJvZHVjdERhdGEgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9wcm9kdWN0cz9wYWdlPSR7cGFnZX0mbGltaXQ9MTAwYCkudGhlbigocmVzcG9uc2UpID0+XG4gICAgICAgICAgICByZXNwb25zZS5qc29uKCksXG4gICAgICAgICAgKVxuICAgICAgICAgIGFsbFByb2R1Y3RzLnB1c2goLi4uKHByb2R1Y3REYXRhLnByb2R1Y3RzIHx8IFtdKSlcbiAgICAgICAgICBoYXNNb3JlID0gQm9vbGVhbihwcm9kdWN0RGF0YS5oYXNNb3JlKVxuICAgICAgICAgIHBhZ2UgKz0gMVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBzZXRQcm9kdWN0cyhhbGxQcm9kdWN0cylcbiAgICAgICAgc2V0Q2F0ZWdvcmllcyhBcnJheS5pc0FycmF5KGNhdGVnb3J5RGF0YSkgPyBjYXRlZ29yeURhdGEgOiBbXSlcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgIHNldFByb2R1Y3RzKFtdKVxuICAgICAgICAgIHNldENhdGVnb3JpZXMoW10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkQ2F0YWxvZygpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlnbm9yZSA9IHRydWVcbiAgICB9XG4gIH0sIFthcGlCYXNlVXJsXSlcblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzZXRTZWxlY3RlZFNsdWdzID0gKG5leHQpID0+IHNldEZpZWxkKCd0YXJnZXRTbHVncycsIEpTT04uc3RyaW5naWZ5KG5leHQpKVxuXG4gIGNvbnN0IHByb2R1Y3RPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBwcm9kdWN0cy5tYXAoKGl0ZW0pID0+ICh7IHZhbHVlOiBpdGVtLnNsdWcsIGxhYmVsOiBpdGVtLm5hbWUgfSkpLFxuICAgIFtwcm9kdWN0c10sXG4gIClcbiAgY29uc3QgY2F0ZWdvcnlPcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiBjYXRlZ29yaWVzLm1hcCgoaXRlbSkgPT4gKHsgdmFsdWU6IGl0ZW0uc2x1ZywgbGFiZWw6IGl0ZW0ubGFiZWwgfSkpLFxuICAgIFtjYXRlZ29yaWVzXSxcbiAgKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdXBvbiBzYXZlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBjb3Vwb24uIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPkNyZWF0ZSBhIHN0b3JlIGNvdXBvbjwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBTZXQgd2hvIGdldHMgdGhlIGRpc2NvdW50LCB3aGVyZSBpdCBhcHBsaWVzLCBhbmQgaG93IG1hbnkgdGltZXMgaXQgY2FuIGJlIHVzZWQuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1ncmlkXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PkNvdXBvbiBjb2RlPC9oND5cbiAgICAgICAgICA8cD5DdXN0b21lcnMgd2lsbCB0eXBlIHRoaXMgYXQgY2hlY2tvdXQgb24gdGhlIHdlYnNpdGUgYW5kIGFwcC48L3A+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXQgdG9rcmktY291cG9uLWNvZGVcIlxuICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2NvZGUnLCBldmVudC50YXJnZXQudmFsdWUudG9VcHBlckNhc2UoKSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIldFTENPTUUxMFwiXG4gICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10b2dnbGVcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgZXZlbnQudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIENvdXBvbiBpcyBhY3RpdmVcbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGlzY291bnQ8L2g0PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY2hvaWNlLXJvd1wiPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdwZXJjZW50J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJQZXJjZW50IG9mZlwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIDEwJSBvZmZcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgndHlwZScsICdwZXJjZW50Jyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e2NvdXBvblR5cGUgPT09ICdmbGF0J31cbiAgICAgICAgICAgICAgdGl0bGU9XCJGbGF0IGFtb3VudFwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJlLmcuIOKCuTUwIG9mZlwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd0eXBlJywgJ2ZsYXQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAge2NvdXBvblR5cGUgPT09ICdwZXJjZW50JyA/ICdQZXJjZW50IHZhbHVlJyA6ICdBbW91bnQgKOKCuSknfVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnZhbHVlID8/ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNaW4gY2FydCAo4oK5KVxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLm1pbkNhcnQgPz8gJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ21pbkNhcnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNYXggZGlzY291bnQgKOKCuSlcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5tYXhEaXNjb3VudCA/PyAnJ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbWF4RGlzY291bnQnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTm8gY2FwXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+QXBwbHkgZGlzY291bnQgb248L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdjYXJ0J31cbiAgICAgICAgICAgIHRpdGxlPVwiQ2FydCB0b3RhbFwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIHRoZSBpdGVtcyBzdWJ0b3RhbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgnYXBwbHlPbicsICdjYXJ0Jyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgc2VsZWN0ZWQ9e2FwcGx5T24gPT09ICdzaGlwcGluZyd9XG4gICAgICAgICAgICB0aXRsZT1cIlNoaXBwaW5nIGZlZVwiXG4gICAgICAgICAgICBoaW50PVwiUmVkdWNlIGRlbGl2ZXJ5IGNoYXJnZXNcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RmllbGQoJ2FwcGx5T24nLCAnc2hpcHBpbmcnKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PldobyBjYW4gZ2V0IHRoaXMgZGlzY291bnQ8L2g0PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgQXBwbHkgdG9cbiAgICAgICAgICA8QW5jaG9yZWRTZWxlY3RcbiAgICAgICAgICAgIHZhbHVlPXt0YXJnZXRUeXBlfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDaG9vc2Ugd2hvIHRoaXMgY291cG9uIGFwcGxpZXMgdG9cIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgIHNldEZpZWxkKCd0YXJnZXRUeXBlJywgbmV4dClcbiAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRTbHVncyhbXSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgIHsgdmFsdWU6ICdhbGwnLCBsYWJlbDogJ0FsbCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ3Byb2R1Y3RzJywgbGFiZWw6ICdTZWxlY3RlZCBwcm9kdWN0cycgfSxcbiAgICAgICAgICAgICAgeyB2YWx1ZTogJ2NhdGVnb3JpZXMnLCBsYWJlbDogJ1NlbGVjdGVkIGNhdGVnb3JpZXMnIH0sXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAge3RhcmdldFR5cGUgPT09ICdwcm9kdWN0cycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUHJvZHVjdHNcbiAgICAgICAgICAgIDxTZWFyY2hhYmxlTXVsdGlTZWxlY3RcbiAgICAgICAgICAgICAgb3B0aW9ucz17cHJvZHVjdE9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgcHJvZHVjdHNcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwcm9kdWN0c1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt0YXJnZXRUeXBlID09PSAnY2F0ZWdvcmllcycgPyAoXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ2F0ZWdvcmllc1xuICAgICAgICAgICAgPFNlYXJjaGFibGVNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICBvcHRpb25zPXtjYXRlZ29yeU9wdGlvbnN9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZFNsdWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VsZWN0ZWRTbHVnc31cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgY2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Vc2FnZTwvaDQ+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgICA8Q2hvaWNlQ2FyZFxuICAgICAgICAgICAgICBzZWxlY3RlZD17dXNhZ2VUeXBlID09PSAndW5saW1pdGVkJ31cbiAgICAgICAgICAgICAgdGl0bGU9XCJVbmxpbWl0ZWRcIlxuICAgICAgICAgICAgICBoaW50PVwiQ3VzdG9tZXJzIGNhbiByZXVzZSBpdFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAndW5saW1pdGVkJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENob2ljZUNhcmRcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3VzYWdlVHlwZSA9PT0gJ3NpbmdsZSd9XG4gICAgICAgICAgICAgIHRpdGxlPVwiU2luZ2xlIHVzZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJPbmUgdXNlIHBlciBjdXN0b21lclwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZpZWxkKCd1c2FnZVR5cGUnLCAnc2luZ2xlJyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt1c2FnZVR5cGUgPT09ICd1bmxpbWl0ZWQnID8gKFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBPcHRpb25hbCBnbG9iYWwgY2FwXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgbWluPVwiMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy51c2FnZUxpbWl0ID8/ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCd1c2FnZUxpbWl0JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkxlYXZlIGJsYW5rIGZvciB1bmxpbWl0ZWRcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRleHQ+RWFjaCBsb2dnZWQtaW4gY3VzdG9tZXIgY2FuIHVzZSB0aGlzIGNvdXBvbiBvbmNlLjwvVGV4dD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtwYXJhbXMudXNlZENvdW50ID8gPFRleHQgbXQ9XCJkZWZhdWx0XCI+VXNlZCB7cGFyYW1zLnVzZWRDb3VudH0gdGltZShzKSBzbyBmYXIuPC9UZXh0PiA6IG51bGx9XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5TY2hlZHVsZTwvaDQ+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgU3RhcnRzIGF0XG4gICAgICAgICAgICA8RGF0ZVRpbWVQaWNrZXJcbiAgICAgICAgICAgICAgdmFsdWU9e3RvRGF0ZXRpbWVWYWx1ZShwYXJhbXMuc3RhcnRzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdzdGFydHNBdCcsIG5leHQgfHwgbnVsbCl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IHN0YXJ0IGRhdGUgYW5kIHRpbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEV4cGlyZXMgYXRcbiAgICAgICAgICAgIDxEYXRlVGltZVBpY2tlclxuICAgICAgICAgICAgICB2YWx1ZT17dG9EYXRldGltZVZhbHVlKHBhcmFtcy5leHBpcmVzQXQpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdleHBpcmVzQXQnLCBuZXh0IHx8IG51bGwpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBleHBpcnkgZGF0ZSBhbmQgdGltZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAge2xvYWRpbmcgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgU2F2ZSBjb3Vwb25cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb3Vwb25FZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBMb2NhbFNlbGVjdCwgU2VhcmNoYWJsZVNlbGVjdCwgdXNlQW5jaG9yZWRNZW51IH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzJ1xuXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KClcblxuY29uc3QgRlVMRklMTE1FTlQgPSBbXG4gIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdXYWl0aW5nIGZvciBmdWxmaWxsbWVudCcgfSxcbiAgeyB2YWx1ZTogJ3BhaWQnLCBsYWJlbDogJ1Byb2Nlc3NpbmcnIH0sXG4gIHsgdmFsdWU6ICdwYWNrZWQnLCBsYWJlbDogJ1BhY2tlZCcgfSxcbiAgeyB2YWx1ZTogJ3NoaXBwZWQnLCBsYWJlbDogJ1NoaXBwZWQnIH0sXG4gIHsgdmFsdWU6ICdkZWxpdmVyZWQnLCBsYWJlbDogJ0RlbGl2ZXJlZCcgfSxcbiAgeyB2YWx1ZTogJ2NhbmNlbGxlZCcsIGxhYmVsOiAnQ2FuY2VsbGVkJyB9LFxuXVxuXG5jb25zdCBQQVlNRU5UX09QVElPTlMgPSBbXG4gIHsgdmFsdWU6ICdwZW5kaW5nJywgbGFiZWw6ICdQZW5kaW5nJyB9LFxuICB7IHZhbHVlOiAncGFpZCcsIGxhYmVsOiAnUGFpZCcgfSxcbiAgeyB2YWx1ZTogJ2ZhaWxlZCcsIGxhYmVsOiAnRmFpbGVkJyB9LFxuICB7IHZhbHVlOiAncmVmdW5kZWQnLCBsYWJlbDogJ1JlZnVuZGVkJyB9LFxuXVxuXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oYW1vdW50KSkgcmV0dXJuICfigrkwJ1xuICByZXR1cm4gYOKCuSR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKCdlbi1JTicsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pfWBcbn1cblxuY29uc3QgZm9ybWF0RGF0ZVRpbWUgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICfigJQnXG4gIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywge1xuICAgIGRhdGVTdHlsZTogJ21lZGl1bScsXG4gICAgdGltZVN0eWxlOiAnc2hvcnQnLFxuICB9KVxufVxuXG5jb25zdCByZXNvbHZlSW1hZ2UgPSAodmFsdWUpID0+IHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGlmICgvXihodHRwcz86fGRhdGE6fGJsb2I6KS8udGVzdCh2YWx1ZSkpIHJldHVybiB2YWx1ZVxuICBpZiAodmFsdWUuc3RhcnRzV2l0aCgnLycpKSByZXR1cm4gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3ZhbHVlfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbmZ1bmN0aW9uIE1vcmVNZW51KHsgdW5wYWlkLCBidXN5LCBvbkNhc2gsIG9uUXIgfSkge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB3cmFwUmVmLCBvcGVuVXAgfSA9IHVzZUFuY2hvcmVkTWVudShvcGVuKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Eb2NDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKCF3cmFwUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHNldE9wZW4oZmFsc2UpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spXG4gIH0sIFt3cmFwUmVmXSlcblxuICBpZiAoIXVucGFpZCkgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbW9yZVwiIHJlZj17d3JhcFJlZn0+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKCh2YWx1ZSkgPT4gIXZhbHVlKX0+XG4gICAgICAgIE1vcmUgYWN0aW9uc1xuICAgICAgICA8c3Bhbj57b3BlbiA/ICfilrQnIDogJ+KWvid9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICB7b3BlbiA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1tb3JlLW1lbnUke29wZW5VcCA/ICcgaXMtdXAnIDogJyd9YH0+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihidXN5KX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICAgICAgb25DYXNoKClcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2J1c3kgPT09ICdjb2xsZWN0Q2FzaCcgPyAnU2F2aW5n4oCmJyA6ICdNYXJrIGNhc2ggY29sbGVjdGVkJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGJ1c3kpfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRPcGVuKGZhbHNlKVxuICAgICAgICAgICAgICBvblFyKClcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2J1c3kgPT09ICdnZW5lcmF0ZVFyJyA/ICdDcmVhdGluZ+KApicgOiAnR2VuZXJhdGUgcGF5bWVudCBRUid9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gc25hcHNob3QocGFyYW1zID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMgfHwgJycsXG4gICAgcGF5bWVudFN0YXR1czogcGFyYW1zLnBheW1lbnRTdGF0dXMgfHwgJycsXG4gICAgZGVsaXZlcnlQYXJ0bmVySWQ6IHBhcmFtcy5kZWxpdmVyeVBhcnRuZXJJZCB8fCAnJyxcbiAgICBjb250YWN0TmFtZTogcGFyYW1zLmNvbnRhY3ROYW1lIHx8ICcnLFxuICAgIGNvbnRhY3RQaG9uZTogcGFyYW1zLmNvbnRhY3RQaG9uZSB8fCAnJyxcbiAgICBhZGRyZXNzTGluZTE6IHBhcmFtcy5hZGRyZXNzTGluZTEgfHwgJycsXG4gICAgYWRkcmVzc0xpbmUyOiBwYXJhbXMuYWRkcmVzc0xpbmUyIHx8ICcnLFxuICAgIGFkZHJlc3NDaXR5OiBwYXJhbXMuYWRkcmVzc0NpdHkgfHwgJycsXG4gICAgYWRkcmVzc1N0YXRlOiBwYXJhbXMuYWRkcmVzc1N0YXRlIHx8ICcnLFxuICAgIGFkZHJlc3NQaW5jb2RlOiBwYXJhbXMuYWRkcmVzc1BpbmNvZGUgfHwgJycsXG4gICAgYWRkcmVzc0xhbmRtYXJrOiBwYXJhbXMuYWRkcmVzc0xhbmRtYXJrIHx8ICcnLFxuICB9XG59XG5cbmNvbnN0IE9yZGVyRGV0YWlsID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQsIGxvYWRpbmcsIHNldFJlY29yZCB9ID0gdXNlUmVjb3JkKGluaXRpYWxSZWNvcmQsIHJlc291cmNlLmlkKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBbc2F2aW5nLCBzZXRTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFthY3Rpb25CdXN5LCBzZXRBY3Rpb25CdXN5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbcGFydG5lcnMsIHNldFBhcnRuZXJzXSA9IHVzZVN0YXRlKFt7IHZhbHVlOiAnJywgbGFiZWw6ICdVbmFzc2lnbmVkJyB9XSlcbiAgY29uc3QgW2Jhc2VsaW5lLCBzZXRCYXNlbGluZV0gPSB1c2VTdGF0ZSgoKSA9PiBzbmFwc2hvdChpbml0aWFsUmVjb3JkPy5wYXJhbXMpKVxuICBjb25zdCBbZWRpdENvbnRhY3QsIHNldEVkaXRDb250YWN0XSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZWRpdEFkZHJlc3MsIHNldEVkaXRBZGRyZXNzXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGFjdGlvbj8ubmFtZSAhPT0gJ3Nob3cnKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgY29uc3QgbmV4dCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9zaG93XFwvPyQvLCAnL2VkaXQnKVxuICAgIGlmIChuZXh0ICE9PSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKG5leHQpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9LCBbYWN0aW9uPy5uYW1lXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBpZ25vcmUgPSBmYWxzZVxuICAgIGFwaVxuICAgICAgLnJlc291cmNlQWN0aW9uKHsgcmVzb3VyY2VJZDogJ0RlbGl2ZXJ5UGFydG5lcicsIGFjdGlvbk5hbWU6ICdsaXN0JywgcGFyYW1zOiB7IHBlclBhZ2U6IDIwMCB9IH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSByZXNwb25zZS5kYXRhPy5yZWNvcmRzIHx8IFtdXG4gICAgICAgIHNldFBhcnRuZXJzKFtcbiAgICAgICAgICB7IHZhbHVlOiAnJywgbGFiZWw6ICdVbmFzc2lnbmVkJyB9LFxuICAgICAgICAgIC4uLnJlY29yZHMubWFwKChpdGVtKSA9PiAoe1xuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uaWQgfHwgaXRlbS5wYXJhbXM/LmlkLFxuICAgICAgICAgICAgbGFiZWw6IGl0ZW0ucGFyYW1zPy5pc0FjdGl2ZSA9PT0gZmFsc2VcbiAgICAgICAgICAgICAgPyBgJHtpdGVtLnBhcmFtcz8ubmFtZSB8fCAnUGFydG5lcid9IChpbmFjdGl2ZSlgXG4gICAgICAgICAgICAgIDogaXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0UGFydG5lcnMoW3sgdmFsdWU6ICcnLCBsYWJlbDogJ1VuYXNzaWduZWQnIH1dKVxuICAgICAgfSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgaXRlbXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShwYXJhbXMuaXRlbXNKc29uIHx8ICdbXScpXG4gICAgICByZXR1cm4gcGFyc2VkLm1hcCgoaXRlbSkgPT4gKHsgLi4uaXRlbSwgaW1hZ2U6IHJlc29sdmVJbWFnZShpdGVtLmltYWdlKSB9KSlcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSwgW3BhcmFtcy5pdGVtc0pzb25dKVxuXG4gIGNvbnN0IGN1cnJlbnQgPSBzbmFwc2hvdChwYXJhbXMpXG4gIGNvbnN0IGRpcnR5ID0gT2JqZWN0LmtleXMoY3VycmVudCkuc29tZSgoa2V5KSA9PiBjdXJyZW50W2tleV0gIT09IGJhc2VsaW5lW2tleV0pXG4gIGNvbnN0IGxpc3RVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvcmVjb3Jkc1xcLy4qJC8sICcnKVxuICBjb25zdCB1bnBhaWQgPSBwYXJhbXMucGF5bWVudFN0YXR1cyAhPT0gJ3BhaWQnXG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBwaG9uZSA9IFN0cmluZyhwYXJhbXMuY29udGFjdFBob25lIHx8ICcnKS5yZXBsYWNlKC9cXEQvZywgJycpXG4gICAgY29uc3QgcGluID0gU3RyaW5nKHBhcmFtcy5hZGRyZXNzUGluY29kZSB8fCAnJykucmVwbGFjZSgvXFxEL2csICcnKVxuICAgIGlmICghU3RyaW5nKHBhcmFtcy5jb250YWN0TmFtZSB8fCAnJykudHJpbSgpIHx8IHBob25lLmxlbmd0aCA8IDEwKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnRW50ZXIgdGhlIGN1c3RvbWVyIG5hbWUgYW5kIGEgMTAtZGlnaXQgY29udGFjdCBudW1iZXIuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghU3RyaW5nKHBhcmFtcy5hZGRyZXNzTGluZTEgfHwgJycpLnRyaW0oKSB8fCAhU3RyaW5nKHBhcmFtcy5hZGRyZXNzQ2l0eSB8fCAnJykudHJpbSgpIHx8ICFTdHJpbmcocGFyYW1zLmFkZHJlc3NTdGF0ZSB8fCAnJykudHJpbSgpIHx8IHBpbi5sZW5ndGggIT09IDYpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdFbnRlciB0aGUgaG91c2UsIGNpdHksIHN0YXRlLCBhbmQgYSA2LWRpZ2l0IHBpbmNvZGUuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHNldFNhdmluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHN1Ym1pdCgpXG4gICAgICBjb25zdCBuZXh0ID0gcmVzcG9uc2U/LmRhdGE/LnJlY29yZD8ucGFyYW1zXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZXRCYXNlbGluZShzbmFwc2hvdChuZXh0KSlcbiAgICAgICAgc2V0RWRpdENvbnRhY3QoZmFsc2UpXG4gICAgICAgIHNldEVkaXRBZGRyZXNzKGZhbHNlKVxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTYXZpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcnVuUGF5bWVudEFjdGlvbiA9IGFzeW5jIChhY3Rpb25OYW1lKSA9PiB7XG4gICAgaWYgKGFjdGlvbk5hbWUgPT09ICdjb2xsZWN0Q2FzaCcgJiYgIXdpbmRvdy5jb25maXJtKCdNYXJrIHRoaXMgb3JkZXIgYXMgcGFpZCBpbiBjYXNoPycpKSByZXR1cm5cbiAgICBzZXRBY3Rpb25CdXN5KGFjdGlvbk5hbWUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLnJlY29yZEFjdGlvbih7XG4gICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLmlkLFxuICAgICAgICByZWNvcmRJZDogcmVjb3JkLmlkLFxuICAgICAgICBhY3Rpb25OYW1lLFxuICAgICAgfSlcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhPy5yZWNvcmQpIHtcbiAgICAgICAgc2V0UmVjb3JkKHJlc3BvbnNlLmRhdGEucmVjb3JkKVxuICAgICAgICBzZXRCYXNlbGluZShzbmFwc2hvdChyZXNwb25zZS5kYXRhLnJlY29yZC5wYXJhbXMpKVxuICAgICAgfVxuICAgICAgYWRkTm90aWNlKHJlc3BvbnNlLmRhdGE/Lm5vdGljZSB8fCB7IG1lc3NhZ2U6ICdVcGRhdGVkLicsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgdXBkYXRlIHBheW1lbnQuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRBY3Rpb25CdXN5KCcnKVxuICAgIH1cbiAgfVxuXG4gIGlmIChhY3Rpb24/Lm5hbWUgPT09ICdzaG93JykgcmV0dXJuIG51bGxcblxuICBjb25zdCBzdGF0dXNMYWJlbCA9IEZVTEZJTExNRU5ULmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHBhcmFtcy5zdGF0dXMpPy5sYWJlbCB8fCAnV2FpdGluZyBmb3IgZnVsZmlsbG1lbnQnXG4gIGNvbnN0IHJlc3RvcmVGaWVsZHMgPSAoa2V5cywgY2xvc2UpID0+IHtcbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgYmFzZWxpbmVba2V5XSB8fCAnJykpXG4gICAgY2xvc2UoZmFsc2UpXG4gIH1cbiAgY29uc3QgYWRkcmVzc1RleHQgPSBbXG4gICAgcGFyYW1zLmFkZHJlc3NMaW5lMSxcbiAgICBwYXJhbXMuYWRkcmVzc0xpbmUyLFxuICAgIFtwYXJhbXMuYWRkcmVzc0NpdHksIHBhcmFtcy5hZGRyZXNzU3RhdGUsIHBhcmFtcy5hZGRyZXNzUGluY29kZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJyksXG4gICAgcGFyYW1zLmFkZHJlc3NMYW5kbWFyayA/IGBMYW5kbWFyazogJHtwYXJhbXMuYWRkcmVzc0xhbmRtYXJrfWAgOiAnJyxcbiAgXS5maWx0ZXIoQm9vbGVhbilcbiAgY29uc3QgcGF5bWVudExhYmVsID0gUEFZTUVOVF9PUFRJT05TLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHBhcmFtcy5wYXltZW50U3RhdHVzKT8ubGFiZWwgfHwgJ1BlbmRpbmcnXG4gIGNvbnN0IHBhcnRuZXJOYW1lID0gcGFyYW1zLmRlbGl2ZXJ5UGFydG5lck5hbWVcbiAgICA/IGAke3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJOYW1lfSR7cGFyYW1zLmRlbGl2ZXJ5UGFydG5lclBob25lID8gYCDCtyAke3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJQaG9uZX1gIDogJyd9YFxuICAgIDogJ05vIGRlbGl2ZXJ5IHBhcnRuZXIgeWV0J1xuICBjb25zdCBpdGVtQ291bnQgPSBpdGVtcy5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgTnVtYmVyKGl0ZW0ucXVhbnRpdHkgfHwgMCksIDApXG5cbiAgcmV0dXJuIChcbiAgICA8Zm9ybSBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlclwiIG9uU3VibWl0PXtoYW5kbGVTYXZlfT5cbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdG9wXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdGl0bGVcIj5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1iYWNrXCIgaHJlZj17bGlzdFVybH0gYXJpYS1sYWJlbD1cIkJhY2sgdG8gb3JkZXJzXCI+4oaQPC9hPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXRpdGxlLXJvd1wiPlxuICAgICAgICAgICAgICA8aDI+I3twYXJhbXMub3JkZXJOb308L2gyPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1waWxsIGlzLSR7cGFyYW1zLnBheW1lbnRTdGF0dXMgfHwgJ3BlbmRpbmcnfWB9PntwYXltZW50TGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1waWxsIGlzLSR7cGFyYW1zLnN0YXR1cyB8fCAncGVuZGluZyd9YH0+e3N0YXR1c0xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHA+e2Zvcm1hdERhdGVUaW1lKHBhcmFtcy5jcmVhdGVkQXQpfTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItYWN0aW9uc1wiPlxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnZvaWNlXCJcbiAgICAgICAgICAgIGhyZWY9e2AvdG9rcmktYmFja29mZmljZS9vcmRlcnMvJHtyZWNvcmQuaWR9L2ludm9pY2U/ZG93bmxvYWQ9MWB9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB0aXRsZT1cIkRvd25sb2FkIFBERiBpbnZvaWNlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBEb3dubG9hZCBJbnZvaWNlXG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2F2ZVwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17IWRpcnR5IHx8IGxvYWRpbmcgfHwgc2F2aW5nfT5cbiAgICAgICAgICAgIHtzYXZpbmcgPyAnU2F2aW5n4oCmJyA6ICdTYXZlJ31cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8TW9yZU1lbnVcbiAgICAgICAgICAgIHVucGFpZD17dW5wYWlkfVxuICAgICAgICAgICAgYnVzeT17YWN0aW9uQnVzeX1cbiAgICAgICAgICAgIG9uQ2FzaD17KCkgPT4gcnVuUGF5bWVudEFjdGlvbignY29sbGVjdENhc2gnKX1cbiAgICAgICAgICAgIG9uUXI9eygpID0+IHJ1blBheW1lbnRBY3Rpb24oJ2dlbmVyYXRlUXInKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvaGVhZGVyPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWxheW91dFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLW1haW5cIj5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWNhcmQtaGVhZFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0b2tyaS1vcmRlci1tYXJrIGlzLSR7cGFyYW1zLnN0YXR1cyB8fCAncGVuZGluZyd9YH0gLz5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntzdGF0dXNMYWJlbH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbUNvdW50fSB7aXRlbUNvdW50ID09PSAxID8gJ2l0ZW0nIDogJ2l0ZW1zJ30gwrcge3BhcnRuZXJOYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgPExvY2FsU2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0YXR1cyB8fCAncGVuZGluZyd9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtGVUxGSUxMTUVOVH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGhhbmRsZUNoYW5nZSgnc3RhdHVzJywgdmFsdWUpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7aXRlbXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lbXB0eVwiPk5vIGl0ZW1zIG9uIHRoaXMgb3JkZXIuPC9wPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pdGVtc1wiPlxuICAgICAgICAgICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17aXRlbS5pZH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdGh1bWItd3JhcFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmltYWdlID8gPGltZyBzcmM9e2l0ZW0uaW1hZ2V9IGFsdD1cIlwiIC8+IDogPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdGh1bWJcIiAvPn1cbiAgICAgICAgICAgICAgICAgICAgICA8ZW0+e2l0ZW0ucXVhbnRpdHl9PC9lbT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57aXRlbS5uYW1lfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLndlaWdodCA/IDxzcGFuPntpdGVtLndlaWdodH08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXF0eVwiPntmb3JtYXRNb25leShpdGVtLnByaWNlVmFsdWUpfSDDlyB7aXRlbS5xdWFudGl0eX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxiPntmb3JtYXRNb25leShpdGVtLmxpbmVUb3RhbCl9PC9iPlxuICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1jYXJkLWhlYWRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdG9rcmktb3JkZXItbWFyayBpcy0ke3BhcmFtcy5wYXltZW50U3RhdHVzIHx8ICdwZW5kaW5nJ31gfSAvPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e3BheW1lbnRMYWJlbH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8c3Bhbj57cGFyYW1zLnBheW1lbnRNZXRob2QgfHwgJ0Nhc2ggb24gZGVsaXZlcnknfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgPExvY2FsU2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBheW1lbnRTdGF0dXMgfHwgJ3BlbmRpbmcnfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17UEFZTUVOVF9PUFRJT05TfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKCdwYXltZW50U3RhdHVzJywgdmFsdWUpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItdG90YWxzXCI+XG4gICAgICAgICAgICAgIDxkaXY+PGR0PlN1YnRvdGFsPC9kdD48ZGQ+e2l0ZW1Db3VudH0ge2l0ZW1Db3VudCA9PT0gMSA/ICdpdGVtJyA6ICdpdGVtcyd9PC9kZD48ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5pdGVtc1RvdGFsKX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkdD5EZWxpdmVyeXtwYXJhbXMuZGVsaXZlcnlPcHRpb24gPyBgIMK3ICR7cGFyYW1zLmRlbGl2ZXJ5T3B0aW9uID09PSAnZXhwcmVzcycgPyAnOTAtbWludXRlJyA6ICdNb3JuaW5nJ31gIDogJyd9PC9kdD5cbiAgICAgICAgICAgICAgICA8ZGQgLz5cbiAgICAgICAgICAgICAgICA8ZGQ+e3BhcmFtcy5mcmVlRGVsaXZlcnlBcHBsaWVkIHx8IE51bWJlcihwYXJhbXMuZGVsaXZlcnlDaGFyZ2UpID09PSAwID8gJ0ZyZWUgKFdlbGNvbWUgb2ZmZXIpJyA6IGZvcm1hdE1vbmV5KHBhcmFtcy5kZWxpdmVyeUNoYXJnZSl9PC9kZD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+PGR0PkhhbmRsaW5nPC9kdD48ZGQgLz48ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5oYW5kbGluZ0NoYXJnZSl9PC9kZD48L2Rpdj5cbiAgICAgICAgICAgICAge051bWJlcihwYXJhbXMudGF4VG90YWwpID4gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGR0PlRheGVzIChHU1Qpe3BhcmFtcy5pc0ludGVyU3RhdGUgPyAnIMK3IElHU1QnIDogJyDCtyBDR1NUK1NHU1QnfTwvZHQ+XG4gICAgICAgICAgICAgICAgICA8ZGQgLz5cbiAgICAgICAgICAgICAgICAgIDxkZD57Zm9ybWF0TW9uZXkocGFyYW1zLnRheFRvdGFsKX08L2RkPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAge051bWJlcihwYXJhbXMuc21hbGxDYXJ0Q2hhcmdlKSA+IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdj48ZHQ+U21hbGwgY2FydDwvZHQ+PGRkIC8+PGRkPntmb3JtYXRNb25leShwYXJhbXMuc21hbGxDYXJ0Q2hhcmdlKX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAge051bWJlcihwYXJhbXMuZGlzY291bnQpID4gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2PjxkdD5EaXNjb3VudHtwYXJhbXMuY291cG9uQ29kZSA/IGAgwrcgJHtwYXJhbXMuY291cG9uQ29kZX1gIDogJyd9PC9kdD48ZGQgLz48ZGQ+LXtmb3JtYXRNb25leShwYXJhbXMuZGlzY291bnQpfTwvZGQ+PC9kaXY+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlzLXRvdGFsXCI+PGR0PlRvdGFsPC9kdD48ZGQgLz48ZGQ+e2Zvcm1hdE1vbmV5KHBhcmFtcy5ncmFuZFRvdGFsKX08L2RkPjwvZGl2PlxuICAgICAgICAgICAgPC9kbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY29sbGVjdGVkXCI+XG4gICAgICAgICAgICAgIDxzcGFuPntwYXJhbXMucGF5bWVudFN0YXR1cyA9PT0gJ3BhaWQnID8gJ1BhaWQgYnkgY3VzdG9tZXInIDogJ1N0aWxsIHRvIGNvbGxlY3QnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGI+e2Zvcm1hdE1vbmV5KHBhcmFtcy5ncmFuZFRvdGFsKX08L2I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtwYXJhbXMucGF5bWVudENvbGxlY3RlZEFzID8gPHAgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItbWV0YVwiPkNvbGxlY3RlZCBhcyB7cGFyYW1zLnBheW1lbnRDb2xsZWN0ZWRBc308L3A+IDogbnVsbH1cbiAgICAgICAgICAgIHtwYXJhbXMucmF6b3JwYXlQYXltZW50SWQgPyA8cCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1tZXRhXCI+UGF5bWVudCBJRCB7cGFyYW1zLnJhem9ycGF5UGF5bWVudElkfTwvcD4gOiBudWxsfVxuICAgICAgICAgICAge3BhcmFtcy5yYXpvcnBheVFyVXJsID8gKFxuICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXFyXCIgc3JjPXtwYXJhbXMucmF6b3JwYXlRclVybH0gYWx0PVwiRG9vcnN0ZXAgcGF5bWVudCBRUlwiIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxhc2lkZSBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zaWRlXCI+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktb3JkZXItY2FyZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zZWN0aW9uLWhlYWRcIj5cbiAgICAgICAgICAgICAgPGgzPkN1c3RvbWVyPC9oMz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zZWN0aW9uLWhlYWRcIj5cbiAgICAgICAgICAgICAgPGg0PkNvbnRhY3Q8L2g0PlxuICAgICAgICAgICAgICB7ZWRpdENvbnRhY3QgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlc3RvcmVGaWVsZHMoWydjb250YWN0TmFtZScsICdjb250YWN0UGhvbmUnXSwgc2V0RWRpdENvbnRhY3QpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWVkaXRcIiBvbkNsaWNrPXsoKSA9PiBzZXRFZGl0Q29udGFjdCh0cnVlKX0+XG4gICAgICAgICAgICAgICAgICBFZGl0XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtlZGl0Q29udGFjdCA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0LWZpZWxkc1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jb250YWN0TmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdjb250YWN0TmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICBQaG9uZSBudW1iZXJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIGlucHV0TW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNvbnRhY3RQaG9uZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdjb250YWN0UGhvbmUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItcmVhZFwiPlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e3BhcmFtcy5jb250YWN0TmFtZSB8fCAn4oCUJ308L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8cD57cGFyYW1zLmNvbnRhY3RQaG9uZSA/IGArOTEgJHtwYXJhbXMuY29udGFjdFBob25lfWAgOiAn4oCUJ308L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1zZWN0aW9uLWhlYWRcIj5cbiAgICAgICAgICAgICAgPGg0PlNoaXBwaW5nIGFkZHJlc3M8L2g0PlxuICAgICAgICAgICAgICB7ZWRpdEFkZHJlc3MgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlc3RvcmVGaWVsZHMoXG4gICAgICAgICAgICAgICAgICAgIFsnYWRkcmVzc0xpbmUxJywgJ2FkZHJlc3NMaW5lMicsICdhZGRyZXNzQ2l0eScsICdhZGRyZXNzU3RhdGUnLCAnYWRkcmVzc1BpbmNvZGUnLCAnYWRkcmVzc0xhbmRtYXJrJ10sXG4gICAgICAgICAgICAgICAgICAgIHNldEVkaXRBZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1lZGl0XCIgb25DbGljaz17KCkgPT4gc2V0RWRpdEFkZHJlc3ModHJ1ZSl9PlxuICAgICAgICAgICAgICAgICAgRWRpdFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ZWRpdEFkZHJlc3MgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZWRpdC1maWVsZHNcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIEhvdXNlIC8gZmxhdFxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTEgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0xpbmUxJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktb3JkZXItZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIFN0cmVldCAvIGFyZWFcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWRkcmVzc0xpbmUyIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBoYW5kbGVDaGFuZ2UoJ2FkZHJlc3NMaW5lMicsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1hZGRyZXNzLWdyaWRcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaXR5XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NDaXR5IHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc0NpdHknLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBTdGF0ZVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzU3RhdGUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzU3RhdGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBQaW5jb2RlXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NQaW5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IGhhbmRsZUNoYW5nZSgnYWRkcmVzc1BpbmNvZGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICBMYW5kbWFya1xuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1vcmRlci1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGFuZG1hcmsgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gaGFuZGxlQ2hhbmdlKCdhZGRyZXNzTGFuZG1hcmsnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW9yZGVyLXJlYWRcIj5cbiAgICAgICAgICAgICAgICB7YWRkcmVzc1RleHQubGVuZ3RoID8gYWRkcmVzc1RleHQubWFwKChsaW5lKSA9PiA8cCBrZXk9e2xpbmV9PntsaW5lfTwvcD4pIDogPHA+4oCUPC9wPn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGg0PkRlbGl2ZXJ5IHBhcnRuZXI8L2g0PlxuICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5kZWxpdmVyeVBhcnRuZXJJZCB8fCAnJ31cbiAgICAgICAgICAgICAgb3B0aW9ucz17cGFydG5lcnN9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUpID0+IGhhbmRsZUNoYW5nZSgnZGVsaXZlcnlQYXJ0bmVySWQnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVW5hc3NpZ25lZFwiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIHBhcnRuZXJzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2FzaWRlPlxuICAgICAgPC9kaXY+XG4gICAgPC9mb3JtPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE9yZGVyRGV0YWlsXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSW5wdXQsIExhYmVsLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IEV5ZUljb24gPSAoeyBoaWRkZW4gfSkgPT5cbiAgaGlkZGVuID8gKFxuICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHBhdGggZD1cIk0zIDNsMTggMThcIiAvPlxuICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICA8cGF0aCBkPVwiTTkuOSA0LjJBMTAuNyAxMC43IDAgMCAxIDEyIDRjNSAwIDkgNC41IDEwIDhhMTIuOCAxMi44IDAgMCAxLTIuMSAzLjZcIiAvPlxuICAgICAgPHBhdGggZD1cIk02LjYgNi42QzQuMyA4IDIuNyAxMC4yIDIgMTJjMSAzLjUgNSA4IDEwIDggMS41IDAgMi45LS40IDQuMS0xXCIgLz5cbiAgICA8L3N2Zz5cbiAgKSA6IChcbiAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxwYXRoIGQ9XCJNMiAxMnM0LTcgMTAtNyAxMCA3IDEwIDctNCA3LTEwIDdTMiAxMiAyIDEyelwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIiAvPlxuICAgIDwvc3ZnPlxuICApXG5cbmZ1bmN0aW9uIFBhc3N3b3JkRmllbGQoeyBpZCwgbGFiZWwsIHZhbHVlLCBvbkNoYW5nZSwgdmlzaWJsZSwgb25Ub2dnbGUgfSkge1xuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgPExhYmVsIGh0bWxGb3I9e2lkfSByZXF1aXJlZD57bGFiZWx9PC9MYWJlbD5cbiAgICAgIDxCb3ggcG9zaXRpb249XCJyZWxhdGl2ZVwiIHdpZHRoPVwiMTAwJVwiPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgdHlwZT17dmlzaWJsZSA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IG9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgYXV0b0NvbXBsZXRlPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPXt2aXNpYmxlID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICAgICAgdG9wOiAnNTAlJyxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxuICAgICAgICAgICAgYm9yZGVyOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzA0Nzg1NycsXG4gICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAyNixcbiAgICAgICAgICAgIGhlaWdodDogMjYsXG4gICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RXllSWNvbiBoaWRkZW49e3Zpc2libGV9IC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCBbcGFzc3dvcmQsIHNldFBhc3N3b3JkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbY29uZmlybVBhc3N3b3JkLCBzZXRDb25maXJtUGFzc3dvcmRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3Nob3dDb25maXJtLCBzZXRTaG93Q29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NhdmluZywgc2V0U2F2aW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKCcnKVxuXG4gIGNvbnN0IGNsb3NlID0gKCkgPT4ge1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKVxuICB9XG5cbiAgY29uc3Qgc2F2ZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBzZXRFcnJvcignJylcbiAgICBpZiAoIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA8IDYpIHtcbiAgICAgIHNldEVycm9yKCdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycy4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkKSB7XG4gICAgICBzZXRFcnJvcignTmV3IHBhc3N3b3JkIGFuZCBjb25maXJtIHBhc3N3b3JkIG11c3QgYmUgdGhlIHNhbWUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFNhdmluZyh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZTogJ2NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IHsgcGFzc3dvcmQsIGNvbmZpcm1QYXNzd29yZCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlLmRhdGE/Lm5vdGljZVxuICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICBzZXRFcnJvcihub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobm90aWNlKSBhZGROb3RpY2Uobm90aWNlKVxuICAgICAgY29uc3QgcmVkaXJlY3RVcmwgPSByZXNwb25zZS5kYXRhPy5yZWRpcmVjdFVybFxuICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVkaXJlY3RVcmxcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjbG9zZSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgcGFzc3dvcmQuJylcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0U2F2aW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveFxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIGluc2V0OiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyLCAxMiwgOCwgMC42MiknLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIHpJbmRleDogODAsXG4gICAgICAgIHBhZGRpbmc6IDE2LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGFzPVwiZm9ybVwiXG4gICAgICAgIG9uU3VibWl0PXtzYXZlfVxuICAgICAgICBiZz1cIndoaXRlXCJcbiAgICAgICAgd2lkdGg9e1snMTAwJScsICc0MjBweCddfVxuICAgICAgICBwPVwieGxcIlxuICAgICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6IDE2LCBib3hTaGFkb3c6ICcwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4yOCknIH19XG4gICAgICA+XG4gICAgICAgIDxIMyBtYj1cInNtXCI+Q2hhbmdlIHBhc3N3b3JkPC9IMz5cbiAgICAgICAgPFRleHQgbWI9XCJ4bFwiIGNvbG9yPVwiIzY0NzQ4YlwiPlxuICAgICAgICAgIFNldCBhIG5ldyBwYXNzd29yZCBmb3Ige3JlY29yZD8ucGFyYW1zPy5uYW1lIHx8IHJlY29yZD8ucGFyYW1zPy5lbWFpbCB8fCAndGhpcyB1c2VyJ30uXG4gICAgICAgIDwvVGV4dD5cblxuICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgIGlkPVwibmV3LXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIk5ldyBwYXNzd29yZFwiXG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRQYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93UGFzc3dvcmR9XG4gICAgICAgICAgb25Ub2dnbGU9eygpID0+IHNldFNob3dQYXNzd29yZCgodmFsdWUpID0+ICF2YWx1ZSl9XG4gICAgICAgIC8+XG4gICAgICAgIDxQYXNzd29yZEZpZWxkXG4gICAgICAgICAgaWQ9XCJjb25maXJtLXBhc3N3b3JkXCJcbiAgICAgICAgICBsYWJlbD1cIkNvbmZpcm0gcGFzc3dvcmRcIlxuICAgICAgICAgIHZhbHVlPXtjb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldENvbmZpcm1QYXNzd29yZH1cbiAgICAgICAgICB2aXNpYmxlPXtzaG93Q29uZmlybX1cbiAgICAgICAgICBvblRvZ2dsZT17KCkgPT4gc2V0U2hvd0NvbmZpcm0oKHZhbHVlKSA9PiAhdmFsdWUpfVxuICAgICAgICAvPlxuXG4gICAgICAgIHtlcnJvciA/IChcbiAgICAgICAgICA8VGV4dCBtYj1cImxnXCIgY29sb3I9XCIjZGMyNjI2XCI+e2Vycm9yfTwvVGV4dD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwiZmxleC1lbmRcIiBzdHlsZT17eyBnYXA6IDEwIH19PlxuICAgICAgICAgIDxCdXR0b24gdHlwZT1cImJ1dHRvblwiIHZhcmlhbnQ9XCJ0ZXh0XCIgb25DbGljaz17Y2xvc2V9IGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgdmFyaWFudD1cImNvbnRhaW5lZFwiIGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAge3NhdmluZyA/ICdTYXZpbmfigKYnIDogJ1NhdmUgcGFzc3dvcmQnfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVBhc3N3b3JkXG4iLCIvKiogSVNPIDMxNjYtMjpJTiBjb2Rlcy4gS2VwdCBuZXh0IHRvIHRoZSBBZG1pbkpTIGZvcm0gc28gdGhlIGRyb3Bkb3duIGFsd2F5cyBoYXMgZXZlcnkgc3RhdGUuICovXG5leHBvcnQgY29uc3QgSU5ESUFfU1RBVEVTID0gW1xuICB7IGNvZGU6ICdBTicsIG5hbWU6ICdBbmRhbWFuIGFuZCBOaWNvYmFyIElzbGFuZHMnIH0sXG4gIHsgY29kZTogJ0FQJywgbmFtZTogJ0FuZGhyYSBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdBUicsIG5hbWU6ICdBcnVuYWNoYWwgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnQVMnLCBuYW1lOiAnQXNzYW0nIH0sXG4gIHsgY29kZTogJ0JSJywgbmFtZTogJ0JpaGFyJyB9LFxuICB7IGNvZGU6ICdDSCcsIG5hbWU6ICdDaGFuZGlnYXJoJyB9LFxuICB7IGNvZGU6ICdDVCcsIG5hbWU6ICdDaGhhdHRpc2dhcmgnIH0sXG4gIHsgY29kZTogJ0RIJywgbmFtZTogJ0RhZHJhIGFuZCBOYWdhciBIYXZlbGkgYW5kIERhbWFuIGFuZCBEaXUnIH0sXG4gIHsgY29kZTogJ0RMJywgbmFtZTogJ0RlbGhpJyB9LFxuICB7IGNvZGU6ICdHQScsIG5hbWU6ICdHb2EnIH0sXG4gIHsgY29kZTogJ0dKJywgbmFtZTogJ0d1amFyYXQnIH0sXG4gIHsgY29kZTogJ0hSJywgbmFtZTogJ0hhcnlhbmEnIH0sXG4gIHsgY29kZTogJ0hQJywgbmFtZTogJ0hpbWFjaGFsIFByYWRlc2gnIH0sXG4gIHsgY29kZTogJ0pLJywgbmFtZTogJ0phbW11IGFuZCBLYXNobWlyJyB9LFxuICB7IGNvZGU6ICdKSCcsIG5hbWU6ICdKaGFya2hhbmQnIH0sXG4gIHsgY29kZTogJ0tBJywgbmFtZTogJ0thcm5hdGFrYScgfSxcbiAgeyBjb2RlOiAnS0wnLCBuYW1lOiAnS2VyYWxhJyB9LFxuICB7IGNvZGU6ICdMQScsIG5hbWU6ICdMYWRha2gnIH0sXG4gIHsgY29kZTogJ0xEJywgbmFtZTogJ0xha3NoYWR3ZWVwJyB9LFxuICB7IGNvZGU6ICdNUCcsIG5hbWU6ICdNYWRoeWEgUHJhZGVzaCcgfSxcbiAgeyBjb2RlOiAnTUgnLCBuYW1lOiAnTWFoYXJhc2h0cmEnIH0sXG4gIHsgY29kZTogJ01OJywgbmFtZTogJ01hbmlwdXInIH0sXG4gIHsgY29kZTogJ01MJywgbmFtZTogJ01lZ2hhbGF5YScgfSxcbiAgeyBjb2RlOiAnTVonLCBuYW1lOiAnTWl6b3JhbScgfSxcbiAgeyBjb2RlOiAnTkwnLCBuYW1lOiAnTmFnYWxhbmQnIH0sXG4gIHsgY29kZTogJ09SJywgbmFtZTogJ09kaXNoYScgfSxcbiAgeyBjb2RlOiAnUFknLCBuYW1lOiAnUHVkdWNoZXJyeScgfSxcbiAgeyBjb2RlOiAnUEInLCBuYW1lOiAnUHVuamFiJyB9LFxuICB7IGNvZGU6ICdSSicsIG5hbWU6ICdSYWphc3RoYW4nIH0sXG4gIHsgY29kZTogJ1NLJywgbmFtZTogJ1Npa2tpbScgfSxcbiAgeyBjb2RlOiAnVE4nLCBuYW1lOiAnVGFtaWwgTmFkdScgfSxcbiAgeyBjb2RlOiAnVEcnLCBuYW1lOiAnVGVsYW5nYW5hJyB9LFxuICB7IGNvZGU6ICdUUicsIG5hbWU6ICdUcmlwdXJhJyB9LFxuICB7IGNvZGU6ICdVUCcsIG5hbWU6ICdVdHRhciBQcmFkZXNoJyB9LFxuICB7IGNvZGU6ICdVVCcsIG5hbWU6ICdVdHRhcmFraGFuZCcgfSxcbiAgeyBjb2RlOiAnV0InLCBuYW1lOiAnV2VzdCBCZW5nYWwnIH0sXG5dXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTG9jYWxTZWxlY3QsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuaW1wb3J0IHsgSU5ESUFfU1RBVEVTIH0gZnJvbSAnLi9pbmRpYS1zdGF0ZXMuanMnXG5cbmNvbnN0IFZFSElDTEVfVFlQRVMgPSBbXG4gIHsgdmFsdWU6ICdCaWtlJywgbGFiZWw6ICdCaWtlJyB9LFxuICB7IHZhbHVlOiAnU2Nvb3RlcicsIGxhYmVsOiAnU2Nvb3RlcicgfSxcbiAgeyB2YWx1ZTogJ0VsZWN0cmljIGJpa2UnLCBsYWJlbDogJ0VsZWN0cmljIGJpa2UnIH0sXG4gIHsgdmFsdWU6ICdDeWNsZScsIGxhYmVsOiAnQ3ljbGUnIH0sXG4gIHsgdmFsdWU6ICdWYW4nLCBsYWJlbDogJ1ZhbicgfSxcbiAgeyB2YWx1ZTogJ090aGVyJywgbGFiZWw6ICdPdGhlcicgfSxcbl1cblxuY29uc3QgU1RBVEVfT1BUSU9OUyA9IElORElBX1NUQVRFUy5tYXAoKGl0ZW0pID0+ICh7XG4gIHZhbHVlOiBpdGVtLm5hbWUsXG4gIGxhYmVsOiBpdGVtLm5hbWUsXG59KSlcblxuZnVuY3Rpb24gRmllbGRFcnJvcih7IGVycm9yIH0pIHtcbiAgaWYgKCFlcnJvcj8ubWVzc2FnZSkgcmV0dXJuIG51bGxcbiAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9yLm1lc3NhZ2V9PC9zcGFuPlxufVxuXG5jb25zdCBQYXJ0bmVyRWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZDogaW5pdGlhbFJlY29yZCwgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzTmV3ID0gYWN0aW9uPy5uYW1lID09PSAnbmV3JyB8fCAhcmVjb3JkPy5pZFxuICBjb25zdCByZWFkT25seSA9IGFjdGlvbj8ubmFtZSA9PT0gJ3Nob3cnXG4gIGNvbnN0IGhhc1Bhc3N3b3JkID0gQm9vbGVhbihwYXJhbXMuaGFzUGFzc3dvcmQpXG4gIGNvbnN0IGlzQWN0aXZlID0gaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpXG4gICAgPyB0cnVlXG4gICAgOiBpc0ZsYWdPbihwYXJhbXMuaXNBY3RpdmUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ2lzQWN0aXZlJywgdHJ1ZSlcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNOZXddKVxuXG4gIGNvbnN0IGVycm9ycyA9IHVzZU1lbW8oKCkgPT4gcmVjb3JkPy5lcnJvcnMgfHwge30sIFtyZWNvcmQ/LmVycm9yc10pXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwYXJ0bmVyJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogaXNOZXdcbiAgICAgICAgICAgID8gJ1BhcnRuZXIgc2F2ZWQuIEEgcGFzc3dvcmQgZW1haWwgd2lsbCBiZSBzZW50IGlmIHRoZXkgZG8gbm90IGhhdmUgYSBwYXNzd29yZCB5ZXQuJ1xuICAgICAgICAgICAgOiAnUGFydG5lciB1cGRhdGVkJyxcbiAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0NvdWxkIG5vdCBzYXZlIHBhcnRuZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntpc05ldyA/ICdBZGQgZGVsaXZlcnkgcGFydG5lcicgOiBwYXJhbXMubmFtZSB8fCAnRGVsaXZlcnkgcGFydG5lcid9PC9IMz5cbiAgICAgICAgPFRleHQgY29sb3I9XCJ3aGl0ZVwiPlxuICAgICAgICAgIENvbGxlY3QgZnVsbCBLWUMgYW5kIGNvbnRhY3QgZGV0YWlscy4gVGhleSBsb2cgaW4gdG8gdGhlIFRva3JpaWkgUGFydG5lciBhcHAgd2l0aCB0aGlzIGVtYWlsXG4gICAgICAgICAgYWZ0ZXIgc2V0dGluZyBhIHBhc3N3b3JkIGZyb20gdGhlIGludml0ZSBtYWlsLlxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5BY2NvdW50IHN0YXR1czwvaDQ+XG4gICAgICAgICAgPHA+SW5hY3RpdmUgcGFydG5lcnMgY2Fubm90IGxvZyBpbiwgZXZlbiBpZiB0aGV5IGFscmVhZHkgc2V0IGEgcGFzc3dvcmQuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWN0aXZlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgdGl0bGU9e2lzQWN0aXZlID8gJ0FjdGl2ZScgOiAnSW5hY3RpdmUnfVxuICAgICAgICAgICAgaGludD17aXNBY3RpdmUgPyAnQ2FuIHNpZ24gaW4gdG8gdGhlIHBhcnRuZXIgYXBwJyA6ICdMb2dpbiBpcyBibG9ja2VkIHVudGlsIHlvdSB0dXJuIHRoaXMgb24nfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHshaXNOZXcgPyAoXG4gICAgICAgICAgICA8VGV4dCBtdD1cImxnXCIgb3BhY2l0eT17MC43fT5cbiAgICAgICAgICAgICAge2hhc1Bhc3N3b3JkID8gJ1Bhc3N3b3JkIGlzIGFscmVhZHkgc2V0LicgOiAnTm8gcGFzc3dvcmQgeWV0IOKAlCBzZW5kIHRoZSBpbnZpdGUgZW1haWwgYWZ0ZXIgc2F2aW5nLid9XG4gICAgICAgICAgICA8L1RleHQ+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5Mb2dpbiBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8cD5FbWFpbCBpcyB1c2VkIHRvIGNyZWF0ZSBhbmQgcmVzZXQgdGhlIHBhcnRuZXIgcGFzc3dvcmQuIE5vIFNNUyBpcyBzZW50LjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBFbWFpbFxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5lbWFpbCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2VtYWlsJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJwYXJ0bmVyQGV4YW1wbGUuY29tXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3JzLmVtYWlsID8gPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5lbWFpbH0gLz4gOiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5QYXNzd29yZCBsaW5rIGlzIHNlbnQgdG8gdGhpcyBpbmJveDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBNb2JpbGUgbnVtYmVyXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTB9XG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5waG9uZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ3Bob25lJywgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJykuc2xpY2UoMCwgMTApKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIxMC1kaWdpdCBudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMucGhvbmV9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5QZXJzb25hbCBkZXRhaWxzPC9oND5cbiAgICAgICAgPHA+TmFtZSBpcyBzaG93biBvbiBvcmRlcnMuIEZhdGhlciZhcG9zO3MgbmFtZSBhbmQgRE9CIGhlbHAgd2l0aCBLWUMgcmVjb3Jkcy48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEZ1bGwgbmFtZVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGFydG5lciBmdWxsIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMubmFtZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEZhdGhlciZhcG9zO3MgLyBndWFyZGlhbiBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZmF0aGVyTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2ZhdGhlck5hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFzIG9uIEFhZGhhYXIgLyBkb2N1bWVudHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgIERhdGUgb2YgYmlydGggPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcbiAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZGF0ZU9mQmlydGggfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZGF0ZU9mQmlydGgnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5LWUMgZG9jdW1lbnRzPC9oND5cbiAgICAgICAgPHA+UEFOIGFuZCBBYWRoYWFyIGFyZSByZXF1aXJlZCBmb3IgcGFydG5lciBvbmJvYXJkaW5nLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgUEFOIG51bWJlclxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXsxMH1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5wYW5OdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3Bhbk51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL1teQS1aMC05XS9nLCAnJykuc2xpY2UoMCwgMTApKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQUJDREUxMjM0RlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5wYW5OdW1iZXJ9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBYWRoYWFyIG51bWJlclxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MTJ9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuYWFkaGFhck51bWJlciB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnYWFkaGFhck51bWJlcicsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDEyKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjEyLWRpZ2l0IEFhZGhhYXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuYWFkaGFhck51bWJlcn0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkN1cnJlbnQgYWRkcmVzczwvaDQ+XG4gICAgICAgIDxwPldoZXJlIHRoZSBwYXJ0bmVyIGN1cnJlbnRseSBsaXZlcyAvIG9wZXJhdGVzIGZyb20uPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBZGRyZXNzIGxpbmUgMVxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hZGRyZXNzTGluZTEgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhZGRyZXNzTGluZTEnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkhvdXNlIC8gc3RyZWV0IC8gYXJlYVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5hZGRyZXNzTGluZTF9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBZGRyZXNzIGxpbmUgMiA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFkZHJlc3NMaW5lMiB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2FkZHJlc3NMaW5lMicsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTGFuZG1hcmssIGNvbG9ueVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDaXR5XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNpdHkgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjaXR5JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJDaXR5XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLmNpdHl9IC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQaW5jb2RlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXs2fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBpbmNvZGUgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdwaW5jb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJykuc2xpY2UoMCwgNikpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjYtZGlnaXQgcGluY29kZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5waW5jb2RlfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgU3RhdGVcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogNiB9fT5cbiAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnN0YXRlIHx8ICcnfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbeyB2YWx1ZTogJycsIGxhYmVsOiAnU2VsZWN0IHN0YXRlJyB9LCAuLi5TVEFURV9PUFRJT05TXX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnc3RhdGUnLCBuZXh0KX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnN0YXRlfSAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgUGVybWFuZW50IGFkZHJlc3MgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0IHRva3JpLXRleHRhcmVhXCJcbiAgICAgICAgICAgIHJvd3M9ezN9XG4gICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBlcm1hbmVudEFkZHJlc3MgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGVybWFuZW50QWRkcmVzcycsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIklmIGRpZmZlcmVudCBmcm9tIGN1cnJlbnQgYWRkcmVzc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5FbWVyZ2VuY3kgY29udGFjdDwvaDQ+XG4gICAgICAgICAgPHA+U29tZW9uZSB3ZSBjYW4gY2FsbCBpZiB0aGUgcGFydG5lciBpcyB1bnJlYWNoYWJsZS48L3A+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgQ29udGFjdCBuYW1lIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZW1lcmdlbmN5TmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2VtZXJnZW5jeU5hbWUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlJlbGF0aXZlIC8gZnJpZW5kIG5hbWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENvbnRhY3QgbW9iaWxlIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICBpbnB1dE1vZGU9XCJudW1lcmljXCJcbiAgICAgICAgICAgICAgbWF4TGVuZ3RoPXsxMH1cbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmVtZXJnZW5jeVBob25lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCdlbWVyZ2VuY3lQaG9uZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDEwKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjEwLWRpZ2l0IG51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5lbWVyZ2VuY3lQaG9uZX0gLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+VmVoaWNsZSBkZXRhaWxzPC9oND5cbiAgICAgICAgICA8cD5Vc2VkIGZvciBkZWxpdmVyeSBhc3NpZ25tZW50IGFuZCBzdXBwb3J0LjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBWZWhpY2xlIHR5cGUgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYgfX0+XG4gICAgICAgICAgICAgIDxMb2NhbFNlbGVjdFxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMudmVoaWNsZVR5cGUgfHwgJyd9XG4gICAgICAgICAgICAgICAgb3B0aW9ucz17W3sgdmFsdWU6ICcnLCBsYWJlbDogJ1NlbGVjdCB2ZWhpY2xlJyB9LCAuLi5WRUhJQ0xFX1RZUEVTXX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCd2ZWhpY2xlVHlwZScsIG5leHQpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgVmVoaWNsZSBudW1iZXIgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy52ZWhpY2xlTnVtYmVyIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIHNldEZpZWxkKCd2ZWhpY2xlTnVtYmVyJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkuc2xpY2UoMCwgMjApKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBNSDEyQUIxMjM0XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5CYW5rIGRldGFpbHM8L2g0PlxuICAgICAgICA8cD5Gb3IgcGF5b3V0cyBhbmQgcmVpbWJ1cnNlbWVudHMuIE9wdGlvbmFsIGZvciBub3csIGJ1dCByZWNvbW1lbmRlZC48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEFjY291bnQgaG9sZGVyIG5hbWUgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5hY2NvdW50SG9sZGVyTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2FjY291bnRIb2xkZXJOYW1lJywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBcyBwZXIgYmFuayBhY2NvdW50XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBBY2NvdW50IG51bWJlciA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFjY291bnROdW1iZXIgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdhY2NvdW50TnVtYmVyJywgZXZlbnQudGFyZ2V0LnZhbHVlLnJlcGxhY2UoL1xccysvZywgJycpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJCYW5rIGFjY291bnQgbnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBJRlNDIGNvZGUgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktb3B0aW9uYWxcIj4ob3B0aW9uYWwpPC9zcGFuPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgIG1heExlbmd0aD17MTF9XG4gICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmlmc2NDb2RlIHx8ICcnfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgc2V0RmllbGQoJ2lmc2NDb2RlJywgZXZlbnQudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvW15BLVowLTldL2csICcnKS5zbGljZSgwLCAxMSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNCSU4wMDAxMjM0XCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuaWZzY0NvZGV9IC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgIDxoND5JbnRlcm5hbCBub3RlczwvaDQ+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICBOb3RlcyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXQgdG9rcmktdGV4dGFyZWFcIlxuICAgICAgICAgICAgcm93cz17NH1cbiAgICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMubm90ZXMgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbm90ZXMnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaGlmdCB0aW1pbmcsIGh1Yiwgb3IgYW55dGhpbmcgeW91ciB0ZWFtIHNob3VsZCByZW1lbWJlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAge3JlYWRPbmx5ID8gbnVsbCA6IChcbiAgICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cImNvbnRhaW5lZFwiIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICAgIHtpc05ldyA/ICdDcmVhdGUgcGFydG5lcicgOiAnU2F2ZSBwYXJ0bmVyJ31cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhcnRuZXJFZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEgzLCBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IEFwaUNsaWVudCwgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgU2VhcmNoYWJsZVNlbGVjdCwgU3RhdHVzU3dpdGNoLCBpc0ZsYWdPbiB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5pbXBvcnQgeyBJTkRJQV9TVEFURVMgfSBmcm9tICcuL2luZGlhLXN0YXRlcy5qcydcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IFNUQVRFX09QVElPTlMgPSBJTkRJQV9TVEFURVMubWFwKChpdGVtKSA9PiAoe1xuICB2YWx1ZTogaXRlbS5jb2RlLFxuICBsYWJlbDogYCR7aXRlbS5uYW1lfSAoJHtpdGVtLmNvZGV9KWAsXG59KSlcblxuY29uc3QgUGluY29kZUVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlLCBhY3Rpb24gfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IHsgcmVjb3JkLCBoYW5kbGVDaGFuZ2UsIHN1Ym1pdDogaGFuZGxlU3VibWl0LCBsb2FkaW5nIH0gPSB1c2VSZWNvcmQoXG4gICAgaW5pdGlhbFJlY29yZCxcbiAgICByZXNvdXJjZS5pZCxcbiAgKVxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fVxuICBjb25zdCBpc05ldyA9IGFjdGlvbj8ubmFtZSA9PT0gJ25ldycgfHwgIXJlY29yZD8uaWRcbiAgY29uc3QgcmVhZE9ubHkgPSBhY3Rpb24/Lm5hbWUgPT09ICdzaG93J1xuICBjb25zdCBpc0FjdGl2ZSA9IGlzTmV3ICYmIChwYXJhbXMuaXNBY3RpdmUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuaXNBY3RpdmUgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuICBjb25zdCBtb3JuaW5nRW5hYmxlZCA9IGlzTmV3ICYmIChwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMubW9ybmluZ0VuYWJsZWQgPT09ICcnKVxuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLm1vcm5pbmdFbmFibGVkKVxuICBjb25zdCBleHByZXNzRW5hYmxlZCA9IGlzTmV3ICYmIChwYXJhbXMuZXhwcmVzc0VuYWJsZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZXhwcmVzc0VuYWJsZWQgPT09ICcnKVxuICAgID8gZmFsc2VcbiAgICA6IGlzRmxhZ09uKHBhcmFtcy5leHByZXNzRW5hYmxlZClcbiAgY29uc3QgW3BhcnRuZXJzLCBzZXRQYXJ0bmVyc10gPSB1c2VTdGF0ZShbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJykpIHtcbiAgICAgIGhhbmRsZUNoYW5nZSgnaXNBY3RpdmUnLCB0cnVlKVxuICAgIH1cbiAgICBpZiAoaXNOZXcgJiYgKHBhcmFtcy5tb3JuaW5nRW5hYmxlZCA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5tb3JuaW5nRW5hYmxlZCA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ21vcm5pbmdFbmFibGVkJywgdHJ1ZSlcbiAgICB9XG4gICAgaWYgKGlzTmV3ICYmIChwYXJhbXMuZXhwcmVzc0VuYWJsZWQgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZXhwcmVzc0VuYWJsZWQgPT09ICcnKSkge1xuICAgICAgaGFuZGxlQ2hhbmdlKCdleHByZXNzRW5hYmxlZCcsIGZhbHNlKVxuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc05ld10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICBhcGlcbiAgICAgIC5yZXNvdXJjZUFjdGlvbih7IHJlc291cmNlSWQ6ICdEZWxpdmVyeVBhcnRuZXInLCBhY3Rpb25OYW1lOiAnbGlzdCcsIHBhcmFtczogeyBwZXJQYWdlOiAyMDAgfSB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChpZ25vcmUpIHJldHVyblxuICAgICAgICBjb25zdCByZWNvcmRzID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkcyB8fCBbXVxuICAgICAgICBzZXRQYXJ0bmVycyhcbiAgICAgICAgICByZWNvcmRzLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmlkIHx8IGl0ZW0ucGFyYW1zPy5pZCxcbiAgICAgICAgICAgIGxhYmVsOiBpc0ZsYWdPbihpdGVtLnBhcmFtcz8uaXNBY3RpdmUpXG4gICAgICAgICAgICAgID8gaXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInXG4gICAgICAgICAgICAgIDogYCR7aXRlbS5wYXJhbXM/Lm5hbWUgfHwgJ1BhcnRuZXInfSAoaW5hY3RpdmUpYCxcbiAgICAgICAgICB9KSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWlnbm9yZSkgc2V0UGFydG5lcnMoW10pXG4gICAgICB9KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBwYXJ0bmVySWQgPSBwYXJhbXMucGFydG5lcklkIHx8IHBhcmFtcy5wYXJ0bmVyIHx8ICcnXG4gIGNvbnN0IHNldEZpZWxkID0gKGtleSwgdmFsdWUpID0+IGhhbmRsZUNoYW5nZShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IHN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBoYW5kbGVTdWJtaXQoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdGljZSA9IHJlc3BvbnNlPy5kYXRhPy5ub3RpY2VcbiAgICAgICAgaWYgKG5vdGljZT8udHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IG5vdGljZS5tZXNzYWdlIHx8ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGlzTmV3ID8gJ1BpbmNvZGUgYWRkZWQnIDogJ1BpbmNvZGUgdXBkYXRlZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSBwaW5jb2RlLiBQbGVhc2UgdHJ5IGFnYWluLicsIHR5cGU6ICdlcnJvcicgfSlcbiAgICAgIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3ggYXM9XCJmb3JtXCIgb25TdWJtaXQ9e3N1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlcm9cIj5cbiAgICAgICAgPEgzIGNvbG9yPVwid2hpdGVcIj57aXNOZXcgPyAnQWRkIHNlcnZpY2VhYmxlIHBpbmNvZGUnIDogYFBJTiAke3BhcmFtcy5waW5jb2RlIHx8ICcnfWB9PC9IMz5cbiAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBjb2xvcjogJyNmZmYnLCBvcGFjaXR5OiAwLjkgfX0+XG4gICAgICAgICAgQ3VzdG9tZXJzIGNhbiBzYXZlIGFuIGFkZHJlc3MgYW5kIGNoZWNrIG91dCBvbmx5IHdoZW4gdGhpcyBwaW5jb2RlIGlzIGFjdGl2ZS5cbiAgICAgICAgPC9wPlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+RGVsaXZlcnkgY292ZXJhZ2U8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gc3RvcCB0YWtpbmcgb3JkZXJzIGZvciB0aGlzIFBJTiB3aXRob3V0IGRlbGV0aW5nIGl0LjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdXZSBkZWxpdmVyIGhlcmUnIDogJ05vdCBkZWxpdmVyaW5nJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0FkZHJlc3Mgc2F2ZSBhbmQgY2hlY2tvdXQgYXJlIGFsbG93ZWQnIDogJ0N1c3RvbWVycyB3aWxsIHNlZSB0aGF0IHRoaXMgUElOIGlzIG5vdCBzZXJ2aWNlYWJsZSd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHNldEZpZWxkKCdpc0FjdGl2ZScsIG5leHQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5EZWxpdmVyeSBvcHRpb25zPC9oND5cbiAgICAgICAgICA8cD5UdXJuIGFuIG9wdGlvbiBvZmYgdG8gc2hvdyBpdCBhcyBjb21pbmcgc29vbiBhdCBjaGVja291dC4gSWYgYm90aCBhcmUgb2ZmLCB0aGlzIFBJTiBpcyBub3QgZGVsaXZlcmFibGUuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e21vcm5pbmdFbmFibGVkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgb25MYWJlbD1cIk9uXCJcbiAgICAgICAgICAgIG9mZkxhYmVsPVwiT2ZmXCJcbiAgICAgICAgICAgIHRpdGxlPVwiTW9ybmluZyBkZWxpdmVyeVwiXG4gICAgICAgICAgICBoaW50PXttb3JuaW5nRW5hYmxlZCA/ICdTaG9wcGVycyBjYW4gY2hvb3NlIG1vcm5pbmcgZGVsaXZlcnknIDogJ1Nob3duIGFzIGNvbWluZyBzb29uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ21vcm5pbmdFbmFibGVkJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtleHByZXNzRW5hYmxlZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgIG9uTGFiZWw9XCJPblwiXG4gICAgICAgICAgICBvZmZMYWJlbD1cIk9mZlwiXG4gICAgICAgICAgICB0aXRsZT1cIjkwLU1pbnV0ZSBkZWxpdmVyeVwiXG4gICAgICAgICAgICBoaW50PXtleHByZXNzRW5hYmxlZCA/ICdTaG9wcGVycyBjYW4gY2hvb3NlIDkwLW1pbnV0ZSBkZWxpdmVyeScgOiAnU2hvd24gYXMgY29taW5nIHNvb24nfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnZXhwcmVzc0VuYWJsZWQnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QXNzaWduZWQgcGFydG5lcjwvaDQ+XG4gICAgICAgICAgPHA+TmV3IG9yZGVycyBpbiB0aGlzIFBJTiBhcmUgYXV0by1hc3NpZ25lZCB0byB0aGlzIHBhcnRuZXIuIFlvdSBjYW4gcmVhc3NpZ24gbGF0ZXIgb24gdGhlIG9yZGVyLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBEZWxpdmVyeSBwYXJ0bmVyIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLW9wdGlvbmFsXCI+KG9wdGlvbmFsKTwvc3Bhbj5cbiAgICAgICAgICAgIDxTZWFyY2hhYmxlU2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJ0bmVySWR9XG4gICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiAnJywgbGFiZWw6ICdObyBwYXJ0bmVyIGFzc2lnbmVkJyB9LCAuLi5wYXJ0bmVyc119XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZWFkT25seX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3BhcnRuZXJJZCcsIG5leHQpXG4gICAgICAgICAgICAgICAgc2V0RmllbGQoJ3BhcnRuZXInLCBuZXh0KVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBhIHBhcnRuZXJcIlxuICAgICAgICAgICAgICBzZWFyY2hQbGFjZWhvbGRlcj1cIlNlYXJjaCBwYXJ0bmVyc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+TG9jYXRpb248L2g0PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQaW5jb2RlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgaW5wdXRNb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgICAgIG1heExlbmd0aD17Nn1cbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5IHx8ICFpc05ld31cbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5waW5jb2RlIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgncGluY29kZScsIGV2ZW50LnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnNsaWNlKDAsIDYpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCI2LWRpZ2l0IFBJTlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5waW5jb2RlID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLnBpbmNvZGUubWVzc2FnZX08L3NwYW4+IDogKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+SW5kaWEgUElOIGNvZGUsIDYgZGlnaXRzPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEFyZWEgbmFtZSA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1vcHRpb25hbFwiPihvcHRpb25hbCk8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmFyZWFMYWJlbCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2FyZWFMYWJlbCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQW5kaGVyaSBXZXN0LCBCYW5kcmEsIOKAplwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBDaXR5XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmVhZE9ubHk9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNpdHkgfHwgJyd9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdjaXR5JywgZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJNdW1iYWlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtlcnJvcnMuY2l0eSA/IDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9ycy5jaXR5Lm1lc3NhZ2V9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBTdGF0ZVxuICAgICAgICAgICAgPFNlYXJjaGFibGVTZWxlY3RcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5zdGF0ZUNvZGUgfHwgcGFyYW1zLnN0YXRlIHx8ICcnfVxuICAgICAgICAgICAgICBvcHRpb25zPXtbeyB2YWx1ZTogJycsIGxhYmVsOiAnU2VsZWN0IHN0YXRlJyB9LCAuLi5TVEFURV9PUFRJT05TXX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JlYWRPbmx5fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnc3RhdGVDb2RlJywgbmV4dClcbiAgICAgICAgICAgICAgICBzZXRGaWVsZCgnc3RhdGUnLCBuZXh0KVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBzdGF0ZVwiXG4gICAgICAgICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoIHN0YXRlc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5zdGF0ZSB8fCBlcnJvcnMuc3RhdGVDb2RlID8gKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPlxuICAgICAgICAgICAgICAgIHsoZXJyb3JzLnN0YXRlIHx8IGVycm9ycy5zdGF0ZUNvZGUpLm1lc3NhZ2V9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5BbGwgSW5kaWFuIHN0YXRlcyBhbmQgdW5pb24gdGVycml0b3JpZXM8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICB7cmVhZE9ubHkgPyBudWxsIDogKFxuICAgICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1hY3Rpb25zXCI+XG4gICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgICAge2lzTmV3ID8gJ0FkZCBwaW5jb2RlJyA6ICdTYXZlIHBpbmNvZGUnfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC9Cb3g+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGluY29kZUVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBcGlDbGllbnQsIHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpXG5cbmNvbnN0IFN0YXR1c1RvZ2dsZSA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZCwgcmVzb3VyY2UsIHByb3BlcnR5LCB3aGVyZSwgb25DaGFuZ2UgfSA9IHByb3BzXG4gIGNvbnN0IGFkZE5vdGljZSA9IHVzZU5vdGljZSgpXG4gIGNvbnN0IGZpZWxkID0gcHJvcGVydHk/LnBhdGggfHwgJ2lzQWN0aXZlJ1xuICBjb25zdCBhY3Rpb25OYW1lID0gcHJvcGVydHk/LmN1c3RvbT8uYWN0aW9uTmFtZSB8fCAndG9nZ2xlQWN0aXZlJ1xuICBjb25zdCBvbkxhYmVsID0gcHJvcGVydHk/LmN1c3RvbT8ub25MYWJlbCB8fCAnQWN0aXZlJ1xuICBjb25zdCBvZmZMYWJlbCA9IHByb3BlcnR5Py5jdXN0b20/Lm9mZkxhYmVsIHx8ICdJbmFjdGl2ZSdcbiAgY29uc3QgcmF3ID0gcmVjb3JkPy5wYXJhbXM/LltmaWVsZF1cbiAgY29uc3QgW2NoZWNrZWQsIHNldENoZWNrZWRdID0gdXNlU3RhdGUoaXNGbGFnT24ocmF3KSlcbiAgY29uc3QgW2J1c3ksIHNldEJ1c3ldID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRDaGVja2VkKGlzRmxhZ09uKHJhdykpXG4gIH0sIFtyYXcsIHJlY29yZD8uaWRdKVxuXG4gIGNvbnN0IHBlcnNpc3QgPSBhc3luYyAobmV4dCkgPT4ge1xuICAgIGlmICghcmVjb3JkPy5pZCkgcmV0dXJuXG4gICAgc2V0QnVzeSh0cnVlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5yZWNvcmRBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZC5pZCxcbiAgICAgICAgYWN0aW9uTmFtZSxcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IHsgW2ZpZWxkXTogbmV4dCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNhdmVkID0gcmVzcG9uc2UuZGF0YT8ucmVjb3JkPy5wYXJhbXM/LltmaWVsZF1cbiAgICAgIHNldENoZWNrZWQoc2F2ZWQgPT09IHVuZGVmaW5lZCA/IG5leHQgOiBpc0ZsYWdPbihzYXZlZCkpXG4gICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZS5kYXRhPy5ub3RpY2VcbiAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgIG1lc3NhZ2U6IG5vdGljZT8ubWVzc2FnZSB8fCAobmV4dCA/IGBNYXJrZWQgJHtvbkxhYmVsLnRvTG93ZXJDYXNlKCl9YCA6IGBNYXJrZWQgJHtvZmZMYWJlbC50b0xvd2VyQ2FzZSgpfWApLFxuICAgICAgICB0eXBlOiBub3RpY2U/LnR5cGUgfHwgJ3N1Y2Nlc3MnLFxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQ291bGQgbm90IHVwZGF0ZSBzdGF0dXMuJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChuZXh0KSA9PiB7XG4gICAgaWYgKHdoZXJlID09PSAnZWRpdCcgJiYgdHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXRDaGVja2VkKG5leHQpXG4gICAgICBvbkNoYW5nZShmaWVsZCwgbmV4dClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBwZXJzaXN0KG5leHQpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgIGNvbXBhY3Q9e3doZXJlICE9PSAnZWRpdCd9XG4gICAgICBjaGVja2VkPXtjaGVja2VkfVxuICAgICAgZGlzYWJsZWQ9e2J1c3l9XG4gICAgICBvbkxhYmVsPXtvbkxhYmVsfVxuICAgICAgb2ZmTGFiZWw9e29mZkxhYmVsfVxuICAgICAgdGl0bGU9e3doZXJlID09PSAnZWRpdCcgPyAoY2hlY2tlZCA/IG9uTGFiZWwgOiBvZmZMYWJlbCkgOiB1bmRlZmluZWR9XG4gICAgICBoaW50PXt3aGVyZSA9PT0gJ2VkaXQnID8gcHJvcGVydHk/LmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkfVxuICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1RvZ2dsZVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBTdGF0dXNTd2l0Y2gsIGlzRmxhZ09uIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2xzLmpzeCdcblxuZnVuY3Rpb24gcGFkKHZhbHVlKSB7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpLnBhZFN0YXJ0KDIsICcwJylcbn1cblxuZnVuY3Rpb24gdG9EYXRlSW5wdXQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IHRleHQgPSBTdHJpbmcodmFsdWUpXG4gIGlmICgvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9Ly50ZXN0KHRleHQpKSByZXR1cm4gdGV4dC5zbGljZSgwLCAxMClcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKVxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkgcmV0dXJuICcnXG4gIHJldHVybiBgJHtkYXRlLmdldEZ1bGxZZWFyKCl9LSR7cGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpfS0ke3BhZChkYXRlLmdldERhdGUoKSl9YFxufVxuXG5mdW5jdGlvbiBmb3JtYXRXaGVuKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHJldHVybiAn4oCUJ1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gJ+KAlCdcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJywgeyBkYXRlU3R5bGU6ICdtZWRpdW0nLCB0aW1lU3R5bGU6ICdzaG9ydCcgfSlcbn1cblxuZnVuY3Rpb24gcGFyc2VBZGRyZXNzZXMocGFyYW1zKSB7XG4gIGNvbnN0IHJhdyA9IHBhcmFtcy5hZGRyZXNzZXNcbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3KSkgcmV0dXJuIHJhdy5maWx0ZXIoQm9vbGVhbilcbiAgaWYgKHJhdyAmJiB0eXBlb2YgcmF3ID09PSAnb2JqZWN0JykgcmV0dXJuIFtyYXddXG4gIGlmICh0eXBlb2YgcmF3ID09PSAnc3RyaW5nJyAmJiByYXcudHJpbSgpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSkgcmV0dXJuIHBhcnNlZC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIGlmIChwYXJzZWQgJiYgdHlwZW9mIHBhcnNlZCA9PT0gJ29iamVjdCcpIHJldHVybiBbcGFyc2VkXVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gZmxhdHRlbmVkIEFkbWluSlMgcGFyYW1zIGJlbG93XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ3JvdXBlZCA9IHt9XG4gIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSBrZXkubWF0Y2goL15hZGRyZXNzZXNcXC4oXFxkKylcXC4oLispJC8pXG4gICAgaWYgKCFtYXRjaCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykgcmV0dXJuXG4gICAgY29uc3QgWywgaW5kZXgsIGZpZWxkXSA9IG1hdGNoXG4gICAgZ3JvdXBlZFtpbmRleF0gPSBncm91cGVkW2luZGV4XSB8fCB7fVxuICAgIGdyb3VwZWRbaW5kZXhdW2ZpZWxkXSA9IHZhbHVlXG4gIH0pXG4gIHJldHVybiBPYmplY3Qua2V5cyhncm91cGVkKVxuICAgIC5zb3J0KChhLCBiKSA9PiBOdW1iZXIoYSkgLSBOdW1iZXIoYikpXG4gICAgLm1hcCgoa2V5KSA9PiBncm91cGVkW2tleV0pXG59XG5cbmZ1bmN0aW9uIGFkZHJlc3NMaW5lcyhhZGRyZXNzKSB7XG4gIHJldHVybiBbXG4gICAgYWRkcmVzcy5saW5lMSxcbiAgICBhZGRyZXNzLmxpbmUyLFxuICAgIFthZGRyZXNzLmNpdHksIGFkZHJlc3Muc3RhdGUsIGFkZHJlc3MucGluY29kZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJyksXG4gICAgYWRkcmVzcy5sYW5kbWFyayA/IGBMYW5kbWFyazogJHthZGRyZXNzLmxhbmRtYXJrfWAgOiAnJyxcbiAgXS5maWx0ZXIoQm9vbGVhbilcbn1cblxuY29uc3QgQ3VzdG9tZXJFZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyByZWNvcmQsIGhhbmRsZUNoYW5nZSwgc3VibWl0OiBoYW5kbGVTdWJtaXQsIGxvYWRpbmcgfSA9IHVzZVJlY29yZChcbiAgICBpbml0aWFsUmVjb3JkLFxuICAgIHJlc291cmNlLmlkLFxuICApXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9XG4gIGNvbnN0IGlzQWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJ1xuICAgID8gdHJ1ZVxuICAgIDogaXNGbGFnT24ocGFyYW1zLmlzQWN0aXZlKVxuICBjb25zdCBhZGRyZXNzZXMgPSB1c2VNZW1vKCgpID0+IHBhcnNlQWRkcmVzc2VzKHBhcmFtcyksIFtwYXJhbXNdKVxuICBjb25zdCBlcnJvcnMgPSB1c2VNZW1vKCgpID0+IHJlY29yZD8uZXJyb3JzIHx8IHt9LCBbcmVjb3JkPy5lcnJvcnNdKVxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBzdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlU3VibWl0KClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBub3RpY2UgPSByZXNwb25zZT8uZGF0YT8ubm90aWNlXG4gICAgICAgIGlmIChub3RpY2U/LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBub3RpY2UubWVzc2FnZSB8fCAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXInLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogJ0N1c3RvbWVyIHVwZGF0ZWQnLCB0eXBlOiAnc3VjY2VzcycgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnQ291bGQgbm90IHNhdmUgY3VzdG9tZXIuIFBsZWFzZSB0cnkgYWdhaW4uJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgfSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEJveCBhcz1cImZvcm1cIiBvblN1Ym1pdD17c3VibWl0fSBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZm9ybVwiPlxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taGVyb1wiPlxuICAgICAgICA8SDMgY29sb3I9XCJ3aGl0ZVwiPntwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICArOTEge3BhcmFtcy5waG9uZSB8fCAn4oCUJ30gwrcgam9pbmVkIHtmb3JtYXRXaGVuKHBhcmFtcy5jcmVhdGVkQXQpfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5BY2NvdW50IHN0YXR1czwvaDQ+XG4gICAgICAgICAgPHA+SW5hY3RpdmUgY3VzdG9tZXJzIGNhbm5vdCBzaWduIGluIHdpdGggdGhpcyBtb2JpbGUgbnVtYmVyLjwvcD5cbiAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICBjaGVja2VkPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIHRpdGxlPXtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0luYWN0aXZlJ31cbiAgICAgICAgICAgIGhpbnQ9e2lzQWN0aXZlID8gJ0NhbiBsb2cgaW4gb24gdGhlIHdlYnNpdGUgYW5kIGFwcCcgOiAnTG9naW4gaXMgYmxvY2tlZCB1bnRpbCB5b3UgdHVybiB0aGlzIG9uJ31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV4dCkgPT4gc2V0RmllbGQoJ2lzQWN0aXZlJywgbmV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1jYXJkXCI+XG4gICAgICAgICAgPGg0PlByb2ZpbGU8L2g0PlxuICAgICAgICAgIDxwPlBob25lIGNvbWVzIGZyb20gT1RQIGxvZ2luIGFuZCBzdGF5cyBhcyB0aGUgY3VzdG9tZXLigJlzIGxvZ2luIGlkLjwvcD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ3VzdG9tZXIgbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2Vycm9ycy5uYW1lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktZmllbGQtZXJyb3JcIj57ZXJyb3JzLm5hbWUubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLXR3b1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBNb2JpbGVcbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiIHZhbHVlPXtwYXJhbXMucGhvbmUgfHwgJyd9IHJlYWRPbmx5IC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgICBEYXRlIG9mIGJpcnRoXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0b0RhdGVJbnB1dChwYXJhbXMuZGF0ZU9mQmlydGgpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZpZWxkKCdkYXRlT2ZCaXJ0aCcsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHtlcnJvcnMuZGF0ZU9mQmlydGggPyA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1lcnJvclwiPntlcnJvcnMuZGF0ZU9mQmlydGgubWVzc2FnZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+U2F2ZWQgYWRkcmVzc2VzPC9oND5cbiAgICAgICAgPHA+XG4gICAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGhcbiAgICAgICAgICAgID8gYCR7YWRkcmVzc2VzLmxlbmd0aH0gYWRkcmVzcyR7YWRkcmVzc2VzLmxlbmd0aCA9PT0gMSA/ICcnIDogJ2VzJ30gc2F2ZWQgaW4gdGhlIGN1c3RvbWVyIGFjY291bnQuYFxuICAgICAgICAgICAgOiAnVGhpcyBjdXN0b21lciBoYXMgbm90IHNhdmVkIGEgZGVsaXZlcnkgYWRkcmVzcyB5ZXQuJ31cbiAgICAgICAgPC9wPlxuICAgICAgICB7YWRkcmVzc2VzLmxlbmd0aCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWFkZHJlc3MtZ3JpZFwiPlxuICAgICAgICAgICAge2FkZHJlc3Nlcy5tYXAoKGFkZHJlc3MsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17YWRkcmVzcy5pZCB8fCBgJHthZGRyZXNzLnBpbmNvZGV9LSR7aW5kZXh9YH0gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1jYXJkXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1hZGRyZXNzLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1sYWJlbFwiPnthZGRyZXNzLmxhYmVsIHx8ICdBZGRyZXNzJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICB7YWRkcmVzcy5waW5jb2RlID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waW5cIj57YWRkcmVzcy5waW5jb2RlfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2FkZHJlc3MubmFtZSB8fCBwYXJhbXMubmFtZSB8fCAnQ3VzdG9tZXInfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIHthZGRyZXNzLnBob25lID8gPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktYWRkcmVzcy1waG9uZVwiPis5MSB7YWRkcmVzcy5waG9uZX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgICAgICAgICB7YWRkcmVzc0xpbmVzKGFkZHJlc3MpLm1hcCgobGluZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPHAga2V5PXtsaW5lfT57bGluZX08L3A+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIFNhdmUgY3VzdG9tZXJcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXN0b21lckVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VSZWNvcmQgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgRmxhZ0NhcmQsIFN0YXR1c1N3aXRjaCwgaXNGbGFnT24gfSBmcm9tICcuL2Zvcm0tY29udHJvbHMuanN4J1xuXG5jb25zdCBST0xFUyA9IFtcbiAgeyB2YWx1ZTogJ3N0YWZmJywgdGl0bGU6ICdTdGFmZicsIGhpbnQ6ICdBY2Nlc3Mgb25seSB0aGUgYXJlYXMgeW91IHRpY2sgYmVsb3cnIH0sXG4gIHsgdmFsdWU6ICdhZG1pbicsIHRpdGxlOiAnQWRtaW4nLCBoaW50OiAnRnVsbCBhY2Nlc3MgdG8gdGhlIENNUycgfSxcbiAgeyB2YWx1ZTogJ3N1cGVyX2FkbWluJywgdGl0bGU6ICdTdXBlciBhZG1pbicsIGhpbnQ6ICdGdWxsIGFjY2Vzcywgc2FtZSBhcyBhZG1pbicgfSxcbl1cblxuY29uc3QgUEVSTUlTU0lPTlMgPSBbXG4gIHsga2V5OiAnbWFuYWdlUHJvZHVjdHMnLCBsYWJlbDogJ1Byb2R1Y3RzJywgaGludDogJ0FkZCBhbmQgZWRpdCBwcm9kdWN0cycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VDYXRhbG9nJywgbGFiZWw6ICdDYXRhbG9nJywgaGludDogJ0NhdGVnb3JpZXMgYW5kIGNvbGxlY3Rpb25zJyB9LFxuICB7IGtleTogJ21hbmFnZU1lZGlhJywgbGFiZWw6ICdNZWRpYScsIGhpbnQ6ICdVcGxvYWQgYW5kIHJlcGxhY2UgaW1hZ2VzJyB9LFxuICB7IGtleTogJ21hbmFnZU9yZGVycycsIGxhYmVsOiAnT3JkZXJzJywgaGludDogJ1ZpZXcgYW5kIHVwZGF0ZSBvcmRlcnMnIH0sXG4gIHsga2V5OiAnbWFuYWdlQ291cG9ucycsIGxhYmVsOiAnQ291cG9ucycsIGhpbnQ6ICdDcmVhdGUgZGlzY291bnQgY29kZXMnIH0sXG4gIHsga2V5OiAnbWFuYWdlQ29udGVudCcsIGxhYmVsOiAnQ29udGVudCcsIGhpbnQ6ICdQYWdlcyBhbmQgcmV2aWV3cycgfSxcbiAgeyBrZXk6ICdtYW5hZ2VTZXR0aW5ncycsIGxhYmVsOiAnU2V0dGluZ3MnLCBoaW50OiAnU3RvcmUgYW5kIGhvbWVwYWdlIHNldHRpbmdzJyB9LFxuICB7IGtleTogJ21hbmFnZVVzZXJzJywgbGFiZWw6ICdUZWFtJywgaGludDogJ0NyZWF0ZSB1c2VycyBhbmQgY2hhbmdlIGFjY2VzcycgfSxcbl1cblxuZnVuY3Rpb24gRmllbGRFcnJvcih7IGVycm9yIH0pIHtcbiAgaWYgKCFlcnJvcj8ubWVzc2FnZSkgcmV0dXJuIG51bGxcbiAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWVycm9yXCI+e2Vycm9yLm1lc3NhZ2V9PC9zcGFuPlxufVxuXG5mdW5jdGlvbiBQYXNzd29yZEZpZWxkKHsgbGFiZWwsIHZhbHVlLCBvbkNoYW5nZSwgZXJyb3IsIHBsYWNlaG9sZGVyIH0pIHtcbiAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gdXNlU3RhdGUoZmFsc2UpXG4gIHJldHVybiAoXG4gICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAge2xhYmVsfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktcGFzc3dvcmQtd3JhcFwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgIHR5cGU9e3Zpc2libGUgPyAndGV4dCcgOiAncGFzc3dvcmQnfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cbiAgICAgICAgICBhdXRvQ29tcGxldGU9XCJuZXctcGFzc3dvcmRcIlxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktcGFzc3dvcmQtdG9nZ2xlXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPXt2aXNpYmxlID8gJ0hpZGUgcGFzc3dvcmQnIDogJ1Nob3cgcGFzc3dvcmQnfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFZpc2libGUoKGN1cnJlbnQpID0+ICFjdXJyZW50KX1cbiAgICAgICAgPlxuICAgICAgICAgIHt2aXNpYmxlID8gJ0hpZGUnIDogJ1Nob3cnfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcn0gLz5cbiAgICA8L2xhYmVsPlxuICApXG59XG5cbmNvbnN0IFRlYW1FZGl0ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkOiBpbml0aWFsUmVjb3JkLCByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wc1xuICBjb25zdCBhZGROb3RpY2UgPSB1c2VOb3RpY2UoKVxuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cbiAgY29uc3QgaXNOZXcgPSBhY3Rpb24/Lm5hbWUgPT09ICduZXcnIHx8ICFyZWNvcmQ/LmlkXG4gIGNvbnN0IHJvbGUgPSBwYXJhbXMucm9sZSB8fCAnc3RhZmYnXG4gIGNvbnN0IGlzQWN0aXZlID1cbiAgICBpc05ldyAmJiAocGFyYW1zLmlzQWN0aXZlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLmlzQWN0aXZlID09PSAnJylcbiAgICAgID8gdHJ1ZVxuICAgICAgOiBpc0ZsYWdPbihwYXJhbXMuaXNBY3RpdmUpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNOZXcgJiYgKHBhcmFtcy5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5pc0FjdGl2ZSA9PT0gJycpKSB7XG4gICAgICBoYW5kbGVDaGFuZ2UoJ2lzQWN0aXZlJywgdHJ1ZSlcbiAgICB9XG4gICAgaWYgKGlzTmV3ICYmICFwYXJhbXMucm9sZSkgaGFuZGxlQ2hhbmdlKCdyb2xlJywgJ3N0YWZmJylcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc05ld10pXG5cbiAgY29uc3QgZXJyb3JzID0gdXNlTWVtbygoKSA9PiByZWNvcmQ/LmVycm9ycyB8fCB7fSwgW3JlY29yZD8uZXJyb3JzXSlcbiAgY29uc3Qgc2V0RmllbGQgPSAoa2V5LCB2YWx1ZSkgPT4gaGFuZGxlQ2hhbmdlKGtleSwgdmFsdWUpXG4gIGNvbnN0IHBlcm1pc3Npb25PbiA9IChrZXkpID0+IGlzRmxhZ09uKHBhcmFtc1tgcGVybWlzc2lvbnMuJHtrZXl9YF0pXG5cbiAgY29uc3Qgc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGhhbmRsZVN1Ym1pdCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uc3Qgbm90aWNlID0gcmVzcG9uc2U/LmRhdGE/Lm5vdGljZVxuICAgICAgICBpZiAobm90aWNlPy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogbm90aWNlLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBzYXZlIHRlYW0gbWVtYmVyJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgICAgbWVzc2FnZTogaXNOZXcgPyAnVGVhbSBtZW1iZXIgY3JlYXRlZCcgOiAnVGVhbSBtZW1iZXIgdXBkYXRlZCcsXG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6ICdDb3VsZCBub3Qgc2F2ZSB0ZWFtIG1lbWJlci4gUGxlYXNlIHRyeSBhZ2Fpbi4nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtzdWJtaXR9IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+e2lzTmV3ID8gJ0FkZCB0ZWFtIG1lbWJlcicgOiBwYXJhbXMubmFtZSB8fCAnVGVhbSBtZW1iZXInfTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBUaGV5IHNpZ24gaW4gdG8gVG9rcmlpaSBDTVMgd2l0aCB1c2VybmFtZSBvciBlbWFpbC4gSW5hY3RpdmUgdXNlcnMgY2Fubm90IGxvZyBpbi5cbiAgICAgICAgPC9UZXh0PlxuICAgICAgPC9Cb3g+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+QWNjb3VudCBzdGF0dXM8L2g0PlxuICAgICAgICAgIDxwPlR1cm4gdGhpcyBvZmYgdG8gYmxvY2sgQ01TIGxvZ2luIHdpdGhvdXQgZGVsZXRpbmcgdGhlIGFjY291bnQuPC9wPlxuICAgICAgICAgIDxTdGF0dXNTd2l0Y2hcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWN0aXZlfVxuICAgICAgICAgICAgdGl0bGU9e2lzQWN0aXZlID8gJ0FjdGl2ZScgOiAnSW5hY3RpdmUnfVxuICAgICAgICAgICAgaGludD17aXNBY3RpdmUgPyAnQ2FuIHNpZ24gaW4gdG8gdGhlIGFkbWluIHBhbmVsJyA6ICdMb2dpbiBpcyBibG9ja2VkIHVudGlsIHlvdSB0dXJuIHRoaXMgb24nfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZCgnaXNBY3RpdmUnLCBuZXh0KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgICA8aDQ+Um9sZTwvaDQ+XG4gICAgICAgICAgPHA+QWRtaW4gYW5kIHN1cGVyIGFkbWluIGdldCBmdWxsIGFjY2Vzcy4gU3RhZmYgb25seSBnZXRzIHRoZSBwZXJtaXNzaW9ucyB5b3UgZW5hYmxlLjwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNob2ljZS1yb3dcIj5cbiAgICAgICAgICAgIHtST0xFUy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICAgICAga2V5PXtpdGVtLnZhbHVlfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtyb2xlID09PSBpdGVtLnZhbHVlfVxuICAgICAgICAgICAgICAgIHRpdGxlPXtpdGVtLnRpdGxlfVxuICAgICAgICAgICAgICAgIGhpbnQ9e2l0ZW0uaGludH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWVsZCgncm9sZScsIGl0ZW0udmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+TG9naW4gZGV0YWlsczwvaDQ+XG4gICAgICAgIDxwPlVzZXJuYW1lIG9yIGVtYWlsIGNhbiBiZSB1c2VkIG9uIHRoZSBDTVMgbG9naW4gc2NyZWVuLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tdHdvXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgRnVsbCBuYW1lXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5uYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnbmFtZScsIGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGVhbSBtZW1iZXIgbmFtZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEZpZWxkRXJyb3IgZXJyb3I9e2Vycm9ycy5uYW1lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1sYWJlbFwiPlxuICAgICAgICAgICAgVXNlcm5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnVzZXJuYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgndXNlcm5hbWUnLCBldmVudC50YXJnZXQudmFsdWUudHJpbSgpKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIHJhdmkuY21zXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RmllbGRFcnJvciBlcnJvcj17ZXJyb3JzLnVzZXJuYW1lfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgRW1haWxcbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1pbnB1dFwiXG4gICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZW1haWwgfHwgJyd9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRGaWVsZCgnZW1haWwnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJuYW1lQHRva3JpaWkuY29tXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGaWVsZEVycm9yIGVycm9yPXtlcnJvcnMuZW1haWx9IC8+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIHtpc05ldyA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi10d29cIj5cbiAgICAgICAgICAgIDxQYXNzd29yZEZpZWxkXG4gICAgICAgICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnBhc3N3b3JkIHx8ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiBzZXRGaWVsZCgncGFzc3dvcmQnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgIGVycm9yPXtlcnJvcnMucGFzc3dvcmR9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXQgbGVhc3QgNiBjaGFyYWN0ZXJzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UGFzc3dvcmRGaWVsZFxuICAgICAgICAgICAgICBsYWJlbD1cIkNvbmZpcm0gcGFzc3dvcmRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLmNvbmZpcm1QYXNzd29yZCB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2YWx1ZSkgPT4gc2V0RmllbGQoJ2NvbmZpcm1QYXNzd29yZCcsIHZhbHVlKX1cbiAgICAgICAgICAgICAgZXJyb3I9e2Vycm9ycy5jb25maXJtUGFzc3dvcmR9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSBwYXNzd29yZCBhZ2FpblwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRva3JpLWZpZWxkLWhpbnRcIj5Vc2UgQ2hhbmdlIHBhc3N3b3JkIGZyb20gdGhlIHRlYW0gbGlzdCB0byByZXNldCBsb2dpbi48L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHtyb2xlID09PSAnc3RhZmYnID8gKFxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICAgIDxoND5QZXJtaXNzaW9uczwvaDQ+XG4gICAgICAgICAgPHA+T25seSB1c2VkIGZvciBzdGFmZi4gVG9nZ2xlIHdoYXQgdGhpcyBwZXJzb24gY2FuIG9wZW4gaW4gdGhlIENNUy48L3A+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1wZXJtLWxpc3RcIj5cbiAgICAgICAgICAgIHtQRVJNSVNTSU9OUy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2l0ZW0ua2V5fSBjbGFzc05hbWU9XCJ0b2tyaS1wZXJtLXJvd1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz57aXRlbS5sYWJlbH08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPntpdGVtLmhpbnR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8U3RhdHVzU3dpdGNoXG4gICAgICAgICAgICAgICAgICBjb21wYWN0XG4gICAgICAgICAgICAgICAgICBjaGVja2VkPXtwZXJtaXNzaW9uT24oaXRlbS5rZXkpfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhuZXh0KSA9PiBzZXRGaWVsZChgcGVybWlzc2lvbnMuJHtpdGVtLmtleX1gLCBuZXh0KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICApIDogbnVsbH1cblxuICAgICAgPEJveCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tYWN0aW9uc1wiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJjb250YWluZWRcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e2xvYWRpbmd9PlxuICAgICAgICAgIHtsb2FkaW5nID8gPEljb24gaWNvbj1cIkxvYWRlclwiIHNwaW4gLz4gOiBudWxsfVxuICAgICAgICAgIHtpc05ldyA/ICdDcmVhdGUgdGVhbSBtZW1iZXInIDogJ1NhdmUgdGVhbSBtZW1iZXInfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlYW1FZGl0XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSDMsIEljb24sIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTm90aWNlLCB1c2VRdWVyeVBhcmFtcywgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnXG5jb25zdCBGT0xERVJTID0gWydhbGwnLCAncHJvZHVjdHMnLCAnY2F0ZWdvcmllcycsICdyZXZpZXdzJywgJ3BhZ2VzJywgJ2dlbmVyYWwnXVxuXG5jb25zdCB3aXRob3V0VHJhaWxpbmdTbGFzaCA9ICh2YWx1ZSkgPT4gU3RyaW5nKHZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG5mdW5jdGlvbiBmb3JtYXRTaXplKGJ5dGVzKSB7XG4gIGNvbnN0IHNpemUgPSBOdW1iZXIoYnl0ZXMpIHx8IDBcbiAgaWYgKHNpemUgPCAxMDI0KSByZXR1cm4gYCR7c2l6ZX0gQmBcbiAgaWYgKHNpemUgPCAxMDI0ICogMTAyNCkgcmV0dXJuIGAke01hdGgucm91bmQoc2l6ZSAvIDEwMjQpfSBLQmBcbiAgcmV0dXJuIGAkeyhzaXplIC8gKDEwMjQgKiAxMDI0KSkudG9GaXhlZCgxKX0gTUJgXG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdoZW4odmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSlcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHJldHVybiAnJ1xuICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyBkYXk6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIHllYXI6ICdudW1lcmljJyB9KVxufVxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKHBhdGgsIGFwcFVybCkge1xuICBpZiAoIXBhdGgpIHJldHVybiAnJ1xuICBpZiAoL14oaHR0cHM/OnxkYXRhOnxibG9iOikvLnRlc3QocGF0aCkpIHJldHVybiBwYXRoXG4gIHJldHVybiBgJHt3aXRob3V0VHJhaWxpbmdTbGFzaChhcHBVcmwgfHwgd2luZG93LmxvY2F0aW9uLm9yaWdpbil9JHtwYXRofWBcbn1cblxuY29uc3QgTWVkaWFMaWJyYXJ5ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVzb3VyY2UsIHNldFRhZyB9ID0gcHJvcHNcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgeyBzdG9yZVBhcmFtcywgZmlsdGVycyB9ID0gdXNlUXVlcnlQYXJhbXMoKVxuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGZldGNoRGF0YSwgdG90YWwsIHBlclBhZ2UgfSA9IHVzZVJlY29yZHMocmVzb3VyY2UuaWQpXG4gIGNvbnN0IGZpbGVSZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbYnVzeUlkLCBzZXRCdXN5SWRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IGZvbGRlciA9IFN0cmluZyhmaWx0ZXJzPy5mb2xkZXIgfHwgJ2FsbCcpXG4gIGNvbnN0IGN1c3RvbSA9IHJlc291cmNlPy5vcHRpb25zPy5jdXN0b20gfHwge31cbiAgY29uc3QgYXBpQmFzZVVybCA9IHdpdGhvdXRUcmFpbGluZ1NsYXNoKGN1c3RvbS5hcGlCYXNlVXJsIHx8ICcvYXBpL3YxJylcbiAgY29uc3QgYXBwVXJsID0gY3VzdG9tLmFwcFVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gIGNvbnN0IHVwbG9hZEZvbGRlciA9IGZvbGRlciA9PT0gJ2FsbCcgPyAnZ2VuZXJhbCcgOiBmb2xkZXJcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZXRUYWcpIHNldFRhZyhTdHJpbmcodG90YWwgfHwgMCkpXG4gIH0sIFt0b3RhbCwgc2V0VGFnXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChOdW1iZXIocGVyUGFnZSkgPCA1MCkgc3RvcmVQYXJhbXMoeyBwZXJQYWdlOiAnNTAnIH0pXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbXSlcblxuICBjb25zdCBpdGVtcyA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIChyZWNvcmRzIHx8IFtdKS5tYXAoKGl0ZW0pID0+ICh7XG4gICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICBuYW1lOiBpdGVtLnBhcmFtcz8ub3JpZ2luYWxOYW1lIHx8IGl0ZW0ucGFyYW1zPy5maWxlbmFtZSB8fCAnSW1hZ2UnLFxuICAgICAgICBmb2xkZXI6IGl0ZW0ucGFyYW1zPy5mb2xkZXIgfHwgJ2dlbmVyYWwnLFxuICAgICAgICBwYXRoOiBpdGVtLnBhcmFtcz8ucGF0aCB8fCAnJyxcbiAgICAgICAgc2l6ZTogaXRlbS5wYXJhbXM/LnNpemUsXG4gICAgICAgIGNyZWF0ZWRBdDogaXRlbS5wYXJhbXM/LmNyZWF0ZWRBdCxcbiAgICAgICAgdXJsOiByZXNvbHZlVXJsKGl0ZW0ucGFyYW1zPy5wYXRoLCBhcHBVcmwpLFxuICAgICAgfSkpLFxuICAgIFthcHBVcmwsIHJlY29yZHNdLFxuICApXG5cbiAgY29uc3Qgc2V0Rm9sZGVyID0gKG5leHQpID0+IHtcbiAgICBzdG9yZVBhcmFtcyh7XG4gICAgICBwYWdlOiAnMScsXG4gICAgICBmaWx0ZXJzOiBuZXh0ID09PSAnYWxsJyA/IHt9IDogeyBmb2xkZXI6IG5leHQgfSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgdXBsb2FkRmlsZXMgPSBhc3luYyAoZmlsZXMpID0+IHtcbiAgICBjb25zdCBsaXN0ID0gWy4uLmZpbGVzXS5maWx0ZXIoKGZpbGUpID0+IGZpbGUudHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKSlcbiAgICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm5cbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGxpc3QpIHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZvbGRlcicsIHVwbG9hZEZvbGRlcilcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHthcGlCYXNlVXJsfS9tZWRpYS91cGxvYWRgLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIH0pXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlIHx8IGBDb3VsZCBub3QgdXBsb2FkICR7ZmlsZS5uYW1lfWApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFkZE5vdGljZSh7XG4gICAgICAgIG1lc3NhZ2U6IGxpc3QubGVuZ3RoID09PSAxID8gJ0ltYWdlIHVwbG9hZGVkJyA6IGAke2xpc3QubGVuZ3RofSBpbWFnZXMgdXBsb2FkZWRgLFxuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICB9KVxuICAgICAgZmV0Y2hEYXRhKClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnVXBsb2FkIGZhaWxlZCcsIHR5cGU6ICdlcnJvcicgfSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKVxuICAgICAgaWYgKGZpbGVSZWYuY3VycmVudCkgZmlsZVJlZi5jdXJyZW50LnZhbHVlID0gJydcbiAgICB9XG4gIH1cblxuICBjb25zdCBjb3B5UGF0aCA9IGFzeW5jIChwYXRoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHBhdGgpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnRmlsZSBwYXRoIGNvcGllZCcsIHR5cGU6ICdzdWNjZXNzJyB9KVxuICAgIH0gY2F0Y2gge1xuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogcGF0aCwgdHlwZTogJ2luZm8nIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlID0gYXN5bmMgKGlkLCBuYW1lKSA9PiB7XG4gICAgaWYgKCF3aW5kb3cuY29uZmlybShgRGVsZXRlIOKAnCR7bmFtZX3igJ0/IFRoaXMgY2Fubm90IGJlIHVuZG9uZS5gKSkgcmV0dXJuXG4gICAgc2V0QnVzeUlkKGlkKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaUJhc2VVcmx9L21lZGlhLyR7aWR9YCwgeyBtZXRob2Q6ICdERUxFVEUnIH0pXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+ICh7fSkpXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgJ0NvdWxkIG5vdCBkZWxldGUgaW1hZ2UnKVxuICAgICAgfVxuICAgICAgYWRkTm90aWNlKHsgbWVzc2FnZTogZGF0YS5tZXNzYWdlIHx8ICdJbWFnZSBkZWxldGVkJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgICBmZXRjaERhdGEoKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdDb3VsZCBub3QgZGVsZXRlIGltYWdlJywgdHlwZTogJ2Vycm9yJyB9KVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5SWQoJycpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1mb3JtXCI+XG4gICAgICA8Qm94IGNsYXNzTmFtZT1cInRva3JpLWNvdXBvbi1oZXJvXCI+XG4gICAgICAgIDxIMyBjb2xvcj1cIndoaXRlXCI+TWVkaWEgbGlicmFyeTwvSDM+XG4gICAgICAgIDxUZXh0IGNvbG9yPVwid2hpdGVcIj5cbiAgICAgICAgICBVcGxvYWQgaW1hZ2VzIHVzZWQgb24gcHJvZHVjdHMsIGNhdGVnb3JpZXMsIHJldmlld3MsIGFuZCB0aGUgaG9tZXBhZ2UuIEZpbGVzIHN0YXkgb24gdGhpcyBzZXJ2ZXIuXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tY2FyZFwiPlxuICAgICAgICA8aDQ+VXBsb2FkPC9oND5cbiAgICAgICAgPHA+XG4gICAgICAgICAgRmlsZXMgZ28gaW50byB0aGUgPHN0cm9uZz57dXBsb2FkRm9sZGVyfTwvc3Ryb25nPiBmb2xkZXJcbiAgICAgICAgICB7Zm9sZGVyID09PSAnYWxsJyA/ICcgKHNlbGVjdCBhIGZvbGRlciBiZWxvdyB0byBjaGFuZ2UgdGhpcykuJyA6ICcuJ31cbiAgICAgICAgPC9wPlxuICAgICAgICA8bGFiZWxcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS11cGxvYWQtZHJvcFwiXG4gICAgICAgICAgb25EcmFnT3Zlcj17KGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgICAgIG9uRHJvcD17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB1cGxvYWRGaWxlcyhldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPnt1cGxvYWRpbmcgPyAnVXBsb2FkaW5n4oCmJyA6ICdDbGljayBvciBkcm9wIGltYWdlcyBoZXJlJ308L3NwYW4+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcbiAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICBkaXNhYmxlZD17dXBsb2FkaW5nfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBsb2FkRmlsZXMoZXZlbnQudGFyZ2V0LmZpbGVzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0b2tyaS1maWVsZC1oaW50XCI+SlBHLCBQTkcsIEdJRiwgb3IgV2ViUCB1cCB0byA1TUIgZWFjaDwvc3Bhbj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkxpYnJhcnk8L2g0PlxuICAgICAgICA8cD57dG90YWwgfHwgMH0gZmlsZXsodG90YWwgfHwgMCkgPT09IDEgPyAnJyA6ICdzJ317Zm9sZGVyICE9PSAnYWxsJyA/IGAgaW4gJHtmb2xkZXJ9YCA6ICcnfS48L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktZm9sZGVyLWNoaXBzXCI+XG4gICAgICAgICAge0ZPTERFUlMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17aXRlbX1cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRva3JpLWZvbGRlci1jaGlwJHtmb2xkZXIgPT09IGl0ZW0gPyAnIGlzLW9uJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZvbGRlcihpdGVtKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2l0ZW0gPT09ICdhbGwnID8gJ0FsbCBmb2xkZXJzJyA6IGl0ZW19XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgICAgPFRleHQgbXQ9XCJ4bFwiPkxvYWRpbmcgaW1hZ2Vz4oCmPC9UZXh0PlxuICAgICAgICApIDogaXRlbXMubGVuZ3RoID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbWVkaWEtZ3JpZFwiPlxuICAgICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLWNhcmRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRva3JpLW1lZGlhLXRodW1iXCI+XG4gICAgICAgICAgICAgICAgICB7aXRlbS51cmwgPyA8aW1nIHNyYz17aXRlbS51cmx9IGFsdD17aXRlbS5uYW1lfSAvPiA6IDxzcGFuPk5vIHByZXZpZXc8L3NwYW4+fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzdHJvbmcgdGl0bGU9e2l0ZW0ubmFtZX0+e2l0ZW0ubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIHtpdGVtLmZvbGRlcn0gwrcge2Zvcm1hdFNpemUoaXRlbS5zaXplKX1cbiAgICAgICAgICAgICAgICAgIHtpdGVtLmNyZWF0ZWRBdCA/IGAgwrcgJHtmb3JtYXRXaGVuKGl0ZW0uY3JlYXRlZEF0KX1gIDogJyd9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktbWVkaWEtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBzaXplPVwic21cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9eygpID0+IGNvcHlQYXRoKGl0ZW0ucGF0aCl9PlxuICAgICAgICAgICAgICAgICAgICBDb3B5IHBhdGhcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiZGFuZ2VyXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2J1c3lJZCA9PT0gaXRlbS5pZH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlKGl0ZW0uaWQsIGl0ZW0ubmFtZSl9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtidXN5SWQgPT09IGl0ZW0uaWQgPyA8SWNvbiBpY29uPVwiTG9hZGVyXCIgc3BpbiAvPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIERlbGV0ZVxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxUZXh0IG10PVwieGxcIj5ObyBpbWFnZXMgaW4gdGhpcyBmb2xkZXIgeWV0LjwvVGV4dD5cbiAgICAgICAgKX1cbiAgICAgIDwvc2VjdGlvbj5cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZWRpYUxpYnJhcnlcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBIMywgSWNvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VOb3RpY2UsIHVzZVJlY29yZCB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgeyBGbGFnQ2FyZCB9IGZyb20gJy4vZm9ybS1jb250cm9scy5qc3gnXG5cbmNvbnN0IFRheEVkaXQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQ6IGluaXRpYWxSZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wc1xuICBjb25zdCB7IHJlY29yZCwgaGFuZGxlQ2hhbmdlLCBzdWJtaXQ6IGhhbmRsZVN1Ym1pdCwgbG9hZGluZyB9ID0gdXNlUmVjb3JkKFxuICAgIGluaXRpYWxSZWNvcmQsXG4gICAgcmVzb3VyY2UuaWQsXG4gIClcbiAgY29uc3QgYWRkTm90aWNlID0gdXNlTm90aWNlKClcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge31cblxuICBjb25zdCBzZXRGaWVsZCA9IChrZXksIHZhbHVlKSA9PiBoYW5kbGVDaGFuZ2Uoa2V5LCB2YWx1ZSlcblxuICBjb25zdCBpc1RheGFibGVCb29sID0gcGFyYW1zLmlzVGF4YWJsZSA9PT0gdHJ1ZSB8fCBwYXJhbXMuaXNUYXhhYmxlID09PSAndHJ1ZScgfHwgcGFyYW1zLmlzVGF4YWJsZSA9PT0gMVxuXG4gIGNvbnN0IGhhbmRsZVRheGFibGVUb2dnbGUgPSAodmFsdWUpID0+IHtcbiAgICBzZXRGaWVsZCgnaXNUYXhhYmxlJywgdmFsdWUpXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgc2V0RmllbGQoJ2dzdFJhdGUnLCAwKVxuICAgIH0gZWxzZSBpZiAoTnVtYmVyKHBhcmFtcy5nc3RSYXRlIHx8IDApID09PSAwKSB7XG4gICAgICBzZXRGaWVsZCgnZ3N0UmF0ZScsIDUpXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgb25TdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudD8ucHJldmVudERlZmF1bHQ/LigpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGhhbmRsZVN1Ym1pdCgpXG4gICAgICBhZGROb3RpY2UoeyBtZXNzYWdlOiAnVGF4IGNvbmZpZ3VyYXRpb24gdXBkYXRlZCBzdWNjZXNzZnVsbHkuJywgdHlwZTogJ3N1Y2Nlc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGFkZE5vdGljZSh7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byB1cGRhdGUgdGF4IGNvbmZpZ3VyYXRpb24nLCB0eXBlOiAnZXJyb3InIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IGFzPVwiZm9ybVwiIG9uU3VibWl0PXtvblN1Ym1pdH0gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWZvcm1cIj5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWhlYWRcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8SDM+e3BhcmFtcy5wcm9kdWN0TmFtZSB8fCAnRWRpdCBQcm9kdWN0IFRheCd9PC9IMz5cbiAgICAgICAgICA8VGV4dCBvcGFjaXR5PXswLjd9PlxuICAgICAgICAgICAgQ29uZmlndXJlIEhTTiBjb2RlIGFuZCBHU1QgcGVyY2VudGFnZSBmb3IgdGhpcyBwcm9kdWN0LlxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0JveD5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlByb2R1Y3QgZGV0YWlsczwvaDQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWdyaWRcIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBQcm9kdWN0IG5hbWVcbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24taW5wdXRcIlxuICAgICAgICAgICAgICB2YWx1ZT17cGFyYW1zLnByb2R1Y3ROYW1lIHx8ICcnfVxuICAgICAgICAgICAgICBkaXNhYmxlZFxuICAgICAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiAwLjcsIGN1cnNvcjogJ25vdC1hbGxvd2VkJyB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIENhdGVnb3J5XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5jYXRlZ29yeU5hbWUgfHwgJ0dlbmVyYWwnfVxuICAgICAgICAgICAgICBkaXNhYmxlZFxuICAgICAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiAwLjcsIGN1cnNvcjogJ25vdC1hbGxvd2VkJyB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PlRheGFiaWxpdHkgc3RhdHVzPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jaG9pY2Utcm93XCI+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17aXNUYXhhYmxlQm9vbH1cbiAgICAgICAgICAgIHRpdGxlPVwiVGF4YWJsZSAoWWVzKVwiXG4gICAgICAgICAgICBoaW50PVwiQ2hhcmdlIEdTVCBhdCBjaGVja291dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUYXhhYmxlVG9nZ2xlKHRydWUpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZsYWdDYXJkXG4gICAgICAgICAgICBzZWxlY3RlZD17IWlzVGF4YWJsZUJvb2x9XG4gICAgICAgICAgICB0aXRsZT1cIk5vbi10YXhhYmxlIChObylcIlxuICAgICAgICAgICAgaGludD1cIjAlIEdTVCAoRnJlc2ggZnJ1aXRzKVwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUYXhhYmxlVG9nZ2xlKGZhbHNlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWNhcmRcIj5cbiAgICAgICAgPGg0PkdTVCAmIEhTTiBkZXRhaWxzPC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tZ3JpZFwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0b2tyaS1jb3Vwb24tbGFiZWxcIj5cbiAgICAgICAgICAgIEhTTiBjb2RlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdmFsdWU9e3BhcmFtcy5oc25Db2RlIHx8ICcwODA4J31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2hzbkNvZGUnLCBldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gMDgwMiBmb3IgZHJ5IGZydWl0cywgMDgwOCBmb3IgZnJlc2ggZnJ1aXRzXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWxhYmVsXCI+XG4gICAgICAgICAgICBHU1QgJSByYXRlXG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWlucHV0XCJcbiAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgIG1heD1cIjEwMFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtwYXJhbXMuZ3N0UmF0ZSA/PyAoaXNUYXhhYmxlQm9vbCA/IDUgOiAwKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0RmllbGQoJ2dzdFJhdGUnLCBOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKSB8fCAwKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIDUgZm9yIGRyeSBmcnVpdHNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFRleHQgbXQ9XCJzbVwiIG9wYWNpdHk9ezAuN30gZm9udFNpemU9XCIxMnB4XCI+XG4gICAgICAgICAge2lzVGF4YWJsZUJvb2xcbiAgICAgICAgICAgID8gYEF0IGNoZWNrb3V0LCBpbnRyYS1zdGF0ZSBvcmRlcnMgc3BsaXQgaW50byAkeyhOdW1iZXIocGFyYW1zLmdzdFJhdGUgfHwgNSkgLyAyKS50b0ZpeGVkKDEpfSUgQ0dTVCArICR7KE51bWJlcihwYXJhbXMuZ3N0UmF0ZSB8fCA1KSAvIDIpLnRvRml4ZWQoMSl9JSBTR1NUOyBpbnRlci1zdGF0ZSBvcmRlcnMgY2hhcmdlICR7TnVtYmVyKHBhcmFtcy5nc3RSYXRlIHx8IDUpfSUgSUdTVC5gXG4gICAgICAgICAgICA6ICdQcm9kdWN0IGlzIGV4ZW1wdC9ub24tdGF4YWJsZSAoMCUgR1NUKS4nfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIDxCb3ggY2xhc3NOYW1lPVwidG9rcmktY291cG9uLWFjdGlvbnNcIj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiY29udGFpbmVkXCIgdHlwZT1cInN1Ym1pdFwiIGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IDxJY29uIGljb249XCJMb2FkZXJcIiBzcGluIC8+IDogbnVsbH1cbiAgICAgICAgICBTYXZlIHRheCBzZXR0aW5nc1xuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRheEVkaXRcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBCb3gsXG4gIEJ1dHRvbixcbiAgRm9ybUdyb3VwLFxuICBIMixcbiAgSW5wdXQsXG4gIExhYmVsLFxuICBNZXNzYWdlQm94LFxuICBUZXh0LFxufSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBSRU1FTUJFUkVEX0xPR0lOX0tFWSA9ICd0b2tyaV9hZG1pbl9sb2dpbidcblxuY29uc3QgTG9naW4gPSAoKSA9PiB7XG4gIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHdpbmRvdy5fX0FQUF9TVEFURV9fIHx8IHt9XG4gIGNvbnN0IHsgdHJhbnNsYXRlTWVzc2FnZSB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBhZG1pblJvb3QgPSBhY3Rpb24/LnJlcGxhY2UoL1xcL2xvZ2luJC8sICcnKSB8fCAnJ1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZFVybCA9IGAke2FkbWluUm9vdH0vZm9yZ290LXBhc3N3b3JkYFxuICBjb25zdCBbaWRlbnRpZmllciwgc2V0SWRlbnRpZmllcl0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW3JlbWVtYmVyTG9naW4sIHNldFJlbWVtYmVyTG9naW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtzaG93UGFzc3dvcmQsIHNldFNob3dQYXNzd29yZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlbWVtYmVyZWRMb2dpbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRU1FTUJFUkVEX0xPR0lOX0tFWSlcbiAgICBpZiAocmVtZW1iZXJlZExvZ2luKSB7XG4gICAgICBzZXRJZGVudGlmaWVyKHJlbWVtYmVyZWRMb2dpbilcbiAgICAgIHNldFJlbWVtYmVyTG9naW4odHJ1ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGZvcm0gPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZW1haWxJbnB1dCA9IGZvcm0uZWxlbWVudHMubmFtZWRJdGVtKCdlbWFpbCcpXG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgKGVtYWlsSW5wdXQgJiYgJ3ZhbHVlJyBpbiBlbWFpbElucHV0ID8gU3RyaW5nKGVtYWlsSW5wdXQudmFsdWUpIDogaWRlbnRpZmllcikudHJpbSgpXG5cbiAgICBpZiAoZW1haWxJbnB1dCAmJiAndmFsdWUnIGluIGVtYWlsSW5wdXQpIHtcbiAgICAgIGVtYWlsSW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgIH1cblxuICAgIGlmIChyZW1lbWJlckxvZ2luICYmIHZhbHVlKSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVksIHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oUkVNRU1CRVJFRF9MT0dJTl9LRVkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBmbGV4XG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgIG1pbkhlaWdodD1cIjEwMHZoXCJcbiAgICAgIGJnPVwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzAyMmMyMiwgIzA0Nzg1NylcIlxuICAgICAgcD1cInhsXCJcbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIGJnPVwid2hpdGVcIlxuICAgICAgICB3aWR0aD17WycxMDAlJywgJzQ0MHB4J119XG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjE4cHhcIlxuICAgICAgICBib3hTaGFkb3c9XCIwIDI0cHggNzBweCByZ2JhKDIsIDQ0LCAzNCwgMC4zNSlcIlxuICAgICAgICBwPVwieDNcIlxuICAgICAgPlxuICAgICAgICA8SDIgY29sb3I9XCIjMDIyYzIyXCIgbWI9XCJzbVwiPlRva3JpaWkgQ01TPC9IMj5cbiAgICAgICAgPFRleHQgY29sb3I9XCIjNjQ3NDhiXCIgbWI9XCJ4bFwiPlxuICAgICAgICAgIFNpZ24gaW4gd2l0aCB5b3VyIGFkbWluIGVtYWlsIG9yIHVzZXJuYW1lIHRvIG1hbmFnZSBwcm9kdWN0cywgb3JkZXJzLCBhbmQgY29udGVudC5cbiAgICAgICAgPC9UZXh0PlxuXG4gICAgICAgIHtlcnJvck1lc3NhZ2UgPyAoXG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIG1iPVwibGdcIlxuICAgICAgICAgICAgbWVzc2FnZT17ZXJyb3JNZXNzYWdlLnNwbGl0KCcgJykubGVuZ3RoID4gMSA/IGVycm9yTWVzc2FnZSA6IHRyYW5zbGF0ZU1lc3NhZ2UoZXJyb3JNZXNzYWdlKX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJkYW5nZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIDxCb3ggYXM9XCJmb3JtXCIgYWN0aW9uPXthY3Rpb259IG1ldGhvZD1cIlBPU1RcIiBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cbiAgICAgICAgICA8Rm9ybUdyb3VwPlxuICAgICAgICAgICAgPExhYmVsIHJlcXVpcmVkPkVtYWlsIG9yIHVzZXJuYW1lPC9MYWJlbD5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwidXNlcm5hbWVcIlxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2lkZW50aWZpZXJ9XG4gICAgICAgICAgICAgIGtleT17aWRlbnRpZmllciB8fCAnbG9naW4tZW1haWwnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0Zvcm1Hcm91cD5cblxuICAgICAgICAgIDxGb3JtR3JvdXA+XG4gICAgICAgICAgICA8TGFiZWwgcmVxdWlyZWQ+UGFzc3dvcmQ8L0xhYmVsPlxuICAgICAgICAgICAgPEJveCBwb3NpdGlvbj1cInJlbGF0aXZlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9e3Nob3dQYXNzd29yZCA/ICd0ZXh0JyA6ICdwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJjdXJyZW50LXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBwYWRkaW5nUmlnaHQ6IDQyIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtzaG93UGFzc3dvcmQgPyAnSGlkZSBwYXNzd29yZCcgOiAnU2hvdyBwYXNzd29yZCd9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1Bhc3N3b3JkKCh2YWx1ZSkgPT4gIXZhbHVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICAgICAgICAgIHRvcDogJzUwJScsXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyMwNDc4NTcnLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMjYsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI2LFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3Nob3dQYXNzd29yZCA/IChcbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyAzbDE4IDE4XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMC42IDEwLjZBMiAyIDAgMCAwIDEzLjQgMTMuNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOS45IDQuMkExMC43IDEwLjcgMCAwIDEgMTIgNGM1IDAgOSA0LjUgMTAgOGExMi44IDEyLjggMCAwIDEtMi4xIDMuNlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNi42IDYuNkM0LjMgOCAyLjcgMTAuMiAyIDEyYzEgMy41IDUgOCAxMCA4IDEuNSAwIDIuOS0uNCA0LjEtMVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjIwXCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjBcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDEyczQtNyAxMC03IDEwIDcgMTAgNy00IDctMTAgN1MyIDEyIDIgMTJ6XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Gb3JtR3JvdXA+XG5cbiAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZD1cInJlbWVtYmVyLWxvZ2luXCJcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgY2hlY2tlZD17cmVtZW1iZXJMb2dpbn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UmVtZW1iZXJMb2dpbihldmVudC50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiA4IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJyZW1lbWJlci1sb2dpblwiIHN0eWxlPXt7IGNvbG9yOiAnIzQ3NTU2OScsIGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICAgICAgUmVtZW1iZXIgbXkgZW1haWwgb3IgdXNlcm5hbWUgb24gdGhpcyBkZXZpY2VcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgd2lkdGg9XCIxMDAlXCIgbXQ9XCJsZ1wiPlxuICAgICAgICAgICAgU2lnbiBpblxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0JveD5cblxuICAgICAgICA8VGV4dCBtdD1cInhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj17Zm9yZ290UGFzc3dvcmRVcmx9IHN0eWxlPXt7IGNvbG9yOiAnIzA0Nzg1NycsIGZvbnRXZWlnaHQ6IDcwMCB9fT5cbiAgICAgICAgICAgIEZvcmdvdCBwYXNzd29yZD9cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2luXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQm94LCBCdXR0b25Hcm91cCwgTWVzc2FnZUJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyB1c2VGaWx0ZXJEcmF3ZXIsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcydcblxuZnVuY3Rpb24gYWRtaW5Sb290UGF0aCgpIHtcbiAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubWF0Y2goL14oLiopXFwvcmVzb3VyY2VzXFwvLylcbiAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvJC8sICcnKVxufVxuXG5mdW5jdGlvbiBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpIHtcbiAgaWYgKHJlc291cmNlSWQgPT09ICdDYXRlZ29yeScpIHtcbiAgICByZXR1cm4geyBleHBvcnRVcmw6ICdjYXRlZ29yaWVzL2V4cG9ydCcsIGltcG9ydFVybDogJ2NhdGVnb3JpZXMvaW1wb3J0JyB9XG4gIH1cbiAgaWYgKHJlc291cmNlSWQgPT09ICdQcm9kdWN0Jykge1xuICAgIHJldHVybiB7IGV4cG9ydFVybDogJ3Byb2R1Y3RzL2V4cG9ydCcsIGltcG9ydFVybDogJ3Byb2R1Y3RzL2ltcG9ydCcgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENhdGFsb2dMaXN0SGVhZGVyQWN0aW9ucyh7IHJlc291cmNlLCBvbkltcG9ydGVkIH0pIHtcbiAgY29uc3QgeyB0cmFuc2xhdGVCdXR0b24sIHRyYW5zbGF0ZUFjdGlvbiB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IHRvZ2dsZUZpbHRlciwgZmlsdGVyc0NvdW50IH0gPSB1c2VGaWx0ZXJEcmF3ZXIoKVxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUobnVsbClcbiAgY29uc3QgZmlsZVJlZiA9IHVzZVJlZihudWxsKVxuXG4gIGNvbnN0IHJlc291cmNlSWQgPSByZXNvdXJjZS5pZFxuICBjb25zdCBjb25maWcgPSBjYXRhbG9nQ29uZmlnKHJlc291cmNlSWQpXG4gIGNvbnN0IHJvb3QgPSBhZG1pblJvb3RQYXRoKClcblxuICBjb25zdCBoYW5kbGVJbXBvcnQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF1cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSAnJ1xuICAgIGlmICghZmlsZSB8fCAhY29uZmlnKSByZXR1cm5cblxuICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICBzZXRNZXNzYWdlKG51bGwpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSlcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtyb290fS9jYXRhbG9nLyR7Y29uZmlnLmltcG9ydFVybH1gLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSlcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBlcnJvckNvdW50ID0gZGF0YS5lcnJvcnM/Lmxlbmd0aCB8fCAwXG4gICAgICBzZXRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogZXJyb3JDb3VudCA/ICdpbmZvJyA6ICdzdWNjZXNzJyxcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICBlcnJvckNvdW50ID4gMFxuICAgICAgICAgICAgPyBgSW1wb3J0IGZpbmlzaGVkLiAke2RhdGEuY3JlYXRlZH0gYWRkZWQsICR7ZGF0YS51cGRhdGVkfSB1cGRhdGVkLiAke2Vycm9yQ291bnR9IHJvdyhzKSBjb3VsZCBub3QgYmUgaW1wb3J0ZWQuIEV4aXN0aW5nIHJvd3MgYXJlIG1hdGNoZWQgYnkgc2x1Zy5gXG4gICAgICAgICAgICA6IGBJbXBvcnQgZmluaXNoZWQuICR7ZGF0YS5jcmVhdGVkfSBhZGRlZCwgJHtkYXRhLnVwZGF0ZWR9IHVwZGF0ZWQuIEV4aXN0aW5nIHJvd3MgYXJlIG1hdGNoZWQgYnkgc2x1ZyDigJQga2VlcCBzbHVnIHRoZSBzYW1lIHRvIHVwZGF0ZSBwcmljZS5gLFxuICAgICAgfSlcbiAgICAgIG9uSW1wb3J0ZWQ/LigpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiAnZGFuZ2VyJywgdGV4dDogZXJyb3IubWVzc2FnZSB8fCAnSW1wb3J0IGZhaWxlZC4nIH0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnV0dG9ucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghY29uZmlnKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0V4cG9ydCBDU1YnLFxuICAgICAgICB2YXJpYW50OiAndGV4dCcsXG4gICAgICAgIGhyZWY6IGAke3Jvb3R9L2NhdGFsb2cvJHtjb25maWcuZXhwb3J0VXJsfWAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0V4cG9ydCBFeGNlbCcsXG4gICAgICAgIHZhcmlhbnQ6ICd0ZXh0JyxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vY2F0YWxvZy8ke2NvbmZpZy5leHBvcnRVcmx9P2Zvcm1hdD14bHN4YCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBsb2FkaW5nID8gJ0ltcG9ydGluZy4uLicgOiAnSW1wb3J0JyxcbiAgICAgICAgdmFyaWFudDogJ3RleHQnLFxuICAgICAgICBvbkNsaWNrOiBsb2FkaW5nID8gdW5kZWZpbmVkIDogKCkgPT4gZmlsZVJlZi5jdXJyZW50Py5jbGljaygpLFxuICAgICAgfSxcbiAgICBdXG5cbiAgICBjb25zdCBuZXdBY3Rpb24gPSByZXNvdXJjZS5yZXNvdXJjZUFjdGlvbnM/LmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uLm5hbWUgPT09ICduZXcnKVxuICAgIGlmIChuZXdBY3Rpb24pIHtcbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICBpY29uOiBuZXdBY3Rpb24uaWNvbixcbiAgICAgICAgbGFiZWw6IHRyYW5zbGF0ZUFjdGlvbihuZXdBY3Rpb24ubGFiZWwsIHJlc291cmNlSWQpLFxuICAgICAgICB2YXJpYW50OiBuZXdBY3Rpb24udmFyaWFudCxcbiAgICAgICAgaHJlZjogYCR7cm9vdH0vcmVzb3VyY2VzLyR7cmVzb3VyY2VJZH0vYWN0aW9ucy9uZXdgLFxuICAgICAgICAnZGF0YS1jc3MnOiBgJHtyZXNvdXJjZUlkfS1uZXctYnV0dG9uYCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyS2V5ID0gZmlsdGVyc0NvdW50ID4gMCA/ICdmaWx0ZXJBY3RpdmUnIDogJ2ZpbHRlcidcbiAgICBpdGVtcy5wdXNoKHtcbiAgICAgIGxhYmVsOiB0cmFuc2xhdGVCdXR0b24oZmlsdGVyS2V5LCByZXNvdXJjZUlkLCB7IGNvdW50OiBmaWx0ZXJzQ291bnQgfSksXG4gICAgICBvbkNsaWNrOiB0b2dnbGVGaWx0ZXIsXG4gICAgICBpY29uOiAnRmlsdGVyJyxcbiAgICAgICdkYXRhLWNzcyc6IGAke3Jlc291cmNlSWR9LWZpbHRlci1idXR0b25gLFxuICAgIH0pXG5cbiAgICByZXR1cm4gaXRlbXNcbiAgfSwgW1xuICAgIGNvbmZpZyxcbiAgICByb290LFxuICAgIGxvYWRpbmcsXG4gICAgcmVzb3VyY2UucmVzb3VyY2VBY3Rpb25zLFxuICAgIHJlc291cmNlSWQsXG4gICAgdHJhbnNsYXRlQWN0aW9uLFxuICAgIHRyYW5zbGF0ZUJ1dHRvbixcbiAgICBmaWx0ZXJzQ291bnQsXG4gICAgdG9nZ2xlRmlsdGVyLFxuICBdKVxuXG4gIGlmICghY29uZmlnKSByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxCb3hcbiAgICAgICAgbXQ9XCJ4bFwiXG4gICAgICAgIG1iPVwiZGVmYXVsdFwiXG4gICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJmbGV4LWVuZFwiXG4gICAgICAgIGZsZXhTaHJpbms9ezB9XG4gICAgICAgIHB4PXtbJ2RlZmF1bHQnLCAwXX1cbiAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiAnLTUycHgnIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25Hcm91cCBidXR0b25zPXtidXR0b25zfSAvPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZWY9e2ZpbGVSZWZ9XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIGFjY2VwdD1cIi5jc3YsLnhsc3gsdGV4dC9jc3YsYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXRcIlxuICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVJbXBvcnR9XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8Qm94IG1iPVwiZGVmYXVsdFwiIHB4PXtbJ2RlZmF1bHQnLCAwXX0+XG4gICAgICAgICAgPE1lc3NhZ2VCb3hcbiAgICAgICAgICAgIHZhcmlhbnQ9e21lc3NhZ2UudHlwZX1cbiAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2UudGV4dH1cbiAgICAgICAgICAgIG9uQ2xvc2VDbGljaz17KCkgPT4gc2V0TWVzc2FnZShudWxsKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgPC8+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXG5pbXBvcnQgeyBPcmlnaW5hbEFjdGlvbkhlYWRlciB9IGZyb20gJ2FkbWluanMnXG5pbXBvcnQgQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIGZyb20gJy4vY2F0YWxvZy1saXN0LWhlYWRlci1hY3Rpb25zLmpzeCdcblxuY29uc3QgQ0FUQUxPR19SRVNPVVJDRVMgPSBuZXcgU2V0KFsnUHJvZHVjdCcsICdDYXRlZ29yeSddKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBY3Rpb25IZWFkZXIocHJvcHMpIHtcbiAgY29uc3QgeyBPcmlnaW5hbENvbXBvbmVudCwgYWN0aW9uLCByZXNvdXJjZSB9ID0gcHJvcHNcbiAgY29uc3QgQmFzZUhlYWRlciA9IE9yaWdpbmFsQ29tcG9uZW50IHx8IE9yaWdpbmFsQWN0aW9uSGVhZGVyXG4gIGNvbnN0IGlzQ2F0YWxvZ0xpc3QgPSBhY3Rpb24/Lm5hbWUgPT09ICdsaXN0JyAmJiBDQVRBTE9HX1JFU09VUkNFUy5oYXMocmVzb3VyY2U/LmlkKVxuXG4gIGlmICghaXNDYXRhbG9nTGlzdCkge1xuICAgIHJldHVybiA8QmFzZUhlYWRlciB7Li4ucHJvcHN9IC8+XG4gIH1cblxuICBjb25zdCB7IE9yaWdpbmFsQ29tcG9uZW50OiBfaWdub3JlZCwgLi4uaGVhZGVyUHJvcHMgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAgPEJhc2VIZWFkZXIgey4uLmhlYWRlclByb3BzfSBvbWl0QWN0aW9ucyAvPlxuICAgICAgPENhdGFsb2dMaXN0SGVhZGVyQWN0aW9uc1xuICAgICAgICByZXNvdXJjZT17cmVzb3VyY2V9XG4gICAgICAgIG9uSW1wb3J0ZWQ9e3Byb3BzLmFjdGlvblBlcmZvcm1lZH1cbiAgICAgIC8+XG4gICAgPC9Cb3g+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBtZW1vLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSwgTGFiZWwsIFRpbnlNQ0UgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsdWdpbnM6IFtcbiAgICAnY29kZScsXG4gICAgJ2xpbmsnLFxuICAgICdsaXN0cycsXG4gICAgJ2ltYWdlJyxcbiAgICAndGFibGUnLFxuICAgICdhdXRvbGluaycsXG4gICAgJ3ByZXZpZXcnLFxuICAgICdzZWFyY2hyZXBsYWNlJyxcbiAgICAnd29yZGNvdW50JyxcbiAgICAnbWVkaWEnLFxuICAgICdjb2Rlc2FtcGxlJyxcbiAgXSxcbiAgdG9vbGJhcjpcbiAgICAndW5kbyByZWRvIHwgYmxvY2tzIHwgYm9sZCBpdGFsaWMgdW5kZXJsaW5lIHN0cmlrZXRocm91Z2ggfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCBhbGlnbmp1c3RpZnkgfCBidWxsaXN0IG51bWxpc3Qgb3V0ZGVudCBpbmRlbnQgfCBsaW5rIGltYWdlIHRhYmxlIGNvZGVzYW1wbGUgfCBjb2RlIHwgcmVtb3ZlZm9ybWF0JyxcbiAgaGVpZ2h0OiA0MDAsXG59XG5cbmNvbnN0IFJpY2h0ZXh0RWRpdCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wc1xuICBjb25zdCB2YWx1ZSA9IHJlY29yZC5wYXJhbXM/Lltwcm9wZXJ0eS5wYXRoXSA/PyAnJ1xuICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgb25DaGFuZ2UocHJvcGVydHkucGF0aCwgbmV3VmFsdWUpXG4gICAgfSxcbiAgICBbb25DaGFuZ2UsIHByb3BlcnR5LnBhdGhdLFxuICApXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAuLi5ERUZBVUxUX09QVElPTlMsXG4gICAgLi4uKHByb3BlcnR5LnByb3BzIHx8IHt9KSxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEZvcm1Hcm91cCBlcnJvcj17Qm9vbGVhbihlcnJvcil9PlxuICAgICAgPExhYmVsIHJlcXVpcmVkPXtwcm9wZXJ0eS5pc1JlcXVpcmVkfT57cHJvcGVydHkubGFiZWx9PC9MYWJlbD5cbiAgICAgIDxUaW55TUNFIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e2hhbmRsZVVwZGF0ZX0gb3B0aW9ucz17b3B0aW9uc30gLz5cbiAgICAgIDxGb3JtTWVzc2FnZT57ZXJyb3I/Lm1lc3NhZ2V9PC9Gb3JtTWVzc2FnZT5cbiAgICA8L0Zvcm1Hcm91cD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFJpY2h0ZXh0RWRpdClcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHsgdXNlTG9jYXRpb24sIHVzZU5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xuXG5mdW5jdGlvbiBhZG1pblJvb3QocGF0aG5hbWUpIHtcbiAgY29uc3QgY3V0ID0gcGF0aG5hbWUuc2VhcmNoKC9cXC8ocmVzb3VyY2VzfHBhZ2VzKShcXC98JCkvKVxuICBjb25zdCByb290ID0gY3V0ID09PSAtMSA/IHBhdGhuYW1lIDogcGF0aG5hbWUuc2xpY2UoMCwgY3V0KVxuICByZXR1cm4gcm9vdC5yZXBsYWNlKC9cXC8kLywgJycpIHx8ICcvJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWRlYmFyUmVzb3VyY2VTZWN0aW9uKHByb3BzKSB7XG4gIGNvbnN0IE9yaWdpbmFsID0gcHJvcHMuT3JpZ2luYWxDb21wb25lbnRcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpXG4gIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKVxuICBjb25zdCBocmVmID0gYWRtaW5Sb290KGxvY2F0aW9uLnBhdGhuYW1lKVxuICBjb25zdCBzZWxlY3RlZCA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyQvLCAnJykgPT09IGhyZWYucmVwbGFjZSgvXFwvJC8sICcnKSB8fCBsb2NhdGlvbi5wYXRobmFtZSA9PT0gYCR7aHJlZn0vYFxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxhXG4gICAgICAgIGNsYXNzTmFtZT17YHRva3JpLXNpZGViYXItZGFzaGJvYXJkJHtzZWxlY3RlZCA/ICcgaXMtYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgIGhyZWY9e2hyZWZ9XG4gICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBuYXZpZ2F0ZShocmVmKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8SWNvbiBpY29uPVwiSG9tZVwiIC8+XG4gICAgICAgIDxzcGFuPkRhc2hib2FyZDwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICAgIHtPcmlnaW5hbCA/IDxPcmlnaW5hbCByZXNvdXJjZXM9e3Byb3BzLnJlc291cmNlc30gLz4gOiBudWxsfVxuICAgIDwvPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBMb2FkZXIsIFRhYmxlLCBUYWJsZUJvZHkgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuaW1wb3J0IHtcbiAgTm9SZWNvcmRzLFxuICBSZWNvcmRJbkxpc3QsXG4gIFJlY29yZHNUYWJsZUhlYWRlcixcbiAgU2VsZWN0ZWRSZWNvcmRzLFxufSBmcm9tICdhZG1pbmpzJ1xuXG5jb25zdCBnZXRSZXNvdXJjZUVsZW1lbnRDc3MgPSAocmVzb3VyY2VJZCwgc3VmZml4KSA9PiBgJHtyZXNvdXJjZUlkfS0ke3N1ZmZpeH1gXG5cbi8qKlxuICogQWRtaW5KUyBtYXJrcyB0aGUgaGVhZGVyIGNoZWNrYm94IGNoZWNrZWQgd2hlbiBBTlkgcm93IGlzIHNlbGVjdGVkLlxuICogT3ZlcnJpZGUgc286IG5vbmUgPSB1bmNoZWNrZWQsIHNvbWUgPSBpbmRldGVybWluYXRlLCBhbGwgPSBjaGVja2VkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWNvcmRzVGFibGUocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHJlc291cmNlLFxuICAgIHJlY29yZHMsXG4gICAgYWN0aW9uUGVyZm9ybWVkLFxuICAgIHNvcnRCeSxcbiAgICBkaXJlY3Rpb24sXG4gICAgaXNMb2FkaW5nLFxuICAgIG9uU2VsZWN0LFxuICAgIHNlbGVjdGVkUmVjb3JkcyxcbiAgICBvblNlbGVjdEFsbCxcbiAgfSA9IHByb3BzXG5cbiAgaWYgKCFyZWNvcmRzLmxlbmd0aCkge1xuICAgIGlmIChpc0xvYWRpbmcpIHJldHVybiA8TG9hZGVyIC8+XG4gICAgcmV0dXJuIDxOb1JlY29yZHMgcmVzb3VyY2U9e3Jlc291cmNlfSAvPlxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWRDb3VudCA9IHNlbGVjdGVkUmVjb3Jkc1xuICAgID8gcmVjb3Jkcy5maWx0ZXIoKHJlY29yZCkgPT4gc2VsZWN0ZWRSZWNvcmRzLnNvbWUoKHNlbGVjdGVkKSA9PiBzZWxlY3RlZC5pZCA9PT0gcmVjb3JkLmlkKSkubGVuZ3RoXG4gICAgOiAwXG4gIGNvbnN0IHNlbGVjdGVkQWxsID0gc2VsZWN0ZWRDb3VudCA+IDAgJiYgc2VsZWN0ZWRDb3VudCA9PT0gcmVjb3Jkcy5sZW5ndGhcbiAgY29uc3QgaW5kZXRlcm1pbmF0ZSA9IHNlbGVjdGVkQ291bnQgPiAwICYmIHNlbGVjdGVkQ291bnQgPCByZWNvcmRzLmxlbmd0aFxuICBjb25zdCByZWNvcmRzSGF2ZUJ1bGtBY3Rpb24gPSAhIXJlY29yZHMuZmluZCgocmVjb3JkKSA9PiByZWNvcmQuYnVsa0FjdGlvbnMubGVuZ3RoKVxuXG4gIGNvbnN0IGNvbnRlbnRUYWcgPSBnZXRSZXNvdXJjZUVsZW1lbnRDc3MocmVzb3VyY2UuaWQsICd0YWJsZScpXG4gIGNvbnN0IHNlbGVjdGVkVGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHJlc291cmNlLmlkLCAndGFibGUtc2VsZWN0ZWQtcmVjb3JkcycpXG4gIGNvbnN0IGJvZHlUYWcgPSBnZXRSZXNvdXJjZUVsZW1lbnRDc3MocmVzb3VyY2UuaWQsICd0YWJsZS1ib2R5JylcblxuICByZXR1cm4gKFxuICAgIDxUYWJsZSBkYXRhLWNzcz17Y29udGVudFRhZ30+XG4gICAgICA8U2VsZWN0ZWRSZWNvcmRzXG4gICAgICAgIHJlc291cmNlPXtyZXNvdXJjZX1cbiAgICAgICAgc2VsZWN0ZWRSZWNvcmRzPXtzZWxlY3RlZFJlY29yZHN9XG4gICAgICAgIGRhdGEtY3NzPXtzZWxlY3RlZFRhZ31cbiAgICAgIC8+XG4gICAgICA8UmVjb3Jkc1RhYmxlSGVhZGVyXG4gICAgICAgIHByb3BlcnRpZXM9e3Jlc291cmNlLmxpc3RQcm9wZXJ0aWVzfVxuICAgICAgICB0aXRsZVByb3BlcnR5PXtyZXNvdXJjZS50aXRsZVByb3BlcnR5fVxuICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgIG9uU2VsZWN0QWxsPXtyZWNvcmRzSGF2ZUJ1bGtBY3Rpb24gPyBvblNlbGVjdEFsbCA6IHVuZGVmaW5lZH1cbiAgICAgICAgc2VsZWN0ZWRBbGw9e3NlbGVjdGVkQWxsfVxuICAgICAgICBpbmRldGVybWluYXRlPXtpbmRldGVybWluYXRlfVxuICAgICAgLz5cbiAgICAgIDxUYWJsZUJvZHkgZGF0YS1jc3M9e2JvZHlUYWd9PlxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4gKFxuICAgICAgICAgIDxSZWNvcmRJbkxpc3RcbiAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgcmVzb3VyY2U9e3Jlc291cmNlfVxuICAgICAgICAgICAga2V5PXtyZWNvcmQuaWR9XG4gICAgICAgICAgICBhY3Rpb25QZXJmb3JtZWQ9e2FjdGlvblBlcmZvcm1lZH1cbiAgICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0fVxuICAgICAgICAgICAgaXNTZWxlY3RlZD17XG4gICAgICAgICAgICAgIHNlbGVjdGVkUmVjb3JkcyAmJiAhIXNlbGVjdGVkUmVjb3Jkcy5maW5kKChzZWxlY3RlZCkgPT4gc2VsZWN0ZWQuaWQgPT09IHJlY29yZC5pZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvVGFibGVCb2R5PlxuICAgIDwvVGFibGU+XG4gIClcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgVGFibGVDZWxsLCBUYWJsZUhlYWQsIFRhYmxlUm93IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSdcbmltcG9ydCB7IFByb3BlcnR5SGVhZGVyIH0gZnJvbSAnYWRtaW5qcydcblxuY29uc3QgZ2V0UmVzb3VyY2VFbGVtZW50Q3NzID0gKHJlc291cmNlSWQsIHN1ZmZpeCkgPT4gYCR7cmVzb3VyY2VJZH0tJHtzdWZmaXh9YFxuXG5jb25zdCBkaXNwbGF5ID0gKGlzVGl0bGUpID0+IFtcbiAgaXNUaXRsZSA/ICd0YWJsZS1jZWxsJyA6ICdub25lJyxcbiAgaXNUaXRsZSA/ICd0YWJsZS1jZWxsJyA6ICdub25lJyxcbiAgJ3RhYmxlLWNlbGwnLFxuICAndGFibGUtY2VsbCcsXG5dXG5cbmZ1bmN0aW9uIFNlbGVjdEFsbENoZWNrQm94KHsgY2hlY2tlZCwgaW5kZXRlcm1pbmF0ZSwgb25DaGFuZ2UgfSkge1xuICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZihudWxsKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQuaW5kZXRlcm1pbmF0ZSA9IEJvb2xlYW4oaW5kZXRlcm1pbmF0ZSlcbiAgICB9XG4gIH0sIFtpbmRldGVybWluYXRlLCBjaGVja2VkXSlcblxuICByZXR1cm4gKFxuICAgIDxsYWJlbFxuICAgICAgY2xhc3NOYW1lPXtgdG9rcmktc2VsZWN0LWFsbCR7aW5kZXRlcm1pbmF0ZSA/ICcgaXMtaW5kZXRlcm1pbmF0ZScgOiAnJ30ke2NoZWNrZWQgPyAnIGlzLWNoZWNrZWQnIDogJyd9YH1cbiAgICAgIHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDUgfX1cbiAgICA+XG4gICAgICA8aW5wdXRcbiAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgY2hlY2tlZD17Qm9vbGVhbihjaGVja2VkKX1cbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBhcmlhLWNoZWNrZWQ9e2luZGV0ZXJtaW5hdGUgPyAnbWl4ZWQnIDogY2hlY2tlZCA/ICd0cnVlJyA6ICdmYWxzZSd9XG4gICAgICAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidG9rcmktc2VsZWN0LWFsbC1ib3hcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAge2luZGV0ZXJtaW5hdGUgPyAoXG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgY2xhc3NOYW1lPVwidG9rcmktc2VsZWN0LWFsbC1pY29uXCI+XG4gICAgICAgICAgICA8bGluZSB4MT1cIjZcIiB5MT1cIjEyXCIgeDI9XCIxOFwiIHkyPVwiMTJcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICApIDogY2hlY2tlZCA/IChcbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBjbGFzc05hbWU9XCJ0b2tyaS1zZWxlY3QtYWxsLWljb25cIj5cbiAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9zcGFuPlxuICAgIDwvbGFiZWw+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVjb3Jkc1RhYmxlSGVhZGVyKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICB0aXRsZVByb3BlcnR5LFxuICAgIHByb3BlcnRpZXMsXG4gICAgc29ydEJ5LFxuICAgIGRpcmVjdGlvbixcbiAgICBvblNlbGVjdEFsbCxcbiAgICBzZWxlY3RlZEFsbCxcbiAgICBpbmRldGVybWluYXRlLFxuICB9ID0gcHJvcHNcblxuICBjb25zdCBjb250ZW50VGFnID0gZ2V0UmVzb3VyY2VFbGVtZW50Q3NzKHRpdGxlUHJvcGVydHkucmVzb3VyY2VJZCwgJ3RhYmxlLWhlYWQnKVxuICBjb25zdCByb3dUYWcgPSBgJHt0aXRsZVByb3BlcnR5LnJlc291cmNlSWR9LXRhYmxlLWhlYWQtcm93YFxuICBjb25zdCBjaGVja2JveENzcyA9IGAke3RpdGxlUHJvcGVydHkucmVzb3VyY2VJZH0tY2hlY2tib3gtdGFibGUtY2VsbGBcblxuICByZXR1cm4gKFxuICAgIDxUYWJsZUhlYWQgZGF0YS1jc3M9e2NvbnRlbnRUYWd9PlxuICAgICAgPFRhYmxlUm93IGRhdGEtY3NzPXtyb3dUYWd9PlxuICAgICAgICA8VGFibGVDZWxsIGRhdGEtY3NzPXtjaGVja2JveENzc30+XG4gICAgICAgICAge29uU2VsZWN0QWxsID8gKFxuICAgICAgICAgICAgPFNlbGVjdEFsbENoZWNrQm94XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvblNlbGVjdEFsbCgpfVxuICAgICAgICAgICAgICBjaGVja2VkPXtCb29sZWFuKHNlbGVjdGVkQWxsKX1cbiAgICAgICAgICAgICAgaW5kZXRlcm1pbmF0ZT17Qm9vbGVhbihpbmRldGVybWluYXRlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvVGFibGVDZWxsPlxuICAgICAgICB7cHJvcGVydGllcy5tYXAoKHByb3BlcnR5KSA9PiAoXG4gICAgICAgICAgPFByb3BlcnR5SGVhZGVyXG4gICAgICAgICAgICBkaXNwbGF5PXtkaXNwbGF5KHByb3BlcnR5LmlzVGl0bGUpfVxuICAgICAgICAgICAga2V5PXtwcm9wZXJ0eS5wcm9wZXJ0eVBhdGh9XG4gICAgICAgICAgICB0aXRsZVByb3BlcnR5PXt0aXRsZVByb3BlcnR5fVxuICAgICAgICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgICAgICAgc29ydEJ5PXtzb3J0Qnl9XG4gICAgICAgICAgICBkaXJlY3Rpb249e2RpcmVjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgICAgPFRhYmxlQ2VsbCBrZXk9XCJhY3Rpb25zXCIgc3R5bGU9e3sgd2lkdGg6IDgwIH19IC8+XG4gICAgICA8L1RhYmxlUm93PlxuICAgIDwvVGFibGVIZWFkPlxuICApXG59XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBQcm9kdWN0RWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9wcm9kdWN0LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RFZGl0ID0gUHJvZHVjdEVkaXRcbmltcG9ydCBDYXRlZ29yeUVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY2F0ZWdvcnktZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2F0ZWdvcnlFZGl0ID0gQ2F0ZWdvcnlFZGl0XG5pbXBvcnQgQ21zTGlzdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9jbXMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ21zTGlzdCA9IENtc0xpc3RcbmltcG9ydCBSZXZpZXdFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3Jldmlldy1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZXZpZXdFZGl0ID0gUmV2aWV3RWRpdFxuaW1wb3J0IFNldHRpbmdzRWRpdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zZXR0aW5ncy1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TZXR0aW5nc0VkaXQgPSBTZXR0aW5nc0VkaXRcbmltcG9ydCBDb3Vwb25FZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NvdXBvbi1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Db3Vwb25FZGl0ID0gQ291cG9uRWRpdFxuaW1wb3J0IE9yZGVyRGV0YWlsIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL29yZGVyLWRldGFpbCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJEZXRhaWwgPSBPcmRlckRldGFpbFxuaW1wb3J0IENoYW5nZVBhc3N3b3JkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL2NoYW5nZS1wYXNzd29yZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2hhbmdlUGFzc3dvcmQgPSBDaGFuZ2VQYXNzd29yZFxuaW1wb3J0IFBhcnRuZXJFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BhcnRuZXItZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUGFydG5lckVkaXQgPSBQYXJ0bmVyRWRpdFxuaW1wb3J0IFBpbmNvZGVFZGl0IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3BpbmNvZGUtZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUGluY29kZUVkaXQgPSBQaW5jb2RlRWRpdFxuaW1wb3J0IFN0YXR1c1RvZ2dsZSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9zdGF0dXMtdG9nZ2xlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TdGF0dXNUb2dnbGUgPSBTdGF0dXNUb2dnbGVcbmltcG9ydCBDdXN0b21lckVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvY3VzdG9tZXItZWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ3VzdG9tZXJFZGl0ID0gQ3VzdG9tZXJFZGl0XG5pbXBvcnQgVGVhbUVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGVhbS1lZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5UZWFtRWRpdCA9IFRlYW1FZGl0XG5pbXBvcnQgTWVkaWFMaWJyYXJ5IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL21lZGlhLWxpYnJhcnknXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk1lZGlhTGlicmFyeSA9IE1lZGlhTGlicmFyeVxuaW1wb3J0IFRheEVkaXQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvdGF4LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlRheEVkaXQgPSBUYXhFZGl0XG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvbG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBBY3Rpb25IZWFkZXIgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvYWN0aW9uLWhlYWRlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQWN0aW9uSGVhZGVyID0gQWN0aW9uSGVhZGVyXG5pbXBvcnQgRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JpY2h0ZXh0LWVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eSA9IERlZmF1bHRSaWNodGV4dEVkaXRQcm9wZXJ0eVxuaW1wb3J0IFNpZGViYXJSZXNvdXJjZVNlY3Rpb24gZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvc2lkZWJhci1kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNpZGViYXJSZXNvdXJjZVNlY3Rpb24gPSBTaWRlYmFyUmVzb3VyY2VTZWN0aW9uXG5pbXBvcnQgUmVjb3Jkc1RhYmxlIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL3JlY29yZHMtdGFibGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZHNUYWJsZSA9IFJlY29yZHNUYWJsZVxuaW1wb3J0IFJlY29yZHNUYWJsZUhlYWRlciBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZWNvcmRzLXRhYmxlLWhlYWRlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVjb3Jkc1RhYmxlSGVhZGVyID0gUmVjb3Jkc1RhYmxlSGVhZGVyIl0sIm5hbWVzIjpbInVzZUFuY2hvcmVkTWVudSIsIm9wZW4iLCJ3cmFwUmVmIiwidXNlUmVmIiwib3BlblVwIiwic2V0T3BlblVwIiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1bmRlZmluZWQiLCJ1cGRhdGUiLCJub2RlIiwiY3VycmVudCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzcGFjZUJlbG93Iiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJib3R0b20iLCJ0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIlNlYXJjaGFibGVNdWx0aVNlbGVjdCIsIm9wdGlvbnMiLCJzZWxlY3RlZCIsIm9uQ2hhbmdlIiwicGxhY2Vob2xkZXIiLCJzZWFyY2hQbGFjZWhvbGRlciIsInNldE9wZW4iLCJxdWVyeSIsInNldFF1ZXJ5Iiwib25Eb2NDbGljayIsImV2ZW50IiwiY29udGFpbnMiLCJ0YXJnZXQiLCJkb2N1bWVudCIsInNlbGVjdGVkU2V0IiwidXNlTWVtbyIsIlNldCIsInNlbGVjdGVkT3B0aW9ucyIsImZpbHRlciIsIml0ZW0iLCJoYXMiLCJ2YWx1ZSIsImZpbHRlcmVkIiwibGFiZWwiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwidHJpbSIsInRvZ2dsZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJlZiIsInR5cGUiLCJvbkNsaWNrIiwibGVuZ3RoIiwibWFwIiwia2V5Iiwicm9sZSIsInRhYkluZGV4Iiwic3RvcFByb3BhZ2F0aW9uIiwiYXV0b0ZvY3VzIiwiY2hlY2tlZCIsIkZsYWdDYXJkIiwidGl0bGUiLCJoaW50IiwiaXNGbGFnT24iLCJTdGF0dXNTd2l0Y2giLCJkaXNhYmxlZCIsImNvbXBhY3QiLCJvbkxhYmVsIiwib2ZmTGFiZWwiLCJwcmV2ZW50RGVmYXVsdCIsIlNlYXJjaGFibGVTZWxlY3QiLCJmaW5kIiwiYWN0aXZlIiwiTG9jYWxTZWxlY3QiLCJTdHJpbmciLCJhcGkiLCJBcGlDbGllbnQiLCJSQU5HRVMiLCJXSURHRVRTIiwiaW5yIiwiTnVtYmVyIiwidG9Mb2NhbGVTdHJpbmciLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJSYW5nZVNlbGVjdCIsImF4aXNNYXgiLCJwYWRkZWQiLCJtYWduaXR1ZGUiLCJNYXRoIiwiZmxvb3IiLCJsb2cxMCIsIm5vcm1hbGl6ZWQiLCJuaWNlIiwiTGluZUNoYXJ0Iiwic2VyaWVzIiwiaG92ZXIiLCJzZXRIb3ZlciIsIndpZHRoIiwiaGVpZ2h0IiwicGFkTGVmdCIsInBhZFJpZ2h0IiwicGFkVG9wIiwicGFkQm90dG9tIiwibWF4IiwicG9pbnQiLCJvcmRlclZhbHVlIiwicGxvdFdpZHRoIiwicGxvdEhlaWdodCIsImJhc2VsaW5lIiwieUZvciIsInN0ZXAiLCJjb29yZHMiLCJpbmRleCIsIngiLCJ5IiwibGluZSIsImpvaW4iLCJhcmVhIiwibGFiZWxFdmVyeSIsImNlaWwiLCJ0aWNrcyIsInJhdGlvIiwicm91bmQiLCJvbk1vdXNlTGVhdmUiLCJ2aWV3Qm94IiwidGljayIsIngxIiwieDIiLCJ5MSIsInkyIiwidGV4dEFuY2hvciIsImQiLCJmaWxsIiwib3BhY2l0eSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWpvaW4iLCJzdHJva2VMaW5lY2FwIiwiZGF0ZSIsImN4IiwiY3kiLCJyIiwib25Nb3VzZUVudGVyIiwicG9pbnRlckV2ZW50cyIsInN0eWxlIiwibGVmdCIsIlBhZ2VyIiwicGFnZSIsInBhZ2VTaXplIiwidG90YWwiLCJwYWdlcyIsIm51bWJlcnMiLCJudW1iZXIiLCJwdXNoIiwiRGFzaGJvYXJkIiwicmVxdWVzdHMiLCJyYW5nZXMiLCJzZXRSYW5nZXMiLCJvcmRlcnMiLCJjdXN0b21lcnMiLCJwcm9kdWN0cyIsImRhdGEiLCJzZXREYXRhIiwic2V0UGFnZXMiLCJidXN5Iiwic2V0QnVzeSIsImxvYWRXaWRnZXQiLCJ3aWRnZXQiLCJyYW5nZSIsInRpY2tldCIsImdldERhc2hib2FyZCIsInBhcmFtcyIsInRoZW4iLCJyZXNwb25zZSIsImZpbmFsbHkiLCJmb3JFYWNoIiwiY2hhbmdlUmFuZ2UiLCJjaGFuZ2VQYWdlIiwiQm94IiwidmFyaWFudCIsIkgyIiwibWIiLCJINSIsIlRleHQiLCJvcmRlckNvdW50Iiwicm93cyIsInJvdyIsImlkIiwib3JkZXJObyIsIm5hbWUiLCJhbW91bnQiLCJwbGFjZWRBdCIsInBob25lIiwiZGF0ZU9mQmlydGgiLCJyZWdpc3RlcmVkQXQiLCJub3JtYWxpemVTbHVnSW5wdXQiLCJyZXBsYWNlIiwid2l0aG91dFRyYWlsaW5nU2xhc2giLCJwYXJzZVNsdWdzIiwicmF3IiwiQXJyYXkiLCJpc0FycmF5IiwiQm9vbGVhbiIsInBhcnNlZCIsIkpTT04iLCJwYXJzZSIsInNwbGl0IiwiUHJvZHVjdEVkaXQiLCJwcm9wcyIsInJlY29yZCIsImluaXRpYWxSZWNvcmQiLCJyZXNvdXJjZSIsImhhbmRsZUNoYW5nZSIsInN1Ym1pdCIsImhhbmRsZVN1Ym1pdCIsImxvYWRpbmciLCJ1c2VSZWNvcmQiLCJhZGROb3RpY2UiLCJ1c2VOb3RpY2UiLCJmaWxlUmVmIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwic2x1Z0VkaXRlZCIsInNldFNsdWdFZGl0ZWQiLCJzbHVnIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJjYXRlZ29yaWVzIiwic2V0Q2F0ZWdvcmllcyIsImN1c3RvbSIsImFwaUJhc2VVcmwiLCJwcm9kdWN0VXJsQmFzZSIsImxvY2F0aW9uIiwib3JpZ2luIiwic2x1Z0lucHV0IiwicHJldmlld1NsdWciLCJwcm9kdWN0VXJsIiwic2VsZWN0ZWRDYXRlZ29yeVNsdWdzIiwiY2F0ZWdvcnlJZHMiLCJpbWFnZVVybCIsImltYWdlIiwidGVzdCIsImFwcFVybCIsImRpc3BsYXllZEltYWdlVXJsIiwic3RhcnRzV2l0aCIsIlVSTCIsInJldm9rZU9iamVjdFVSTCIsImlnbm9yZSIsImZldGNoIiwianNvbiIsImNhdGNoIiwic2V0RmllbGQiLCJvblByb3BlcnR5Q2hhbmdlIiwicHJvcGVydHlQYXRoIiwicmVzdCIsInNldFNlbGVjdGVkQ2F0ZWdvcmllcyIsInNsdWdzIiwic3RyaW5naWZ5IiwidXBsb2FkSW1hZ2UiLCJmaWxlIiwiZmlsZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwibG9jYWxQcmV2aWV3VXJsIiwiY3JlYXRlT2JqZWN0VVJMIiwibWV0aG9kIiwiYm9keSIsIm9rIiwiZXJyb3IiLCJFcnJvciIsIm1lc3NhZ2UiLCJtZWRpYSIsInBhdGgiLCJub3RpY2UiLCJkZXNjcmlwdGlvblByb3BlcnR5IiwiZWRpdFByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImFzIiwib25TdWJtaXQiLCJIMyIsImNvbG9yIiwicmVxdWlyZWQiLCJtdCIsImhyZWYiLCJyZWwiLCJtaW4iLCJwcmljZVZhbHVlIiwib2xkUHJpY2VWYWx1ZSIsIndlaWdodCIsImJhZGdlIiwic3RvY2siLCJzb3J0T3JkZXIiLCJtYXJnaW5Cb3R0b20iLCJpc1RheGFibGUiLCJuZXh0IiwiZ3N0UmF0ZSIsImhzbkNvZGUiLCJzcmMiLCJhbHQiLCJhY2NlcHQiLCJpc0Jlc3RTZWxsZXIiLCJpc0ltcG9ydGVkIiwiaXNGZWF0dXJlZCIsImlzQWN0aXZlIiwibWluSGVpZ2h0IiwiQmFzZVByb3BlcnR5Q29tcG9uZW50Iiwid2hlcmUiLCJCdXR0b24iLCJJY29uIiwiaWNvbiIsInNwaW4iLCJDYXRlZ29yeUVkaXQiLCJiYW5uZXJGaWxlUmVmIiwiYmFubmVyVXBsb2FkaW5nIiwic2V0QmFubmVyVXBsb2FkaW5nIiwiYmFubmVyUHJldmlld1VybCIsInNldEJhbm5lclByZXZpZXdVcmwiLCJjYXRlZ29yeVVybEJhc2UiLCJjYXRlZ29yeVVybCIsImJhbm5lckltYWdlVXJsIiwiYmFubmVySW1hZ2UiLCJkaXNwbGF5ZWRCYW5uZXJVcmwiLCJ1cGxvYWRUbyIsImZpZWxkIiwic2V0TG9jYWxQcmV2aWV3Iiwic3VjY2Vzc01lc3NhZ2UiLCJzdWJ0aXRsZSIsIm1hcmdpblRvcCIsImRpc3BsYXkiLCJQRVJfUEFHRV9PUFRJT05TIiwiQ21zTGlzdCIsInNldFRhZyIsInRpdGxlUHJvcCIsInRpdGxlUHJvcGVydHkiLCJzdG9yZVBhcmFtcyIsImZpbHRlcnMiLCJ1c2VRdWVyeVBhcmFtcyIsInJlY29yZHMiLCJkaXJlY3Rpb24iLCJzb3J0QnkiLCJmZXRjaERhdGEiLCJwZXJQYWdlIiwidXNlUmVjb3JkcyIsInNlbGVjdGVkUmVjb3JkcyIsImhhbmRsZVNlbGVjdCIsImhhbmRsZVNlbGVjdEFsbCIsInNldFNlbGVjdGVkUmVjb3JkcyIsInVzZVNlbGVjdGVkUmVjb3JkcyIsImRlYm91bmNlUmVmIiwic3RvcmVQYXJhbXNSZWYiLCJ0b1N0cmluZyIsImhhbmRsZVF1ZXJ5Q2hhbmdlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInRyaW1tZWQiLCJoYW5kbGVBY3Rpb25QZXJmb3JtZWQiLCJjdXJyZW50UGFnZSIsInJvd3NQZXJQYWdlIiwidG90YWxSb3dzIiwidG90YWxQYWdlcyIsImZyb20iLCJ0byIsImdvVG9QYWdlIiwibmV4dFBhZ2UiLCJzYWZlIiwiY2hhbmdlUGVyUGFnZSIsInBhZ2VOdW1iZXJzIiwid2luZG93U2l6ZSIsInN0YXJ0IiwiZW5kIiwicG9zaXRpb24iLCJtYXhXaWR0aCIsInRyYW5zZm9ybSIsIklucHV0IiwicGFkZGluZ0xlZnQiLCJSZWNvcmRzVGFibGUiLCJhY3Rpb25QZXJmb3JtZWQiLCJvblNlbGVjdCIsIm9uU2VsZWN0QWxsIiwiaXNMb2FkaW5nIiwib3B0aW9uIiwicmVzb2x2ZUltYWdlVXJsIiwiRmllbGRFcnJvciIsIlJldmlld0VkaXQiLCJhY3Rpb24iLCJpc05ldyIsImVycm9ycyIsInJhdGluZyIsImlzQXBwcm92ZWQiLCJjb250ZW50IiwiVEFCUyIsImZpZWxkcyIsIkltYWdlVXBsb2FkZXIiLCJvblVwbG9hZCIsIndpZGUiLCJkaXNwbGF5ZWQiLCJTZXR0aW5nc0VkaXQiLCJhY3RpdmVUYWIiLCJzZXRBY3RpdmVUYWIiLCJtb2JpbGVCYW5uZXJGaWxlUmVmIiwiaGlnaGxpZ2h0RmlsZVJlZiIsImJhbm5lclByZXZpZXciLCJzZXRCYW5uZXJQcmV2aWV3IiwibW9iaWxlQmFubmVyUHJldmlldyIsInNldE1vYmlsZUJhbm5lclByZXZpZXciLCJoaWdobGlnaHRQcmV2aWV3Iiwic2V0SGlnaGxpZ2h0UHJldmlldyIsIm1vYmlsZUJhbm5lclVwbG9hZGluZyIsInNldE1vYmlsZUJhbm5lclVwbG9hZGluZyIsImhpZ2hsaWdodFVwbG9hZGluZyIsInNldEhpZ2hsaWdodFVwbG9hZGluZyIsImhvbWVGZWF0dXJlZENhdGVnb3J5U2x1Z3MiLCJob21lQmFubmVySW1hZ2UiLCJtb2JpbGVCYW5uZXJJbWFnZVVybCIsImhvbWVNb2JpbGVCYW5uZXJJbWFnZSIsImhpZ2hsaWdodEltYWdlVXJsIiwiaG9tZUhpZ2hsaWdodEltYWdlIiwiaGFzaCIsInNvbWUiLCJ0YWIiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwic2V0UHJldmlldyIsImZsZXgiLCJmbGV4RGlyZWN0aW9uIiwiRHJhd2VyQ29udGVudCIsInByb3BlcnRpZXMiLCJwIiwiSDQiLCJtb3JuaW5nRGVsaXZlcnlUaXRsZSIsIm1vcm5pbmdEZWxpdmVyeVN1YnRpdGxlIiwibW9ybmluZ1NoaXBwaW5nRmVlIiwibW9ybmluZ0ZyZWVBYm92ZSIsImV4cHJlc3NEZWxpdmVyeVRpdGxlIiwiZXhwcmVzc0RlbGl2ZXJ5U3VidGl0bGUiLCJleHByZXNzU2hpcHBpbmdGZWUiLCJleHByZXNzRnJlZUFib3ZlIiwiaGFuZGxpbmdGZWUiLCJEcmF3ZXJGb290ZXIiLCJwYWQiLCJudW0iLCJwYWRTdGFydCIsInRvRGF0ZXRpbWVWYWx1ZSIsIkRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImZvcm1hdERhdGV0aW1lTGFiZWwiLCJkYXkiLCJtb250aCIsInllYXIiLCJob3VyIiwibWludXRlIiwiQ2hvaWNlQ2FyZCIsIkFuY2hvcmVkU2VsZWN0IiwiRGF0ZVRpbWVQaWNrZXIiLCJ2YWxpZCIsIm1vbnRoRGF0ZSIsInNldE1vbnRoRGF0ZSIsImhvdXJzIiwic2V0SG91cnMiLCJtaW51dGVzIiwic2V0TWludXRlcyIsImZpcnN0RGF5IiwiZ2V0RGF5IiwidG90YWxEYXlzIiwiY2VsbHMiLCJpIiwiYXBwbHkiLCJuZXh0SG91cnMiLCJuZXh0TWludXRlcyIsInNlbGVjdGVkRGF5IiwiQ291cG9uRWRpdCIsInNldFByb2R1Y3RzIiwic2VsZWN0ZWRTbHVncyIsInRhcmdldFNsdWdzIiwidGFyZ2V0VHlwZSIsImFwcGx5T24iLCJ1c2FnZVR5cGUiLCJjb3Vwb25UeXBlIiwibG9hZENhdGFsb2ciLCJjYXRlZ29yeURhdGEiLCJhbGxQcm9kdWN0cyIsImhhc01vcmUiLCJwcm9kdWN0RGF0YSIsInNldFNlbGVjdGVkU2x1Z3MiLCJwcm9kdWN0T3B0aW9ucyIsImNhdGVnb3J5T3B0aW9ucyIsImNvZGUiLCJ0b1VwcGVyQ2FzZSIsIm1pbkNhcnQiLCJtYXhEaXNjb3VudCIsInVzYWdlTGltaXQiLCJ1c2VkQ291bnQiLCJzdGFydHNBdCIsImV4cGlyZXNBdCIsIkZVTEZJTExNRU5UIiwiUEFZTUVOVF9PUFRJT05TIiwiZm9ybWF0TW9uZXkiLCJmb3JtYXREYXRlVGltZSIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsInJlc29sdmVJbWFnZSIsIk1vcmVNZW51IiwidW5wYWlkIiwib25DYXNoIiwib25RciIsInNuYXBzaG90Iiwic3RhdHVzIiwicGF5bWVudFN0YXR1cyIsImRlbGl2ZXJ5UGFydG5lcklkIiwiY29udGFjdE5hbWUiLCJjb250YWN0UGhvbmUiLCJhZGRyZXNzTGluZTEiLCJhZGRyZXNzTGluZTIiLCJhZGRyZXNzQ2l0eSIsImFkZHJlc3NTdGF0ZSIsImFkZHJlc3NQaW5jb2RlIiwiYWRkcmVzc0xhbmRtYXJrIiwiT3JkZXJEZXRhaWwiLCJzZXRSZWNvcmQiLCJzYXZpbmciLCJzZXRTYXZpbmciLCJhY3Rpb25CdXN5Iiwic2V0QWN0aW9uQnVzeSIsInBhcnRuZXJzIiwic2V0UGFydG5lcnMiLCJzZXRCYXNlbGluZSIsImVkaXRDb250YWN0Iiwic2V0RWRpdENvbnRhY3QiLCJlZGl0QWRkcmVzcyIsInNldEVkaXRBZGRyZXNzIiwicGF0aG5hbWUiLCJyZXNvdXJjZUFjdGlvbiIsInJlc291cmNlSWQiLCJhY3Rpb25OYW1lIiwiaXRlbXMiLCJpdGVtc0pzb24iLCJkaXJ0eSIsIk9iamVjdCIsImtleXMiLCJsaXN0VXJsIiwiaGFuZGxlU2F2ZSIsInBpbiIsInJ1blBheW1lbnRBY3Rpb24iLCJjb25maXJtIiwicmVjb3JkQWN0aW9uIiwicmVjb3JkSWQiLCJzdGF0dXNMYWJlbCIsInJlc3RvcmVGaWVsZHMiLCJjbG9zZSIsImFkZHJlc3NUZXh0IiwicGF5bWVudExhYmVsIiwicGFydG5lck5hbWUiLCJkZWxpdmVyeVBhcnRuZXJOYW1lIiwiZGVsaXZlcnlQYXJ0bmVyUGhvbmUiLCJpdGVtQ291bnQiLCJyZWR1Y2UiLCJzdW0iLCJxdWFudGl0eSIsImNyZWF0ZWRBdCIsImxpbmVUb3RhbCIsInBheW1lbnRNZXRob2QiLCJpdGVtc1RvdGFsIiwiZGVsaXZlcnlPcHRpb24iLCJmcmVlRGVsaXZlcnlBcHBsaWVkIiwiZGVsaXZlcnlDaGFyZ2UiLCJoYW5kbGluZ0NoYXJnZSIsInRheFRvdGFsIiwiaXNJbnRlclN0YXRlIiwic21hbGxDYXJ0Q2hhcmdlIiwiZGlzY291bnQiLCJjb3Vwb25Db2RlIiwiZ3JhbmRUb3RhbCIsInBheW1lbnRDb2xsZWN0ZWRBcyIsInJhem9ycGF5UGF5bWVudElkIiwicmF6b3JwYXlRclVybCIsImlucHV0TW9kZSIsIkV5ZUljb24iLCJoaWRkZW4iLCJQYXNzd29yZEZpZWxkIiwidmlzaWJsZSIsIm9uVG9nZ2xlIiwiTGFiZWwiLCJodG1sRm9yIiwiYXV0b0NvbXBsZXRlIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwiY3Vyc29yIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsIkNoYW5nZVBhc3N3b3JkIiwicGFzc3dvcmQiLCJzZXRQYXNzd29yZCIsImNvbmZpcm1QYXNzd29yZCIsInNldENvbmZpcm1QYXNzd29yZCIsInNob3dQYXNzd29yZCIsInNldFNob3dQYXNzd29yZCIsInNob3dDb25maXJtIiwic2V0U2hvd0NvbmZpcm0iLCJzZXRFcnJvciIsImJhY2siLCJzYXZlIiwicmVkaXJlY3RVcmwiLCJlcnIiLCJpbnNldCIsInpJbmRleCIsImJnIiwiYm9yZGVyUmFkaXVzIiwiYm94U2hhZG93IiwiZW1haWwiLCJnYXAiLCJJTkRJQV9TVEFURVMiLCJWRUhJQ0xFX1RZUEVTIiwiU1RBVEVfT1BUSU9OUyIsIlBhcnRuZXJFZGl0IiwicmVhZE9ubHkiLCJoYXNQYXNzd29yZCIsIm1heExlbmd0aCIsInNsaWNlIiwiZmF0aGVyTmFtZSIsInBhbk51bWJlciIsImFhZGhhYXJOdW1iZXIiLCJjaXR5IiwicGluY29kZSIsInN0YXRlIiwicGVybWFuZW50QWRkcmVzcyIsImVtZXJnZW5jeU5hbWUiLCJlbWVyZ2VuY3lQaG9uZSIsInZlaGljbGVUeXBlIiwidmVoaWNsZU51bWJlciIsImFjY291bnRIb2xkZXJOYW1lIiwiYWNjb3VudE51bWJlciIsImlmc2NDb2RlIiwibm90ZXMiLCJQaW5jb2RlRWRpdCIsIm1vcm5pbmdFbmFibGVkIiwiZXhwcmVzc0VuYWJsZWQiLCJwYXJ0bmVySWQiLCJwYXJ0bmVyIiwibWFyZ2luIiwiYXJlYUxhYmVsIiwic3RhdGVDb2RlIiwiU3RhdHVzVG9nZ2xlIiwic2V0Q2hlY2tlZCIsInBlcnNpc3QiLCJzYXZlZCIsImRlc2NyaXB0aW9uIiwidG9EYXRlSW5wdXQiLCJ0ZXh0IiwiZm9ybWF0V2hlbiIsInBhcnNlQWRkcmVzc2VzIiwiYWRkcmVzc2VzIiwiZ3JvdXBlZCIsImVudHJpZXMiLCJtYXRjaCIsInNvcnQiLCJhIiwiYiIsImFkZHJlc3NMaW5lcyIsImFkZHJlc3MiLCJsaW5lMSIsImxpbmUyIiwibGFuZG1hcmsiLCJDdXN0b21lckVkaXQiLCJST0xFUyIsIlBFUk1JU1NJT05TIiwic2V0VmlzaWJsZSIsIlRlYW1FZGl0IiwicGVybWlzc2lvbk9uIiwidXNlcm5hbWUiLCJGT0xERVJTIiwiZm9ybWF0U2l6ZSIsImJ5dGVzIiwic2l6ZSIsInRvRml4ZWQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJyZXNvbHZlVXJsIiwiTWVkaWFMaWJyYXJ5IiwiYnVzeUlkIiwic2V0QnVzeUlkIiwiZm9sZGVyIiwidXBsb2FkRm9sZGVyIiwib3JpZ2luYWxOYW1lIiwiZmlsZW5hbWUiLCJ1cmwiLCJzZXRGb2xkZXIiLCJ1cGxvYWRGaWxlcyIsImxpc3QiLCJjb3B5UGF0aCIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInJlbW92ZSIsIm9uRHJhZ092ZXIiLCJvbkRyb3AiLCJkYXRhVHJhbnNmZXIiLCJtdWx0aXBsZSIsIlRheEVkaXQiLCJpc1RheGFibGVCb29sIiwiaGFuZGxlVGF4YWJsZVRvZ2dsZSIsInByb2R1Y3ROYW1lIiwiY2F0ZWdvcnlOYW1lIiwiZm9udFNpemUiLCJSRU1FTUJFUkVEX0xPR0lOX0tFWSIsIkxvZ2luIiwiZXJyb3JNZXNzYWdlIiwiX19BUFBfU1RBVEVfXyIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImFkbWluUm9vdCIsImZvcmdvdFBhc3N3b3JkVXJsIiwiaWRlbnRpZmllciIsInNldElkZW50aWZpZXIiLCJyZW1lbWJlckxvZ2luIiwic2V0UmVtZW1iZXJMb2dpbiIsInJlbWVtYmVyZWRMb2dpbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJmb3JtIiwiY3VycmVudFRhcmdldCIsImVtYWlsSW5wdXQiLCJlbGVtZW50cyIsIm5hbWVkSXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiTWVzc2FnZUJveCIsIkZvcm1Hcm91cCIsImRlZmF1bHRWYWx1ZSIsIm1hcmdpblJpZ2h0IiwidGV4dEFsaWduIiwiZm9udFdlaWdodCIsImFkbWluUm9vdFBhdGgiLCJjYXRhbG9nQ29uZmlnIiwiZXhwb3J0VXJsIiwiaW1wb3J0VXJsIiwiQ2F0YWxvZ0xpc3RIZWFkZXJBY3Rpb25zIiwib25JbXBvcnRlZCIsInRyYW5zbGF0ZUJ1dHRvbiIsInRyYW5zbGF0ZUFjdGlvbiIsInRvZ2dsZUZpbHRlciIsImZpbHRlcnNDb3VudCIsInVzZUZpbHRlckRyYXdlciIsInNldExvYWRpbmciLCJzZXRNZXNzYWdlIiwiY29uZmlnIiwicm9vdCIsImhhbmRsZUltcG9ydCIsImNyZWRlbnRpYWxzIiwiZXJyb3JDb3VudCIsImNyZWF0ZWQiLCJ1cGRhdGVkIiwiYnV0dG9ucyIsImNsaWNrIiwibmV3QWN0aW9uIiwicmVzb3VyY2VBY3Rpb25zIiwiZmlsdGVyS2V5IiwiY291bnQiLCJGcmFnbWVudCIsImZsZXhTaHJpbmsiLCJweCIsIkJ1dHRvbkdyb3VwIiwib25DbG9zZUNsaWNrIiwiQ0FUQUxPR19SRVNPVVJDRVMiLCJBY3Rpb25IZWFkZXIiLCJPcmlnaW5hbENvbXBvbmVudCIsIkJhc2VIZWFkZXIiLCJPcmlnaW5hbEFjdGlvbkhlYWRlciIsImlzQ2F0YWxvZ0xpc3QiLCJfaWdub3JlZCIsImhlYWRlclByb3BzIiwiX2V4dGVuZHMiLCJvbWl0QWN0aW9ucyIsIkRFRkFVTFRfT1BUSU9OUyIsInBsdWdpbnMiLCJ0b29sYmFyIiwiUmljaHRleHRFZGl0IiwiaGFuZGxlVXBkYXRlIiwidXNlQ2FsbGJhY2siLCJuZXdWYWx1ZSIsImlzUmVxdWlyZWQiLCJUaW55TUNFIiwiRm9ybU1lc3NhZ2UiLCJtZW1vIiwiY3V0Iiwic2VhcmNoIiwiU2lkZWJhclJlc291cmNlU2VjdGlvbiIsIk9yaWdpbmFsIiwidXNlTG9jYXRpb24iLCJuYXZpZ2F0ZSIsInVzZU5hdmlnYXRlIiwicmVzb3VyY2VzIiwiZ2V0UmVzb3VyY2VFbGVtZW50Q3NzIiwic3VmZml4IiwiTG9hZGVyIiwiTm9SZWNvcmRzIiwic2VsZWN0ZWRDb3VudCIsInNlbGVjdGVkQWxsIiwiaW5kZXRlcm1pbmF0ZSIsInJlY29yZHNIYXZlQnVsa0FjdGlvbiIsImJ1bGtBY3Rpb25zIiwiY29udGVudFRhZyIsInNlbGVjdGVkVGFnIiwiYm9keVRhZyIsIlRhYmxlIiwiU2VsZWN0ZWRSZWNvcmRzIiwiUmVjb3Jkc1RhYmxlSGVhZGVyIiwibGlzdFByb3BlcnRpZXMiLCJUYWJsZUJvZHkiLCJSZWNvcmRJbkxpc3QiLCJpc1NlbGVjdGVkIiwiaXNUaXRsZSIsIlNlbGVjdEFsbENoZWNrQm94IiwiaW5wdXRSZWYiLCJtYXJnaW5MZWZ0IiwicG9pbnRzIiwicm93VGFnIiwiY2hlY2tib3hDc3MiLCJUYWJsZUhlYWQiLCJUYWJsZVJvdyIsIlRhYmxlQ2VsbCIsIlByb3BlcnR5SGVhZGVyIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiRGVmYXVsdFJpY2h0ZXh0RWRpdFByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRU8sU0FBU0EsaUJBQWVBLENBQUNDLElBQUksRUFBRTtFQUNwQyxFQUFBLE1BQU1DLE9BQU8sR0FBR0MsWUFBTSxDQUFDLElBQUksQ0FBQztJQUM1QixNQUFNLENBQUNDLE1BQU0sRUFBRUMsU0FBUyxDQUFDLEdBQUdDLGNBQVEsQ0FBQyxLQUFLLENBQUM7RUFFM0NDLEVBQUFBLGVBQVMsQ0FBQyxNQUFNO0VBQ2QsSUFBQSxJQUFJLENBQUNOLElBQUksRUFBRSxPQUFPTyxTQUFTO01BRTNCLE1BQU1DLE1BQU0sR0FBR0EsTUFBTTtFQUNuQixNQUFBLE1BQU1DLElBQUksR0FBR1IsT0FBTyxDQUFDUyxPQUFPO1FBQzVCLElBQUksQ0FBQ0QsSUFBSSxFQUFFO0VBQ1gsTUFBQSxNQUFNRSxJQUFJLEdBQUdGLElBQUksQ0FBQ0cscUJBQXFCLEVBQUU7UUFDekMsTUFBTUMsVUFBVSxHQUFHQyxNQUFNLENBQUNDLFdBQVcsR0FBR0osSUFBSSxDQUFDSyxNQUFNO1FBQ25EWixTQUFTLENB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
