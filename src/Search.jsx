import React from 'react';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import Select from 'react-select';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection(option) {
    const { history } = this.props;
    history.push(`/edit/${option.value}`);
  }

  async loadOptions(inputValue) {
    if (inputValue.length < 3) return [];
    const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id title}
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: inputValue }, showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`,
      value: issue.id,
    }));
  }

  render() {
    return (
      <Select
        instanceId="search-select"
        value={null} // No initial value
        loadOptions={this.loadOptions}
        onChange={this.onChangeSelection}
        isClearable
        isSearchable
      />
    );
  }
}

export default withRouter(withToast(Search));
