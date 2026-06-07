import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('ANDO Presskit')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'photo', title: 'Photos', S, context }),
      orderableDocumentListDeskItem({ type: 'video', title: 'Videos', S, context }),
      orderableDocumentListDeskItem({ type: 'liveSet', title: 'Live Sets', S, context }),
      orderableDocumentListDeskItem({ type: 'contact', title: 'Contacts', S, context }),
      orderableDocumentListDeskItem({ type: 'event', title: 'Events', S, context }),
    ])
