import _ from 'lodash';
import data from './cards.json';
import 'paginationjs';

let state = {
    filtersMap: [
        {"Компания": {
            key: "company",
            type: "value"
        }},
        {"Цена": {
            key: "price",
            type: "range"
        }},
        {"Объем": {
            key: "power",
            type: "range"
        }},
        {"Объем парной": {
            key: "size",
            type: "value"
        }},
        {"Парогенератор": {
            key: "steamGenerator",
            type: "switch"
        }},
        {"Управление": {
            key: "control",
            type: "value"
        }},
        {"Установка": {
            key: "installation",
            type: "value"
        }}
    ],
    checkedFilters: [],
    filteredContent: [],
    content: data
};

const renderContent = (data = state.content, pure = true) => {
    const cards = document.querySelector('#cards');
    if (pure) {cards.innerHTML = ''};

    const content = document.createDocumentFragment()
    data.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-price', item.price)

        const imageBlock = document.createElement('div');
        imageBlock.classList.add('card__image-block');

        if (item.images && item.images.length > 1) {
            const sliderBlock = document.createElement('div');
            sliderBlock.classList.add('card__slider-block');

            const slider = document.createElement('div');
            slider.classList.add('slider');

            const sectors = document.createElement('div');
            sectors.classList.add('sectors');

            const pagination = document.createElement('div');
            pagination.classList.add('pagination');

            item.images.forEach((image, index) =>{
                const slide = document.createElement('img');
                slide.classList.add('slide');
                slide.alt = "";

                const sector = document.createElement('div');
                sector.classList.add('sector')

                const item = document.createElement('div');
                item.classList.add('pagination-item');

                if (index === 0) {
                    slide.classList.add('slide_status_active');
                    slide.srcset = `
                        assets/pictures/${image}.jpg,
                        assets/pictures/${image}_2x.jpg 2x
                    `;
                    slide.src = `assets/pictures/${image}.jpg`;
                    item.classList.add('pagination-item_status_active');
                } else {
                    slide.setAttribute('data-src', `assets/pictures/${image}.jpg`);
                    slide.setAttribute('data-setsrc', `assets/pictures/${image}.jpg, assets/pictures/${image}_2x.jpg 2x`);
                }

                slider.append(slide);
                sectors.append(sector)
                pagination.append(item);
            })

            sliderBlock.append(slider, sectors, pagination)
            imageBlock.append(sliderBlock)
        } else if (item.images && item.images.length === 1 ){
            const image = document.createElement('img');
            image.srcset = `
                assets/pictures/${item.images[0]}.jpg,
                assets/pictures/${item.images[0]}_2x.jpg 2x
            `;
            image.src = `assets/pictures/${item.images[0]}.jpg`;
            image.alt = "";
            image.classList.add('card__image');
            imageBlock.append(image)
        }
        if (item.comment || item.favourite) {
            const info = document.createElement('div');
            info.classList.add('card__info-block');

            if (item.comment && item.comment > 0) {
                const comment = document.createElement('div');
                comment.classList.add('card__comment-block');
                comment.insertAdjacentHTML('afterbegin', `
                    <button class="card__comment-icon"></button>
                    <span class="card__comment-count">${item.comment}</span>
                `)
                info.append(comment)
            }
            if (item.favourite && item.favourite > 0) {
                const favourite = document.createElement('div');
                favourite.classList.add('card__favourite-block');
                favourite.insertAdjacentHTML('afterbegin', `
                    <button class="card__favourite-icon"></button>
                    <span class="card__favourite-count">${item.favourite}</span>
                `)
                info.append(favourite)
                card.setAttribute('data-favourite', item.favourite)
            }
            imageBlock.append(info)
        }
        if (item.hasOwnProperty('new') && item.new) {
            const newTag = document.createElement('div');
            newTag.classList.add('card__tag_type_new');
            newTag.textContent = "new";
            imageBlock.append(newTag)
        }
        card.append(imageBlock)

        const descriptionBlock = document.createElement('div');
        descriptionBlock.classList.add('card__description-block');

        if (item.description) {
            const description = document.createElement('span');
            description.classList.add('description');
            description.textContent = item.description.join(", ")
            descriptionBlock.append(description)
        }
        if (item.location) {
            const location = document.createElement('span');
            location.classList.add('location');
            location.textContent = item.location.join(", ")
            descriptionBlock.append(location)
        }
        if (item.company) {
            const company = document.createElement('span');
            company.classList.add('company');
            company.textContent = item.company
            descriptionBlock.append(company)
            card.setAttribute('data-company', item.company)
        }
        card.append(descriptionBlock)

        cards.append(card)
    })
    cards.append(content)
}
renderContent();

let lastWindowWidth,
    currentWindowWidth = window.innerWidth;

const checkHeader = () => {
    const inner = document.querySelector('.header__inner');
    const logo = document.querySelector('.header__logo');
    const nav = document.querySelector('.header__nav-list');
    const buttons = document.querySelector('.header__buttons');
    const navItemMore = document.querySelector('#header__nav-item_type_select').firstElementChild;

    const hideItems = () => {
        const navItems = [...nav.children];
        navItemMore.append(navItems[navItems.length-2])
    }

    const openItems = () => {
        const nextElem = navItemMore.children[navItemMore.children.length - 1];
        if (nextElem.offsetWidth + logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth <= inner.offsetWidth) {
            navItemMore.closest('#header__nav-item_type_select').insertAdjacentElement('beforebegin', nextElem)
        }
    }

    if (lastWindowWidth) {
        if (currentWindowWidth - lastWindowWidth > 0) {
            if ((navItemMore.children.length > 0) && (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth < inner.offsetWidth)) {
                do {
                    openItems()
                } while ((navItemMore.children.length > 0) && (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth < inner.offsetWidth)) 
            }
        } else if (currentWindowWidth - lastWindowWidth < 0) {
            if (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth > inner.offsetWidth) {
                do {
                    hideItems()
                } while (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth > inner.offsetWidth)
            }
        }
    } else {
        if (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth > inner.offsetWidth) {
            do {
                hideItems()
            } while (logo.offsetWidth + nav.offsetWidth + buttons.offsetWidth > inner.offsetWidth)
        }
    }
    lastWindowWidth = currentWindowWidth;
}
if (window.innerWidth > 767.98) {
    checkHeader()
}

// const debounce = (callback, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId)
//     timeoutId = setTimeout(() => {
//       timeoutId = null
//       callback(...args)
//     }, delay)
//   }
// }
// let debouncedCheckedHeader = debounce(checkHeader, 100);

window.addEventListener('resize', () => {
    currentWindowWidth = window.innerWidth;
    if (window.innerWidth > 767.98) {
        checkHeader();
    }
})

const paginationMoreHandle = () => {
    let currentPaginationPage = 1;
    return () => {
        currentPaginationPage += 1;
        const selector = `[data-num='${currentPaginationPage}']`
        document.querySelector(selector).click()
        renderContent(state.content, false);
    }
}
const paginationMore = paginationMoreHandle();

$('#pagination-container').pagination({
    dataSource: (() => {
        let array = [];
        for (let i = 1; i <= 100; i++) {
            array.push(i)
        }
        return array;
    })(),
    activeClassName: 'paginationjs-page_status_active' ,
    pageSize: 1,
    pageRange: 2,
    showPrevious: false,
    showNext: false,
});

const sorter = (target) => {
    const parent = target.parentElement;
    const sorterItems = [...parent.children];

    sorterItems.forEach(item => {
        if (item === target) {
            item.classList.add('sorter-button_status_active')
        } else {
            item.classList.remove('sorter-button_status_active')
        }
    })
    const sorterItem = target.dataset.sort;

    let sortedContent = state.filteredContent.length > 0 ? state.filteredContent : state.content;
    sortedContent = sortedContent
        .filter(item => item[sorterItem])
        .sort((a, b) => {
            if (a[sorterItem] > b[sorterItem]) {
                return -1;
            }
            if (a[sorterItem] < b[sorterItem]) {
            return 1;
            }
            return 0;
        })
        .concat(
            sortedContent
                .filter(item => !item[sorterItem])
        )
        
    renderContent(sortedContent)
}

const filterHandle = (contentList = state.content, filters = _.cloneDeep(state.checkedFilters)) => {
    let filteredContent = [];
    if (state.checkedFilters.length > 0) {
        const filter = Object.keys(filters[0])[0];
        let key,
            type;
        state.filtersMap.forEach(item => {
            if (item.hasOwnProperty(filter)) {
                key = item[filter].key;
                type = item[filter].type;
            }
        })

        if (type === 'value') {
            filteredContent = contentList.filter(item => {
                if (filters[0][filter].includes(item[key])) {
                    return item;
                }
            })
        } else if (type === 'range') {
            contentList.forEach(item => {
                filters[0][filter].forEach(filterItem => {
                    if (filterItem.search(/менее/) >= 0) {
                        if (item[key] <= filterItem.split(' ')[1]) {
                            filteredContent.push(item);
                        }
                    } else if (filterItem.search(/более/) >= 0) {
                        if (item[key] > filterItem.split(' ')[1]) {
                            filteredContent.push(item);
                        }
                    } else {
                        let [a,,b] = filterItem.split(' ');
                        if (item[key] > a && item[key] <= b) {
                            filteredContent.push(item);
                        }
                    }
                })
            })
        } else if (type === 'switch') {
            filteredContent = contentList.filter(item => item[key]);
        }

        delete(filters[0]);
        filters = filters.filter(Boolean);

        if (filters.length === 0) {
            if (state.checkedFilters.length > 0) {
                state.filteredContent = filteredContent;
                renderContent(filteredContent);
            } else {
                renderContent();
            }
        } else {
            return filterHandle(filteredContent, filters);
        }
    } else {
        renderContent();
    }
}

let visibleFilters = 5;
const renderFilterItemsMoreButton = () => {
    const button = document.querySelector('#filter-items-more');
    const items = button.previousElementSibling.children

    if (visibleFilters < items.length) {
        button.classList.add('filter-items-more_status_active')
    } else {
        button.classList.remove('filter-items-more_status_active')
    }
}
renderFilterItemsMoreButton()

const companyFilter = document.querySelector('[data-filter-name="Компания"]');
const filterList = [...companyFilter.querySelectorAll('input[type="checkbox"]')].map(item => item.dataset.filter);

// document.querySelector('#search-field').addEventListener('input', (e) => {
//     const filterName = companyFilter.dataset.filterName;
//     const filterItems = companyFilter.querySelector('.filter-items');
//     const word = e.target.value.trim();
//     const filters = [...filterList]

//     let fragment = document.createDocumentFragment();

//     filters
//         .filter(item => {
//             const regexp = new RegExp(word, 'gi');
//             return item.match(regexp);
//         })
//         .forEach(item => {
//             let checkedValue = '';
//             state.checkedFilters.forEach(filter => {
//                 if (filter.hasOwnProperty(filterName)) {
//                     if (filter[filterName].includes(item)) {
//                         checkedValue = 'checked'
//                     }
//                 }
//             })
//             let elem = document.createElement('div');
//             elem.classList.add('checkbox-field')
//             elem.innerHTML = `
//                 <label>
//                     <input type="checkbox" data-filter="${item}" ${checkedValue}>
//                     <div class="pseudo-checkbox"></div>
//                         ${item}
//                 </label>
//             `;
//             fragment.append(elem);
//         });


//     filterItems.innerHTML = '';
//     filterItems.append(fragment);
// })
document.querySelector('#filters-form').addEventListener('change', (e) => {
    if (e.target.matches('[type="checkbox"]')) {
        const filter = e.target.closest('.filter');
        let filterName = filter.dataset.filterName;

        const checkedFilters = [];
        [...filter.querySelectorAll('input[type="checkbox"]')].forEach(item => {
            if (item.checked) {
                checkedFilters.push(item.dataset.filter) 
            }
        })
        if (checkedFilters.length > 0) {
            if (state.checkedFilters.length === 0) {
                state.checkedFilters.push({[filterName]: checkedFilters})
            } else {
                state.checkedFilters.forEach((item, index) => {
                    if (item.hasOwnProperty(filterName)) {
                        delete(state.checkedFilters[index]);
                        state.checkedFilters = state.checkedFilters.filter(Boolean);
                    }
                })
                state.checkedFilters.push({[filterName]: checkedFilters});
                
            }
        } else {
            state.checkedFilters.forEach((item, index) => {
                if (item.hasOwnProperty(filterName)) {
                    delete(state.checkedFilters[index]);
                    state.checkedFilters = state.checkedFilters.filter(Boolean);
                }
            })
        }
        
        const filterCount = filter.querySelector('.filter-title-count');
        if (filterCount) {
            filterCount.textContent = checkedFilters.length === 0 ? "" : checkedFilters.length
        }
    }
    filterHandle()
} )
document.querySelector('#filters-form').addEventListener('reset', (e) => {
    [...e.target.querySelectorAll('.filter-title-count')].forEach(item => {
        item.textContent = "";
    });
    [...e.target.querySelector('.filter').querySelectorAll('input[type="checkbox"]')].forEach(item => {
        item.removeAttribute('checked');
    });
    state.checkedFilters = [];
    state.filteredContent = [];
    
    let fragment = document.createDocumentFragment();
    filterList.forEach(item => {
        let elem = document.createElement('div');
        elem.classList.add('checkbox-field')
        elem.innerHTML = `
            <label>
                <input type="checkbox" data-filter="${item}">
                <div class="pseudo-checkbox"></div>
                    ${item}
            </label>
        `;
        fragment.append(elem);
    });
    companyFilter.querySelector('.filter-items').innerHTML = '';
    companyFilter.querySelector('.filter-items').append(fragment);
    
    renderContent();
})

let touchTarget,
    touchStartX,
    touchEndX,
    currentSlide;

const touchSlider = (target) => {
    const nextSlide = (elem, index, strClass) => {
        elem[index].classList.add(strClass);
    };
    const prevSlide = (elem, index, strClass) => {
        elem[index].classList.remove(strClass);
    };

    const sliderBlock = target.closest('.card__slider-block');
    const slider = [...sliderBlock.querySelector('.slider').children];
    slider.forEach(item => {
        if (item.dataset.src) {
            item.srcset = item.dataset.setsrc;
            item.src = item.dataset.src;
            item.removeAttribute('data-src');
            item.removeAttribute('data-setsrc');
        }
    })
    const pagination = [...sliderBlock.querySelector('.pagination').children];

    pagination.forEach((item, index) => {
        if (item.matches('.pagination-item_status_active')) {
            currentSlide = index
        }
    })

    if (touchStartX < touchEndX) {
        prevSlide(slider, currentSlide, 'slide_status_active');
        prevSlide(pagination, currentSlide, 'pagination-item_status_active');

        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slider.length - 1;
        }

        nextSlide(slider, currentSlide, 'slide_status_active');
        nextSlide(pagination, currentSlide, 'pagination-item_status_active');
    } else if (touchStartX > touchEndX) {
        prevSlide(slider, currentSlide, 'slide_status_active');
        prevSlide(pagination, currentSlide, 'pagination-item_status_active');

        currentSlide++;
        if (currentSlide >= slider.length) {
            currentSlide = 0;
        }

        nextSlide(slider, currentSlide, 'slide_status_active');
        nextSlide(pagination, currentSlide, 'pagination-item_status_active');
    }
}
const moveSlider = (event) => {
    let target = event.target;
    if (target.matches('.sector')) {
    const sliderBlock = target.closest('.card__slider-block');
    const slider = [...sliderBlock.querySelector('.slider').children];
    const pagination = [...sliderBlock.querySelector('.pagination').children]
    const sectors = [...target.parentElement.children];
    slider.forEach(item => {
        item.classList.remove('slide_status_active')
        if (item.dataset.src) {
            item.srcset = item.dataset.setsrc;
            item.src = item.dataset.src;
            item.removeAttribute('data-src');
            item.removeAttribute('data-setsrc');
        }
    })
    pagination.forEach(item => {
        item.classList.remove('pagination-item_status_active')
    })
    sectors.forEach((sector, index) => {
        if (sector === target) {
            slider[index].classList.add('slide_status_active');
            pagination[index].classList.add('pagination-item_status_active');
        }
    })
    }
}

document.addEventListener('mousemove', moveSlider)
document.addEventListener('touchstart', (e) => {
    touchTarget = e.target;
    touchStartX = e.touches[0].clientX;
})
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (e.target.matches('.sector')) {
        touchSlider(e.target)
    }
})

document.addEventListener('click', (e) => {
    let target = e.target;
    // if(target.matches('.nav-item-link')) {
    //     const parent = target.parentElement.parentElement;
    //     parent.querySelectorAll('.nav-item').forEach(item => {
    //         if (item === target.parentElement) {
    //             item.classList.add('nav-item_status_active');
    //         } else {
    //             item.classList.remove('nav-item_status_active');
    //         }
    //     })
    // } 
    // else if (target.matches('.nav-item')) {
    //     const parent = target.parentElement;
    //     parent.querySelectorAll('.nav-item').forEach(item => {
    //         if (item === target) {
    //             item.classList.add('nav-item_status_active');
    //         } else {
    //             item.classList.remove('nav-item_status_active');
    //         }
    //     })
    // } 
     if (target.matches('#filter-button_type_desktop')) {
        const filters = document.querySelector('#filters');
        target.textContent = target.classList.contains('filter-button_status_active') ? " Показать фильтр" : "Скрыть фильтр";
        target.classList.toggle('filter-button_status_active');
        filters.classList.toggle('filters_status_active')
    } else if (target.matches('#filter-button_type_mobile')) {
        document.querySelector('#filters').classList.toggle('filters_status_active')
        document.body.classList.toggle('body_status_scrolless')
    } else if (target.matches('#filter-items-more')) {
        visibleFilters += 5
        const filterItems = target.previousElementSibling;
        const height = filterItems.offsetHeight
        filterItems.style.height = `${height + (5 * 40)}px`;
        renderFilterItemsMoreButton()
    } else if (target.matches('#filters-button-close')) {
        document.querySelector('#filters').classList.toggle('filters_status_active')
        document.body.classList.toggle('body_status_scrolless')
    } else if (target.matches('.sorter-button') && target.closest('#settings__sorter_type_desktop')) {
        sorter(target)
    } else if (target.matches('.sorter-button') && target.closest('#settings__sorter_type_mobile')) {
        target.nextElementSibling.classList.add('sorter-modal_status_active')
        document.body.classList.toggle('body_status_scrolless')
    } else if (target.matches('.sorter-modal__inner')) {
        target.parentElement.classList.remove('sorter-modal_status_active')
        document.body.classList.toggle('body_status_scrolless')
    } else if (target.matches('.sorter-item')) {
        const items = [...target.parentElement.children];
        items.forEach(item => {
            if (item === target) {
                item.classList.add('sorter-item_status_active')
            } else {
                item.classList.remove('sorter-item_status_active')
            }
        })
        sorter(target)
        document.querySelector('#settings__sorter-button_type_mobile').textContent = `Сначала ${target.textContent.toLowerCase()}`;
    } else if (target.matches('.card__favourite-icon')) {
        const count = target.nextElementSibling;
        count.textContent = target.matches('.card__favourite-icon_status_active') ?
            +count.textContent - 1 : +count.textContent + 1;
        target.classList.toggle('card__favourite-icon_status_active');
    } else if (target.matches('#pagination__page-more')) {
        paginationMore();
    } else if (target.matches('#mobile-nav-button')) {
        target.classList.toggle('mobile-nav-button_status_active')
        document.body.classList.toggle('body_status_scrolless')
        document.querySelector('#mobile-nav').classList.toggle('mobile-nav_status_active')
    }
})
document.querySelector('#header__nav-list').addEventListener('click', (e) => {
    const target = e.target;
    const parent = target.closest('#header__nav-list');

    if (target.matches('.nav-item-link')) {
        [...parent.querySelectorAll('.nav-item')].forEach(item => {
            item.classList.remove('nav-item_status_active')
        });
        [...parent.querySelectorAll('.nav-item-link')].forEach(item => {
            if (item === target) {
                item.parentElement.classList.add('nav-item_status_active')
            } else {
                item.parentElement.classList.remove('nav-item_status_active')
            }
        })
    } else if (target.matches('.nav-item')) {
        [...parent.querySelectorAll('.nav-item')].forEach(item => {
            if (item === target) {
                item.classList.add('nav-item_status_active')
            } else {
                item.classList.remove('nav-item_status_active')
            }
        })
    }
})
document.querySelector('#mobile-nav').addEventListener('click', (e) => {
    const target = e.target;
    const parent = target.closest('#mobile-nav');

    if (target.matches('.nav-item-link')) {
        [...parent.querySelectorAll('.nav-item-link')].forEach(item => {
            if (item === target) {
                item.parentElement.classList.add('nav-item_status_active')
            } else {
                item.parentElement.classList.remove('nav-item_status_active')
            }
        })
    } else if (target.matches('.nav-item')) {
        [...parent.querySelectorAll('.nav-item')].forEach(item => {
            if (item === target) {
                item.classList.add('nav-item_status_active')
            } else {
                item.classList.remove('nav-item_status_active')
            }
        })
    }
})