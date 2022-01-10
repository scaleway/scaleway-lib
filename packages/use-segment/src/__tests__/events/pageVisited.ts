import { Analytics } from '@segment/analytics-next'
import { PageType, ProductCategory } from './types'


const pageVisited = (analytics: Analytics) => async (
    pageType: PageType,
    organizationId: string,
    productCategory?: ProductCategory
): Promise<void> => {
    await analytics.page(
        {
            page_type: pageType,
            product_category: productCategory,
        },
        {
            context: {
                groupId: organizationId,
            },
        },
    )
}

export default pageVisited
