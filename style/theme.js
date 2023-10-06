const { theme } = require('antd');
const { default: createAliasToken } = require('antd/lib/theme/util/alias');

const seedtoken = {
    colorBgBase: '#151515',
    colorPrimary: '#0ea155',
    colorInfo: '#0ea155',
    fontFamily: 'Roboto'
};

const mapToken = theme.darkAlgorithm({
    ...theme.defaultSeed,
    ...seedtoken
});

const aliasToken = {
    ...createAliasToken(mapToken),
    colorBgElevated: mapToken.colorBgContainer
};

const components = {
    Avatar: {
        colorTextPlaceholder: seedtoken.colorPrimary
    },
    Table: {
        tablePaddingVerticalSmall: 4,
        tablePaddingVerticalMiddle: 4,
        paddingXS: 4
    },
    List: {
        paddingContentHorizontal: 6,
        paddingContentVerticalSM: 6,
        paddingContentVertical: 8,
        paddingContentVerticalLG: 12
    },
    Slider: {
        // track color
        colorPrimaryBorder: mapToken.colorPrimaryText,
        // track hover color
        colorPrimaryBorderHover: mapToken.colorPrimaryTextHover
    }
};

module.exports = {
    token: aliasToken,
    components: components
};
