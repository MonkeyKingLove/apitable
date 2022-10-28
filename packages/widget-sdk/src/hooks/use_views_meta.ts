import { useSelector, shallowEqual } from 'react-redux';
import { IWidgetContext, IWidgetState } from 'interface';
import { pickViewProperty } from './use_view_meta';
import { Datasheet } from 'model';
import { getWidgetDatasheet } from 'store';
import { useContext } from 'react';
import { WidgetContext } from 'context';
import { useMeta } from 'hooks/use_meta';
import { Selectors } from '@apitable/core';

/** @internal */
export const viewSelector = (state: IWidgetState, datasheetId?: string) => {
  const datasheet = getWidgetDatasheet(state, datasheetId);
  if (!datasheet) {
    return [];
  }
  return datasheet.snapshot.meta.views;
};

/**
 * `Beta API`, possible feature changes.
 *
 * Get the metadata property of the all views.
 * Rerendering is triggered when the order of views changes or the metadata property changes.
 *
 * @returns
 *
 * ### Example
 * ```js
 * import { useViewsMeta, useDatasheet } from '@vikadata/widget-sdk';
 *
 * // Show all views name
 * function ViewNames() {
 *   const viewsMeta = useViewsMeta();
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>View names: {viewMeta.name}</p>)}
 *   </div>);
 * }
 *
 * // Show the names of all views corresponding to the datasheetId(dstXXXXXXXX) datasheet 
 * function DatasheetViewNames() {
 *   const datasheet = useDatasheet('dstXXXXXXXX');
 *   const viewsMeta = useViewsMeta(datasheet);
 *   return (<div>
 *     {viewsMeta.map(viewMeta => <p>View names: {viewMeta.name}</p>)}
 *   </div>);
 * }
 * ```
 *
 */
export function useViewsMeta(datasheet?: Datasheet) {
  const viewsData = useSelector(state => viewSelector(state, datasheet?.datasheetId), shallowEqual);
  const context = useContext<IWidgetContext>(WidgetContext);
  const meta = useMeta();
  const state = context.globalStore.getState();
  if (meta.sourceId?.startsWith('mir')) {
    const sourceInfo = Selectors.getMirrorSourceInfo(state, meta.sourceId);
    if (sourceInfo) {
      const viewData = viewsData.find(viewData => viewData.id === sourceInfo.viewId);
      return [pickViewProperty(viewData!)];
    }
  }

  return viewsData.map(viewData => {
    return pickViewProperty(viewData);
  });
}
