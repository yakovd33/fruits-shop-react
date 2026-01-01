import React from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const OrchardCategories = ({
	sectionClassName = 'home-section',
	headingTitle = 'הקטגוריות שלנו',
	headingDescription = 'נבחרת קטגוריות קבועה שמתעדכנת פעם בשבועיים ומסדרת לכם את הסל לפי מצב רוח, טעם וסגנון הגשה.',
	ctaLabel = 'כל הקטגוריות',
	cardCtaLabel = 'גלו את המוצרים',
	banner,
	leftColumn = [],
	rightFeature,
	rightSecondary = [],
	onCtaClick
}) => {
	const handleCtaClick = () => {
		if (typeof onCtaClick === 'function') {
			onCtaClick();
		}
	};

	const renderOrchardCard = (item, variant = 'standard') => {
		if (!item) {
			return null;
		}

		const mediaConfig = item.media || {};
		const mediaSrc = mediaConfig.src || item.image;
		const mediaAlt = mediaConfig.alt || '';
		const mediaWrapperStyle = mediaConfig.wrapperStyle || {};
		const mediaStyle = {
			width: '70%',
			left: '0',
			bottom: '0',
			...(mediaConfig.style || {})
		};

		return (
			<article
				key={ item.id || item.title }
				className={ `orchard-card orchard-card--${ variant }` }
				style={{ '--orchard-accent': item.accent || 'rgba(15, 159, 102, 0.28)' }}
			>
				<div className="orchard-card-media" aria-hidden="true" style={ mediaWrapperStyle }>
					<span className="orchard-card-orb"></span>
					{ mediaSrc ? (
						<img src={ mediaSrc } alt={ mediaAlt } loading="lazy" style={ mediaStyle } />
					) : null }
				</div>
				<div className="orchard-card-body">
					<h3>{ item.title }</h3>
					{ item.subtitle && <small>{ item.subtitle }</small> }
					<p>{ item.description }</p>
				</div>
				<footer className="orchard-card-footer">
					<button type="button" className="orchard-card-link" onClick={ handleCtaClick }>
						{ cardCtaLabel }
						<AiOutlineArrowLeft />
					</button>
				</footer>
			</article>
		);
	};

	return (
		<section className={ sectionClassName }>
			<div className="section-heading orchard-heading">
				<div>
					<h2><strong>{ headingTitle }</strong></h2>
					<p>{ headingDescription }</p>
				</div>
				<button type="button" className="orchard-heading-cta" onClick={ handleCtaClick }>
					{ ctaLabel }
					<AiOutlineArrowLeft />
				</button>
			</div>
			<div className="orchard-highlights-grid">
				{ banner ? (
					<div className="orchard-banner-card">
						<img src={ banner.image } alt={ banner.alt } loading="lazy" />
					</div>
				) : null }
				<div className="orchard-column orchard-column--left">
					{ leftColumn.map((item) => renderOrchardCard(item, 'stacked')) }
				</div>
				<div className="orchard-column orchard-column--right">
					<div className="orchard-right-secondary">
						{ renderOrchardCard(rightFeature, 'feature') }
						{ rightSecondary.map((item) => renderOrchardCard(item, 'secondary')) }
					</div>
				</div>
			</div>
		</section>
	);
};

export default OrchardCategories;
