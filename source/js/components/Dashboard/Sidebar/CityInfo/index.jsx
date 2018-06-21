import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import ExternalLinkOverlay from './ExternalLinkOverlay';

@connect(state => ({
  articles: state.app.get('articles'),
  placeMapData: state.app.get('placeMapData'),
  showCityInfo: state.app.get('showCityInfo'),
  commonscat: state.app.get('commonscat'),
}))
class CityInfo extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(List),
    placeMapData: PropTypes.instanceOf(Map),
    commonscat: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      shownLink: null,
    };
  }

  render() {
    const { articles, placeMapData, commonscat } = this.props;

    const cityName = placeMapData.get('text');
    const currentArticle = articles.get(0);

    if (!currentArticle) return null;

    /* get Wiki Edit Links */
    const missingSections = currentArticle.get('sections').filter((section) => (
      !section.get('inArticle')
    )).map((section) => (
      `<a
        href="${ section.get('editLink') }"
        key="${ section.get('name') }"
      >
        ${ section.get('name') }
      </a>`
    )).join(', ');

    /* render external link info overlay */
    let externalLinkOverlay = null;

    if (this.state.shownLink) {
      switch (this.state.shownLink) {
        case 'regio': {
          const title = (<FormattedMessage
            id='cityinfo.regiowikiTitle'
            description='Title for RegioWiki'
            defaultMessage='RegioWiki'
          />);

          const text = (<FormattedMessage
            id='cityinfo.regiowikiText'
            description='Text for RegioWiki'
            defaultMessage='Im RegioWiki kannst du all jene Themen deiner
            Umgebung beschreiben, die nicht von großem überregionalem Interesse
            sind, aber für deine Gemeinde eine Bedeutung haben. Dazu zählen etwa
            die heimische Blasmusikkapelle, die Beschreibung des jährlichen
            Kirtags oder die Chronologie der Umzüge im Ort. Du kannst dich auf
            Regiowiki einfach registrieren und danach sofort loslegen!'
          />);

          externalLinkOverlay = (<ExternalLinkOverlay
            title={ title }
            text={ text }
            link={ `http://regiowiki.at/wiki/${ currentArticle.get('source') }` }
            closeAction={ () => this.setState({ 'shownLink': null }) }
          />);
          break;
        }
        case 'gpx': {
          const title = (<FormattedMessage
            id='cityinfo.gpxTitle'
            description='Title for GPX-Download'
            defaultMessage='GPX-Datei'
          />);

          const text = (<FormattedMessage
            id='cityinfo.gpxText'
            description='Text for GPX-File'
            defaultMessage='Hier können Sie eine GPX-Datei herunterladen.'
          />);

          externalLinkOverlay = (<ExternalLinkOverlay
            title={ title }
            text={ text }
            link='#'
            closeAction={ () => this.setState({ 'shownLink': null }) }
          />);
          break;
        }
        default:
      }
    }

    return (
      <section className='CityInfo'>
        <div className='CityInfo-Content'>
          <a
            href={ `https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=WikiDaheim-at&categories=${ commonscat }&descriptionlang=de` }
            target='_blank'
            rel='noopener noreferrer'
            className='CityInfo-Link'
          >
            <FormattedMessage
              id='uploadPhoto'
              description='Text for Photo Upload-Button'
              defaultMessage='Foto hochladen'
            >
              {(text) => (<strong>{text}</strong>)}
            </FormattedMessage>

            <FormattedMessage
              id='uploadPhoto.description'
              description='Description text for Photo Upload Button'
              defaultMessage='Lade ein Foto zu {cityName} hoch'
              values={ { cityName } }
            />
          </a>
          <a
            href={ currentArticle.get('editLink') }
            target='_blank'
            rel='noopener noreferrer'
            className='CityInfo-Link CityInfo-Link-Wiki'
          >
            <FormattedMessage
              id='cityinfo.editWikiLink'
              description='Text edit Wiki button'
              defaultMessage='Wikipedia-Artikel bearbeiten'
            >
              {(text) => (<strong>{text}</strong>)}
            </FormattedMessage>

            <span>
              <FormattedHTMLMessage
                id='cityinfo.editWikiLinkDescription'
                description='Description text for the "Edit Wiki"-Link'
                defaultMessage='Fehlende Abschnitte: {missingSectionsCount, plural,
                    =0 {keine}
                    other {}
                }'
                values={ {
                  missingSectionsCount: missingSections.length,
                  missingSections: '',
                } }
              />
              {missingSections.length > 0 ?
                <span
                  dangerouslySetInnerHTML={ { __html: missingSections } } // eslint-disable-line
                />
              : null }
            </span>
          </a>
        </div>
        <footer className='CityInfo-Footer'>
          <button
            className='CityInfo-Link'
            onClick={ () => this.setState({ 'shownLink': 'regio' }) }
          >
            <FormattedMessage
              id='cityinfo.regiowikiTitle'
              description='Title for RegioWiki'
              defaultMessage='RegioWiki'
            />
          </button>

          <button
            className='CityInfo-Link'
            onClick={ () => this.setState({ 'shownLink': 'gpx' }) }
          >
            <FormattedMessage
              id='cityinfo.gpxTitle'
              description='Title for GPX-Download'
              defaultMessage='GPX-Datei'
            />
          </button>
        </footer>
        { externalLinkOverlay }
      </section>
    );
  }

}

export default CityInfo;
